import { privateGetRequest } from '@/api/apiFunctions'
import { GET_AREA_BY_PROJECT_ID } from '@/api/apiUrl'
import { Layout } from '@/components/custom/layout'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import '../pagination.css'
import { Card, CardFooter } from '@/components/ui/card'
import { useState } from 'react'
import { ArrowUp, SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ReactPaginate from 'react-paginate'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const QualityArea = () => {
  const { id } = useParams<{ id: string }>()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data: areaByProjectId } = useQuery({
    queryKey: ['areaByProjectId', id, currentPage, pageSize, searchTerm],
    queryFn: async () => {
      const response = await privateGetRequest(
        `${GET_AREA_BY_PROJECT_ID}/${id}?pageNo=${currentPage}&pageSize=${pageSize}&search=${searchTerm}`
      )
      return response.data
    },
  })
  const data = areaByProjectId?.data ?? []
  const pagination = areaByProjectId?.pagination ?? {
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
      <div className='mb-6 mt-10 flex items-center justify-between gap-4'>
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

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Area</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell className='flex items-center'></TableCell>
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
    </Layout>
  )
}

export default QualityArea
