import { Layout } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import AddQualityProject from './add-quality-project'
import { IMAGE_BASE_URL } from '@/api/apiUrl'
import { DownloadLink } from './components/DownloadLink'

export type TasksDialogType = 'import'

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
        <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Add Quality Project
            </h2>
            <p className='text-muted-foreground'>
              Add a new quality project to the list
            </p>
          </div>
          <div className='p-5'>
            <DownloadLink
              href={`${IMAGE_BASE_URL}/exports/sample_quality_Project/quality_project_sample.xlsx`}
              label='Download Sample'
            />
          </div>
        </div>
        <AddQualityProject />
      </Layout.Body>
    </Layout>
  )
}

export default index
