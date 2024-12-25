import {
  IconCash,
  IconShield,
  IconUsersGroup,
  IconUserShield,
} from '@tabler/icons-react'
import { UserStatus } from '../features/data/schema'

export const callTypes = new Map<UserStatus, string>([
  ['ACTIVE', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['INACTIVE', 'bg-neutral-300/40 border-neutral-300'],
  //   ['invited', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  //   [
  //     'suspended',
  //     'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  //   ],
])

//   z.literal('ENGINEER'),
//   z.literal('ADMIN'),
//   z.literal('QUALITY'),
//   z.literal('MANAGER'),
// ])
export const userTypes = [
  {
    label: 'Quality',
    value: 'QUALITY',
    icon: IconUserShield,
  },
  {
    label: 'Manager',
    value: 'MANAGER',
    icon: IconCash,
  },
] as const
