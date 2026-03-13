export function calculateGrade(total: number): string {
  if (total >= 70) return "A1";
  if (total >= 65) return "B2";
  if (total >= 60) return "B3";
  if (total >= 55) return "C4";
  if (total >= 50) return "C5";
  if (total >= 45) return "C6";
  if (total >= 40) return "D7";
  if (total >= 35) return "E8";
  return "F9";
}