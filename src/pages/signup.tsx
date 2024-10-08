import { useUser } from "@/utils/auth";
import SignupForm from "../components/Auth/SignupForm";
import { useRouter } from "next/router";

export default function SignupPage() {
  const { user } = useUser();
  const router = useRouter();

  if(user) {
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div>
          <h2 className="my-6 text-center text-3xl font-extrabold text-gray-400">
            Create an Account
          </h2>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
