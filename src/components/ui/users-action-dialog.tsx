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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { userTypes } from '../../data/data'
import { User } from '../../features/data/schema'
import { useMutation } from '@tanstack/react-query'
import { privatePostRequest } from '@/api/apiFunctions'
import { CREATE_USER } from '@/api/apiUrl'

const formSchema = z.object({
  name: z.string().min(1, { message: 'First Name is required.' }),
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().transform((pwd) => pwd.trim()),
  role: z.string().min(1, { message: 'Role is required.' }),
  confirmPassword: z.string().transform((pwd) => pwd.trim()),
  isEdit: z.boolean(),
})
// .superRefine(({ isEdit, password, confirmPassword }, ctx) => {
//   if (!isEdit || (isEdit && password !== '')) {
//     if (password === '') {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: 'Password is required.',
//         path: ['password'],
//       })
//     }

//     if (password.length < 8) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: 'Password must be at least 8 characters long.',
//         path: ['password'],
//       })
//     }

//     if (!password.match(/[a-z]/)) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: 'Password must contain at least one lowercase letter.',
//         path: ['password'],
//       })
//     }

//     if (!password.match(/\d/)) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: 'Password must contain at least one number.',
//         path: ['password'],
//       })
//     }

//     if (password !== confirmPassword) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Passwords don't match.",
//         path: ['confirmPassword'],
//       })
//     }
//   }
// })
type UserForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
  getUsersList: () => void
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
  getUsersList,
}: Props) {
  const isEdit = !!currentRow
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          password: '',
          confirmPassword: '',
          isEdit,
        }
      : {
          name: '',
          username: '',
          password: '',
          role: '',
          confirmPassword: '',
          isEdit,
        },
  })

  const { mutate: createUser } = useMutation({
    mutationFn: async (values: UserForm) => {
      const response = await privatePostRequest(CREATE_USER, values)
      return response.data
    },
    onSuccess: () => {
      getUsersList()
      form.reset()
      toast({
        title: 'User created',
        description: (
          <div>
            <p>User has been created successfully.</p>
          </div>
        ),
      })
      onOpenChange(false)
    },
    onError: (error: any) => {
      console.log(error)
      toast({
        title: 'Error',
        description: (
          <div>
            <p>Error: {error?.response?.data.message}</p>
          </div>
        ),
      })
    },
  })
  const onSubmit = (values: UserForm) => {
    console.log(values)
    createUser(values)
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

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
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the user here. ' : 'Create new user here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='-mr-4 h-[20rem] w-full py-1 pr-4'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john_doe'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Role
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select a role'
                      className='col-span-4'
                      items={userTypes.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='e.g., S3cur3P@ssw0rd'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        disabled={!isPasswordTouched}
                        placeholder='e.g., S3cur3P@ssw0rd'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
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
