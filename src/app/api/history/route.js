import {prisma} from "@/lib/db"

export async function GET() {
    try {
    const sessions = await prisma.DebugSession.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 10
    })

    return Response.json(sessions)

  } catch (err) {
    console.error(err)

    return Response.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    )}
}