import { createServerFn } from "@tanstack/react-start";
import { auth } from "@/lib/auth";

export const serverSignOut = createServerFn({ method: "POST" }).handler(async (ctx) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const request = (ctx as any).request;
  await auth.api.signOut({ headers: request?.headers ?? new Headers() });
  return { success: true };
});
