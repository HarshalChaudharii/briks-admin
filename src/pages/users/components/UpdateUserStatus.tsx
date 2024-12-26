'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SelectDropdown } from '@/components/select-dropdown'
import { userStatus } from '../../../data/data'
import { User } from '../../../features/data/schema'
import { useMutation } from '@tanstack/react-query'
import { privatePutRequest } from '@/api/apiFunctions'
import { CREATE_USER } from '@/api/apiUrl'

const formSchema = z.object({
  status: z.string(),
})

type UserForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  getUsersList: () => void
}

const UpdateUserStatus = ({
  open,
  onOpenChange,
  currentRow,
  getUsersList,
}: Props) => {
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: currentRow?.status || 'ACTIVE',
    },
  })

  const { mutate: UpdateUserStatus } = useMutation({
    mutationFn: async (values: UserForm) => {
      const response = await privatePutRequest(
        CREATE_USER + '/' + currentRow?.id + '/status',
        values
      )
      return response.data
    },
    onSuccess: () => {
      getUsersList()
      form.reset()
      toast({
        title: 'Status updated successfully',
      })
      onOpenChange(false)
    },
    onError: (error: any) => {
      console.log(error)
      toast({
        title: 'Error creating user',
        description: (
          <div>
            <p>{error?.response?.data.message}</p>
          </div>
        ),
      })
    },
  })

  const onSubmit = (values: UserForm) => {
    console.log(values)

    UpdateUserStatus(values)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>
            <h1>Update Status</h1>
          </DialogTitle>
          <DialogDescription>
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='w-full py-1 pr-4'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className=' '>
                    <FormLabel className='col-span-2 text-right'>
                      Status
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select a status'
                      className='col-span-4'
                      items={userStatus.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button type='submit' form='user-form'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateUserStatus
