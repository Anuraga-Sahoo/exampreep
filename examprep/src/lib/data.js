export const MOCK_TESTS = [
    {
        id: "neet-mock-1",
        title: "NEET Full Mock Test 1",
        category: "NEET",
        questionsCount: 200,
        durationMinutes: 200,
        difficulty: "Hard",
    },
    {
        id: "ssc-cgl-mock-1",
        title: "SSC CGL Tier 1 Mock",
        category: "Government",
        questionsCount: 100,
        durationMinutes: 60,
        difficulty: "Medium",
        premium: true, // Mark as premium
    },
];

export const MOCK_QUESTIONS = [
    {
        id: 1,
        testId: "neet-mock-1",
        question: "Which of the following consists of prokaryotic cells?",
        options: ["Green algae", "Blue-green algae", "Brown algae", "Red algae"],
        correctAnswer: 1,
        explanation: "Blue-green algae (Cyanobacteria) are prokaryotes.",
    },
    {
        id: 2,
        testId: "neet-mock-1",
        question: "The power house of the cell is:",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Body"],
        correctAnswer: 1,
        explanation: "Mitochondria are known as the power house of the cell because they produce ATP.",
    },
];
