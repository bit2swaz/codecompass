/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import Link from "next/link";
import AnalysisForm from "../_components/analysis-form";
import InfoBanner from "../_components/info-banner";
import RenameModal from "../_components/rename-modal";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import RepoSelector from "../_components/repo-selector";

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
const RunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);
const OpportunityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
const SkillIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const analysesQuery = api.analysis.getAllAnalyses.useQuery(undefined, {
    enabled: !!session?.user,
  });

  const [analysisHistory, setAnalysisHistory] = useState(
    analysesQuery.data ?? [],
  );
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [analysisToRename, setAnalysisToRename] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<{
    url: string;
    isPrivate: boolean;
  } | null>(null);

  useEffect(() => {
    if (analysesQuery.data) {
      setAnalysisHistory(analysesQuery.data);
    }
  }, [analysesQuery.data]);

  const utils = api.useUtils();

  const deleteAnalysisMutation = api.analysis.deleteAnalysis.useMutation({
    onSuccess: (deletedAnalysis) => {
      utils.analysis.getAllAnalyses.invalidate();
      setAnalysisHistory((prev) =>
        prev.filter((a) => a.id !== deletedAnalysis.id),
      );
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const updateAnalysisMutation = api.analysis.updateAnalysis.useMutation({
    onSuccess: (updatedAnalysis) => {
      utils.analysis.getAllAnalyses.invalidate();
      setAnalysisHistory((prev) =>
        prev.map((a) =>
          a.id === updatedAnalysis.id
            ? { ...a, displayName: updatedAnalysis.displayName }
            : a,
        ),
      );
      closeRenameModal();
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const openRenameModal = (analysis: {
    id: string;
    displayName: string | null;
    repoUrl: string;
  }) => {
    setAnalysisToRename({
      id: analysis.id,
      name:
        analysis.displayName ??
        analysis.repoUrl.replace("https://github.com/", ""),
    });
    setIsRenameModalOpen(true);
  };

  const closeRenameModal = () => setIsRenameModalOpen(false);

  const handleRenameSave = (newName: string) => {
    if (analysisToRename) {
      updateAnalysisMutation.mutate({
        id: analysisToRename.id,
        displayName: newName,
      });
    }
  };

  if (
    status === "loading" ||
    (status === "authenticated" && analysesQuery.isLoading)
  ) {
    return (
      <div className="mt-32 text-center text-white">Loading dashboard...</div>
    );
  }

  if (status === "unauthenticated") {
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

  const analysesRun = analysisHistory.length;
  const opportunitiesFound = analysisHistory
    .filter((a) => a.status === "COMPLETED" && Array.isArray(a.results))
    .reduce((acc, a) => acc + (a.results as any[]).length, 0);

  return (
    <>
      <div className="container mx-auto mt-8 px-4 text-white">
        <div className="mb-12">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="mt-2 text-lg text-gray-400">
            Welcome back, {session?.user?.name}.
          </p>
        </div>
        <InfoBanner />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="flex items-start gap-4 overflow-hidden rounded-lg bg-gray-800/60 px-4 py-5 shadow sm:p-6">
            <RunIcon />
            <div>
              <dt className="truncate text-sm font-medium text-gray-400">
                Analyses Run
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">
                {analysesRun}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-4 overflow-hidden rounded-lg bg-gray-800/60 px-4 py-5 shadow sm:p-6">
            <OpportunityIcon />
            <div>
              <dt className="truncate text-sm font-medium text-gray-400">
                Opportunities Found
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">
                {opportunitiesFound}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-4 overflow-hidden rounded-lg bg-gray-800/60 px-4 py-5 shadow sm:p-6">
            <SkillIcon />
            <div>
              <dt className="truncate text-sm font-medium text-gray-400">
                Skills Improved
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">
                0 <span className="text-sm">(Coming soon)</span>
              </dd>
            </div>
          </div>
        </div>
        <div className="mt-12 rounded-lg border border-purple-500/30 bg-gray-800/50 p-8 shadow-xl">
          <h2 className="text-2xl font-semibold">Start a New Analysis</h2>
          <div className="mt-6">
            <p className="mb-2 text-sm text-gray-400">
              Select a repository from your GitHub account.
            </p>
            <RepoSelector
              onSelectRepoAction={(repo) =>
                setSelectedRepo({ url: repo.url, isPrivate: repo.isPrivate })
              }
            />
            <div className="mt-4">
              <AnalysisForm
                prefilledUrl={selectedRepo?.url}
                isPrivateRepo={selectedRepo?.isPrivate ?? false}
              />
            </div>
          </div>
        </div>
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold">Analysis History</h2>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50">
            {analysisHistory.length > 0 ? (
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
                      className="px-3 py-3.5 text-center text-sm font-semibold"
                    >
                      Opportunities
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pr-4 pl-3 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 bg-gray-900">
                  <AnimatePresence>
                    {analysisHistory.map((analysis) => {
                      const opportunityCount = Array.isArray(analysis.results)
                        ? analysis.results.length
                        : 0;
                      return (
                        <motion.tr
                          key={analysis.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -50 }}
                          className="hover:bg-gray-800/50"
                        >
                          <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap sm:pl-6">
                            {analysis.displayName ??
                              analysis.repoUrl.replace(
                                "https://github.com/",
                                "",
                              )}
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-400">
                            {new Date(analysis.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-400">
                            <StatusBadge status={analysis.status} />
                          </td>
                          <td className="px-3 py-4 text-center text-sm whitespace-nowrap text-gray-400">
                            {opportunityCount}
                          </td>
                          <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                            <Link
                              href={`/analysis/${analysis.id}`}
                              className="mr-4 text-purple-400 hover:text-purple-300"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => openRenameModal(analysis)}
                              className="mr-4 text-gray-400 hover:text-white"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure you want to delete this analysis? This action cannot be undone.",
                                  )
                                ) {
                                  deleteAnalysisMutation.mutate({
                                    id: analysis.id,
                                  });
                                }
                              }}
                              disabled={deleteAnalysisMutation.isPending}
                              className="text-red-500 hover:text-red-400"
                            >
                              Delete
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
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
      {analysisToRename && (
        <RenameModal
          isOpen={isRenameModalOpen}
          onClose={closeRenameModal}
          onSave={handleRenameSave}
          currentName={analysisToRename.name}
          isSaving={updateAnalysisMutation.isPending}
        />
      )}
    </>
  );
}
