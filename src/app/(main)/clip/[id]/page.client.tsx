"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronLeft,
  Copy,
  Download,
  Instagram,
  Pause,
  Play,
  Share2,
  TwitterIcon as TikTok,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function ClipReady({ clipUrl }: { clipUrl: string }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const clipTitle = "Increíble jugada en directo";
  const streamerName = "StreamerPro";

  useEffect(() => {
    const updateProgress = () => {
      if (videoRef.current) {
        const currentProgress =
          (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(currentProgress);
      }
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("timeupdate", updateProgress);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("timeupdate", updateProgress);
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    toast("Descarga iniciada", {
      description: "Tu clip se está descargando",
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(clipUrl);
    toast("Enlace copiado", {
      description: "El enlace del clip ha sido copiado al portapapeles",
    });
  };

  const handleShare = (platform: string) => {
    let shareUrl = "";

    switch (platform) {
      case "tiktok":
        shareUrl = `https://www.tiktok.com/upload?url=${encodeURIComponent(
          clipUrl
        )}`;
        break;
      case "instagram":
        navigator.clipboard.writeText(clipUrl);
        toast("Listo para Instagram", {
          description: "Enlace copiado. Abre Instagram y pégalo para compartir",
        });
        return;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          clipUrl
        )}&text=${encodeURIComponent("¡Mira este clip increíble!")}`;
        break;
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };

  return (
    <div className="container mx-auto px-4">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Volver al inicio
      </Link>

      <div className="space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
            ¡Tu clip está listo!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{clipTitle}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Por {streamerName}
          </p>
        </div>

        {/* Video player */}
        <div className="relative rounded-xl overflow-hidden bg-black shadow-xl">
          <video
            ref={videoRef}
            src={clipUrl}
            className="w-full h-full object-contain aspect-video"
            poster="/placeholder.svg?height=720&width=1280"
            autoPlay
            controls
            muted
          />
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
          >
            <div className="w-20 h-20 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center transform transition-transform hover:scale-105">
              {isPlaying ? (
                <Pause className="w-10 h-10 text-white" />
              ) : (
                <Play className="w-10 h-10 text-white ml-1" />
              )}
            </div>
          </button>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleDownload}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 h-14 text-lg rounded-xl border-0 shadow-lg shadow-pink-500/20 transition-all duration-300 hover:shadow-pink-500/30 hover:translate-y-[-2px]"
          >
            <Download className="mr-2 h-5 w-5" /> Descargar Clip
          </Button>

          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="h-14 text-lg rounded-xl border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:translate-y-[-2px]"
          >
            <Copy className="mr-2 h-5 w-5" /> Copiar Enlace
          </Button>
        </div>

        {/* Share section */}
        <Card className="backdrop-blur-md bg-white/50 dark:bg-gray-800/50 rounded-xl p-8">
          <h2 className="text-lg font-medium mb-6 flex items-center">
            <Share2 className="mr-2 h-5 w-5 text-pink-500" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
              Compartir en redes sociales
            </span>
          </h2>

          <div className="flex flex-wrap gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => handleShare("tiktok")}
                    variant="outline"
                    size="lg"
                    className="h-16 w-16 p-0 rounded-xl border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:border-pink-500 transition-all duration-300 hover:translate-y-[-2px]"
                  >
                    <TikTok className="h-7 w-7 text-black dark:text-white" />
                    <span className="sr-only">Compartir en TikTok</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Compartir en TikTok</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => handleShare("instagram")}
                    variant="outline"
                    size="lg"
                    className="h-16 w-16 p-0 rounded-xl border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:border-pink-500 transition-all duration-300 hover:translate-y-[-2px]"
                  >
                    <Instagram className="h-7 w-7 text-black dark:text-white" />
                    <span className="sr-only">Compartir en Instagram</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Compartir en Instagram</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => handleShare("twitter")}
                    variant="outline"
                    size="lg"
                    className="h-16 w-16 p-0 rounded-xl border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:border-pink-500 transition-all duration-300 hover:translate-y-[-2px]"
                  >
                    <Twitter className="h-7 w-7 text-black dark:text-white" />
                    <span className="sr-only">Compartir en Twitter</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Compartir en Twitter</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </Card>
      </div>
    </div>
  );
}
