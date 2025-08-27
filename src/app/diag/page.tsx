import { env } from "~/env";

export default function DiagPage() {
  // We are reading the variables directly to see what the server has access to.
  const prismaUrl = env.POSTGRES_PRISMA_URL;
  const nonPoolingUrl = env.POSTGRES_URL_NON_POOLING;
  const nodeEnv = env.NODE_ENV;

  // Helper to mask secrets
  const maskSecret = (secret: string | undefined) => {
    if (!secret) return "Not Set";
    return `${secret.substring(0, 4)}...${secret.substring(secret.length - 4)}`;
  };

  return (
    <div className="container mx-auto mt-16 text-white">
      <h1 className="text-4xl font-bold">Environment Diagnostics</h1>
      <p className="mt-2 text-lg text-gray-400">
        This page shows the environment variables the application is currently
        using.
      </p>
      <div className="mt-8 font-mono text-sm">
        <div className="mb-4 rounded bg-gray-800 p-4">
          <p className="font-bold text-gray-300">NODE_ENV:</p>
          <p className="text-green-400">{nodeEnv}</p>
        </div>
        <div className="mb-4 rounded bg-gray-800 p-4">
          <p className="font-bold text-gray-300">
            POSTGRES_PRISMA_URL (Pooled):
          </p>
          <p className="text-cyan-400">{prismaUrl}</p>
        </div>
        <div className="mb-4 rounded bg-gray-800 p-4">
          <p className="font-bold text-gray-300">
            POSTGRES_URL_NON_POOLING (Direct):
          </p>
          <p className="text-cyan-400">{nonPoolingUrl}</p>
        </div>
        <div className="mb-4 rounded bg-gray-800 p-4">
          <p className="font-bold text-gray-300">GITHUB_CLIENT_ID:</p>
          <p className="text-yellow-400">{maskSecret(env.AUTH_GITHUB_ID)}</p>
        </div>
      </div>
    </div>
  );
}
