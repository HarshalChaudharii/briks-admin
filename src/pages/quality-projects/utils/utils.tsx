import { toast } from '@/hooks/use-toast'
import { requiredHeaders } from '../data/data'

export const validateHeaders = (headers: string[]): boolean => {
  const requiredWBSHeaders = requiredHeaders.filter((header) =>
    header.startsWith('wbs_')
  )

  // Validate regular required headers
  const missingRegularHeaders = requiredHeaders
    .filter((header) => !header.startsWith('wbs_'))
    .filter(
      (required) =>
        !headers.some(
          (header) => header.toLowerCase() === required.toLowerCase()
        )
    )

  // Validate WBS headers
  const missingWBSHeaders = requiredWBSHeaders.filter(
    (required) =>
      !headers.some((header) =>
        header.toLowerCase().startsWith(required.toLowerCase())
      )
  )

  if (missingRegularHeaders.length > 0 || missingWBSHeaders.length > 0) {
    const errorMessages = []

    if (missingRegularHeaders.length > 0) {
      errorMessages.push(
        `Missing required headers: ${missingRegularHeaders.join(', ')}`
      )
    }

    if (missingWBSHeaders.length > 0) {
      errorMessages.push(
        `Missing headers starting with "wbs_": ${missingWBSHeaders.join(', ')}`
      )
    }

    toast({
      title: 'Validation Error',
      description: errorMessages.join('. '),
      variant: 'destructive',
    })

    return false
  }

  return true
}

export const validateData = (data: any[], columns: string[]) => {
  // Fields to validate for non-null values
  const requiredDataFields = ['identified_by', 'remark', 'closure_status']

  // Get the indices of the required fields
  const fieldIndices = requiredDataFields.map((field) => columns.indexOf(field))
  // Check each row for empty or null values in required fields
  const invalidRows = data.filter((row) =>
    fieldIndices.some(
      (index) =>
        index !== -1 && (!row[index] || String(row[index]).trim() === '')
    )
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
