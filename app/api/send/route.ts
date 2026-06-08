import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, html, text } = body;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY is not configured.' },
        { status: 500 }
      );
    }
    
    const resend = new Resend(apiKey);

    const data = await resend.emails.send({
      from: 'Agency <onboarding@resend.dev>',
      to,
      subject,
      html,
      text,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
