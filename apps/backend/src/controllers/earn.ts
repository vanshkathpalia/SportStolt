import { Hono } from 'hono'
import axios from 'axios'
// import { z } from 'zod'
import { authMiddleware } from '~/middleware/authMiddleware';
import { getPrisma } from '~/lib/prismaClient';

export const earnRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
      CASHFREE_APP_ID: string;
      CASHFREE_SECRET_KEY: string;
  } 
    Variables: {
      userId: number;
    }
}>();


earnRouter.use('/*', authMiddleware)

earnRouter.use("/*", authMiddleware);

earnRouter.post("/create-order", async (c) => {
  try {
    const prisma = getPrisma(c.env.DATABASE_URL);

    const userId = c.get("userId");
    if (!userId) {
      console.warn("Unauthorized access: No userId found in context");
      return c.text("Unauthorized", 401);
    }

    const body = await c.req.json();
    const amount = body.amount;

    // console.log("Received create-order request from userId:", userId, "with amount:", amount);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    if (!user) {
      console.warn("User not found in DB for id:", userId);
      return c.text("User not found", 404);
    }

    // const data = {
    //   customer_details: {
    //     customer_id: String(user.id),
    //     customer_email: user.email,
    //     customer_phone: '9992852109', // dummy for now
    //   },
    //   order_amount: amount,
    //   order_currency: "INR",
    //   order_id: `ORDER_${Date.now()}`,
    // };

    const data = {
        customer_details: {
            customer_id: String(user.id),
            customer_email: user.email,
            customer_phone: '9992852109',
        },
        order_amount: amount,
        order_currency: "INR",
        order_id: `ORDER_${Date.now()}`,
        order_meta: {
            // return_url: "http://localhost:5173/payment-success?userId=" + user.id,
            return_url: "https://sport-stolt.vercel.app/payment-success?userId=" + user.id,

            // return_url: "https://spp-sandy.vercel.app/payment-success?userId=" + user.id,
        },
        // return_url: "https://xxxx.ngrok.io/payment-success?userId=" + user.id,
    };


    // console.log("Sending data to Cashfree:", data);

    const response = await axios.post(
      "https://api.cashfree.com/pg/orders",
    //   "https://sandbox.cashfree.com/pg/orders",

      data,
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": c.env.CASHFREE_APP_ID,
          "x-client-secret": c.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01",
        },
      }
    );

    // console.log("Cashfree Response:", response.data);

    return c.json({
        paymentSessionId: response.data.payment_session_id ?? null, 
    });

  } catch (err: any) {
    console.error("Error in create-order:", err.response?.data || err.message || err);
    return c.text("Something went wrong", 500);
  }
});

earnRouter.post("/confirm-payment", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const { userId } = await c.req.json();

  if (!userId) return c.text("Missing userId", 400);

  await prisma.user.update({
    where: { id: userId },
    data: { hasPaid: true },
  });

  return c.text("User marked as paid");
});


export default earnRouter;
