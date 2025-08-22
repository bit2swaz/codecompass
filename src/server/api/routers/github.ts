import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

// Type definition for the data we expect from the GitHub API
type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  owner: {
    login: string;
  };
};

export const githubRouter = createTRPCRouter({
  getUserRepos: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // 1. Find the user's GitHub account to get their access token
    const account = await db.account.findFirst({
      where: {
        userId: userId,
        provider: "github",
      },
    });

    if (!account?.access_token) {
      throw new Error("GitHub account not linked or access token is missing.");
    }

    // 2. Fetch repositories from the GitHub API, sorted by last updated
    const response = await fetch(
      "https://api.github.com/user/repos?sort=updated&per_page=100",
      {
        headers: {
          Authorization: `token ${account.access_token}`,
        },
      },
    );

    if (!response.ok) {
      console.error("GitHub API Error:", await response.text());
      throw new Error("Failed to fetch repositories from GitHub.");
    }

    const repos = (await response.json()) as GitHubRepo[];

    // 3. Format the data into a clean structure for our front-end
    return repos.map((repo) => ({
      id: repo.id,
      name: repo.full_name,
      isPrivate: repo.private,
      url: repo.html_url,
    }));
  }),
});
