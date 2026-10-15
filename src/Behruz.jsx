import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { router } from './router/router'

// Feature entry point; the app integrator can mount this from App.jsx.
export default function Behruz() {
  return <AuthProvider><RouterProvider router={router} /></AuthProvider>
}
