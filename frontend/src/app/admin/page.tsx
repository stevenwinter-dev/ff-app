// app/admin/page.tsx
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import AdminPanel from '../../components/admin/AdminPanel';
import NotFound from '../../components/global/NotFound';
import { notFound } from 'next/navigation';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Check if the user is the admin
  if (session?.user?.email !== 'steveplayshorn@gmail.com') {
    notFound();
  }

  return <AdminPanel />;
}