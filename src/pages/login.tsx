import LoginForm from "../components/Auth/LoginForm";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

export default function LoginPage() {
  

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div>
          <h2 className="my-6 text-center text-3xl font-extrabold text-gray-400">
            Sign in to your account
          </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};