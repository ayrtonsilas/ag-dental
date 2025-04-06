/**
 * Formats a Brazilian CNPJ number (14 digits) to the standard format: XX.XXX.XXX/XXXX-XX
 * @param value The raw CNPJ string
 * @returns Formatted CNPJ
 */
export function formatCNPJ(value: string): string {
  // Remove non-numeric characters
  const digits = value.replace(/\D/g, '')
  
  if (digits.length !== 14) {
    return value // Return original if not a valid CNPJ length
  }
  
  // Apply CNPJ mask
  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

/**
 * Formats a Brazilian phone number to the standard format: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
 * @param value The raw phone number string
 * @returns Formatted phone number
 */
export function formatPhone(value: string): string {
  // Remove non-numeric characters
  const digits = value.replace(/\D/g, '')
  
  if (digits.length < 10 || digits.length > 11) {
    return value // Return original if not a valid phone length
  }
  
  // Apply phone mask based on length (with or without 9th digit)
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
}

/**
 * Removes all non-numeric characters from a string
 * @param value The formatted string
 * @returns Unformatted string with only numeric characters
 */
export function unformatValue(value: string): string {
  return value.replace(/\D/g, '')
} 