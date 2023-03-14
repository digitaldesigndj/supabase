import type { Handlers } from "$fresh/server.ts";
import { stripe } from "@/utils/stripe.ts";
import { DashboardState } from "./_middleware.ts";
import { STRIPE_PREMIUM_PLAN_PRICE_ID } from "@/constants.ts";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, DashboardState> = {
  async GET(request, ctx) {
    const { url } = await stripe.checkout.sessions.create({
      success_url: new URL(request.url).origin + "/todos",
      customer: ctx.state.session.user.user_metadata.stripe_customer_id,
      line_items: [
        {
          price: STRIPE_PREMIUM_PLAN_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
    });

    return new Response(null, {
      headers: {
        location: url!,
      },
      status: 302,
    });
  },
};