// Per-student shuffling of CBT questions and their options.
//
// Each attempt stores a stable permutation so two students sitting side by side see
// the same questions in a different order, with the options under each question in a
// different order too — yet answers are always translated back to the exam's CANONICAL
// order before they are stored. That keeps grading (submit) and the teacher's review
// screen, which both read the canonical order, completely unchanged.
//
//   questionOrder[displayPos]            = canonical question index shown at that position
//   optionOrders[canonicalQuestionIndex] = [displayOptPos -> canonical option index]
//
// optionOrders is indexed by the CANONICAL question index (not the display position) so
// it can be applied directly when translating an answer back to canonical form.

export interface AttemptShuffle {
  questionOrder: number[];
  optionOrders: number[][];
}

interface ExamQuestionLike {
  text: string;
  options: string[];
}

// Fisher–Yates shuffle on a fresh copy.
function shuffled<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// A randomised permutation for one attempt: question order + per-question option order.
export function buildAttemptShuffle(questions: ExamQuestionLike[]): AttemptShuffle {
  const n = questions.length;
  const questionOrder = shuffled(Array.from({ length: n }, (_, i) => i));
  const optionOrders = questions.map((q) =>
    shuffled(Array.from({ length: q.options?.length ?? 0 }, (_, i) => i)),
  );
  return { questionOrder, optionOrders };
}

// Identity permutation — used for attempts that predate shuffling so they are never
// reshuffled mid-exam (which would scramble answers already saved in canonical order).
export function identityShuffle(questions: ExamQuestionLike[]): AttemptShuffle {
  return {
    questionOrder: questions.map((_, i) => i),
    optionOrders: questions.map((q) => (q.options ?? []).map((_, i) => i)),
  };
}

// Is a stored shuffle usable for this exam's current question set?
export function isValidShuffle(shuffle: Partial<AttemptShuffle> | undefined, questions: ExamQuestionLike[]): shuffle is AttemptShuffle {
  if (!shuffle || !Array.isArray(shuffle.questionOrder) || !Array.isArray(shuffle.optionOrders)) return false;
  if (shuffle.questionOrder.length !== questions.length) return false;
  if (shuffle.optionOrders.length !== questions.length) return false;
  for (let q = 0; q < questions.length; q++) {
    if ((shuffle.optionOrders[q]?.length ?? -1) !== (questions[q].options?.length ?? 0)) return false;
  }
  return true;
}

// Canonical exam questions -> display order for the student (options reordered, no answers).
export function toDisplayQuestions(
  questions: ExamQuestionLike[],
  shuffle: AttemptShuffle,
): { text: string; options: string[] }[] {
  return shuffle.questionOrder.map((canonicalQ) => {
    const q = questions[canonicalQ];
    const optOrder = shuffle.optionOrders[canonicalQ] ?? [];
    return {
      text: q.text,
      options: optOrder.map((canonicalOpt) => q.options[canonicalOpt]),
    };
  });
}

// Canonical answers (index = canonical question, value = canonical option | null) ->
// display order (index = display position, value = display option position | null).
export function canonicalAnswersToDisplay(
  canonicalAnswers: (number | null)[],
  shuffle: AttemptShuffle,
): (number | null)[] {
  return shuffle.questionOrder.map((canonicalQ) => {
    const canonicalOpt = canonicalAnswers[canonicalQ];
    if (canonicalOpt == null) return null;
    const displayPos = (shuffle.optionOrders[canonicalQ] ?? []).indexOf(canonicalOpt);
    return displayPos >= 0 ? displayPos : null;
  });
}

// One answer the student gave in DISPLAY terms -> its CANONICAL (question, option) pair.
// Returns null when the indices fall outside the shuffle (e.g. a stale client payload).
export function displayAnswerToCanonical(
  displayQIndex: number,
  displayOptIndex: number | null,
  shuffle: AttemptShuffle,
): { questionIndex: number; optionIndex: number } | null {
  if (displayQIndex < 0 || displayQIndex >= shuffle.questionOrder.length) return null;
  const canonicalQ = shuffle.questionOrder[displayQIndex];
  if (displayOptIndex == null) return null;
  const optOrder = shuffle.optionOrders[canonicalQ] ?? [];
  if (displayOptIndex < 0 || displayOptIndex >= optOrder.length) return null;
  return { questionIndex: canonicalQ, optionIndex: optOrder[displayOptIndex] };
}
