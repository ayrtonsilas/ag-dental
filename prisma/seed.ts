import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create a company
  const company = await prisma.company.create({
    data: {
      name: 'Clínica Médica Exemplo',
      document: '12345678000190',
      phone: '1199999999',
      address: 'Rua Exemplo, 123 - São Paulo, SP'
    }
  })

  // Create admin user
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@example.com',
      password: await hash('admin123', 10),
      role: 'ADMIN',
      companyId: company.id,
      phone: '1199999999'
    }
  })

  // Create users for professionals
  const professional1User = await prisma.user.create({
    data: {
      name: 'Dra. Maria Santos',
      email: 'maria.santos@example.com',
      password: await hash('senha123', 10),
      role: 'USER',
      companyId: company.id,
      phone: '1199998888'
    }
  })

  const professional2User = await prisma.user.create({
    data: {
      name: 'Dr. Carlos Mendes',
      email: 'carlos.mendes@example.com',
      password: await hash('senha123', 10),
      role: 'USER',
      companyId: company.id,
      phone: '1199997777'
    }
  })

  // Create professionals
  await prisma.professional.create({
    data: {
      name: 'Dra. Maria Santos',
      email: 'maria.santos@example.com',
      phone: '1199998888',
      cnpj: '12345678000191',
      specialty: 'Cardiologia',
      bio: 'Médica cardiologista com mais de 10 anos de experiência',
      userId: professional1User.id,
      companyId: company.id
    }
  })

  await prisma.professional.create({
    data: {
      name: 'Dr. Carlos Mendes',
      email: 'carlos.mendes@example.com',
      phone: '1199997777',
      cnpj: '12345678000192',
      specialty: 'Ortopedia',
      bio: 'Médico ortopedista especializado em cirurgia de coluna',
      userId: professional2User.id,
      companyId: company.id
    }
  })

  // Create patients
  await prisma.patient.create({
    data: {
      name: 'João Silva',
      email: 'joao.silva@example.com',
      phone: '1199996666',
      dateOfBirth: new Date('1980-01-01'),
      gender: 'M',
      address: 'Rua dos Pacientes, 123 - São Paulo, SP',
      healthInsurance: 'Unimed',
      healthInsuranceNumber: '123456789',
      documentNumber: '12345678900',
      companyId: company.id
    }
  })

  await prisma.patient.create({
    data: {
      name: 'Ana Oliveira',
      email: 'ana.oliveira@example.com',
      phone: '1199995555',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'F',
      address: 'Avenida das Flores, 456 - São Paulo, SP',
      healthInsurance: 'Bradesco Saúde',
      healthInsuranceNumber: '987654321',
      documentNumber: '98765432100',
      companyId: company.id
    }
  })

  console.log('Seed completed successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 