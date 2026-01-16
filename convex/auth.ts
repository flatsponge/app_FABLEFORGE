import { convexAuth } from "@convex-dev/auth/server";
import { Email } from "@convex-dev/auth/providers/Email";
import { alphabet, generateRandomString } from "oslo/crypto";
import { MutationCtx } from "./_generated/server";

// Email OTP provider
export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Email({
      id: "resend-otp",
      maxAge: 10 * 60, // 10 minutes
      // Generate an 8-digit numeric code
      generateVerificationToken() {
        return generateRandomString(8, alphabet("0-9"));
      },
      async sendVerificationRequest({ identifier: email, token }) {
        // Dynamic import of Resend to avoid "use node" requirement at module level
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.AUTH_RESEND_KEY);

        await resend.emails.send({
          from: "Fabletales <fabletales@aserious.app>",
          to: email,
          subject: "Your Fabletales verification code",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
              <h1 style="color: #7c3aed; margin-bottom: 24px;">Fabletales</h1>
              <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
                Here's your verification code:
              </p>
              <div style="background-color: #f3e8ff; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #7c3aed;">
                  ${token}
                </span>
              </div>
              <p style="font-size: 14px; color: #666; margin-bottom: 8px;">
                This code expires in 10 minutes.
              </p>
              <p style="font-size: 14px; color: #666;">
                If you didn't request this code, you can safely ignore this email.
              </p>
            </div>
          `,
        });
      },
    }),
  ],
  callbacks: {
    /**
     * Custom user creation/update callback.
     * Ensures the email field is stored on the users table for lookup via email index.
     */
    async createOrUpdateUser(ctx: MutationCtx, args) {
      // For Email provider, email is in profile.email
      const email = args.profile.email as string | undefined;

      console.log("[Auth] createOrUpdateUser called:", {
        existingUserId: args.existingUserId,
        email,
        providerId: args.provider?.id,
      });

      // If user already exists, update their email
      if (args.existingUserId) {
        if (email) {
          console.log("[Auth] Updating existing user with email:", email);
          await ctx.db.patch(args.existingUserId, { email });
        }
        return args.existingUserId;
      }

      // Check if a user with this email already exists (account linking)
      if (email) {
        const existingUser = await ctx.db
          .query("users")
          .withIndex("email", (q) => q.eq("email", email))
          .first();
        if (existingUser) {
          console.log("[Auth] Found existing user by email:", existingUser._id);
          return existingUser._id;
        }
      }

      // Create new user with email
      console.log("[Auth] Creating new user with email:", email);
      return ctx.db.insert("users", { email });
    },
  },
});
