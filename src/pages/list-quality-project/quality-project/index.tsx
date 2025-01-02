import { Layout } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import QualityArea from './QualityArea'
import QualityUsers from './QualityUsers'
import QualityLevels from './QualityLevels'

const index = () => {
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
          </div>
        </div>
        <QualityArea />
        <QualityUsers />
        <QualityLevels />
      </Layout.Body>
    </Layout>
  )
}

export default index
