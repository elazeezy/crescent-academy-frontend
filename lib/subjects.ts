export const JSS_SUBJECTS = [
  'English Language',
  'General Mathematics',
  'Basic Science',
  'Basic Technology',
  'Agricultural Science / Home Economics',
  'Social Studies / Civic Education',
  'Physical & Health Education',
  'Yoruba Language',
  "Qur'an",
  'Islamic Religious Knowledge (IRK)',
  'Business Studies',
  'Creative Arts',
];

export const SSS_SUBJECTS = [
  'English Language',
  'Mathematics',
  'Biology',
  'Chemistry',
  'Physics',
  'Agricultural Science',
  'Economics',
  'Social Studies',
  'Yoruba Language',
  "Qur'an",
  'Islamic Religious Knowledge (IRK)',
  'Commerce',
];

export const AFFECTIVE_TRAITS = [
  { key: 'punctuality', label: 'Punctuality' },
  { key: 'mentalAlertness', label: 'Mental Alertness' },
  { key: 'behavior', label: 'Behavior' },
  { key: 'reliability', label: 'Reliability' },
  { key: 'attentiveness', label: 'Attentiveness' },
  { key: 'respect', label: 'Respect' },
  { key: 'neatness', label: 'Neatness' },
  { key: 'politeness', label: 'Politeness' },
  { key: 'honesty', label: 'Honesty' },
  { key: 'relationshipWithStaff', label: 'Relationship with Staff' },
  { key: 'relationshipWithStudents', label: 'Relationship with Students' },
  { key: 'attitudeToSchool', label: 'Attitude to School' },
  { key: 'selfControl', label: 'Self-Control' },
  { key: 'spiritOfTeamwork', label: 'Spirit of Teamwork' },
  { key: 'initiatives', label: 'Initiatives' },
  { key: 'organizationalAbility', label: 'Organizational Ability' },
];

export const PSYCHOMOTOR_SKILLS = [
  { key: 'handwriting', label: 'Handwriting' },
  { key: 'reading', label: 'Reading' },
  { key: 'verbalFluency', label: 'Verbal Fluency / Diction' },
  { key: 'musicalSkills', label: 'Musical Skills' },
  { key: 'creativeArts', label: 'Creative Arts' },
  { key: 'physicalEducation', label: 'Physical Education' },
  { key: 'generalReasoning', label: 'General Reasoning' },
];

export const CLASS_NAMES = [
  'J.S.S. 1',
  'J.S.S. 2',
  'J.S.S. 3',
  'S.S. 1',
  'S.S. 2',
  'S.S. 3',
];

export function getSubjectsForClass(className: string, teacherSubjects?: string[]): string[] {
  if (teacherSubjects && teacherSubjects.length > 0) return teacherSubjects;
  const upper = (className || '').toUpperCase();
  if (upper.includes('J.S.S') || upper.includes('JSS') || upper.includes('JS') || upper.includes('JUNIOR')) {
    return JSS_SUBJECTS;
  }
  return SSS_SUBJECTS;
}

export const GRADING_SCALE = [
  { range: '75 – 100', grade: 'A1', meaning: 'Excellent' },
  { range: '70 – 74', grade: 'B2', meaning: 'Very Good' },
  { range: '65 – 69', grade: 'B3', meaning: 'Good' },
  { range: '60 – 64', grade: 'C4', meaning: 'Credit' },
  { range: '55 – 59', grade: 'C5', meaning: 'Credit' },
  { range: '50 – 54', grade: 'C6', meaning: 'Credit' },
  { range: '45 – 49', grade: 'D7', meaning: 'Pass' },
  { range: '40 – 44', grade: 'E8', meaning: 'Pass' },
  { range: '0 – 39', grade: 'F9', meaning: 'Fail' },
];

export const TRAIT_KEY_LABELS: Record<string, string> = {
  5: 'Maintains an excellent degree of observation',
  4: 'Maintains high level of observation trait',
  3: 'Acceptable level of observation trait',
  2: 'Shows minimal level of observation trait',
  1: 'Has no regard for observation trait',
};

export function getGradeRemark(grade: string): string {
  const map: Record<string, string> = {
    A1: 'Excellent', B2: 'Very Good', B3: 'Good',
    C4: 'Credit', C5: 'Credit', C6: 'Credit',
    D7: 'Pass', E8: 'Pass', F9: 'Fail',
  };
  return map[grade] || '-';
}

export function getOverallPerformance(avg: number): string {
  if (avg >= 75) return 'Excellent';
  if (avg >= 65) return 'Very Good';
  if (avg >= 55) return 'Good';
  if (avg >= 45) return 'Average';
  return 'Below Average';
}
