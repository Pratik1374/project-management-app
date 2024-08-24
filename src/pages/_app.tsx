import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Poppins } from "next/font/google";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main className={`${poppins.className} flex-1`}>
        <Component {...pageProps} />
        <ToastContainer theme="dark" position="top-center" transition={Zoom} />
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
