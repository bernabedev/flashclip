import ClipReady from "./page.client";

export default async function ClipPage(props: {
  searchParams: Promise<{ url: string }>;
}) {
  const searchParams = await props.searchParams;
  const url = searchParams?.url || "";

  return <ClipReady clipUrl={url} />;
}
