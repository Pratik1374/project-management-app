import { signIn, signOut, useSession } from "next-auth/react";

export const useUser = () => {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isLoading: status === "loading",
    isLoggedIn: status === "authenticated",
  };
};

export { signIn, signOut };
