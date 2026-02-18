export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-sans">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to ExamPrep
        </h1>
        <p className="text-lg text-gray-600 max-w-xl">
          Your ultimate platform for NEET and Government Exam preparation.
          Practice with Mock Tests, PYQs, and Chapter-wise tests.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/dashboard"
          >
            Go to Dashboard
          </a>
          <a
            className="rounded-full border border-solid border-gray-200 transition-colors flex items-center justify-center hover:bg-gray-50 hover:border-transparent text-gray-700 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/login"
          >
            Login / Signup
          </a>
        </div>
      </main>
    </div>
  );
}
