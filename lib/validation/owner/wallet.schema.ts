import * as z from "zod";

export const walletTopUpSchema = z.object({
  amount: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? undefined : parsed;
      }
      return val;
    },
    z.number({ message: "Please enter a valid amount" })
      .min(100, { message: "Minimum top-up amount is ₹100" })
      .max(50000, { message: "Maximum top-up amount is ₹50,000" })
  )
});

export type WalletTopUpValues = z.infer<typeof walletTopUpSchema>;
