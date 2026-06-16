import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import crypto from "crypto"

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json({error: "Unauthorized"}, {status: 401})
        }

        const token = crypto.randomBytes(32).toString("hex");

        await prisma.user.update({
            where: { id: session.user.id},
            data: { apiToken: token}
        });

        return Response.json({token});

    } catch (error) {
        console.error(error);
        return Response.json({ error: "Failed to generate token"}, {status: 500})
    }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { apiToken: true}
    })

    return Response.json({ token: user?.apiToken || null });
} catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch token" }, {status: 500}); 
}
}