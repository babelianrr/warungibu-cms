import {Route, Redirect} from 'react-router-dom'
import {Login} from 'pages'

export default function LoginRoute({children, isAuth, setIsAuth, ...rest}) {
  const token = localStorage.token
  return (
    <Route
      {...rest}
      render={({location}) =>
        !token ? (
          <Login setIsAuth={setIsAuth} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: {from: location},
            }}
          />
        )
      }
    />
  )
}
