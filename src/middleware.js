import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/debug/:path*", "/history/:path*", "/irt/:path*", "/settings/:path*"],
};
