"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { auth } from "@/firebase/firebase";
import AuthCard from "./AuthCard";
import PasswordInput from "./PasswordInput";
import GoogleButton from "./GoogleButton";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function login() {
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      toast.success("Welcome back!");

      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Welcome Back 👋"
      subtitle="Login to continue to SemShot"
    >
      <div className="space-y-5">

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
          w-full
          rounded-xl
          border
          border-zinc-700
          bg-zinc-950
          p-3
          text-white
          outline-none
          focus:border-blue-500
          "
        />

        <PasswordInput
          value={password}
          onChange={setPassword}
        />

        <button
          onClick={login}
          disabled={loading}
          className="
          w-full
          rounded-xl
          bg-blue-600
          py-3
          font-semibold
          text-white
          transition
          hover:bg-blue-700
          disabled:opacity-60
          "
        >
          {loading ? "Signing In..." : "Login"}
        </button>

        <GoogleButton />

        <div className="flex justify-between text-sm">

          <Link
            href="/forgot-password"
            className="text-blue-400 hover:underline"
          >
            Forgot Password?
          </Link>

          <Link
            href="/signup"
            className="text-blue-400 hover:underline"
          >
            Create Account
          </Link>

        </div>

      </div>
    </AuthCard>
  );
}