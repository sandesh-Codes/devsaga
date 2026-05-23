import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const weakSpots = await prisma.weakSpot.findMany({
      where: { userId: session.user.id },
      include: { resources: true, test: true },
      orderBy: { confidence: "desc" },
    });

    return Response.json({ weakSpots });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch weak spots" }, { status: 500 });
  }
}