import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { AppointmentStatus } from '@/types'
import { validateAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await validateAuth()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    
    // Get filter params
    const date = searchParams.get('date')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const patientId = searchParams.get('patientId')
    const professionalId = searchParams.get('professionalId')
    const status = searchParams.get('status') as AppointmentStatus | null
    const pageSize = +(searchParams.get('pageSize') || '10')
    const page = +(searchParams.get('page') || '1')
    
    // Build where conditions
    let whereConditions = {}
    
    if (date) {
      whereConditions = {
        ...whereConditions,
        date
      }
    }
    
    if (startDate && endDate) {
      whereConditions = {
        ...whereConditions,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    }
    
    if (patientId) {
      whereConditions = {
        ...whereConditions,
        patientId
      }
    }
    
    if (professionalId) {
      whereConditions = {
        ...whereConditions,
        professionalId
      }
    }
    
    if (status) {
      whereConditions = {
        ...whereConditions,
        status
      }
    }

    // Get appointments count for pagination
    const totalAppointments = await db.appointment.count({
      where: whereConditions
    })
    
    // Get appointments
    const appointments = await db.appointment.findMany({
      where: whereConditions,
      include: {
        patient: {
          select: {
            id: true,
            name: true
          }
        },
        professional: {
          select: {
            id: true,
            name: true
          }
        }
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        date: 'asc'
      }
    })
    
    return NextResponse.json({
      appointments,
      pagination: {
        total: totalAppointments,
        pageSize,
        page,
        pages: Math.ceil(totalAppointments / pageSize)
      }
    })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await validateAuth()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const data = await req.json()
    
    // Validate required fields
    const requiredFields = ['patientId', 'professionalId', 'date', 'startTime', 'endTime', 'status']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }
    
    // Check for conflicting appointments
    console.log('Checking for conflicts with data:', {
      date: data.date,
      professionalId: data.professionalId,
      startTime: data.startTime,
      endTime: data.endTime,
      status: data.status
    })

    const existingAppointment = await db.appointment.findFirst({
      where: {
        OR: [
          {
            // Check for time conflicts with the same professional
            AND: [
              { date: data.date },
              { professionalId: data.professionalId },
              { status: { notIn: ['CANCELLED', 'NO_SHOW'] } },
              {
                OR: [
                  {
                    // Check if new appointment overlaps with existing appointment
                    AND: [
                      { startTime: { lt: data.endTime } },
                      { endTime: { gt: data.startTime } }
                    ]
                  }
                ]
              }
            ]
          },
          {
            // Check if patient already has an appointment on this day
            AND: [
              { date: data.date },
              { patientId: data.patientId },
              { status: { notIn: ['CANCELLED', 'NO_SHOW'] } },
              { id: { not: data.id } } // Exclude current appointment if updating
            ]
          },
          {
            // Check if trying to set a new appointment as IN_PROGRESS when patient already has one
            AND: [
              { patientId: data.patientId },
              { status: 'IN_PROGRESS' },
              { id: { not: data.id } } // Exclude current appointment if updating
            ]
          }
        ]
      }
    })

    if (existingAppointment) {
      if (existingAppointment.patientId === data.patientId && 
          existingAppointment.status === 'IN_PROGRESS' && 
          data.status === 'IN_PROGRESS') {
        return NextResponse.json({ 
          error: 'Este paciente já possui uma consulta em andamento. Não é possível iniciar uma nova consulta até que a atual seja finalizada.'
        }, { status: 409 })
      }
      
      if (existingAppointment.patientId === data.patientId && 
          existingAppointment.date === data.date) {
        return NextResponse.json({ 
          error: 'Este paciente já possui uma consulta agendada para este dia. Não é possível agendar mais de uma consulta por dia para o mesmo paciente.'
        }, { status: 409 })
      }
      
      // Only show time conflict error if the existing appointment is not cancelled or no-show
      if (existingAppointment.status !== 'CANCELLED' && existingAppointment.status !== 'NO_SHOW') {
        return NextResponse.json({ 
          error: 'Conflito de horário: já existe uma consulta agendada para este profissional neste horário'
        }, { status: 409 })
      }
    }
    
    // Create appointment
    const appointment = await db.appointment.create({
      data: {
        patientId: data.patientId,
        professionalId: data.professionalId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status,
        notes: data.notes || '',
        treatment: data.treatment || ''
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true
          }
        },
        professional: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
    
    return NextResponse.json({ appointment })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await validateAuth()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Missing appointment ID' }, { status: 400 })
    }
    
    const data = await req.json()
    
    // Validate required fields
    const requiredFields = ['patientId', 'professionalId', 'date', 'startTime', 'endTime', 'status']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }
    
    // Check for conflicting appointments
    const existingAppointment = await db.appointment.findFirst({
      where: {
        OR: [
          {
            // Check for time conflicts with the same professional
            AND: [
              { date: data.date },
              { professionalId: data.professionalId },
              { status: { notIn: ['CANCELLED', 'NO_SHOW'] } },
              {
                OR: [
                  {
                    // Check if new appointment overlaps with existing appointment
                    AND: [
                      { startTime: { lt: data.endTime } },
                      { endTime: { gt: data.startTime } }
                    ]
                  }
                ]
              }
            ]
          },
          {
            // Check if patient already has an appointment on this day
            AND: [
              { date: data.date },
              { patientId: data.patientId },
              { status: { notIn: ['CANCELLED', 'NO_SHOW'] } },
              { id: { not: id } } // Exclude current appointment
            ]
          },
          {
            // Check if trying to set a new appointment as IN_PROGRESS when patient already has one
            AND: [
              { patientId: data.patientId },
              { status: 'IN_PROGRESS' },
              { id: { not: id } } // Exclude current appointment
            ]
          }
        ]
      }
    })
    
    if (existingAppointment) {
      if (existingAppointment.patientId === data.patientId && 
          existingAppointment.status === 'IN_PROGRESS' && 
          data.status === 'IN_PROGRESS') {
        return NextResponse.json({ 
          error: 'Este paciente já possui uma consulta em andamento. Não é possível iniciar uma nova consulta até que a atual seja finalizada.'
        }, { status: 409 })
      }
      
      if (existingAppointment.patientId === data.patientId && 
          existingAppointment.date === data.date) {
        return NextResponse.json({ 
          error: 'Este paciente já possui uma consulta agendada para este dia. Não é possível agendar mais de uma consulta por dia para o mesmo paciente.'
        }, { status: 409 })
      }
      
      // Only show time conflict error if the existing appointment is not cancelled or no-show
      if (existingAppointment.status !== 'CANCELLED' && existingAppointment.status !== 'NO_SHOW') {
        return NextResponse.json({ 
          error: 'Conflito de horário: já existe uma consulta agendada para este profissional neste horário'
        }, { status: 409 })
      }
    }
    
    // Update appointment
    const appointment = await db.appointment.update({
      where: { id },
      data: {
        patientId: data.patientId,
        professionalId: data.professionalId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status,
        notes: data.notes || '',
        treatment: data.treatment || ''
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true
          }
        },
        professional: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
    
    return NextResponse.json({ appointment })
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await validateAuth()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Missing appointment ID' }, { status: 400 })
    }
    
    // Delete appointment
    await db.appointment.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 