import { redirect } from 'next/navigation';

// The teacher results hub is now the dashboard itself
export default function ResultsHub() {
  redirect('/portals/dashboard/teacher');
}
