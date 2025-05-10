"use client";

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
  }, []);
  return (
    <div>
      Editor {clipId}{" "}
      {videoFile && <video src={URL.createObjectURL(videoFile)} controls />}
    </div>
  );
}
