import { z } from "zod";

export const SignupInput = z.object({
    email: z.string(),
    password: z.string().min(6),
});

export type SignupInput = z.infer<typeof SignupInput>;

export const SigninInput = z.object({
    email: z.string(),
    password: z.string().min(6),
});

export type SigninInput = z.infer<typeof SigninInput>;

export const VerifyOtpInput = z.object({
    email: z.email(),
    otp: z.string().length(6),
});

export type VerifyOtpInput = z.infer<typeof VerifyOtpInput>;

export const ResendOtpInput = z.object({
    email: z.email(),
});

export type ResendOtpInput = z.infer<typeof ResendOtpInput>;
