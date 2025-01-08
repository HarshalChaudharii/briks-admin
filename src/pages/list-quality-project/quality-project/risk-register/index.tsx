import { privateGetRequest } from '@/api/apiFunctions'
import { GET_RISK_REGISTER } from '@/api/apiUrl'
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
import '../../pagination.css'
import { Card, CardFooter } from '@/components/ui/card'
import { useState } from 'react'
import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ReactPaginate from 'react-paginate'

interface RiskData {
  id: number
  projectId: number
  projectMilestone: string
  description: string
  probability: number
  impact: number
  pxi: number
  actionPlan: string
  rca: string
  riskStrategy: string
  riskOwner: number
  urgency: string
  status: string
  plannedClosureDate: string
  actualClosureDate: string | null
  remarks: string
  createdAt: string
  updatedAt: string
}

const RiskRegister = () => {
  const { id } = useParams<{ id: string }>()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data: queryData, isLoading } = useQuery({
    queryKey: ['riskRegister', id, currentPage, pageSize, searchTerm],
    queryFn: async () => {
      const response = await privateGetRequest(
        `${GET_RISK_REGISTER}/${id}?pageNo=${currentPage}&pageSize=${pageSize}&search=${searchTerm}`
      )
      return response.data
    },
  })

  const data: RiskData[] = queryData?.data ?? []
  const pagination = queryData?.pagination ?? {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value)
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
              <TableHead>Milestone</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>Impact</TableHead>
              <TableHead>PXI</TableHead>
              <TableHead>Action Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Planned Closure</TableHead>
              <TableHead>Remarks</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className='text-center'>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              data.map((item: RiskData) => (
                <TableRow key={item.id}>
                  <TableCell>{item.projectMilestone}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.probability}</TableCell>
                  <TableCell>{item.impact}</TableCell>
                  <TableCell>{item.pxi}</TableCell>
                  <TableCell>{item.actionPlan}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.urgency}</TableCell>
                  <TableCell>
                    {new Date(item.plannedClosureDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{item.remarks}</TableCell>
                </TableRow>
              ))
            )}
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

export default RiskRegister
