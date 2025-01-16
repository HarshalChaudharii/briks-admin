import { privateGetRequest } from '@/api/apiFunctions'
import { IMAGE_BASE_URL, QUALITY_USERS } from '@/api/apiUrl'
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import UploadUser from './upload/UploadUser'
import { DownloadLink } from '@/pages/quality-projects/components/DownloadLink'

const roleOptions = [
  { value: 'All', label: 'All' },
  //   { value: 'ADMIN', label: 'Admin' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'ENGINEER', label: 'Engineer' },
  { value: 'QUALITY', label: 'Quality Engineer' },
  { value: 'SITE_ENGINEER', label: 'Site Engineer' },
  { value: 'VALIDATOR', label: 'Validator' },
]

const QualityUsers = () => {
  const { id } = useParams<{ id: string }>()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  //   @ts-ignore
  const [pageSize, setPageSize] = useState(10)
  const [selectedRole, setSelectedRole] = useState<string>()

  const { data: userByProjectId } = useQuery({
    queryKey: [
      'userByProjectId',
      id,
      currentPage,
      pageSize,
      searchTerm,
      selectedRole,
    ],
    queryFn: async () => {
      const response = await privateGetRequest(
        `${QUALITY_USERS}/${id}?pageNo=${currentPage}&pageSize=${pageSize}&search=${searchTerm}${selectedRole ? (selectedRole === 'All' ? '' : `&role=${selectedRole}`) : ''}`
      )
      return response.data
    },
  })
  const data = userByProjectId?.data ?? []
  const pagination = userByProjectId?.pagination ?? {
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
      <div className='p-5'>
        <DownloadLink
          href={`${IMAGE_BASE_URL}/exports/sample_quality_Project/sample_user.xlsx`}
          label='Download Sample'
        />
      </div>
      <UploadUser />
      <div className='mb-6  flex items-center justify-between gap-4'>
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
        <div className='flex items-center gap-4'>
          <Select
            value={selectedRole}
            onValueChange={(value) => setSelectedRole(value)}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select Role' />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* <DropdownMenu>
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
        </DropdownMenu> */}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: any, index: number) => (
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

export default QualityUsers
