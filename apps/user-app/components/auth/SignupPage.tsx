"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@repo/ui/AuthCard";
import { TextInput } from "@repo/ui/TextInput";
import { Button } from "@repo/ui/Button";

export const SignupPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Something went wrong");
            } else {
                router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
            }
        } catch (err) {
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard title="Get Started" subtitle="Join the next generation of payments">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <TextInput 
                    label="Email Address"
                    value={email}
                    onChange={setEmail}
                    placeholder="john.doe@example.com"
                    type="email"
                    required
                />
                <TextInput 
                    label="Secure Password"
                    value={password}
                    onChange={setPassword}
                    placeholder="******"
                    type="password"
                    showPasswordToggle
                    required
                />
                
                {error && (
                    <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <Button type="submit" onClick={() => {}} disabled={loading}>
                    {loading ? "Processing..." : "Create Account"}
                </Button>
            </form>

            <p className="mt-8 text-center text-[#6B7280] text-sm font-medium leading-relaxed">
                Already have an account?{" "}
                <a href="/auth/signin" className="text-[#7B61FF] hover:text-[#6C4FE0] font-semibold transition-colors">Sign In</a>
            </p>
        </AuthCard>
    );
};
