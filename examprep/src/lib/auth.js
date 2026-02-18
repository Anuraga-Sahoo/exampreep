import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const authOptions = {
    debug: true,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account.provider === "google") {
                const { name, email, image } = user;
                try {
                    await dbConnect();
                    const userExists = await User.findOne({ email });
                    if (!userExists) {
                        await User.create({
                            name,
                            email,
                            image,
                            subscription: 'free',
                        });
                    }
                    return true;
                } catch (error) {
                    console.error("Error saving user to DB:", error);
                    return false;
                }
            }
            return true;
        },
        async session({ session }) {
            try {
                await dbConnect();
                const dbUser = await User.findOne({ email: session.user.email });
                if (dbUser) {
                    session.user.id = dbUser._id;
                    session.user.subscription = dbUser.subscription;
                    session.user.name = dbUser.name;
                    session.user.image = dbUser.image;
                    session.user.phone = dbUser.phone;
                }
                return session;
            } catch (error) {
                console.error("Error fetching user data for session:", error);
                return session;
            }
        },
        async redirect({ url, baseUrl }) {
            // Force redirect to dashboard if resolving to home
            if (url === '/' || url === baseUrl) {
                return baseUrl + '/dashboard';
            }
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl + '/dashboard';
        },
    },
    pages: {
        signIn: '/login', // Custom login page
    },
};
