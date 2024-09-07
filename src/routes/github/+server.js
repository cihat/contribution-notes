import { json } from "@sveltejs/kit";
import fetchDataForAllYears from "../../api/github";
import { format, username } from "../../constants";

export async function GET() {
  const data = await fetchDataForAllYears(username, format);
  return json(data);
}
