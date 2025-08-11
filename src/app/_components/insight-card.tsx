type Insight = {
  title: string;
  problem: string;
  solution: string;
};

type InsightCardProps = {
  insight: Insight;
};

export default function InsightCard({ insight }: InsightCardProps) {
  return (
    <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-md">
      <h3 className="mb-2 text-2xl font-bold text-purple-400">
        {insight.title}
      </h3>
      <div className="space-y-4">
        <div>
          <h4 className="mb-1 font-semibold text-gray-300">The Problem</h4>
          <p className="text-gray-400">{insight.problem}</p>
        </div>
        <div>
          <h4 className="mb-1 font-semibold text-gray-300">The Solution</h4>
          <p className="text-gray-400">{insight.solution}</p>
        </div>
      </div>
    </div>
  );
}
