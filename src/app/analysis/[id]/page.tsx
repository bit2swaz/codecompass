"use client";

import { api } from "~/trpc/react";
import InsightCard from "~/app/_components/insight-card";

type AnalysisPageProps = {
  params: {
    id: string;
  };
};

export default function AnalysisPage({ params }: AnalysisPageProps) {
  const { data: analysis, error } = api.analysis.getAnalysisById.useQuery(
    { id: params.id },
    {
      refetchInterval: (data) => (data?.status === "PENDING" ? 2000 : false),
    },
  );

  if (error) {
    return (
      <div className="container mx-auto mt-16 text-center text-red-500">
        Error loading analysis: {error.message}
      </div>
    );
  }

  // Define a type for our results for type safety
  type Insight = {
    title: string;
    problem: string;
    solution: string;
  };

  const results = analysis?.results as Insight[] | null;

  return (
    <div className="container mx-auto mt-16 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Analysis Results</h1>
        <p className="text-lg text-gray-400">
          Status:{" "}
          <span className="font-semibold text-purple-400">
            {analysis?.status ?? "LOADING..."}
          </span>
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-4xl">
        {analysis?.status === "PENDING" && (
          <div className="text-center">
            {/* You can add a spinner or loading animation here */}
            <p className="text-xl">Analyzing your repository, please wait...</p>
          </div>
        )}

        {analysis?.status === "COMPLETED" && (
          <div>
            {results && results.length > 0 ? (
              results.map((insight, index) => (
                <InsightCard key={index} insight={insight} />
              ))
            ) : (
              <p className="text-center text-gray-400">
                No opportunities for improvement were found. Great job!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
