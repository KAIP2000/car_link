// convex/auth.config.ts
export default {
  providers: [
    {
      // The domain of your Clerk instance (e.g., https://xxxx.clerk.accounts.dev)
      // Ensure this is set in your Convex dashboard environment variables for production.
      domain: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL,
      // The application ID from Convex settings
      applicationID: "convex",
    },
  ]
}; 