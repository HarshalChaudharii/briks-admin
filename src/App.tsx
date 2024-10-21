import { RouterProvider } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import router from '@/router'
import Cookie from 'js-cookie'
const App = () => {
  const user_details = Cookie.get('user_details')

  return (
    <div>
      <RouterProvider router={router} />
      <Toaster />
    </div>
  )
}

export default App
