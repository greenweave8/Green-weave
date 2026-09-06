import "server-only";
import { Resend } from "resend";
import type { Order } from "@/lib/types";
import { formatINR } from "@/lib/format";

const API_KEY = process.env.RESEND_API_KEY || "";
const SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL || "";
const ORDER_VERIFY_EMAIL = process.env.ORDER_VERIFY_EMAIL || "";

export const mailConfigured = Boolean(API_KEY);

function requireMail() {
  if (!mailConfigured) {
    throw new Error(
      "Email is not configured. Add RESEND_API_KEY to .env.local."
    );
  }
}

function lineItemsText(order: Order): string {
  const lines = order.items.map(
    (item) =>
      `  ${item.name} — size ${item.size} × ${item.qty} — ${formatINR(
        item.price * item.qty
      )}`
  );
  return lines.length ? lines.join("\n") : "  (no items)";
}

function lineItemsHtml(order: Order): string {
  return order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 10px;border-bottom:1px solid #eef4f1">
            <strong>${item.name}</strong>
            <div style="color:#888;font-size:12px">Size ${item.size} · Qty ${item.qty}</div>
          </td>
          <td style="padding:8px 10px;border-bottom:1px solid #eef4f1;text-align:right;white-space:nowrap">${formatINR(
            item.price * item.qty
          )}</td>
        </tr>`
    )
    .join("");
}

export async function sendOrderVerificationMail(opts: {
  to: string;
  order: Order;
  verifyUrl: string;
}): Promise<void> {
  requireMail();
  const { to, order, verifyUrl } = opts;
  if (!to) {
    throw new Error("No receiver email configured (ORDER_VERIFY_EMAIL).");
  }

  const { customer } = order;
  const totalQty = order.items.reduce((sum, item) => sum + item.qty, 0);

  const text = [
    `Hi,`,
    ``,
    `A new order needs verification:`,
    ``,
    `Order ID: ${order.id}`,
    `Placed: ${new Date(order.createdAt).toLocaleString("en-IN")}`,
    ``,
    `Items (${totalQty}):`,
    lineItemsText(order),
    ``,
    `Customer: ${customer.name}`,
    `Email: ${customer.email}`,
    `Phone: ${customer.phone}`,
    `Shipping:`,
    `  ${customer.address}`,
    `  ${customer.city}, ${customer.state} - ${customer.pincode}`,
    ``,
    `Subtotal: ${formatINR(order.subtotal)}`,
    `Shipping: ${order.shipping === 0 ? "Free" : formatINR(order.shipping)}`,
    `Total: Rs. ${order.total}`,
    ``,
    `Click the link below to mark this order as verified and valid:`,
    ``,
    verifyUrl,
    ``,
    `If you didn't expect this order, you can safely ignore this email.`,
    ``,
    `— Greenweave`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#16303f">
      <h2 style="color:#0e8a5b;margin:0 0 4px">Order verification required</h2>
      <p style="margin:0 0 20px;color:#666">A new order is waiting to be verified. Confirm it to mark it as valid and start shipping it.</p>

      <table style="border-collapse:collapse;width:100%;background:#fafaf6;border:1px solid #eef4f1;border-radius:12px">
        <tr>
          <td style="padding:10px 14px"><strong>Order ID</strong><br/><span style="color:#666;font-size:13px">${order.id}</span></td>
          <td style="padding:10px 14px;text-align:right"><strong>Total</strong><br/><span style="color:#0e8a5b;font-weight:700;font-size:15px">${formatINR(
            order.total
          )}</span></td>
        </tr>
      </table>

      <h3 style="font-size:14px;letter-spacing:0.5px;text-transform:uppercase;color:#888;margin:22px 0 8px">Items · ${totalQty}</h3>
      <table style="border-collapse:collapse;width:100%">
        ${lineItemsHtml(order)}
      </table>

      <h3 style="font-size:14px;letter-spacing:0.5px;text-transform:uppercase;color:#888;margin:22px 0 8px">Customer</h3>
      <table style="border-collapse:collapse;width:100%;background:#fafaf6;border:1px solid #eef4f1">
        <tr><td style="padding:8px 14px;color:#666">Name</td><td style="padding:8px 14px;font-weight:700">${customer.name}</td></tr>
        <tr><td style="padding:8px 14px;color:#666">Email</td><td style="padding:8px 14px">${customer.email}</td></tr>
        <tr><td style="padding:8px 14px;color:#666">Phone</td><td style="padding:8px 14px">${customer.phone}</td></tr>
        <tr>
          <td style="padding:8px 14px;color:#666">Shipping address</td>
          <td style="padding:8px 14px">${customer.address}<br/>${customer.city}, ${customer.state} - ${customer.pincode}</td>
        </tr>
      </table>

      <table style="border-collapse:collapse;width:100%;margin:16px 0">
        <tr><td style="padding:4px 14px;color:#666">Subtotal</td><td style="padding:4px 14px;text-align:right">${formatINR(
          order.subtotal
        )}</td></tr>
        <tr><td style="padding:4px 14px;color:#666">Shipping</td><td style="padding:4px 14px;text-align:right">${
          order.shipping === 0 ? "Free" : formatINR(order.shipping)
        }</td></tr>
        <tr><td style="padding:4px 14px;font-weight:700;border-top:2px solid #0e8a5b">Total</td><td style="padding:4px 14px;text-align:right;font-weight:700;color:#0e8a5b;border-top:2px solid #0e8a5b">${formatINR(
          order.total
        )}</td></tr>
      </table>

      <p>
        <a href="${verifyUrl}"
           style="display:inline-block;background:#0e8a5b;color:#fff;text-decoration:none;
                  padding:12px 22px;border-radius:999px;font-weight:700">
          Verify order
        </a>
      </p>
      <p style="color:#888;font-size:12px">If you didn't expect this order, you can safely ignore this email.</p>
    </div>
  `;

  const resend = new Resend(API_KEY);
  const sendOpts = {
    from: SENDER_EMAIL || "Greenweave <onboarding@resend.dev>",
    to,
    subject: `Verify order ${order.id} · Greenweave`,
    text,
    html,
  };

  const { error } = await resend.emails.send(
    SENDER_EMAIL ? { ...sendOpts, replyTo: SENDER_EMAIL } : sendOpts
  );
  if (error) {
    throw new Error(error.message ?? "Resend failed to send the mail.");
  }
}

export { ORDER_VERIFY_EMAIL };