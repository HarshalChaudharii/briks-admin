import { RouterProvider } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import router from '@/router'

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
      <Toaster />
    </div>
  )
}

export default App
