"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/utils/auth";
import InputComponent from "../InputCompoent"; 

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignupError(null);

    try {
      if (!name || !email || !password) {
        setSignupError("Name, email, and password are required");
        return;
      }

      if (password.length < 6) {
        setSignupError("Password must be at least 6 characters");
        return;
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        await signIn("credentials", { 
          email, 
          password,
          redirect: false,
        });
        router.push("/dashboard");
      } else {
        const errorData = await res.json();
        setSignupError(errorData.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      setSignupError("An error occurred during signup.");
      console.error("Signup error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Name Input */}
      <InputComponent
        label="Name"
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        error={signupError && signupError.includes("name") ? signupError : undefined} 
      />

      <InputComponent
        label="Email"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        error={
          signupError && signupError.includes("email") ? signupError : undefined
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
          signupError && signupError.includes("password")
            ? signupError
            : undefined
        }
      />

      {signupError && <p className="text-xs text-red-500">{signupError}</p>}

      <button
        type="submit"
        className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Sign Up
      </button>
    </form>
  );
}