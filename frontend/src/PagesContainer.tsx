import { Route, Routes } from 'react-router-dom';
import { Layout } from './Layout';
import { privateRoutes, independentPageRoutes } from './lib/routes';
import ProtectedRoutes from './ProtectedRoutes';

const PagesContainer = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Route element={<Layout />}>
          {privateRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={element}
            />
          ))}
        </Route>
      </Route>

      {independentPageRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={element}
        />
      ))}
    </Routes>
  );
};
export default PagesContainer;
