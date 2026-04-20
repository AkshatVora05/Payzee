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
    const router = useRouter();

    const handleCredentialsLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        
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
    };

    return (
        <AuthCard title="Welcome back" subtitle="Login to continue to Payzee">
            <form onSubmit={handleCredentialsLogin} className="flex flex-col gap-6">
                <TextInput 
                    label="Email Address"
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
                    placeholder="••••••••"
                    type="password"
                    required
                />
                
                {error && (
                    <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <Button type="submit" onClick={() => {}} variant="primary">
                    Sign In
                </Button>
            </form>

            <p className="mt-8 text-center text-zinc-400 text-sm font-medium leading-relaxed">
                New to Payzee? <br/>
                <a href="/auth/signup" className="text-blue-500 hover:text-blue-400 transition-colors">Create an account</a>
            </p>
        </AuthCard>
    );
};
