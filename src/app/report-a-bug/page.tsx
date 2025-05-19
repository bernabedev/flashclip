/**
 * Redirects to the GitHub issues page
 * Page to get analytics on how many people are reporting bugs
 */
import { redirect } from "next/navigation";

const REPO_ISSUES_URL = "https://github.com/bernabedev/flashclip/issues/new";

export default function ReportABug() {
  return redirect(REPO_ISSUES_URL);
}
