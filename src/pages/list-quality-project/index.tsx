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
import { useMutation, useQuery } from '@tanstack/react-query'
import { privateGetRequest } from '@/api/apiFunctions'
import { BASE_URL, GET_ALL_QUALITY_PROJECTS } from '@/api/apiUrl'
import { useState } from 'react'
import { ArrowDown, ArrowUp, SearchIcon } from 'lucide-react'
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
import Cookies from 'js-cookie'
import axios from 'axios'
import { toast } from 'sonner'
import moment from 'moment'

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
  const { mutate: downloadExcel, isLoading } = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const token = Cookies.get('token')
      try {
        const response = await axios.get(
          `${BASE_URL}/quality-projects/download-quality-excel/${id}`,
          {
            responseType: 'blob',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        console.log('Response received:', response)
        if (response.data.size === 0) {
          throw new Error('Empty file received')
        }
        return { data: response.data, name }
      } catch (error) {
        console.error('Download error:', error)
        throw error
      }
    },
    onSuccess: ({ data, name }) => {
      try {
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        if (blob.size === 0) {
          throw new Error('Empty blob created')
        }
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute(
          'download',
          `${name + moment().format('_DD_MM_YYYY')}.xlsx`
        )
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error('File processing error:', error)
        toast.error('Error processing the file')
      }
    },
    onError: (error) => {
      console.error('Mutation error:', error)
      toast.error('Failed to download excel file')
    },
  })

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
          <Button asChild>
            <Link to='/upload-quality-projects'>Upload Quality Project</Link>
          </Button>
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
                <TableHead>View</TableHead>
                <TableHead>Download</TableHead>
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
                  <TableCell className='py-2'>
                    <Button
                      onClick={() =>
                        downloadExcel({ id: item.id, name: item.name })
                      }
                      disabled={isLoading}
                      size='sm'
                      variant='ghost'
                      className='h-8'
                    >
                      {
                        <div className='flex items-center gap-2'>
                          <ArrowDown className='h-4 w-4' />{' '}
                          <span>Donwnlod Excel</span>
                        </div>
                      }
                    </Button>
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
