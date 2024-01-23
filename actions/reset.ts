"use server";

import { getUserByEmail } from "@/data/user";
import { sendPasswordResetToken } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/schemas";
import { z } from "zod";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  if (!existingUser.emailVerified) {
    return { error: "Please verify your email first!" };
  }

  //TODO: send password reset link
  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetToken(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Password reset link sent to email!" };
};
