/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import AnalysisForm from "../_components/analysis-form";

export default async function DashboardPage() {
  const session = await api.auth.getSession();

  if (!session?.user) {
    redirect("/");
  }

  // Placeholder for analysis history
  const analysisHistory: any[] = [
    // { id: '1', repoUrl: 'https://github.com/user/project-1', status: 'COMPLETED', createdAt: new Date() },
    // { id: '2', repoUrl: 'https://github.com/user/project-2', status: 'FAILED', createdAt: new Date() },
  ];

  return (
    <div className="container mx-auto mt-8 px-4 text-white">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold">Your Dashboard</h1>
        <p className="mt-2 text-lg text-gray-400">
          Welcome back, {session.user.name}. Ready to find your next learning
          opportunity?
        </p>
      </div>

      {/* Start New Analysis Section */}
      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-8">
        <h2 className="text-2xl font-semibold">Start a New Analysis</h2>
        <p className="mt-2 text-gray-400">
          Enter the URL of a public GitHub repository to get started.
        </p>
        <div className="mt-6">
          <AnalysisForm />
        </div>
      </div>

      {/* Analysis History Section (Placeholder) */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold">Analysis History</h2>
        <div className="mt-6 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden rounded-lg shadow ring-1 ring-white/10">
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
                        <tr key={analysis.id}>
                          {/* Table row content will go here */}
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
    </div>
  );
}
