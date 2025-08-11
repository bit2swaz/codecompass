import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import AnalysisForm from "../_components/analysis-form";

export default async function DashboardPage() {
  const session = await api.auth.getSession();

  // If the user is not logged in, redirect them to the homepage
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="container mx-auto mt-16 flex flex-col items-center justify-center gap-8 px-4 py-16 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Your Dashboard</h1>
        <p className="mt-2 text-lg text-gray-400">
          Welcome back, {session.user.name}. Let&apos;s get analyzing.
        </p>
      </div>
      <AnalysisForm />
    </div>
  );
}
