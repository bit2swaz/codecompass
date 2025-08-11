import { api } from "~/trpc/server";
import LandingPage from "./_components/landing-page";

export default async function Home() {
  const session = await api.auth.getSession();
  return <LandingPage session={session} />;
}
