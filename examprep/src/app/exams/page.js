import Link from 'next/link';

export default function ExamsPage() {
    const categories = [
        { title: "NEET", description: "National Eligibility cum Entrance Test", link: "/exams/mock-tests?category=neet", color: "bg-blue-50 text-blue-700" },
        { title: "SSC / Banking", description: "Government Exams Practice", link: "/exams/mock-tests?category=gov", color: "bg-green-50 text-green-700" },
    ];

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-2">Exam Categories</h1>
            <p className="text-gray-600 mb-8">Select your exam goal to start practicing.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((cat) => (
                    <Link key={cat.title} href={cat.link} className="block group">
                        <div className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 transition-colors shadow-sm hover:shadow-md">
                            <div className={`w-12 h-12 ${cat.color} rounded-lg flex items-center justify-center mb-4 font-bold text-xl`}>
                                {cat.title[0]}
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{cat.title}</h3>
                            <p className="text-gray-500">{cat.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
