import { config } from "dotenv"
import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

if (process.env.NODE_ENV !== "production") config()

export const env = createEnv({
  server: {
    WEBAPP_URL: z.string().url(),
    STRIPE_SECRET: z.string(),
    PORT: z.string(),
    STRIPE_WEBHOOK_SECRETS: z.string(),
    GOOGLE_APPLICATION_CREDENTIALS: z.string(),
  },
  runtimeEnv: process.env,
})
