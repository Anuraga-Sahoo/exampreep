"use client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link"; // added for register link

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/dashboard");
        }
    }, [status, router]);

    if (status === "loading") {
        return <div className="flex min-h-screen items-center justify-center bg-white text-teal-600 font-medium">Loading...</div>;
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-6 relative overflow-hidden bg-white">
            {/* Subtle Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-green-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

            <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl shadow-teal-900/5 border border-white/50 p-10 text-center relative z-10 transform transition-all hover:scale-[1.01]">
                <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center shadow-inner border border-teal-100">
                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-extrabold mb-3 text-gray-900 tracking-tight">Welcome Back</h1>
                <p className="text-gray-500 mb-8 font-medium">Sign in to continue your preparation</p>

                <button
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-teal-500 hover:bg-teal-50 px-4 py-3.5 rounded-xl transition-all font-bold text-gray-700 hover:text-teal-700 shadow-sm hover:shadow-md"
                >
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </button>

                <p className="mt-8 text-center text-sm font-medium text-gray-500">
                    Don't have an account? <Link href="/register" className="text-teal-600 font-bold hover:underline hover:text-teal-700 transition-colors">Sign up</Link>
                </p>
                <div className="mt-6 text-xs text-gray-400">
                    By confirming, you agree to our Terms of Service and Privacy Policy.
                </div>
            </div>
        </div>
    );
}
