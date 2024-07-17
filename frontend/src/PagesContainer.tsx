import { Route, Routes } from "react-router-dom";
import {
  privateRoutes,
  independentPageRoutes,
  profileRoutes,
  homeRoutes,
} from "./lib/routes";
import ProtectedRoutes from "./ProtectedRoutes";
import Layout from "./layouts/MainLayout";
import HomeLayout from "./layouts/HomeLayout";
import ProfileLayout from "./layouts/ProfileLayout";
import { Suspense } from "react";
import PageLoader from "./components/PageLoader";

const PagesContainer = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
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
