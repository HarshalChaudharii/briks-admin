import { toast } from '@/hooks/use-toast'
import { requiredHeaders } from '../data/data'

export function validateHeaderNames(excelHeaders: string[]): boolean {
  // Lowercase all actual Excel headers for case-insensitive comparison
  const lowercaseExcelHeaders = excelHeaders.map((h) => h.toLowerCase())

  // 1. Check normal headers (everything not "wbs_")
  const normalRequired = requiredHeaders.filter((h) => h !== 'wbs_')
  const missingNormalHeaders = normalRequired.filter(
    (required) => !lowercaseExcelHeaders.includes(required.toLowerCase())
  )

  // 2. Check for at least one column starting with "wbs_"
  const hasWBS = lowercaseExcelHeaders.some((h) => h.startsWith('wbs_'))

  if (missingNormalHeaders.length > 0 || !hasWBS) {
    const errors: string[] = []

    if (missingNormalHeaders.length > 0) {
      errors.push(
        `Missing required headers: ${missingNormalHeaders.join(', ')}`
      )
    }

    if (!hasWBS) {
      errors.push('Missing any header that starts with "wbs_"')
    }

    toast({
      title: 'Validation Error',
      description: errors.join('. '),
      variant: 'destructive',
    })
    return false
  }

  return true
}
export const validateData = (data: any[], columns: string[]) => {
  // Fields to validate for non-null values in each row object
  const requiredDataFields = ['identified_by', 'remark', 'closure_status']

  // We filter out rows that are missing any required field
  const invalidRows = data.filter((row) =>
    requiredDataFields.some((field) => {
      // Skip if the column isn't even present
      if (!columns.includes(field)) {
        return false
      }
      // Check if the value is empty or missing
      const value = row[field]
      return !value || String(value).trim() === ''
    })
  )

  if (invalidRows.length > 0) {
    toast({
      title: 'Validation Error',
      description: `Some rows have missing data in required fields: ${requiredDataFields.join(', ')}`,
      variant: 'destructive',
    })
    return false
  }

  return true
}
