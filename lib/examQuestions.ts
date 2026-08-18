export const DEMO_OBJECTIVE_COUNTS = [3, 5, 10];
export const REAL_OBJECTIVE_COUNTS = [30, 60, 100];
export const ALL_OBJECTIVE_COUNTS = [...DEMO_OBJECTIVE_COUNTS, ...REAL_OBJECTIVE_COUNTS];

export function validateQuestions(questions: any): { questions: any[]; error?: string } {
  if (!questions) return { questions: [] };
  if (!Array.isArray(questions)) return { questions: [], error: 'questions must be an array' };

  const cleaned = [];
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!q?.text || typeof q.text !== 'string' || !q.text.trim()) {
      return { questions: [], error: `Question ${i + 1} is missing text` };
    }
    if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6) {
      return { questions: [], error: `Question ${i + 1} must have 2–6 options` };
    }
    const correctIndex = Number(q.correctIndex);
    if (isNaN(correctIndex) || correctIndex < 0 || correctIndex >= q.options.length) {
      return { questions: [], error: `Question ${i + 1} has an invalid correct answer` };
    }
    cleaned.push({
      text: String(q.text).trim(),
      options: q.options.map((o: any) => String(o).trim()),
      correctIndex,
    });
  }
  return { questions: cleaned };
}
