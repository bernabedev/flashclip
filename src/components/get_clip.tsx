"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveVideoToDB } from "@/lib/save-clip-local";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FileUploader from "./file-uploader";

export default function GetClip() {
  const [loading, setLoading] = useState(false);
  const [clipUrl, setClipUrl] = useState("");
  const [downloadedVideoFile, setDownloadedVideoFile] = useState<File | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const downloadClip = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!clipUrl.trim()) {
      setError("Please enter a Twitch Clip URL.");
      return;
    }
    setLoading(true);
    setError(null);
    setDownloadedVideoFile(null);

    try {
      const match = clipUrl.match(/\/clip\/([^/?#]+)/);
      const clipId = match ? match[1] : null;

      if (!clipId) {
        setError("Invalid Twitch Clip URL format. Could not extract Clip ID.");
        setLoading(false);
        return;
      }

      const apiUrl = `https://api.flashclip.app/twitch/download/clip/${clipId}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        let errorDetail = "";
        try {
          const errorText = await response.text();
          errorDetail = ` Server responded with: ${errorText.substring(
            0,
            200
          )}`;
        } catch (e: unknown) {
          console.error("Failed to read error text:", e);
        }
        const errorMessage = `Failed to download clip. Status: ${response.status}.${errorDetail}`;
        console.error(errorMessage);
        setError(errorMessage);
        return;
      }

      const blob = await response.blob();
      const fileName = `${clipId}.mp4`;
      const videoFile = new File([blob], fileName, { type: "video/mp4" });

      setDownloadedVideoFile(videoFile);
    } catch (err) {
      console.error("Error downloading clip:", err);
      let specificErrorMessage =
        "An error occurred while downloading the clip.";
      if (err instanceof Error) {
        specificErrorMessage = err.message;
        if (
          err.name === "TypeError" &&
          err.message.toLowerCase().includes("failed to fetch")
        ) {
          specificErrorMessage +=
            " This might be a CORS (Cross-Origin Resource Sharing) issue or a network problem. The server at 'api.flashclip.app' must allow requests from your website's domain. If you control the server, ensure 'Access-Control-Allow-Origin' headers are correctly set. Otherwise, you may need to proxy this request through your own backend server to bypass browser CORS restrictions.";
        }
      } else {
        specificErrorMessage = String(err);
      }
      setError(specificErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (file: File) => {
    setDownloadedVideoFile(file);
  };

  useEffect(() => {
    if (downloadedVideoFile) {
      const clipId = window.crypto.randomUUID();
      saveVideoToDB(clipId, downloadedVideoFile);
      router.push(`/editor/${clipId}`);
    }
  }, [downloadedVideoFile]);

  return (
    <>
      <FileUploader
        className="w-full bg-white"
        containerClassName="w-full"
        maxSizeMB={100}
        placeholderAccept="MP4, MOV, OGG, WEBM, 3GP"
        accept="video/mp4,video/mpeg,video/quicktime,video/ogg,video/webm,video/3gpp"
        onFileUpload={handleFileUpload}
      />
      <hr className="my-8" />
      <div className="flex flex-col gap-2">
        <form className="flex gap-2" onSubmit={downloadClip}>
          <Input
            placeholder="Enter Twitch Clip URL"
            className="bg-white w-96"
            value={clipUrl}
            onChange={(e) => {
              setClipUrl(e.target.value);
              if (error) setError(null);
            }}
            disabled={loading}
          />
          <Button
            className="min-w-32"
            type="submit"
            disabled={!clipUrl.trim() || loading}
          >
            {loading ? "Generating..." : "Generate"}
          </Button>
        </form>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </>
  );
}
