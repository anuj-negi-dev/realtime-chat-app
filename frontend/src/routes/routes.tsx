import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import Chat from "@/pages/chat";
import SingleChat from "@/pages/single-chat";

export const authRouter = {
  signIn: "/",
  signUp: "/sign-up",
};

export const protectedRoutes = {
  chat: "/chat",
  singleChat: "/chat/:chatId",
};

export const authRoutesPaths = [
  {
    path: authRouter.signIn,
    element: <SignIn />,
  },
  {
    path: authRouter.signUp,
    element: <SignUp />,
  },
];

export const protectedRoutesPaths = [
  {
    path: protectedRoutes.chat,
    element: <Chat />,
  },
  {
    path: protectedRoutes.singleChat,
    element: <SingleChat />,
  },
];

export const isAuthRoute = (pathname: string) => {
  return Object.values(protectedRoutes).includes(pathname);
};
