import { Outlet } from 'react-router-dom'

const ErrorLayout = () => {
  return (
    <div className="error-layout">
      <Outlet />
    </div>
  )
}

export default ErrorLayout
