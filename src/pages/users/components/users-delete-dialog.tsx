'use client'

import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { toast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { User } from '../../../features/data/schema'
import { useMutation } from '@tanstack/react-query'
import { privateDeleteRequest } from '@/api/apiFunctions'
import { CREATE_USER } from '@/api/apiUrl'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
  getUsersList: () => void
}

export function UsersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
  getUsersList,
}: Props) {
  const [value, _] = useState('')

  const { mutate: deleteUser, isLoading } = useMutation({
    mutationFn: async () => {
      const response = await privateDeleteRequest(
        CREATE_USER + '/' + currentRow.id
      )
      return response?.data
    },
    onSuccess: () => {
      onOpenChange(false)
      getUsersList()
      toast({
        title: 'User deleted successfully',
      })
    },
  })

  const handleDelete = () => {
    deleteUser()
    onOpenChange(false)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.username}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='mr-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete User
        </span>
      }
      isLoading={isLoading}
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{currentRow.username}</span>?
            <br />
            This action will permanently remove the user with the role of{' '}
            <span className='font-bold'>
              {currentRow.role.toUpperCase()}
            </span>{' '}
            from the system. This cannot be undone.
          </p>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be carefull, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
