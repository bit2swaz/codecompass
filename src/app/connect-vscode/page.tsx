"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

function ConnectVscodeClient() {
  const searchParams = useSearchParams();
  const deviceId = searchParams.get("deviceId");
  const { data: session, status } = useSession();

  const approveDeviceMutation = api.vscode.approveDevice.useMutation();

  useEffect(() => {
    // Only attempt to approve the device once when the session is ready.
    if (deviceId && session?.user?.id && status === "authenticated") {
      if (
        !approveDeviceMutation.isSuccess &&
        !approveDeviceMutation.isPending
      ) {
        approveDeviceMutation.mutate({ deviceId });
      }
    }
  }, [deviceId, session, status, approveDeviceMutation]);

  // If the user isn't logged in, prompt them to sign in.
  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto mt-32 text-center text-white">
        <h1 className="text-3xl font-bold">Please Sign In</h1>
        <p className="mt-2 text-lg text-gray-400">
          You need to be logged in to connect your VS Code extension.
        </p>
        <div className="mt-8">
          <Link
            href={`/api/auth/signin?callbackUrl=/connect-vscode?deviceId=${deviceId ?? ""}`}
            className="rounded-md bg-purple-600 px-6 py-3 font-semibold text-white"
          >
            Sign In with GitHub
          </Link>
        </div>
      </div>
    );
  }

  // This is the main view. It shows a consistent message.
  // The VS Code extension itself will provide the final success/error message.
  return (
    <div className="mt-32 text-center text-white">
      <h1 className="text-3xl font-bold text-green-400">
        Authentication in Progress
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        Your request has been sent. Please return to VS Code to complete the
        sign-in process.
      </p>
      <p className="mt-1 text-sm text-gray-500">
        You can now close this window.
      </p>
    </div>
  );
}

export default function ConnectVscodePage() {
  return (
    <Suspense
      fallback={<div className="mt-32 text-center text-white">Loading...</div>}
    >
      <ConnectVscodeClient />
    </Suspense>
  );
}
