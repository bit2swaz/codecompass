/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import AnalysisForm from "../_components/analysis-form";

// SVG Icon for the empty state
const EmptyStateIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto h-12 w-12 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
    />
  </svg>
);

export default async function DashboardPage() {
  const session = await api.auth.getSession();

  if (!session?.user) {
    redirect("/");
  }

  // We will fetch real analysis history here in the future.
  const analysisHistory: any[] = [];

  return (
    <div className="container mx-auto mt-8 px-4 text-white">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="mt-2 text-lg text-gray-400">
          Welcome back, {session.user.name}.
        </p>
      </div>

      {/* Start New Analysis Section */}
      <div className="rounded-lg border border-purple-500/30 bg-gray-800/50 p-8 shadow-xl">
        <h2 className="text-2xl font-semibold">Start a New Analysis</h2>
        <p className="mt-2 text-gray-400">
          Enter the URL of a public GitHub repository to get started.
        </p>
        <div className="mt-6">
          <AnalysisForm />
        </div>
      </div>

      {/* Analysis History Section */}
      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-semibold">Analysis History</h2>
        <div className="rounded-lg border border-gray-800 bg-gray-900/50">
          {analysisHistory.length > 0 ? (
            <table className="min-w-full">
              {/* Table will go here when there's data */}
            </table>
          ) : (
            <div className="py-20 text-center">
              <EmptyStateIcon />
              <h3 className="mt-4 text-lg font-semibold">No Analyses Yet</h3>
              <p className="mt-1 text-sm text-gray-400">
                Start a new analysis to see your history here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
