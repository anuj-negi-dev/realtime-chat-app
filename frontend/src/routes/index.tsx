import { Route, Routes } from "react-router-dom";
import BaseLayout from "@/layout/base-layout";
import { authRoutesPaths, protectedRoutesPaths } from "./routes";
import AppLayout from "@/layout/app-layout";
import RouterGuard from "./router-guard";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<RouterGuard requireAuth={false} />}>
        <Route element={<BaseLayout />}>
          {authRoutesPaths.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>
      <Route path="/" element={<RouterGuard requireAuth={true} />}>
        <Route element={<AppLayout />}>
          {protectedRoutesPaths.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>
    </Routes>
  );
};
