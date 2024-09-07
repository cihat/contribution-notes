import { json } from "@sveltejs/kit";
import { getGithubService } from "~/api/GithubService";
import { format } from "~/constants";

export async function GET({ url }: { url: URL }) {
  const username = url.searchParams.get('username');

  if (!username) {
    return json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    const githubService = getGithubService(username, format);
    githubService.setUserName(username);
    const data = await githubService.fetchDataForAllYears();

    return json(data);
  } catch (e: any) {
    return json({ error: e.message }, { status: 500 });
  }
}
