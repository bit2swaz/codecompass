const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
      clipRule="evenodd"
    />
  </svg>
);

export default function InfoBanner() {
  return (
    <div className="mb-8 rounded-lg border border-yellow-700/50 bg-yellow-900/30 p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <InfoIcon />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-300">
            <span className="font-semibold">Coming Soon:</span> Private
            repository analysis will be available in a future update. For now,
            please use public repositories.
          </p>
        </div>
      </div>
    </div>
  );
}
