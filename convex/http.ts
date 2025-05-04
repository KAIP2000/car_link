import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";

const http = httpRouter();

// Define the action that Clerk webhook will call
// This endpoint verifies the webhook signature and then calls the internal mutation.
const handleClerkWebhook = httpAction(async (ctx, request) => {
  // Validate the incoming request
  const event = await validateRequest(request);
  if (!event) {
    console.error("Webhook validation failed");
    return new Response("Invalid webhook signature", { status: 400 });
  }

  // Handle the specific event type (user created or updated)
  switch (event.type) {
    case "user.created":
    case "user.updated":
      // Extract relevant user attributes from the webhook event data
      const userAttributes = event.data;
      const email = userAttributes.email_addresses?.find(e => e.id === userAttributes.primary_email_address_id)?.email_address;
      const name = `${userAttributes.first_name ?? ''} ${userAttributes.last_name ?? ''}`.trim();
      const pictureUrl = userAttributes.image_url;

      // Ensure we have the necessary data before calling the mutation
      if (!userAttributes.id || !email) {
        console.error("Missing required user data in webhook event:", event.type, userAttributes.id);
        // Return 200 to acknowledge receipt but log the error
        return new Response("Missing required user data", { status: 200 });
      }

      // Run the internal mutation to create or update the user in the database
      try {
        await ctx.runMutation(internal.users.createOrUpdateUser, {
          clerkId: userAttributes.id,
          email: email,
          name: name || undefined, // Pass undefined if name is empty
          pictureUrl: pictureUrl || undefined, // Pass undefined if pictureUrl is empty
        });
        console.log(`Successfully processed ${event.type} for user ${userAttributes.id}`);
      } catch (error) {
        console.error(`Error processing ${event.type} for user ${userAttributes.id}:`, error);
        // Optionally return a 500 error to signal failure to Clerk
        // return new Response("Internal Server Error during mutation", { status: 500 });
      }
      break;

    // case "user.deleted": // Example: Handle user deletion if needed
      // const deletedUserId = event.data.id;
      // if (deletedUserId) {
      //   // Add logic to find user by clerkId and potentially delete or mark as deleted
      //   console.log("User deleted event received:", deletedUserId);
      //   // await ctx.runMutation(internal.users.deleteUser, { clerkId: deletedUserId });
      // }
      // break;

    default:
      // Log unhandled event types for debugging
      console.log("Received unhandled Clerk webhook event:", event.type);
  }

  // Return a success response to Clerk to acknowledge receipt of the webhook
  return new Response(null, { status: 200 });
});

// Define the specific route for the Clerk webhook
// Make sure this path matches the URL you configure in Clerk
http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

// Helper function to validate the webhook request using Svix
async function validateRequest(req: Request): Promise<WebhookEvent | undefined> {
  // Get the Svix headers required for verification
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  // Check if all required Svix headers are present
  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("Missing required Svix headers for webhook validation");
    return undefined;
  }

  // Get the webhook signing secret from environment variables
  // IMPORTANT: Ensure CLERK_WEBHOOK_SECRET is set in your Convex dashboard environment variables
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    // Throw an error if the secret is not configured, as verification cannot proceed
    throw new Error("CLERK_WEBHOOK_SECRET environment variable is not set in Convex dashboard.");
  }

  // Create a new Svix instance with your secret
  const wh = new Webhook(secret);
  let event: WebhookEvent | null = null;

  try {
    // Verify the webhook signature and parse the event payload
    const payload = await req.text(); // Read the raw request body
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent; // Cast needed as Svix types might not perfectly match Clerk's

  } catch (err: any) {
    // Log any errors during verification
    console.error("Error verifying Clerk webhook signature:", err.message);
    return undefined; // Return undefined if verification fails
  }

  // Return the verified and parsed event object
  return event;
}

// Export the http router
export default http; 