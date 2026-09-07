import { NextResponse } from "next/server";
import { sendContactMail, mailConfigured, ORDER_VERIFY_EMAIL } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!mailConfigured) {
    return NextResponse.json(
      {
        error:
          "Email is not configured yet. Add RESEND_API_KEY to .env.local.",
      },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (!message) {
    return NextResponse.json({ error: "Please write a message." }, { status: 400 });
  }

  try {
    await sendContactMail({
      to: ORDER_VERIFY_EMAIL,
      name,
      email,
      subject,
      message,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to send the message. Please try again.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, message: "Message sent." });
}