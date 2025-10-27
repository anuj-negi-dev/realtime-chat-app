import { Navigate, Outlet } from "react-router-dom";

interface Props {
  requireAuth: boolean;
}

const RouterGuard = ({ requireAuth }: Props) => {
  const user = null;
  if (requireAuth && !user) return <Navigate to="/" replace />;

  if (!requireAuth && user) return <Navigate to="/chat" replace />;

  return <Outlet />;
};

export default RouterGuard;
