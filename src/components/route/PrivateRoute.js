import {Route, Redirect} from 'react-router-dom'
import MainLayout from '../layout/MainLayout'

export default function PrivateRoute({children, plain = false, ...rest}) {
  // ! check token valid atau engga
  const token = localStorage.getItem('token')

  return (
    <Route
      {...rest}
      render={({location}) =>
        token ? (
          plain ? (
            <>{children}</>
          ) : (
            <MainLayout>{children}</MainLayout>
          )
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: {from: location},
            }}
          />
        )
      }
    />
  )
}
