"use client";

import Editor from "@/components/editor/editor";
import { getVideoFromDB } from "@/lib/save-clip-local";
import { useEffect, useState } from "react";

export default function EditorClipPage({ clipId }: { clipId: string }) {
  const [videoFile, setVideoFile] = useState<File>();
  useEffect(() => {
    const loadVideo = async () => {
      const videoFile = await getVideoFromDB(clipId);
      if (videoFile) {
        setVideoFile(videoFile);
      }
    };
    loadVideo();
  }, [clipId]);
  return <Editor videoFile={videoFile} />;
}
