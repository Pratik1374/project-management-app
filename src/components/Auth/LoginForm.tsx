"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/utils/auth";
import InputComponent from "../InputCompoent";
import { toast } from "react-toastify";
import Link from "next/link";
import Loader from "../Loader";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function isValidEmail(email: string): boolean {
    const regex =
      /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
    return regex.test(email);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError(null);

    try {
      if (!email) {
        toast.error("Please enter email address.");
        return;
      }
      if (!password) {
        toast.error("Please enter password.");
        return;
      }
      if (!isValidEmail(email)) {
        toast.error("Please enter valid email address.");
        return;
      }

      setIsLoading(true);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result?.error) {
        router.push("/dashboard");
      } else {
        toast.error("Invalid credentials.");
        setLoginError(result.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred during login.");
      toast.error("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <InputComponent
          label="Email"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          error={
            loginError && loginError.includes("email") ? loginError : undefined
          }
        />

        <InputComponent
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          error={
            loginError && loginError.includes("password")
              ? loginError
              : undefined
          }
        />
        <button type="submit" className="submit-button">
          Log in
        </button>
        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="border-0 border-b border-solid border-blue-600 text-blue-600"
          >
            Create one
          </Link>
        </p>
      </form>
    </>
  );
}
