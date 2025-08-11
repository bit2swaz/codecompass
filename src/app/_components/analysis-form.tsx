"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function AnalysisForm() {
  const [repoUrl, setRepoUrl] = useState("");
  const router = useRouter();

  const runAnalysisMutation = api.analysis.runAnalysis.useMutation({
    onSuccess: (data) => {
      router.push(`/analysis/${data.analysisId}`);
    },
    onError: (error) => {
      console.error("Analysis failed:", error);
      alert(`Error: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoUrl) {
      runAnalysisMutation.mutate({ repoUrl });
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="url"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/username/repository"
          className="flex-grow rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-purple-400 focus:ring focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={runAnalysisMutation.isPending}
          className="rounded-md bg-purple-600 px-6 py-2 font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:bg-gray-600"
        >
          {runAnalysisMutation.isPending ? "Analyzing..." : "Analyze"}
        </button>
      </form>
    </div>
  );
}
