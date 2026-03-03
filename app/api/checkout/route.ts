import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/api/stripe";

export async function POST(req: NextRequest) {
  try {
    const { priceId, customerId } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await createCheckoutSession({
      priceId,
      customerId,
      successUrl: `${origin}/dashboard?checkout=success`,
      cancelUrl: `${origin}/pricing?checkout=canceled`,
      trialDays: 14,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
