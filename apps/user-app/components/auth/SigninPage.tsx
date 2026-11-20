"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@repo/ui/AuthCard";
import { TextInput } from "@repo/ui/TextInput";
import { Button } from "@repo/ui/Button";

export const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCredentialsLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Sign in to Payzee"
      subtitle="Access your personal balance, transfers, and cards"
    >
      <form onSubmit={handleCredentialsLogin} className="flex flex-col gap-4">
        <TextInput
          label="Email address"
          value={email}
          onChange={setEmail}
          placeholder="name@example.com"
          type="email"
          required
        />
        <TextInput
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          type="password"
          showPasswordToggle
          required
        />

        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <div className="pt-2">
          <Button type="submit" disabled={loading} variant="primary">
            {loading ? "Signing in..." : "Continue"}
          </Button>
        </div>
      </form>

      <p className="mt-8 text-center text-[#6B7280] text-sm font-medium leading-relaxed">
        Don't have an account?{" "}
        <a
          href="/auth/signup"
          className="text-[#7B61FF] hover:text-[#6C4FE0] font-semibold transition-colors"
        >
          Create one now
        </a>
      </p>
    </AuthCard>
  );
};
