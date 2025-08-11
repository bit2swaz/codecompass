import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import AnalysisForm from "../_components/analysis-form";
import Link from "next/link";

// Helper component for status badges
const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses = "rounded-full px-2.5 py-0.5 text-xs font-medium";
  const statusClasses = {
    COMPLETED: "bg-green-500/20 text-green-400",
    PENDING: "bg-yellow-500/20 text-yellow-400 animate-pulse",
    FAILED: "bg-red-500/20 text-red-400",
  };
  return (
    <span
      className={`${baseClasses} ${statusClasses[status as keyof typeof statusClasses] || "bg-gray-500/20 text-gray-400"}`}
    >
      {status}
    </span>
  );
};

export default async function DashboardPage() {
  const session = await api.auth.getSession();

  if (!session?.user) {
    redirect("/");
  }

  // Placeholder data for analysis history
  const analysisHistory = [
    {
      id: "1",
      repoUrl: "https://github.com/bit2swaz/project-x",
      status: "COMPLETED",
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: "2",
      repoUrl: "https://github.com/bit2swaz/old-portfolio",
      status: "COMPLETED",
      createdAt: new Date(Date.now() - 172800000),
    },
    {
      id: "3",
      repoUrl: "https://github.com/bit2swaz/api-service",
      status: "FAILED",
      createdAt: new Date(Date.now() - 259200000),
    },
  ];

  return (
    <div className="container mx-auto mt-8 px-4 text-white">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold">Your Dashboard</h1>
        <p className="mt-2 text-lg text-gray-400">
          Welcome back, {session.user.name}. Let&apos;s find your next learning
          opportunity.
        </p>
      </div>

      {/* Stats Section (Placeholder) - This is the "addicting" part */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-gray-800/60 px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-400">
            Analyses Run
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">
            3
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-gray-800/60 px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-400">
            Opportunities Found
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">
            12
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-gray-800/60 px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-400">
            Skills Improved
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">
            4
          </dd>
        </div>
      </div>

      {/* Start New Analysis Section */}
      <div className="mt-12 rounded-lg border border-purple-500/30 bg-gray-800/50 p-8 shadow-xl">
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
        <h2 className="text-2xl font-semibold">Analysis History</h2>
        <div className="mt-6 flow-root">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-lg ring-1 ring-white/10">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold sm:pl-6"
                    >
                      Repository
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pr-4 pl-3 sm:pr-6"
                    >
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 bg-gray-900">
                  {analysisHistory.length > 0 ? (
                    analysisHistory.map((analysis) => (
                      <tr key={analysis.id} className="hover:bg-gray-800/50">
                        <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap sm:pl-6">
                          {analysis.repoUrl.replace("https://github.com/", "")}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-400">
                          {analysis.createdAt.toLocaleDateString()}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-400">
                          <StatusBadge status={analysis.status} />
                        </td>
                        <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                          <Link
                            href="#"
                            className="text-purple-400 hover:text-purple-300"
                          >
                            View
                            <span className="sr-only">
                              , {analysis.repoUrl}
                            </span>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-gray-500"
                      >
                        You have no past analyses.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
