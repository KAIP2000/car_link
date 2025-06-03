"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function SupportPage() {
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitFeedback = useMutation(api.feedback.submitFeedback);
  const { isSignedIn, user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitted(false);

    if (!message.trim()) {
      setError("Please enter your feedback message.");
      return;
    }

    if (!isSignedIn) {
      setError("You must be logged in to submit feedback.");
      return;
    }

    try {
      await submitFeedback({ message });
      setIsSubmitted(true);
      setMessage(""); // Clear the textarea after submission
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Support & Feedback
        </h1>
        <p className="mt-3 text-xl text-gray-600 dark:text-gray-300 sm:mt-4">
          We value your input! Let us know how we can improve.
        </p>
      </div>

      {!isSignedIn ? (
        <div className="mt-12 rounded-md bg-yellow-50 dark:bg-yellow-900/30 p-4 text-center">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Please{" "}
            <Link href={`/sign-in?redirect_url=${encodeURIComponent("/support")}`} className="font-bold underline hover:text-yellow-700 dark:hover:text-yellow-100">
              sign in
            </Link>{" "}
            or{" "}
            <Link href={`/sign-up?redirect_url=${encodeURIComponent("/support")}`} className="font-bold underline hover:text-yellow-700 dark:hover:text-yellow-100">
              sign up
            </Link>{" "}
            to submit feedback.
          </p>
        </div>
      ) : isSubmitted ? (
        <div className="mt-12 rounded-md bg-green-50 dark:bg-green-900/30 p-6 text-center">
          <h2 className="text-xl font-semibold text-green-800 dark:text-green-200">Thank You!</h2>
          <p className="mt-2 text-green-700 dark:text-green-300">Your feedback has been submitted successfully.</p>
          <Button onClick={() => setIsSubmitted(false)} className="mt-4">Submit More Feedback</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-12 space-y-6">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Your Message
            </label>
            <div className="mt-1">
              <Textarea
                id="message"
                name="message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="Drop us a line! Tell us what you think, any issues you've encountered, or suggestions for improvement."
                required
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-3">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" variant="default">
              Send Feedback
            </Button>
          </div>
        </form>
      )}
       <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
        This site may be protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
      </p>
    </div>
  );
} 