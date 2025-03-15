// app/admin/page.tsx
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import AdminPanel from '../../components/admin/AdminPanel';
import NotFound from '../../components/global/NotFound';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Check if the user is the admin
  if (session?.user?.email !== 'steveplayshorn@gmail.com') {
    return <NotFound />; // Display a 404 page if the user is not the admin
  }

  return <AdminPanel />;
}