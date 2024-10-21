import React, { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowUp, FolderSync, SearchIcon } from 'lucide-react'
import moment from 'moment'
import { Layout } from '@/components/custom/layout'
import { TopNav } from '@/components/top-nav'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import {
  privateGetRequest,
  publicGetRequest,
  publicPostRequest,
} from '@/api/apiFunctions'
import { GET_ALL_USERS, SYNC_DATA } from '@/api/apiUrl'
import { toast } from 'sonner'
import { Card, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from '@radix-ui/react-dropdown-menu'

const UsersListPage = () => {
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    remainingPages: 0,
  })

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }
  const handlePageSizeChange = (size) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  return (
    <Layout>
      <Layout.Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>
      <Layout.Body>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='shrink-0'>
                  {/* <IoIosArrowRoundUp className='mr-2 h-4 w-4' /> */}
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
                  <TableHead className='cursor-pointer'>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{item.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <CardFooter className='flex items-center justify-between border-t pt-6'>
              <div className='text-xs text-muted-foreground'>
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, pagination.totalItems)} of{' '}
                {pagination.totalItems} results
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'solid' : 'outline'}
                    size='sm'
                    className={cn(
                      currentPage !== page &&
                        currentPage + 1 !== page &&
                        currentPage - 1 !== page
                        ? 'hidden'
                        : 'block'
                    )}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant='outline'
                  size='sm'
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </Layout.Body>
    </Layout>
  )
}
const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
  },
]
export default UsersListPage
