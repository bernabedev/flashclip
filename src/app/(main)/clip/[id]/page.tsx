import ClipReady from "./page.client";

export default async function ClipPage(props: {
  searchParams: Promise<{ url: string; title?: string; streamer?: string }>;
}) {
  const searchParams = await props.searchParams;
  const url = searchParams?.url || "";
  const title = searchParams?.title;
  const streamer = searchParams?.streamer;

  return <ClipReady clipUrl={url} clipTitle={title} streamerName={streamer} />;
}
