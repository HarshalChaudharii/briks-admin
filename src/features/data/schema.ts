import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('ACTIVE'),
  z.literal('INACTIVE'),
  //   z.literal('invited'),
  z.literal('SUSPENDED'),
])
export type UserStatus = z.infer<typeof userStatusSchema>

const userRoleSchema = z.union([
  //   z.literal('superadmin'),
  //   z.literal('admin'),
  //   z.literal('cashier'),
  //   z.literal('manager'),
  z.literal('QUALITY'),
  z.literal('MANAGER'),
  z.literal('ENGINEER'),
])
export type UserRole = z.infer<typeof userRoleSchema>

const userSchema = z.object({
  //   id: z.string(),
  //   firstName: z.string(),
  //   lastName: z.string(),
  //   username: z.string(),
  //   email: z.string(),
  //   phoneNumber: z.string(),
  //   status: userStatusSchema,
  //   role: userRoleSchema,
  //   createdAt: z.coerce.date(),
  //   updatedAt: z.coerce.date(),
  id: z.string(),
  name: z.string(),
  username: z.string(),
  role: userRoleSchema,
  status: userStatusSchema.optional(),
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)
