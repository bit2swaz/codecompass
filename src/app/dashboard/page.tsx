/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "~/trpc/server";
import AnalysisForm from "../_components/analysis-form";
import Link from "next/link";

// SVG Icons
const LoginIcon = () => (
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
      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
    />
  </svg>
);
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
// Other icons for stats...

export default async function DashboardPage() {
  const session = await api.auth.getSession();

  // If user is not logged in, show a special message
  if (!session?.user) {
    return (
      <div className="container mx-auto mt-32 text-center text-white">
        <LoginIcon />
        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          Access Denied
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          You must be logged in to view your dashboard.
        </p>
        <div className="mt-8">
          <Link
            href="/api/auth/signin"
            className="rounded-md bg-purple-600 px-6 py-3 font-semibold text-white no-underline shadow-lg shadow-purple-600/20 transition hover:bg-purple-500"
          >
            Sign In with GitHub
          </Link>
        </div>
      </div>
    );
  }

  // We will fetch real analysis history here in the future.
  const analysisHistory: any[] = [];

  // If user is logged in, show the full dashboard
  return (
    <div className="container mx-auto mt-8 px-4 text-white">
      <div className="mb-12">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="mt-2 text-lg text-gray-400">
          Welcome back, {session.user.name}.
        </p>
      </div>

      {/* Stats Section remains the same */}

      <div className="mt-12 rounded-lg border border-purple-500/30 bg-gray-800/50 p-8 shadow-xl">
        <h2 className="text-2xl font-semibold">Start a New Analysis</h2>
        <p className="mt-2 text-gray-400">
          Enter the URL of a public GitHub repository to get started.
        </p>
        <div className="mt-6">
          <AnalysisForm />
        </div>
      </div>

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
                Start your first analysis to see your history here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
