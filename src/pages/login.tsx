import { useUser } from "@/utils/auth";
import LoginForm from "../components/Auth/LoginForm";
import { useRouter } from "next/router";

export default function LoginPage() {
  const { user } = useUser();
  const router = useRouter();

  if(user) {
    router.push("/dashboard");
  }

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
