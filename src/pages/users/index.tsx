import './pagination.css'

import { ArrowUp, SearchIcon } from 'lucide-react'
import { Card, CardFooter } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { GET_ALL_USERS } from '@/api/apiUrl'
import { Input } from '@/components/ui/input'
import { Layout } from '@/components/custom/layout'
import ReactPaginate from 'react-paginate'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { privateGetRequest } from '@/api/apiFunctions'
import { UsersActionDialog } from '@/pages/users/components/users-action-dialog'
import { User, userListSchema } from '@/features/data/schema'
import { IconEdit, IconTrash, IconUserPlus } from '@tabler/icons-react'
import useDialogState from '@/hooks/use-dialog-state'
import { UsersDeleteDialog } from './components/users-delete-dialog'
import UpdateUserStatus from './components/UpdateUserStatus'
import { callTypes } from '@/data/data'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
const UsersListPage = () => {
  // interface User {
  //   id: number
  //   name: string
  //   username: string
  //   role: string
  // }
  type UsersDialogType = 'invite' | 'add' | 'edit' | 'delete' | 'status'
  // const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [data, setData] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    remainingPages: 0,
  })

  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<User | null>(null)
  const getUsersList = async () => {
    try {
      const response = await privateGetRequest(
        GET_ALL_USERS +
          '?pageNo=' +
          currentPage +
          '&pageSize=' +
          pageSize +
          '&search=' +
          searchTerm
      )
      if (response?.data.success) {
        setData(response.data.data)
        setPagination(response.data.pagination)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUsersList()
  }, [searchTerm, currentPage, pageSize])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  // const handlePageChange = (page) => {
  //   setCurrentPage(page)
  // }
  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size))
    setCurrentPage(1)
  }
  interface SelectedPage {
    selected: number
  }

  const handlePageChange = (selectedPage: SelectedPage): void => {
    setCurrentPage(selectedPage.selected + 1) // react-paginate uses 0-based index
  }
  // const setOpen = (type: string) => {}
  return (
    <Layout>
      <Layout.Header>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>
      <Layout.Body>
        <UsersActionDialog
          currentRow={currentRow}
          key='user-add'
          open={open === 'add'}
          onOpenChange={() => setOpen('add')}
          getUsersList={getUsersList}
        />
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-4'>
            <div className='relative flex-1'>
              {/* <CiSearch className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' /> */}
              <SearchIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Search...'
                value={searchTerm}
                onChange={handleSearch}
                className='pl-8'
              />
            </div>
            <Button className='space-x-1' onClick={() => setOpen('add')}>
              <span>Add User</span> <IconUserPlus size={18} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='shrink-0'>
                  {/* <IoIosArrowRoundUp className='w-4 h-4 mr-2' /> */}
                  <ArrowUp className='mr-2 h-4 w-4' />
                  {pageSize} per page
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-[200px]' align='end'>
                <DropdownMenuRadioGroup
                  value={pageSize.toString()}
                  onValueChange={handlePageSizeChange}
                >
                  <DropdownMenuRadioItem value='10'>
                    10 per page
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='25'>
                    25 per page
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='50'>
                    50 per page
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='100'>
                    100 per page
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='cursor-pointer'>ID</TableHead>
                  <TableHead className='cursor-pointer'>Name</TableHead>
                  <TableHead className='cursor-pointer'>Username</TableHead>
                  <TableHead className='cursor-pointer'>Status</TableHead>
                  <TableHead className='cursor-pointer'>Role</TableHead>
                  <TableHead className='sr-only'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => {
                  const badgeColor = item?.status
                    ? callTypes.get(item.status)
                    : ''
                  return (
                    <TableRow key={index}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.username}</TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={cn(
                            `capitalize ${badgeColor} cursor-pointer`
                          )}
                          onClick={() => {
                            setOpen('status')
                            setCurrentRow(item)
                          }}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.role}</TableCell>
                      <TableCell className='flex items-center space-x-4'>
                        <span>
                          <IconEdit
                            size={20}
                            className='cursor-pointer'
                            onClick={() => {
                              setOpen('edit')
                              setCurrentRow(item)
                            }}
                          />
                        </span>
                        <span>
                          <IconTrash
                            size={20}
                            className='cursor-pointer text-red-500'
                            onClick={() => {
                              setOpen('delete')
                              setCurrentRow(item)
                            }}
                          />
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <CardFooter className='flex items-center justify-between border-t pt-6'>
              <div className='text-xs text-muted-foreground'>
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, pagination.totalItems)} of{' '}
                {pagination.totalItems} results
              </div>

              <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                pageCount={pagination.totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={1}
                onPageChange={handlePageChange}
                containerClassName={'pagination'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                activeClassName={'active'}
              />
            </CardFooter>
          </Card>
        </div>
        {currentRow && (
          <>
            <UsersActionDialog
              key={`user-edit-${currentRow.id}`}
              open={open === 'edit'}
              onOpenChange={() => {
                setOpen('edit')
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }}
              currentRow={currentRow}
              getUsersList={getUsersList}
            />

            <UsersDeleteDialog
              key={`user-delete-${currentRow.id}`}
              open={open === 'delete'}
              onOpenChange={() => {
                setOpen('delete')
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }}
              currentRow={currentRow}
              getUsersList={getUsersList}
            />
          </>
        )}
        <div>
          <UpdateUserStatus
            key={`user-status-${currentRow?.id}`}
            open={open === 'status'}
            onOpenChange={() => {
              setOpen('status')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            getUsersList={getUsersList}
          />
        </div>
      </Layout.Body>
    </Layout>
  )
}
// const topNav = [
//   {
//     title: 'Overview',
//     href: 'dashboard/overview',
//     isActive: true,
//   },
//   {
//     title: 'Customers',
//     href: 'dashboard/customers',
//     isActive: false,
//   },
//   {
//     title: 'Products',
//     href: 'dashboard/products',
//     isActive: false,
//   },
//   {
//     title: 'Settings',
//     href: 'dashboard/settings',
//     isActive: false,
//   },
// ]
export default UsersListPage
