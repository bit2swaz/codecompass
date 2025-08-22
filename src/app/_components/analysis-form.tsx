/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { TRPCClientError } from "@trpc/client";

export default function AnalysisForm({
  prefilledUrl,
  isPrivateRepoSelected,
}: {
  prefilledUrl?: string;
  isPrivateRepoSelected?: boolean;
}) {
  const [repoUrl, setRepoUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (prefilledUrl) {
      setRepoUrl(prefilledUrl);
    }
  }, [prefilledUrl]);

  const runAnalysisMutation = api.analysis.runAnalysis.useMutation({
    onSuccess: (data) => {
      router.push(`/analysis/${data.analysisId}`);
    },
    onError: (error) => {
      if (error instanceof TRPCClientError) {
        if (error.message.includes("Could not clone the repository")) {
          alert(
            "Error: Failed to clone the repository. Please ensure the URL is correct and the repository is public.",
          );
        } else {
          alert(`An error occurred: ${error.message}`);
        }
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
      console.error("Analysis failed:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPrivateRepoSelected) {
      alert("Private repository analysis is a Pro feature, coming soon!");
      return;
    }
    try {
      new URL(repoUrl);
      if (!repoUrl.includes("github.com")) {
        throw new Error("Please enter a valid GitHub repository URL.");
      }
      runAnalysisMutation.mutate({ repoUrl });
    } catch (error) {
      alert(
        "Invalid URL. Please enter a valid GitHub repository URL starting with https://github.com/...",
      );
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 sm:flex-row sm:gap-2"
      >
        <input
          type="url"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="Or paste a public repository URL here"
          className="flex-grow rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:border-purple-400 focus:ring focus:ring-purple-500/50 focus:outline-none"
          required
        />
        <div className="relative">
          <button
            type="submit"
            disabled={
              runAnalysisMutation.isPending || !repoUrl || isPrivateRepoSelected
            }
            className="w-full rounded-md bg-purple-600 px-6 py-2 font-semibold text-white shadow-lg shadow-purple-600/20 transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:bg-gray-600"
          >
            {runAnalysisMutation.isPending ? "Analyzing..." : "Analyze"}
          </button>
          {isPrivateRepoSelected && (
            <div className="absolute -top-10 right-0 w-max rounded-md bg-gray-900 px-2 py-1 text-xs text-white">
              Private repo analysis coming soon!
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
