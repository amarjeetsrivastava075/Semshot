"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function PasswordInput({
  placeholder = "Password",
  value,
  onChange,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-xl
          border
          border-zinc-700
          bg-zinc-950
          px-4
          py-3
          pr-12
          text-white
          outline-none
          transition
          duration-300
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/30
        "
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          text-zinc-400
          hover:text-white
        "
      >
        {showPassword ? (
          <EyeOff size={20} />
        ) : (
          <Eye size={20} />
        )}
      </button>
    </div>
  );
}