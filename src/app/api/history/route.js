import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sessions = await prisma.DebugSession.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    return Response.json(sessions);
  } catch (err) {
    console.error(err);

    return Response.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
