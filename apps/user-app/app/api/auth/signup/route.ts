import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";
import bcrypt from "bcryptjs";
import { SignupInput } from "@repo/common";
import redis from "@/app/lib/redis";
import { sendOTPEmail } from "@/app/lib/email";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const result = SignupInput.safeParse(body);

    if (!result.success) {
        return NextResponse.json({
            message: "Invalid Inputs"
        }, {
            status: 400
        });
    }

    const { email, password } = result.data;

    // 1. Check Rate Limit (60 seconds cooldown)
    const cooldown = await redis.get(`otp:cooldown:${email}`);
    if (cooldown) {
        return NextResponse.json({
            message: "Please wait 60 seconds before requesting another OTP" 
        }, {
            status: 429
        });
    }

    // 2. Check if user already exists in DB
    const existingUser = await prisma.user.findFirst({
        where: { email }
    });

    if (existingUser) {
        return NextResponse.json({
            message: "User already exists"
        }, {
            status: 403
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        // 3. Store in Redis with 10 min expiry
        await redis.set(`user:pending:${email}`, JSON.stringify({
            email,
            password: hashedPassword,
            otp
        }), {
            ex: 600
        });

        // 4. Set Cooldown in Redis for 60 seconds
        await redis.set(`otp:cooldown:${email}`, "true", {
            ex: 60
        });

        // 5. Send Real OTP Email
        await sendOTPEmail(email, otp);

        return NextResponse.json({ 
            message: "OTP sent to your email" 
        }, { 
            status: 200 
        });
    } catch (e) {
        return NextResponse.json({ 
            message: "Failed to send OTP. Please try again later." 
        }, { 
            status: 500 
        });
    }
}
