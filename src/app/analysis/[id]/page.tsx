/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import InsightCard from "~/app/_components/insight-card";
import Feedback from "~/app/_components/feedback";

export default function AnalysisPage() {
  const params = useParams<{ id: string }>();
  const { data: analysis, error } = api.analysis.getAnalysisById.useQuery(
    { id: params.id },
    {
      refetchInterval: (query) =>
        query.state.data?.status === "PENDING" ? 2000 : false,
    },
  );

  if (error) {
    return (
      <div className="container mx-auto mt-16 text-center text-red-500">
        Error loading analysis: {error.message}
      </div>
    );
  }

  // Define a type for our successful results
  type Insight = {
    title: string;
    problem: string;
    solution: string;
  };

  // Use 'any' to safely check for our custom error structure
  const results = analysis?.results as any;

  return (
    <div className="container mx-auto mt-16 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Analysis Results</h1>
        <p className="text-lg text-gray-400">
          For: <span className="font-mono">{analysis?.repoUrl}</span>
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-4xl">
        {(!analysis || analysis.status === "PENDING") && (
          <div className="flex flex-col items-center justify-center gap-6 rounded-lg bg-gray-800 p-8">
            <svg
              className="h-12 w-12 animate-spin text-purple-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <h2 className="text-2xl font-semibold">Analysis in Progress...</h2>
            <p className="text-center text-gray-400">
              Cloning your repository, running static analysis, and generating
              AI insights.
              <br />
              This may take a minute.
            </p>
          </div>
        )}

        {analysis?.status === "COMPLETED" && (
          <div>
            {/* --- NEW BLOCK FOR PRIVATE REPO --- */}
            {results?.error === "PRIVATE_REPO" ? (
              <div className="rounded-lg border border-yellow-700 bg-yellow-900/50 p-8 text-center">
                <h2 className="text-2xl font-semibold text-yellow-400">
                  Private Repository Detected
                </h2>
                <p className="mt-2 text-yellow-300">
                  Analysis of private repositories is coming soon in a future
                  update! For now, please analyze a public repository.
                </p>
              </div>
            ) : // --- Existing logic for successful analysis ---
            results && results.length > 0 ? (
              (results as Insight[]).map((insight, index) => (
                <InsightCard key={index} insight={insight} />
              ))
            ) : (
              <p className="text-center text-gray-400">
                No opportunities for improvement were found. Great job!
              </p>
            )}

            {/* The Feedback component remains here */}
            <Feedback analysisId={analysis.id} />
          </div>
        )}

        {analysis?.status === "FAILED" && (
          <div className="rounded-lg border border-red-700 bg-red-900/50 p-8 text-center">
            <h2 className="text-2xl font-semibold text-red-400">
              Analysis Failed
            </h2>
            <p className="mt-2 text-red-300">
              Unfortunately, something went wrong while analyzing your
              repository. Please try again with a different public repository.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
