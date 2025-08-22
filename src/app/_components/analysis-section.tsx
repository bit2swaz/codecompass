"use client";

import { useState } from "react";
import RepoSelector from "./repo-selector";
import AnalysisForm from "./analysis-form";

export default function AnalysisSection() {
  const [selectedRepoUrl, setSelectedRepoUrl] = useState("");

  return (
    <>
      <p className="mb-2 text-sm text-gray-400">
        Select a repository from your GitHub account.
      </p>
      <RepoSelector onSelectRepoAction={setSelectedRepoUrl} />
      <div className="mt-4">
        <AnalysisForm prefilledUrl={selectedRepoUrl} />
      </div>
    </>
  );
}
