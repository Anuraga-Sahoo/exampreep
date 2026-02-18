import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login",
    },
});

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/exams/:path*",
        "/mock-tests/:path*",
        "/test/:path*",
        "/previous-year-papers/:path*"
    ]
};
