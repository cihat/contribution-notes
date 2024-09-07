import { json } from "@sveltejs/kit";
import GithubService from "~/api/GithubService";
import { format, username } from "~/constants";

export async function GET() {
  const githubService = new GithubService(username, format);
  const data = await githubService.fetchDataForAllYears();
  return json(data);
}
