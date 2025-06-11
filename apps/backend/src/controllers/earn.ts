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

earnRouter.post("/withdraw", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const userId = c.get("userId");

    if (!userId) {
        console.warn("No userId found in context");
        return c.text("Unauthorized", 401);
    }
    
  const body = await c.req.json();
  const amount = body.amount;
  const upi = body.upi;


  if (!amount || amount <= 0 || !upi) {
    console.log("Withdraw Validation Failed:", { amount, upi });
    return c.text("Invalid input", 400);
  }


    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            username: true,
            hasPaid: true,
            points: true,
            verifiedStories: true,
        },
    });

    if (!user) {
        console.warn("User not found in DB:", userId);
        return c.text("User not found", 404);
    }

    // if (!user.hasPaid || user.verifiedStories.length < 5) {
    //   console.warn("Eligibility check failed", {
    //     hasPaid: user.hasPaid,
    //     verifiedStoriesCount: user.verifiedStories.length,
    // });
    //     return c.text("You must post at least 5 valid stories after payment to withdraw.", 400);
    // }


  const requiredPoints = Math.ceil((amount * 100) / 10); // 1 point = ₹0.1

  if (user.points < requiredPoints) {
    return c.text(`Insufficient balance. You need at least ${requiredPoints} points to withdraw ₹${amount}`, 400);
  }

  // Call payout API
  try {
    const payoutRes = await axios.post(
        // "https://sandbox.cashfree.com/payouts/v1/requestTransfer",
        "https://payout-api.cashfree.com/payouts/v1/requestTransfer",
        {
            beneId: userId,  // Or a mapped beneficiary ID
            amount,
            transferId: `TR_${Date.now()}`,
            transferMode: "upi",
            remarks: "reward withdrawal"
        },
        {
            headers: {
            "Content-Type": "application/json",
            "X-Client-Id": c.env.CASHFREE_APP_ID,
            "X-Client-Secret": c.env.CASHFREE_SECRET_KEY
            },
        }
    );

    // Deduct points
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          decrement: requiredPoints,
        },
      },
    });

    // Log withdrawal
    await prisma.withdrawal.create({
      data: {
        userId,
        amount,
        upi,
        status: "SUCCESS",
        initiatedAt: new Date(),
      },
    });

    return c.json({ success: true, payoutId: payoutRes.data.payout_id });
  } catch (err) {
        if (axios.isAxiosError(err)) {
            const msg = err.response?.data || err.message;
            console.error("Withdraw Axios Error:", msg);
        } else {
            console.error("Unknown Error:", err);
        }
    };


    await prisma.withdrawal.create({
      data: {
        userId,
        amount,
        upi,
        status: "FAILED",
        initiatedAt: new Date(),
      },
    });

    return c.text("Payout failed", 500);
  }
);


export default earnRouter;
