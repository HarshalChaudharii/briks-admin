import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { privateGetRequest, privatePostRequest } from '@/api/apiFunctions'
import { useMutation, useQuery } from '@tanstack/react-query'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/custom/button'
import { Card } from '@/components/ui/card'
import { Layout } from '@/components/custom/layout'
import { RefreshCcw } from 'lucide-react'
import { SYNC_DATA } from '@/api/apiUrl'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { cn } from '@/lib/utils'
import moment from 'moment'
import { toast } from 'sonner'

const columns = [
  { name: 'ID', uid: 'id' },
  { name: 'SYNC TYPE', uid: 'syncType' },
  { name: 'LOG', uid: 'message' },
  { name: 'STATUS', uid: 'status' },
  { name: 'SYNCED AT', uid: 'createdAt' },
]

export default function Dashboard() {
  // const navigate = useNavigate()
  // navigate('/sign-in-2')
  const { data, isSuccess, refetch } = useQuery({
    queryKey: ['get-sync-logs'],
    queryFn: async () => {
      const response = await privateGetRequest(SYNC_DATA)
      return response.data.data
    },
  })

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const response = await privatePostRequest(SYNC_DATA, {}, {})
      return response
    },

    onSuccess: () => {
      toast.success('Data Synced Successfully')
    },

    onSettled: () => {
      refetch()
    },
  })

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        {/* <TopNav links={topNav} /> */}
        <div className='ml-auto flex items-center space-x-4'>
          {/* <Search /> */}
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      {/* ===== Main ===== */}
      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            {/* <Button>Download</Button> */}
            <Button
              className='px-5 '
              disabled={isLoading}
              onClick={() => mutate()}
            >
              <RefreshCcw className='mr-2' size='20' /> Sync Data
            </Button>
          </div>
        </div>
        {/* <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full pb-2 overflow-x-auto'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
              <TabsTrigger value='reports'>Reports</TabsTrigger>
              <TabsTrigger value='notifications'>Notifications</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                  <CardTitle className='text-sm font-medium'>
                    Total Revenue
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='w-4 h-4 text-muted-foreground'
                  >
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>$45,231.89</div>
                  <p className='text-xs text-muted-foreground'>
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                  <CardTitle className='text-sm font-medium'>
                    Subscriptions
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='w-4 h-4 text-muted-foreground'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+2350</div>
                  <p className='text-xs text-muted-foreground'>
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                  <CardTitle className='text-sm font-medium'>Sales</CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='w-4 h-4 text-muted-foreground'
                  >
                    <rect width='20' height='14' x='2' y='5' rx='2' />
                    <path d='M2 10h20' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+12,234</div>
                  <p className='text-xs text-muted-foreground'>
                    +19% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                  <CardTitle className='text-sm font-medium'>
                    Active Now
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='w-4 h-4 text-muted-foreground'
                  >
                    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+573</div>
                  <p className='text-xs text-muted-foreground'>
                    +201 since last hour
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  <Overview />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs> */}
        <div className='flex flex-col gap-4'>
          <div className='flex w-full items-center gap-4'></div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.uid} className='cursor-pointer'>
                      {column.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isSuccess &&
                  // @ts-ignore
                  data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.syncType}</TableCell>
                      <TableCell className='w-[50%]  whitespace-pre-wrap'>
                        {item.message}
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={cn({
                            'bg-green-500': item.status === 'SUCCESS',
                            'bg-red-500': item.status === 'FAILED',
                            'bg-yellow-500': item.status === 'ONGOING',
                          })}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {moment(item.createdAt).format('DD MMM YYYY hh:mm A')}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Card>
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
