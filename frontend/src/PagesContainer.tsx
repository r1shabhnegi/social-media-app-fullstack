import { Route, Routes } from 'react-router-dom';
import { Layout } from './Layout';
import { privateRoutes, publicRoutes } from './routes';
import ProtectedRoutes from './ProtectedRoutes';

const PagesContainer = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {publicRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={element}
          />
        ))}

        <Route element={<ProtectedRoutes />}>
          {privateRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={element}
            />
          ))}
        </Route>
      </Route>
    </Routes>
  );
};
export default PagesContainer;
