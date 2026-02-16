import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  if (session.user.role === 'SUPER_ADMIN') {
    redirect('/hotels');
  }

  redirect('/dashboard');
}
