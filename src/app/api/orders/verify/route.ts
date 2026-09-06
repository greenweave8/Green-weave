import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getOrderById, updateOrder } from "@/lib/db";
import { formatINR } from "@/lib/format";

export const dynamic = "force-dynamic";

const HTML = (title: string, body: string) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      body { font-family: Georgia, serif; background: #fbfaf5; color: #16303f;
             display: grid; place-items: center; min-height: 100vh; margin: 0; }
      .card { background: #fff; border: 1px solid #dff4e7; border-radius: 20px;
              padding: 40px 48px; max-width: 420px; width: 90%; text-align: center;
              box-shadow: 0 10px 30px rgba(7,31,23,0.08); }
      .badge { width: 56px; height: 56px; border-radius: 999px; margin: 0 auto 16px;
               display: grid; place-items: center; font-size: 28px; }
      h1 { font-size: 24px; margin: 0 0 8px; }
      p { color: #6b7280; line-height: 1.6; }
      .muted { font-size: 12px; color: #b0b7bd; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="card">${body}</div>
  </body>
</html>`;

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("order") || "";
  const token = request.nextUrl.searchParams.get("token") || "";

  if (!orderId || !token) {
    return new NextResponse(
      HTML("Invalid link", `<div class="badge">❌</div>
        <h1>Invalid link</h1><p>This verification link is incomplete or malformed.</p>
        <p class="muted">Greenweave</p>`),
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  const order = await getOrderById(orderId);
  if (!order || order.verificationToken !== token || !order.verificationToken) {
    return new NextResponse(
      HTML("Verification failed", `<div class="badge">⚠️</div>
        <h1>Verification failed</h1>
        <p>The link is invalid, already used, or the order no longer exists.</p>
        <p class="muted">Greenweave</p>`),
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  await updateOrder(orderId, {
    verificationVerified: true,
    verificationToken: "",
    paymentStatus: "paid",
    orderStatus: "confirmed",
  });

  return new NextResponse(
    HTML(
      "Order verified",
      `<div class="badge">✅</div>
       <h1>Order verified</h1>
       <p>Order <strong>${orderId}</strong> for
          <strong>${formatINR(order.total)}</strong> is now confirmed and valid.</p>
       <p class="muted">Greenweave</p>`
    ),
    { headers: { "Content-Type": "text/html" } }
  );
}
