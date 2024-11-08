import { Layout } from '@/components/custom/layout'

import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'

import { privateGetRequest } from '@/api/apiFunctions'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BASE_URL, IMAGE_BASE_URL } from '@/api/apiUrl'
import { ArrowUp, Image, SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'
import { Button } from '@/components/custom/button'
import {
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import { Card, CardFooter } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import moment from 'moment'
import { useSearchParams } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function Tasks() {
  interface ProjectItem {
    id: number
    name: string
    plannedStartDate: string
    plannedEndDate: string | null
    actualStartDate: string | null
    actualEndDate: string | null
    plannedDuration: number
    remainingDuration: number
    reasonForDelay: string
    remarks: string
    photos: { url: string; id: number }[]
    status: string
    hasNext?: boolean
  }

  const [data, setData] = useState<ProjectItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  // const [view, setView] = useState('PROJECT')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    remainingPages: 0,
  })

  const [searchParams, setSearchParams] = useSearchParams() // Managing URL params
  const view = useMemo(
    () => searchParams.get('view') || 'PROJECT',
    [searchParams]
  )
  const currentWbsId = useMemo(
    () => searchParams.get('wbsId') || '',
    [searchParams]
  )
  const hasWbsId = !!currentWbsId // Boolean to determine if we're in a WBS view

  // Function to fetch all project data
  const getAllProjectList = useCallback(async () => {
    try {
      const url =
        BASE_URL +
        '/projects/all' +
        '?pageNo=' +
        currentPage +
        '&pageSize=' +
        pageSize +
        '&search=' +
        searchTerm

      const response = await privateGetRequest(url)

      if (response?.data.success) {
        setData(response.data.data)
        setPagination(response.data.pagination)
        setSearchParams({ view: 'PROJECT', wbsId: '' }, { replace: true }) // Avoid redundant state pushes
      }
    } catch (error) {
      console.log(error)
    }
  }, [currentPage, pageSize, searchTerm, setSearchParams])

  // Function to fetch WBS list based on WBS ID

  // Memoized `getAllWbsList` and `getAllActivityList` with replace flag
  const getAllWbsList = useCallback(
    async (wbsParams: string) => {
      try {
        const url = `${BASE_URL}/project/wbs/all/${wbsParams}?pageNo=${currentPage}&pageSize=${pageSize}&search=${searchTerm}`

        const response = await privateGetRequest(url)
        if (response?.data.success) {
          setData(response.data.data)
          setPagination(response.data.pagination)
          setSearchParams({ view: 'WBS', wbsId: wbsParams })
        }
      } catch (error) {
        console.log(error)
      }
    },
    [currentPage, pageSize, searchTerm, setSearchParams]
  )

  const getAllActivityList = useCallback(
    // @ts-ignore
    async (wbsParams) => {
      try {
        const url = `${BASE_URL}/activity/all/${wbsParams}?pageNo=${currentPage}&pageSize=${pageSize}&search=${searchTerm}`

        const response = await privateGetRequest(url)
        if (response?.data.success) {
          setData(response.data.data)
          setPagination(response.data.pagination)
          setSearchParams(
            { view: 'ACTIVITY', wbsId: wbsParams }
            // { replace: true }
          )
        }
      } catch (error) {
        console.log(error)
      }
    },
    [currentPage, pageSize, searchTerm, setSearchParams]
  )

  // Handle back navigation to project list
  const handleBackClick = useCallback(() => {
    setSearchParams({ view: 'PROJECT', wbsId: '' }, { replace: true })
  }, [setSearchParams])

  // Fetch data based on the presence of `wbsId` in URL parameters
  useEffect(() => {
    if (view === 'PROJECT') {
      getAllProjectList()
    } else if (view === 'WBS' && currentWbsId) {
      getAllWbsList(currentWbsId)
    } else if (view === 'ACTIVITY' && currentWbsId) {
      getAllActivityList(currentWbsId)
    }
  }, [view, currentWbsId, getAllProjectList, getAllWbsList, getAllActivityList])

  // Function to navigate to a WBS node (push wbsId to URL)

  interface HandleRowClickParams {
    wbsId: string
    hasNext: boolean
  }

  const handleRowClick = useCallback(
    ({ wbsId, hasNext }: HandleRowClickParams) => {
      if (hasNext === true) {
        getAllWbsList(wbsId)
      } else {
        getAllActivityList(wbsId)
      }
    },
    [getAllActivityList, getAllWbsList]
  )

  interface HandleSearchEvent {
    target: {
      value: string
    }
  }

  const handleSearch = (e: HandleSearchEvent) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  interface HandlePageChangeParams {
    page: number
  }

  const handlePageChange = ({ page }: HandlePageChangeParams) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: any) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  return (
    <Layout>
      {/* ===== Top Heading ===== */}

      <Layout.Header sticky>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          {hasWbsId && (
            <Button variant='outline' onClick={handleBackClick}>
              Back
            </Button>
          )}
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className='flex flex-col gap-4'>
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
                    <DropdownMenuRadioItem value='100'>
                      100 per page
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Card>
              {!hasWbsId && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='cursor-pointer'>ID</TableHead>
                      <TableHead className='cursor-pointer'>Name</TableHead>
                      <TableHead className='cursor-pointer'>
                        Plan Start Date
                      </TableHead>
                      <TableHead className='cursor-pointer'>
                        Plan End Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow
                        key={index}
                        // @ts-ignore
                        onClick={() => handleRowClick(item.projectWBSId, true)}
                        className='cursor-pointer'
                      >
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          {moment(item.plannedStartDate).format('DD MMM YYYY')}
                        </TableCell>
                        <TableCell>
                          {item.plannedEndDate === null
                            ? 'N/A'
                            : moment(item.plannedEndDate).format(
                                'MMMM Do YYYY'
                              )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {view === 'WBS' && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='cursor-pointer'>ID</TableHead>

                      <TableHead className='cursor-pointer'>Name</TableHead>
                      <TableHead className='cursor-pointer'>
                        Has Next Child
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow
                        key={index}
                        onClick={() =>
                          handleRowClick({
                            wbsId: item.id.toString(),
                            hasNext: item.hasNext ?? false,
                          })
                        }
                        className='cursor-pointer'
                      >
                        <TableCell>{item.id}</TableCell>

                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.hasNext ? 'Yes' : 'No'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {view === 'ACTIVITY' && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='cursor-pointer'>ID</TableHead>

                      <TableHead className='cursor-pointer'>Name</TableHead>
                      <TableHead className='cursor-pointer'>
                        Planned End Date
                      </TableHead>
                      <TableHead className='cursor-pointer'>
                        Planned End Date
                      </TableHead>
                      <TableHead className='cursor-pointer'>
                        Actual Start Date
                      </TableHead>
                      <TableHead className='cursor-pointer'>
                        Actual End Date
                      </TableHead>
                      <TableHead className='cursor-pointer'>
                        Planned Duration
                      </TableHead>
                      <TableHead className='cursor-pointer'>
                        Remaining Duration
                      </TableHead>
                      <TableHead className='cursor-pointer'>
                        Reason For Delay
                      </TableHead>
                      <TableHead className='cursor-pointer'>Remark</TableHead>
                      <TableHead className='cursor-pointer'>Images</TableHead>
                      <TableHead className='cursor-pointer'>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow
                        key={index}
                        // onClick={() => handleRowClick(item.id, item.hasNext)}
                        className='cursor-pointer'
                      >
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          {moment(item.plannedStartDate).format('DD MMM YYYY')}
                        </TableCell>
                        <TableCell>
                          {moment(item.plannedEndDate).format('DD MMM YYYY')}
                        </TableCell>
                        <TableCell>
                          {item.actualStartDate === null
                            ? 'N/A'
                            : moment(item.actualStartDate).format(
                                'DD MMM YYYY'
                              )}
                        </TableCell>
                        <TableCell>
                          {item.actualEndDate === null
                            ? 'N/A'
                            : moment(item.actualEndDate).format('DD MMM YYYY')}
                        </TableCell>
                        <TableCell>{item.plannedDuration / 8}</TableCell>
                        <TableCell>{item.remainingDuration / 8}</TableCell>
                        <TableCell>{item.reasonForDelay}</TableCell>
                        <TableCell>{item.remarks}</TableCell>
                        <TableCell>
                          <ActivityImages images={item.photos} />
                        </TableCell>
                        <TableCell>{item.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              <CardFooter className='mt-3 flex items-center justify-between border-t pt-3 '>
                <div className='text-xs text-muted-foreground'>
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, pagination.totalItems)} of{' '}
                  {pagination.totalItems} results
                </div>
                <div className='flex items-center space-x-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handlePageChange({ page: currentPage - 1 })}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handlePageChange({ page: currentPage + 1 })}
                    disabled={currentPage === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Layout.Body>
    </Layout>
  )
}

// @ts-ignore
const ActivityImages = ({ images }) => {
  // console.log(images)
  return (
    <Dialog>
      <DialogTrigger>
        <Image />
      </DialogTrigger>
      <DialogContent className='w-[70vw] max-w-7xl '>
        <DialogHeader>
          <DialogTitle>Images</DialogTitle>
          <DialogDescription className=''>
            <div className='relative flex flex-1 gap-2'>
              {images &&
                // @ts-ignore
                images.map((image, index) => (
                  <a
                    target='_blank'
                    href={IMAGE_BASE_URL + '/images/' + image.url}
                    key={image.id}
                    className='h-36 w-36 bg-white drop-shadow-md'
                  >
                    <img
                      src={IMAGE_BASE_URL + '/images/' + image.url}
                      key={index}
                      alt='activity'
                      className='object-fit h-full w-40  '
                      loading='lazy'
                    />
                  </a>
                ))}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
