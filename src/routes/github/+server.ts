import { json } from "@sveltejs/kit";
import { getGithubService } from "~/api/GithubService";
import { format } from "~/constants";
import { FormatEnum } from "~/types";

async function fetchUserContributions(username: string, format: FormatEnum) {
  const githubService = getGithubService();
  githubService.setUserName(username);
  githubService.setFormat(format);

  return await githubService.fetchDataForAllYears();
}

export async function GET({ url }: { url: URL }) {
  const username = url.searchParams.get('username');

  if (!username) {
    return json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    const data = await fetchUserContributions(username, format)
    return json(data, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate'
      }
    })
  } catch (e) {
    return json({ error: (e as Error).message }, {
      status: 500,
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate'
      }
    });
  }
}
