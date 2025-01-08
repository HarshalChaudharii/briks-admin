import { privateGetRequest } from '@/api/apiFunctions'
import { GET_QUALITY_LEVELS } from '@/api/apiUrl'
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
import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ReactPaginate from 'react-paginate'
interface Level {
  id: number
  name: string
  type: string
  description: string
}
interface QualityLevel {
  id: number
  name: string
  type: string
  description: string
  projectId: number
  parentId: number | null
  hasChildren: boolean
  level1: Level | null
  level2: Level | null
  level3: Level | null
}

const QualityLevels = () => {
  const { id } = useParams<{ id: string }>()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedRole, _] = useState<string>()

  const { data: levelByProjectId } = useQuery({
    queryKey: [
      'levelByProjectId',
      id,
      currentPage,
      pageSize,
      searchTerm,
      selectedRole,
    ],
    queryFn: async () => {
      const response = await privateGetRequest(
        `${GET_QUALITY_LEVELS}/${id}?pageNo=${currentPage}&pageSize=${pageSize}&search=${searchTerm}`
      )
      return response.data
    },
  })
  const data = levelByProjectId?.data ?? []
  const pagination = levelByProjectId?.pagination ?? {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  // @ts-ignore
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
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Level 1</TableHead>
              <TableHead>Level 2</TableHead>
              <TableHead>Level 3</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((item: QualityLevel) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.description}</TableCell>
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

export default QualityLevels
