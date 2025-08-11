/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import { api } from "~/trpc/react";

type AnalysisPageProps = {
  params: {
    id: string;
  };
};

export default function AnalysisPage({ params }: AnalysisPageProps) {
  // This query will refetch data every 2 seconds until it succeeds
  const { data: analysis, error } = api.analysis.getAnalysisById.useQuery(
    { id: params.id },
    {
      refetchInterval: (query: { state: { data: { status: string } } }) =>
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

  return (
    <div className="container mx-auto mt-16 text-white">
      <h1 className="text-center text-4xl font-bold">Analysis Results</h1>
      <p className="text-center text-lg text-gray-400">
        Status:{" "}
        <span className="font-semibold text-purple-400">
          {analysis?.status ?? "LOADING..."}
        </span>
      </p>

      {/* We will render the actual results here in the next step */}
      {analysis?.status === "COMPLETED" && (
        <div className="mt-8 rounded-lg bg-gray-800 p-6">
          <h2 className="text-2xl font-bold">Opportunities Found:</h2>
          <pre className="mt-4 overflow-x-auto rounded bg-gray-900 p-4 text-sm">
            {JSON.stringify(analysis.results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
