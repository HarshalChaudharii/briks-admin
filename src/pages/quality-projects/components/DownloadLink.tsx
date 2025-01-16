import { DownloadIcon } from 'lucide-react'

interface DownloadLinkProps {
  href: string
  label: string
  className?: string
}

export const DownloadLink: React.FC<DownloadLinkProps> = ({
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
