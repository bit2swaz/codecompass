export default function AuthErrorPage() {
  return (
    <div className="container mx-auto mt-16 flex flex-col items-center justify-center gap-6 px-4 py-16 text-white">
      <h1 className="text-4xl font-bold text-red-500">Authentication Error</h1>
      <p className="text-xl text-gray-300">
        Something went wrong during the sign-in process.
      </p>
      <p className="text-gray-400">
        Please try signing in again. If the problem persists, check the server
        logs for more details.
      </p>
    </div>
  );
}
