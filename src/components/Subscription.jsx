// /src/components/Subscription.jsx
import React, { useState } from "react";
import { toast } from "sonner";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Subscription = () => {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isValid = EMAIL_RE.test(email);
  const showError = touched && !isValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);

    if (!isValid) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setSubmitting(true);

      // TODO: replace with your real API call
      // await fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ email }) });
      await new Promise((r) => setTimeout(r, 800));

      toast.success("Subscribed! You’ll hear from me soon.");
      setEmail("");
      setTouched(false);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center">
      <h4 className="text-md font-semibold text-cyan-200 mb-3">
        Subscribe to Newsletter
      </h4>

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex">
          <input
            type="email"
            name="email"
            value={email}
            onBlur={() => setTouched(true)}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            aria-label="Email address"
            aria-invalid={showError ? "true" : "false"}
            className={`flex-1 px-4 py-2 rounded-l-lg border bg-black/30 text-white placeholder-gray-400 focus:outline-none 
              ${showError ? "border-red-500 focus:border-red-500" : "border-cyan-400/40 focus:border-cyan-400"}`}
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-r-lg bg-gradient-to-r from-cyan-500 to-green-500 text-black font-semibold
                       shadow-[0_0_14px_rgba(34,211,238,0.5)] hover:shadow-[0_0_22px_rgba(34,211,238,0.7)] transition disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Subscribe"}
          </button>
        </div>

        {showError && (
          <p className="mt-2 text-sm text-red-400">
            Please enter a valid email address (e.g., name@example.com).
          </p>
        )}
      </form>
    </div>
  );
};

export default Subscription;
