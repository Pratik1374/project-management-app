import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className="flex"> 
      <main className="flex-1">
        <Component {...pageProps} /> 
      </main>
    </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
