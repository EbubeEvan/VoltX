import { createServerFn } from "@tanstack/react-start";

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string }) => input)
  .handler(async (ctx) => {
    const { data } = ctx;
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, email: data.email };
  });
