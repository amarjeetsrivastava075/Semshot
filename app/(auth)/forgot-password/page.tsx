import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="mt-2">Password reset feature coming soon.</p>
        <Link href="/login" className="text-blue-500 mt-4 inline-block">
          Back to Login
        </Link>
      </div>
    </div>
  );
}