"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/utils/auth";
import InputComponent from "../InputCompoent";
import { toast } from "react-toastify";
import Link from "next/link";
import Loader from "../Loader";

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function isValidEmail(email: string): boolean {
    const regex =
      /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
    return regex.test(email);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignupError(null);

    try {
      if (!name || !email || !password) {
        toast.error("Name, email, and password are required");
        return;
      }

      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      if (!isValidEmail(email)) {
        toast.error("Please enter valid email address.");
        return;
      }

      setIsLoading(true);
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
        toast.error(errorData.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      setSignupError("An error occurred during signup.");
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    {isLoading && <Loader/>}
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Name Input */}
      <InputComponent
        label="Name"
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        error={
          signupError && signupError.includes("name") ? signupError : undefined
        }
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

      <button type="submit" className="submit-button">
        Sign Up
      </button>
      <p className="text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="border-0 border-b border-solid border-blue-600 text-blue-600"
        >
          Login here
        </Link>
      </p>
    </form>
    </>
  );
}
