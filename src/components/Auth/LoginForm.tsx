"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/utils/auth";
import InputComponent from "../InputCompoent";
import { toast } from "react-toastify";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError(null); 

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result?.error) {
        toast.success("Login successful!",{autoClose: 1000}); 
        router.push("/dashboard"); 
      } else {
        toast.error("Invalid credentials.");
        setLoginError(result.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred during login.");
      toast.error("An error occurred during login."); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          loginError && loginError.includes("password") ? loginError : undefined
        }
      />
      <button
        type="submit"
        className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Log in
      </button>
    </form>
  );
}
