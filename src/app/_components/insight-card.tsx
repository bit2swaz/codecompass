const CodeIcon = () => (
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
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
    />
  </svg>
);

type Insight = {
  title: string;
  problem: string;
  solution: string;
  file: string;
  line: number;
  type: string;
};

export default function InsightCard({ insight }: { insight: Insight }) {
  const solutionSteps = insight.solution
    .split("\n")
    .filter((step) => step.trim() !== "");

  return (
    <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800/50 shadow-lg transition-all hover:border-purple-500/50 hover:shadow-purple-900/20">
      <div className="flex items-center gap-4 border-b border-gray-700 p-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-700/50">
          <CodeIcon />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
          <p className="font-mono text-sm text-gray-400">
            {insight.file}, line {insight.line}
          </p>
        </div>
      </div>
      <div className="space-y-4 p-6">
        <div>
          <h4 className="mb-2 font-semibold text-gray-300">The Problem</h4>
          <p className="text-gray-400">{insight.problem}</p>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-gray-300">
            The Recommended Solution
          </h4>
          <ol className="list-inside list-decimal space-y-2 text-gray-400">
            {solutionSteps.map((step, index) => (
              <li key={index}>{step.replace(/^\d+\.\s*/, "")}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
