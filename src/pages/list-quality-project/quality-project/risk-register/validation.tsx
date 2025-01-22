import { toast } from '@/hooks/use-toast'

const REQUIRED_HEADERS = [
  'projectMilestone',
  'description',
  'probability',
  'impact',
  'pxi',
  'actionPlan',
  'rca',
  'riskStrategy',
  'riskOwner',
  'urgency',
  'plannedClosureDate',
] as const

// Add validation functions
export const validateHeaders = (headers: string[]): boolean => {
  const missingHeaders = REQUIRED_HEADERS.filter(
    (required) => !headers.includes(required)
  )

  if (missingHeaders.length > 0) {
    toast({
      title: 'Invalid Headers',
      description: `Missing or incorrect headers: ${missingHeaders.join(', ')}`,
      variant: 'destructive',
    })
    return false
  }
  return true
}

export const validateData = (data: any[]): boolean => {
  const invalidRows = data.filter((row) => {
    // Check for empty fields
    const hasEmptyFields = REQUIRED_HEADERS.some(
      (header) => !row[header] || row[header].toString().trim() === ''
    )

    return hasEmptyFields
  })

  if (invalidRows.length > 0) {
    toast({
      title: 'Invalid Data',
      description: 'Some rows have empty fields or invalid roles',
      variant: 'destructive',
    })
    return false
  }
  return true
}
