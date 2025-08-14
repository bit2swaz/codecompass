// SVG Icons for different opportunity types
const SecretIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-red-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);
const PropDrillingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-blue-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    />
  </svg>
);

type Insight = {
  title: string;
  problem: string;
  solution: string;
  // These properties are expected from the backend
  file: string;
  line: number;
  type: "HARDCODED_SECRET" | "PROP_DRILLING";
};

export default function InsightCard({ insight }: { insight: Insight }) {
  // **FIX:** This function now correctly selects the icon based on the 'type' property
  const getIcon = () => {
    switch (insight.type) {
      case "HARDCODED_SECRET":
        return <SecretIcon />;
      case "PROP_DRILLING":
        return <PropDrillingIcon />;
      default:
        return null; // Fallback in case of an unknown type
    }
  };

  return (
    <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800/50 shadow-lg transition-all hover:border-purple-500/50 hover:shadow-purple-900/20">
      <div className="flex items-center gap-4 border-b border-gray-700 p-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-700/50">
          {getIcon()}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
          {/* **FIX:** This line now correctly displays the file path and line number */}
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
          <p className="text-gray-400">{insight.solution}</p>
        </div>
      </div>
    </div>
  );
}
