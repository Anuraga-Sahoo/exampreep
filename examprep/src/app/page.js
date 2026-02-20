"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaGraduationCap, FaRegClock, FaChartLine, FaBookOpen, FaUserGraduate, FaQuestionCircle, FaTrophy } from "react-icons/fa";

// Floating animation variants for standard antigravity feel
const floatingAnimation = {
  y: ["-10px", "10px"],
  transition: {
    duration: 3,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut"
  }
};

const floatingAnimationDelayed = {
  y: ["10px", "-10px"],
  transition: {
    duration: 3.5,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut"
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] overflow-hidden font-sans relative text-gray-800 selection:bg-teal-200 selection:text-teal-900">

      {/* --- Ambient Effects & Premium Grid Background --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] -z-20"></div>
      <div className="absolute top-0 w-full h-96 bg-gradient-to-b from-teal-50/80 to-transparent -z-10"></div>

      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-300/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="fixed top-[40%] left-[60%] w-[300px] h-[300px] bg-emerald-200/20 rounded-full blur-[90px] -z-10 animate-pulse" style={{ animationDelay: '4s' }}></div>

      <main className="container mx-auto px-6 pt-24 pb-20 sm:pt-32 flex flex-col items-center">

        {/* --- 1. HERO SECTION --- */}
        <section className="w-full flex flex-col items-center text-center relative z-10 mb-32">

          <motion.div
            className="hidden md:flex absolute top-[10%] left-[10%] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl shadow-teal-900/10 rotate-[-6deg] items-center gap-3 border border-white"
            animate={{ y: ["-15px", "15px"], rotate: [-6, -4, -6] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center text-teal-700"><FaTrophy /></div>
            <div className="text-left"><p className="text-xs text-gray-500 font-bold">Top Ranker</p><p className="text-sm font-black text-gray-800">AIR 142</p></div>
          </motion.div>

          <motion.div
            className="hidden md:flex absolute top-[20%] right-[10%] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl shadow-blue-900/10 rotate-[8deg] items-center gap-3 border border-white"
            animate={{ y: ["15px", "-15px"], rotate: [8, 10, 8] }}
            transition={{ duration: 4.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-blue-700"><FaRegClock /></div>
            <div className="text-left"><p className="text-xs text-gray-500 font-bold">Speed Test</p><p className="text-sm font-black text-gray-800">+12% faster</p></div>
          </motion.div>


          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-gray-900 mb-6 relative z-10"
          >
            Prepare Smart.<br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500 animate-[gradient-x_3s_ease_infinite] inline-block mt-2 bg-[length:200%_auto]">Test Better.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 mb-12 font-bold tracking-wide max-w-2xl bg-white/60 backdrop-blur-md px-8 py-3 rounded-full border border-white/80 shadow-sm"
          >
            Mock Tests <span className="text-teal-400 mx-2">•</span> Previous Year Papers <span className="text-teal-400 mx-2">•</span> Practice Mode
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-5 sm:gap-6 w-full sm:w-auto z-20"
          >
            <Link href="/exams/mock-tests" className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-teal-500/30 transition-all hover:-translate-y-1 hover:shadow-teal-500/40 text-center relative overflow-hidden group border border-teal-400/50 block">
              <span className="relative z-10 w-full flex justify-center">Start Mock Test</span>
              <div className="absolute inset-0 h-full w-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"></div>
            </Link>
            <Link href="/exams" className="bg-white hover:bg-teal-50 text-teal-700 border border-gray-200 hover:border-teal-200 px-10 py-4 rounded-full font-bold text-lg shadow-lg shadow-gray-200/50 transition-all hover:-translate-y-1 text-center group block">
              Explore Practice <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        </section>


        {/* --- 2. STATS SECTION (Gradient Cards) --- */}
        <section className="w-full max-w-5xl mb-32 z-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              animate={floatingAnimation}
              className="bg-gradient-to-br from-teal-500 to-emerald-600 p-8 rounded-3xl shadow-2xl shadow-teal-900/20 border border-teal-400 text-center transform -rotate-3 hover:rotate-0 transition-transform duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
              <h3 className="text-5xl font-black text-white mb-2 relative z-10 drop-shadow-sm">10K+</h3>
              <p className="text-sm font-bold text-teal-100 uppercase tracking-widest relative z-10">Active Students</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              animate={floatingAnimationDelayed}
              className="bg-gradient-to-br from-blue-500 to-cyan-600 p-8 rounded-3xl shadow-2xl shadow-blue-900/20 border border-blue-400 text-center transform md:-translate-y-8 rotate-3 hover:rotate-0 transition-transform duration-300 relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-10 -translate-x-10"></div>
              <h3 className="text-5xl font-black text-white mb-2 relative z-10 drop-shadow-sm">5K+</h3>
              <p className="text-sm font-bold text-blue-100 uppercase tracking-widest relative z-10">Questions Bank</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              animate={floatingAnimation}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-3xl shadow-2xl shadow-indigo-900/20 border border-indigo-400 text-center transform -rotate-2 hover:rotate-0 transition-transform duration-300 relative overflow-hidden"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <h3 className="text-5xl font-black text-white mb-2 relative z-10 drop-shadow-sm">500+</h3>
              <p className="text-sm font-bold text-indigo-100 uppercase tracking-widest relative z-10">Mock Tests</p>
            </motion.div>
          </div>
        </section>


        {/* --- 3. FEATURES SECTION --- */}
        <section className="w-full max-w-6xl mb-32 z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Everything you need</h2>
            <p className="text-lg md:text-xl text-teal-700 font-bold bg-teal-50 display-inline px-6 py-2 rounded-full w-max mx-auto border border-teal-100 shadow-sm">Tools designed to boost your rank and confidence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FaRegClock />, title: "Timed Mock Tests", desc: "Simulate real exam environment with accurate timers and interfaces.", color: "text-blue-600", bg: "bg-gradient-to-br from-blue-50 to-blue-100", border: "border-blue-200", delay: 0 },
              { icon: <FaBookOpen />, title: "Previous Papers", desc: "Practice with actual past exams to understand the pattern.", color: "text-purple-600", bg: "bg-gradient-to-br from-purple-50 to-purple-100", border: "border-purple-200", delay: 0.1 },
              { icon: <FaQuestionCircle />, title: "Topic Practice", desc: "Master individual concepts with subject-wise drills.", color: "text-emerald-600", bg: "bg-gradient-to-br from-emerald-50 to-emerald-100", border: "border-emerald-200", delay: 0.2 },
              { icon: <FaChartLine />, title: "In-depth Analytics", desc: "Track weak areas, speed, and accuracy to improve faster.", color: "text-orange-600", bg: "bg-gradient-to-br from-orange-50 to-orange-100", border: "border-orange-200", delay: 0.3 }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: feature.delay }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-white flex flex-col items-center text-center group cursor-default transition-all relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className={`w-16 h-16 ${feature.bg} ${feature.color} ${feature.border} border rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>


        {/* --- 4. EXPLORE SUBJECTS (Clean UI/UX) --- */}
        <section className="w-full max-w-5xl mb-32 z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Explore Subjects</h2>
            <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto">Master concepts chapter by chapter with comprehensive practice materials.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                name: "Mathematics",
                desc: "50+ Topics",
                icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
                color: "text-blue-600",
                bg: "bg-blue-50",
                ring: "group-hover:ring-blue-100"
              },
              {
                name: "Reasoning",
                desc: "Logical Puzzles",
                icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                color: "text-purple-600",
                bg: "bg-purple-50",
                ring: "group-hover:ring-purple-100"
              },
              {
                name: "English",
                desc: "Grammar & Vocab",
                icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>,
                color: "text-rose-600",
                bg: "bg-rose-50",
                ring: "group-hover:ring-rose-100"
              },
              {
                name: "General Knowledge",
                desc: "Current Affairs",
                icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                ring: "group-hover:ring-emerald-100"
              }
            ].map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 border border-gray-100 flex flex-col items-center justify-center aspect-square cursor-pointer group transition-all relative"
                onClick={() => window.location.href = '/exams'}
              >
                <div className={`w-20 h-20 rounded-full ${cat.bg} ${cat.color} flex items-center justify-center mb-6 ring-8 ring-transparent ${cat.ring} transition-all duration-300 group-hover:scale-110`}>
                  {cat.icon}
                </div>

                <h4 className="font-extrabold text-gray-900 text-center text-xl mb-1">{cat.name}</h4>
                <p className="text-gray-500 text-sm font-medium text-center mb-6">{cat.desc}</p>

                <div className="mt-auto flex items-center gap-2 text-sm font-bold text-gray-400 group-hover:text-gray-900 transition-colors">
                  <span>Practice</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>


        {/* --- 5. TESTIMONIALS (Masonry Floating Grid) --- */}
        <section className="w-full mb-32 z-10 py-10 relative">

          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-indigo-200/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Student Success Stories</h2>
            <p className="text-lg md:text-xl text-indigo-700 font-bold bg-indigo-50 display-inline px-6 py-2 rounded-full w-max mx-auto border border-indigo-100 shadow-sm">Real results from our top achievers.</p>
          </div>

          <div className="max-w-7xl mx-auto px-4 columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[
              { text: "The mock tests perfectly matched the real exam pattern. The analytics helped me track my speed and improve drastically!", author: "Priya S.", exam: "SSC CGL", score: "AIR 45", delay: 0 },
              { text: "The Antigravity UI makes studying feel less like a chore. The chapter-wise practice is top-notch and beautifully designed.", author: "Rahul M.", exam: "Bank PO", score: "Cleared", delay: 0.2 },
              { text: "PYQs section with detailed solutions was exactly what I needed to clear my cutoffs. Simply the best platform.", author: "Anjali T.", exam: "Railway NTPC", score: "Selected", delay: 0.1 },
              { text: "I struggled with time management, but the UI and realistic timers fixed that. The app is incredibly fast.", author: "Vikram K.", exam: "UPSC Prelims", score: "Qualified", delay: 0.3 },
              { text: "The most beautiful test prep app I have ever used. It actually makes me want to log in and practice every day!", author: "Neha R.", exam: "NEET", score: "680/720", delay: 0.2 },
              { text: "Detailed performance analytics showed me my weak spots in Reasoning. I focused there and improved my score.", author: "Amit P.", exam: "State PCS", score: "Rank 12", delay: 0.4 },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: testimonial.delay }}
                whileHover={{ y: -8, rotate: i % 2 === 0 ? 1 : -1, scale: 1.02 }}
                className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-teal-900/5 border border-white/60 relative overflow-hidden group break-inside-avoid block"
              >
                {/* Ambient Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-200/20 rounded-full blur-2xl -translate-y-10 translate-x-10 group-hover:bg-teal-300/30 transition-colors"></div>

                <div className="text-7xl text-teal-100 absolute -top-2 right-6 font-serif leading-none select-none opacity-50 group-hover:opacity-100 transition-opacity">"</div>

                <p className="text-gray-700 font-medium italic mb-8 relative z-10 leading-relaxed text-lg">"{testimonial.text}"</p>

                <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-auto">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-inner border border-teal-200 ring-4 ring-teal-50 group-hover:ring-teal-100 transition-all">
                      {testimonial.author[0]}
                    </div>
                    <div>
                      <h5 className="font-extrabold text-gray-900 tracking-tight">{testimonial.author}</h5>
                      <p className="text-xs text-teal-600 font-bold uppercase tracking-wider">{testimonial.exam}</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 text-teal-800 font-black text-sm px-4 py-2 rounded-xl border border-teal-100 shadow-sm shadow-teal-100/50 group-hover:shadow-md transition-shadow">
                    {testimonial.score}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      {/* --- 6. FOOTER --- */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8 relative z-10 flex-shrink-0">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 text-center md:text-left">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center justify-center md:justify-start gap-2">
                <FaGraduationCap className="text-teal-600" /> ExamPrep
              </h2>
              <p className="text-gray-500 font-medium max-w-sm mx-auto md:mx-0 leading-relaxed">
                Elevating your preparation with smart analytics, realistic mock tests, and a flawless learning experience. Join the revolution.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Platform</h4>
              <ul className="space-y-4 text-gray-500 font-medium text-sm">
                <li><Link href="/exams/mock-tests" className="hover:text-teal-600 transition-colors">Mock Tests</Link></li>
                <li><Link href="/previous-year-papers" className="hover:text-teal-600 transition-colors">Previous Papers</Link></li>
                <li><Link href="/exams" className="hover:text-teal-600 transition-colors">Practice Chapters</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Support</h4>
              <ul className="space-y-4 text-gray-500 font-medium text-sm">
                <li><Link href="#" className="hover:text-teal-600 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-teal-600 transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-teal-600 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-sm font-medium">© {new Date().getFullYear()} ExamPrep. All rights reserved.</p>
            <div className="flex gap-6 text-sm font-bold bg-gray-50 px-6 py-2 rounded-full border border-gray-100">
              <Link href="/login" className="text-gray-600 hover:text-teal-600 transition-colors">Login</Link>
              <div className="w-[1px] h-4 bg-gray-300 self-center"></div>
              <Link href="/register" className="text-teal-600 hover:text-teal-700 transition-colors">Register</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Global styles addition inline for shimmer and gradient text */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes gradient-x {
          0%, 100% {
              background-position: 0% 50%;
          }
          50% {
              background-position: 100% 50%;
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1; 
        }
      `}} />
    </div>
  );
}
