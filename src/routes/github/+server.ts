import { json } from "@sveltejs/kit";
import githubServiceInstance from "~/api/GithubService";
import { format } from "~/constants";
import { FormatEnum, type Granularity } from "~/types";

async function githubService({ username, repoName, format, granularity }: { username: string, repoName: string, format: FormatEnum, granularity: Granularity }) {
  const githubService = githubServiceInstance;
  githubService.setUserName(username);
  githubService.setFormat(format);
  githubService.setRepoName(repoName);
  githubService.setGranularity(granularity);
  if (repoName) {
    return githubService.getCodeRetentionData(granularity);
  } else {
    return githubService.fetchDataForAllYears();
  }
}

export async function GET({ url }: { url: URL }) {
  const username = url.searchParams.get('username');
  const repoName = url.searchParams.get('repo');
  const granularity = url.searchParams.get('granularity') as Granularity || 'week';


  console.log('{username, repoName} >>', { username, repoName })



  if (!username) {
    return json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    const data = await githubService({ username, repoName, format, granularity });
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
