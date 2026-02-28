import { Route, Routes } from 'react-router-dom'
import routes from './routes'
import RequireAuth from './hocs/RequireAuth'

const App = () => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={<route.layout />}>
          <Route
            {...route}
            element={
              <RequireAuth component={route.element} path={route.path} />
            }
          />
        </Route>
      ))}
    </Routes>
  )
}

export default App
