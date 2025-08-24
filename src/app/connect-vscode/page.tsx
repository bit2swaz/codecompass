/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ConnectVscodePage() {
  const searchParams = useSearchParams();
  const deviceId = searchParams.get("deviceId");
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  const approveDeviceMutation = api.vscode.approveDevice.useMutation({
    onError: (err) => {
      setError(err.message);
    },
  });

  useEffect(() => {
    if (deviceId && session?.user?.id && status === "authenticated") {
      approveDeviceMutation.mutate({ deviceId });
    }
  }, [deviceId, session, status]);

  if (status === "loading") {
    return (
      <div className="mt-32 text-center text-white">Loading session...</div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto mt-32 text-center text-white">
        <h1 className="text-3xl font-bold">Please Sign In</h1>
        <p className="mt-2 text-lg text-gray-400">
          You need to be logged in to connect your VS Code extension.
        </p>
        <div className="mt-8">
          <Link
            href="/api/auth/signin"
            className="rounded-md bg-purple-600 px-6 py-3 font-semibold text-white"
          >
            Sign In with GitHub
          </Link>
        </div>
      </div>
    );
  }

  if (approveDeviceMutation.isSuccess) {
    return (
      <div className="mt-32 text-center text-white">
        <h1 className="text-3xl font-bold text-green-400">Success!</h1>
        <p className="mt-2 text-lg text-gray-400">
          You can now close this window and return to VS Code.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-32 text-center text-white">
        <h1 className="text-3xl font-bold text-red-400">Error</h1>
        <p className="mt-2 text-lg text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-32 text-center text-white">
      <h1 className="text-3xl font-bold">Connecting to CodeCompass...</h1>
      <p className="mt-2 text-lg text-gray-400">
        Please wait while we link your VS Code extension.
      </p>
    </div>
  );
}
