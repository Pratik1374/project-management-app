import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { api } from "@/utils/api";
import { useUser } from "@/utils/auth";
import { useRouter } from "next/router";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  if(user) {
    router.push("/dashboard");
  }

  return (
    <>
      <Head>
        <title>Project Management App</title>
        <meta name="description" content="Manage projects efficiently" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-3xl text-center font-extrabold tracking-tight text-white sm:text-[3rem]">
            <span className="text-[hsl(280,100%,70%)]">Effortless Task Tracking for Teams.</span>
          </h1>
          <p className="text-gray-200 text-center max-w-[750px]">Take control of your to-do list. Our intuitive interface makes task management simple, so you can focus on what matters most – getting things done.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="/signup"
            >
              <h3 className="text-2xl font-bold">Sign Up</h3>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="/login"
            >
              <h3 className="text-2xl font-bold">Log In</h3>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}