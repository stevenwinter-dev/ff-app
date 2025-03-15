import { sendVerificationEmail } from '../../../../lib/email';
import prisma from '../../../../../prisma';

export async function POST(request) {
  const { email } = await request.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    if (user.emailVerified) {
      return new Response(JSON.stringify({ error: 'Email already verified' }), { status: 400 });
    }

    await sendVerificationEmail(user.email, user.verificationToken);

    return new Response(JSON.stringify({ message: 'Verification email sent successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error resending verification email:', error);
    return new Response(JSON.stringify({ error: 'Failed to resend verification email' }), { status: 500 });
  }
}