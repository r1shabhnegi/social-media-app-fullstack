import { Route, Routes } from "react-router-dom";
import {
  privateRoutes,
  independentPageRoutes,
  profileRoutes,
  homeRoutes,
} from "./lib/routes";
import ProtectedRoutes from "./ProtectedRoutes";
import { HomeLayout, Layout, ProfileLayout } from "./layout";
// import { Layout, ProfileLayout, HomeLayout } from "./layout";

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

          <Route element={<HomeLayout />}>
            {homeRoutes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={element}
              />
            ))}
          </Route>

          <Route element={<ProfileLayout />}>
            {profileRoutes?.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={element}
              />
            ))}
          </Route>
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
