import { Layout } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import QualityArea from './QualityArea'
import QualityUsers from './QualityUsers'
import QualityLevels from './QualityLevels'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { privateGetRequest } from '@/api/apiFunctions'
import { GET_ALL_QUALITY_PROJECTS_BY_ID } from '@/api/apiUrl'
import RiskRegisterTab from './risk-register'

const index = () => {
  const { id } = useParams<{ id: string }>()
  const { data } = useQuery({
    queryKey: ['quality-project', id],
    queryFn: async () => {
      const response = await privateGetRequest(
        `${GET_ALL_QUALITY_PROJECTS_BY_ID}/${id}`
      )
      return response.data.data
    },
  })

  return (
    <>
      <Layout>
        <Layout.Header>
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <UserNav />
          </div>
        </Layout.Header>
        <Layout.Body>
          <h2 className='mb-5 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-3xl font-bold tracking-tight text-transparent'>
            <span>Project: </span>
            <span className='text-blue-500'> {data?.name}</span>
          </h2>

          <Tabs defaultValue='users' className='w-full'>
            <TabsList className='grid w-[30rem] grid-cols-4'>
              <TabsTrigger value='users'>Quality Users</TabsTrigger>
              <TabsTrigger value='area'>Quality Area</TabsTrigger>
              <TabsTrigger value='levels'>Quality Levels</TabsTrigger>
              <TabsTrigger value='risk-register'>Risk Register</TabsTrigger>
            </TabsList>
            <TabsContent value='users'>
              <QualityUsers />
            </TabsContent>
            <TabsContent value='area'>
              <QualityArea />
            </TabsContent>
            <TabsContent value='levels'>
              <QualityLevels />
            </TabsContent>
            <TabsContent value='risk-register'>
              <RiskRegisterTab />
            </TabsContent>
          </Tabs>
        </Layout.Body>
      </Layout>
    </>
  )
}

export default index
