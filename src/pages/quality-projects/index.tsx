import { Layout } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import AddQualityProject from './add-quality-project'
import { IconDownload } from '@tabler/icons-react'
import { IMAGE_BASE_URL } from '@/api/apiUrl'
import { DownloadIcon } from 'lucide-react'

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

interface DownloadLinkProps {
  href: string
  label: string
  className?: string
}

const DownloadLink: React.FC<DownloadLinkProps> = ({
  href,
  label,
  className = '',
}) => {
  return (
    <a
      href={href}
      className={`
        inline-flex items-center space-x-2 rounded-full bg-blue-600 
        px-4 py-2 text-sm 
        font-medium text-white 
        shadow-md transition-all 
        duration-200 hover:bg-blue-700 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
        active:scale-95
        ${className}
      `}
    >
      <span>{label}</span>
      <DownloadIcon
        size={18}
        className='transition-transform duration-200 group-hover:translate-y-0.5'
      />
    </a>
  )
}

export default index
