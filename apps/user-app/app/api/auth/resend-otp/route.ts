import { NextRequest, NextResponse } from "next/server";
import redis from "@/app/lib/redis";
import { sendOTPEmail } from "@/app/lib/email";
import { ResendOtpInput } from "@repo/common";

type UserData = {
    email: string,
    password: string,
    otp: string
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const result = ResendOtpInput.safeParse(body);

    if (!result.success) {
        return NextResponse.json({ 
            message: "Invalid inputs" 
        }, { 
            status: 400 
        });
    }

    const { email } = result.data;

    // 1. Check Rate Limit (60 seconds cooldown)
    const cooldown = await redis.ttl(`otp:cooldown:${email}`);
    if (cooldown > 0) {
        return NextResponse.json({ 
            message: `Please wait ${cooldown} seconds before requesting another OTP` 
        }, { 
            status: 429 
        });
    }

    try {
        // 2. Retrieve existing pending user data
        const data: UserData | null = await redis.get(`user:pending:${email}`);

        if (!data) {
            return NextResponse.json({ 
                message: "Registration session expired. Please sign up again." 
            }, { 
                status: 400 
            });
        }

        // 3. Generate new OTP (optional, can reuse but generating new is safer)
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Update Redis with new OTP but keep original password/email
        await redis.set(`user:pending:${email}`, JSON.stringify({
            ...data,
            otp: newOtp
        }), { ex: 600 });

        // 4. Set Cooldown
        await redis.set(`otp:cooldown:${email}`, "true", { ex: 60 });

        // 5. Send Email
        await sendOTPEmail(email, newOtp);

        return NextResponse.json({ 
            message: "New OTP sent to your email" 
        }, { 
            status: 200 
        });
    } catch (e) {
        return NextResponse.json({ 
            message: "Internal server error" 
        }, { 
            status: 500 
        });
    }
}
