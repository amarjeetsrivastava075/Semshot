"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function GoogleButton() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const loginWithGoogle = async () => {
    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();

      await signInWithPopup(auth, provider);

      toast.success("Logged in successfully");

      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={loginWithGoogle}
      disabled={loading}
      className="
      flex
      w-full
      items-center
      justify-center
      gap-3
      rounded-xl
      border
      border-zinc-700
      bg-zinc-900
      py-3
      font-medium
      text-white
      transition
      hover:bg-zinc-800
      disabled:opacity-60
      "
    >
      <Globe size={20} />

      {loading ? "Connecting..." : "Continue with Google"}
    </button>
  );
}