import { useEffect } from "react";
import { useAuth } from "./hooks/user-auth";
import { AppRouter } from "./routes";
import Logo from "./components/logo";
import { Spinner } from "./components/ui/spinner";

function App() {
  const { user, isAuthStatus, isAuthStatusLoading } = useAuth();

  useEffect(() => {
    isAuthStatus();
  }, []);

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
