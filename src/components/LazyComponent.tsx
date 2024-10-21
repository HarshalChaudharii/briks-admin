import React from 'react'

// Create a map of static imports
const lazyModules: Record<
  string,
  () => Promise<{ default: React.ComponentType<any> }>
> = {
  dashboard: () => import('../pages/dashboard'),
  tasks: () => import('../pages/tasks'),
  chats: () => import('../pages/chats'),
  apps: () => import('../pages/apps'),
  // Add more modules here as needed
}

interface LazyComponentProps {
  moduleKey: keyof typeof lazyModules // Ensures moduleKey matches one of the keys in lazyModules
}

const LazyComponent = ({ moduleKey }: LazyComponentProps) => {
  const Lazy = React.lazy(lazyModules[moduleKey])

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Lazy />
    </React.Suspense>
  )
}

export default LazyComponent
