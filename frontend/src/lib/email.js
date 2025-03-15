import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email, token) {
  try {
    console.log('Sending verification email to:', email);

    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Click <a href="${process.env.NEXTAUTH_URL}/verify-email?token=${token}">here</a> to verify your email.</p>`,
    });

    if (data.error) {
      console.error('Resend API Error:', data.error);
      throw new Error('Failed to send verification email');
    }

    console.log('Verification email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
}