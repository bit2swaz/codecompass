import { api } from "~/trpc/server";
import AnalysisForm from "./_components/analysis-form";

export default async function Home() {
  const session = await api.auth.getSession();

  return (
    <div className="container mx-auto mt-16 flex flex-col items-center justify-center gap-12 px-4 py-16 text-white">
      <h1 className="text-center text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Your Code is Smart.
        <br />
        <span className="text-purple-400">
          Your Learning Path Should Be, Too.
        </span>
      </h1>

      {session?.user ? (
        <AnalysisForm />
      ) : (
        <p className="max-w-3xl text-center text-2xl text-gray-300">
          Sign in with GitHub above to analyze your first repository.
        </p>
      )}
    </div>
  );
}
