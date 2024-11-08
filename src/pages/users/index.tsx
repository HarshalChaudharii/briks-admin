import './pagination.css'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowUp, SearchIcon } from 'lucide-react'

import { Layout } from '@/components/custom/layout'
import { TopNav } from '@/components/top-nav'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { privateGetRequest } from '@/api/apiFunctions'
import { GET_ALL_USERS } from '@/api/apiUrl'

import { Card, CardFooter } from '@/components/ui/card'

import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from '@radix-ui/react-dropdown-menu'
import ReactPaginate from 'react-paginate'

const UsersListPage = () => {
  interface User {
    id: number
    name: string
    username: string
    role: string
  }

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
  return (
    <Layout>
      <Layout.Header>
        <div className='flex items-center ml-auto space-x-4'>
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
                  {/* <IoIosArrowRoundUp className='w-4 h-4 mr-2' /> */}
                  <ArrowUp className='w-4 h-4 mr-2' />
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
            <CardFooter className='flex items-center justify-between pt-6 border-t'>
              <div className='text-xs text-muted-foreground'>
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, pagination.totalItems)} of{' '}
                {pagination.totalItems} results
              </div>
              {/* <div className='flex items-center gap-2'>
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
              </div> */}
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
