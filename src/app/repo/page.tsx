import { redirect } from "next/navigation";
const REPO_URL = "https://github.com/bernabedev/flashclip";

export default function RepoPage() {
  return redirect(REPO_URL);
}
