import EditorPage from "./page.client";

export default async function EditorClipPage({
  params,
}: {
  params: Promise<{ clipId: string }>;
}) {
  const clipId = (await params).clipId;
  if (!clipId) return <div>Clip not found</div>;
  return <EditorPage clipId={clipId} />;
}
