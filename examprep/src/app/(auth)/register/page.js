"use client";
import Link from "next/link";
import { FaUserPlus } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function RegisterPage() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="flex min-h-[85vh] items-center justify-center px-6 relative overflow-hidden bg-[#f8fafc]">
            {/* Premium Dynamic Background Elements */}
            <div className="absolute top-0 w-full h-full bg-gradient-to-br from-teal-50/50 to-emerald-50/50 -z-20"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2.5, repeat: Infinity, repeatType: "mirror", delay: 0.2 }}
                className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-200/30 rounded-full mix-blend-multiply filter blur-[100px] -z-10 animate-blob"
            ></motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "mirror", delay: 0.7 }}
                className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-emerald-200/30 rounded-full mix-blend-multiply filter blur-[100px] -z-10 animate-blob animation-delay-2000"
            ></motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2.8, repeat: Infinity, repeatType: "mirror", delay: 1.2 }}
                className="absolute bottom-[-10%] right-[20%] w-[450px] h-[450px] bg-cyan-200/30 rounded-full mix-blend-multiply filter blur-[100px] -z-10 animate-blob animation-delay-4000"
            ></motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-teal-900/10 border border-white p-10 relative z-10 overflow-hidden"
            >
                {/* Decorative Top Accent */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-teal-400 to-emerald-400"></div>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mb-8 flex justify-center relative"
                >
                    <div className="absolute inset-0 bg-teal-400 blur-xl opacity-20 rounded-full animate-pulse"></div>
                    <div className="w-20 h-20 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl flex items-center justify-center shadow-inner border border-white relative z-10 text-teal-600">
                        <FaUserPlus size={36} />
                    </div>
                </motion.div>

                <h1 className="text-3xl font-black text-center mb-10 text-gray-900 tracking-tight">Create Account</h1>

                <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="w-full relative group bg-white border border-gray-200 px-4 py-4 rounded-2xl transition-all shadow-sm hover:shadow-xl hover:border-teal-200 overflow-hidden mb-8"
                >
                    {/* Hover Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-teal-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                    <div className="relative z-10 flex items-center justify-center gap-4">
                        <div className="bg-white p-1.5 rounded-full shadow-sm">
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        </div>
                        <span className="font-bold text-gray-700 group-hover:text-teal-800 transition-colors">
                            Sign up with Google
                        </span>
                    </div>
                </motion.button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest text-gray-400">
                        <span className="px-4 bg-white/80 backdrop-blur-sm">Or sign up with email</span>
                    </div>
                </div>

                <form className="space-y-4 opacity-40 pointer-events-none grayscale">
                    <div>
                        <input
                            disabled
                            type="text"
                            className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50/50 outline-none transition-all placeholder-gray-400 font-medium text-gray-800"
                            placeholder="Full Name (Coming in v2)"
                        />
                    </div>
                    <div>
                        <input
                            disabled
                            type="email"
                            className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50/50 outline-none transition-all placeholder-gray-400 font-medium text-gray-800"
                            placeholder="Email Address (Coming in v2)"
                        />
                    </div>
                </form>

                <div className="mt-10 pt-6 border-t border-gray-100 text-center">
                    <p className="text-sm font-medium text-gray-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-teal-600 font-black hover:underline hover:text-teal-700 transition-colors inline-block hover:scale-105 transform active:scale-95">
                            Log in here
                        </Link>
                    </p>
                    <p className="mt-4 text-[10px] uppercase tracking-wider font-bold text-gray-400">
                        By signing up, you agree to our Terms
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
