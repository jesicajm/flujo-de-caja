export const formatNumber = (value) => {
  if (!value) return ''
  
  // Remove any existing dots and non-numeric characters (except minus sign)
  const cleanValue = value.toString().replace(/[^\d-]/g, '')
  
  // Handle negative numbers
  const isNegative = cleanValue.startsWith('-')
  const absoluteValue = cleanValue.replace('-', '')
  
  // Add dots for thousands
  const formattedValue = absoluteValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  
  return isNegative ? '-' + formattedValue : formattedValue
}

export const unformatNumber = (value) => {
  if (!value) return ''
  return value.toString().replace(/\./g, '')
}

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
} 