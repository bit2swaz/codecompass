/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function Feedback({ analysisId }: { analysisId: string }) {
  const [feedbackSent, setFeedbackSent] = useState(false);

  // We'll create this tRPC mutation next
  const sendFeedbackMutation = api.feedback.sendFeedback.useMutation({
    onSuccess: () => {
      setFeedbackSent(true);
    },
  });

  const handleFeedback = (wasHelpful: boolean) => {
    sendFeedbackMutation.mutate({ analysisId, wasHelpful });
  };

  if (feedbackSent) {
    return (
      <div className="mt-8 rounded-lg border border-gray-700 bg-gray-800/50 p-6 text-center">
        <h3 className="text-xl font-semibold text-purple-400">
          Thank you for your feedback!
        </h3>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-lg border border-gray-700 bg-gray-800/50 p-6 text-center">
      <h3 className="text-xl font-semibold">Was this analysis helpful?</h3>
      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={() => handleFeedback(true)}
          disabled={sendFeedbackMutation.isPending}
          className="rounded-md bg-green-600/80 px-6 py-2 font-semibold text-white transition hover:bg-green-500 disabled:opacity-50"
        >
          👍 Yes
        </button>
        <button
          onClick={() => handleFeedback(false)}
          disabled={sendFeedbackMutation.isPending}
          className="rounded-md bg-red-600/80 px-6 py-2 font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
        >
          👎 No
        </button>
      </div>
    </div>
  );
}
