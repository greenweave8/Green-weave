import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { getOrderById, updateOrder } from "@/lib/db";
import { sendOrderVerificationMail, mailConfigured } from "@/lib/mail";
import { formatINR } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/orders/[id]/verify-request">
) {
  if (!mailConfigured) {
    return NextResponse.json(
      {
        error:
          "Email is not configured yet. Add RESEND_API_KEY to .env.local before sending verification mail.",
      },
      { status: 503 }
    );
  }

  const { id } = await ctx.params;
  const order = await getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.verificationVerified) {
    return NextResponse.json({
      ok: true,
      message: "This order is already verified.",
      verified: true,
    });
  }

  const token = randomBytes(24).toString("hex");
  const origin = request.headers.get("origin") || new URL(request.url).origin;
  const verifyUrl = `${origin}/api/orders/verify?order=${order.id}&token=${token}`;

  await updateOrder(id, {
    verificationToken: token,
    verificationSentAt: new Date().toISOString(),
  });

  try {
    await sendOrderVerificationMail({
      to: process.env.ORDER_VERIFY_EMAIL || "",
      order,
      verifyUrl,
    });
  } catch (err) {
    await updateOrder(id, { verificationToken: "", verificationSentAt: "" });
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to send verification mail. Please try again.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Verification mail sent to the store.",
    sentTo: process.env.ORDER_VERIFY_EMAIL || "",
    amount: formatINR(order.total),
  });
}
