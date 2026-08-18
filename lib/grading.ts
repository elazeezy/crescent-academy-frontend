// CBT objectives are scaled to a fixed 30-mark pool regardless of question count (30/60/100)
export const CBT_OBJECTIVE_MAX = 30;
export const CBT_THEORY_MAX_DEFAULT = 40;

export function scaleObjectiveScore(correctCount: number, objectiveCount: number): number {
  if (objectiveCount <= 0) return 0;
  const raw = (correctCount / objectiveCount) * CBT_OBJECTIVE_MAX;
  return Math.round(raw * 10) / 10; // one decimal place
}

export function calculateGrade(total: number): string {
  if (total >= 75) return "A1";
  if (total >= 70) return "B2";
  if (total >= 65) return "B3";
  if (total >= 60) return "C4";
  if (total >= 55) return "C5";
  if (total >= 50) return "C6";
  if (total >= 45) return "D7";
  if (total >= 40) return "E8";
  return "F9";
}