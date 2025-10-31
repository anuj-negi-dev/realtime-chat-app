import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./hooks/user-auth";
import { AppRouter } from "./routes";
import Logo from "./components/logo";
import { Spinner } from "./components/ui/spinner";
import { isAuthRoute } from "./routes/routes";

function App() {
  const { pathname } = useLocation();
  const { user, isAuthStatus, isAuthStatusLoading } = useAuth();
  const isAuth = isAuthRoute(pathname);

  useEffect(() => {
    if (!isAuth) return;
    isAuthStatus();
  }, [isAuthStatus, isAuth]);

  if (!user && isAuthStatusLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Logo imgClass="size-20" showText={false} />
        <Spinner className="size-6" />
      </div>
    );
  }

  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
