import { Layout } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import './pagination.css'
import { Card, CardFooter } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { privateGetRequest } from '@/api/apiFunctions'
import { GET_ALL_QUALITY_PROJECTS } from '@/api/apiUrl'
import { useState } from 'react'
import { ArrowUp, SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import ReactPaginate from 'react-paginate'
import { EyeOpenIcon } from '@radix-ui/react-icons'
import { Link } from 'react-router-dom'

const index = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const { data: queryData } = useQuery({
    queryKey: ['quality-projects', currentPage, pageSize, searchTerm],
    queryFn: async () => {
      const response = await privateGetRequest(
        `${GET_ALL_QUALITY_PROJECTS}?pageNo=${currentPage}&pageSize=${pageSize}&search=${searchTerm}`
      )
      return response.data
    },
  })
  const data = queryData?.data ?? []
  const pagination = queryData?.pagination ?? {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size))
    setCurrentPage(1)
  }

  const handlePageChange = ({ selected }: { selected: number }): void => {
    setCurrentPage(selected + 1)
  }
  return (
    <Layout>
      <Layout.Header>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>
      <Layout.Body>
        <div className=' mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Projects</h2>
            <p className='text-muted-foreground'>List of quality projects</p>
          </div>
        </div>
        <div className='mb-10 flex flex-col gap-4'>
          <div className='flex items-center gap-4'>
            <div className='relative flex-1'>
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
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Project</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className='flex items-center'>
                    <Link to={`/quality-project/${item.id}`} className='mr-2'>
                      <EyeOpenIcon className='h-6 w-6 text-muted-foreground' />
                    </Link>
                  </TableCell>
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
      </Layout.Body>
    </Layout>
  )
}

export default index
