import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";
import redis from "@/app/lib/redis";
import { VerifyOtpInput } from "@repo/common";

type UserData = {
    email: string,
    password: string,
    otp: string
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const result = VerifyOtpInput.safeParse(body);

    if (!result.success) {
        return NextResponse.json({ 
            message: "Invalid inputs" 
        }, { 
            status: 400
        });
    }

    const { email, otp } = result.data;

    try {
        const data: UserData = await redis.get(`user:pending:${email}`) || {
            email: "",
            password: "",
            otp: ""
        };


        if (data.otp !== otp) {
            return NextResponse.json({
                message: "Incorrect OTP"
            }, {
                status: 400
            });
        }

        // Create user in DB
        await prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
            }
        });

        // Clear redis
        await redis.del(`user:pending:${email}`);

        return NextResponse.json({
            message: "Account verified and created" 
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
