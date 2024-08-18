import PropTypes from 'prop-types'
import useAuth from '../hooks/useAuth'
import { Navigate, useLocation } from 'react-router-dom'


const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="flex items-center justify-center min-h-screen">
  <span className="loading loading-ring loading-lg" style={{ width: '6rem', height: '6rem' }}></span>
</div>
  if (user) return children
  return <Navigate to='/login' state={location.state?.form?.pathname} replace='true' />
}

PrivateRoute.propTypes = {
  children: PropTypes.element,
}

export default PrivateRoute