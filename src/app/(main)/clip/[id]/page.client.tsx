"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, Copy, Download, Pause, Play, Share2 } from "lucide-react";
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

  const handleDownload = async () => {
    toast("Descarga iniciada", {
      description: "Tu clip se está descargando",
    });
    try {
      const response = await fetch(clipUrl);

      if (!response.ok) {
        let errorMessage = `Error al obtener el archivo: ${response.statusText} (código: ${response.status})`;
        if (
          response.status === 0 ||
          response.type === "opaque" ||
          response.status === 403 ||
          response.status === 401
        ) {
          errorMessage +=
            ". Verifica la configuración CORS en el bucket de Backblaze B2 y que la URL prefirmada sea válida.";
        }
        throw new Error(errorMessage);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `clip-${clipTitle}.mp4`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast("Descarga completada", {
        description: "Tu clip se ha descargado.",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error en la descarga:", error);
        toast("Error en la descarga", {
          description: `No se pudo descargar el clip. ${error.message}`,
        });
      }
    }
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
            className="bg-gradient-to-r from-primary/90 to-secondary/90 hover:from-primary hover:to-secondary h-14 text-lg rounded-xl border-0 shadow-lg shadow-pink-500/20 transition-all duration-300 hover:shadow-pink-500/30 hover:translate-y-[-2px]"
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
          <h2 className="text-lg font-medium flex items-center">
            <Share2 className="mr-2 h-5 w-5 text-primary" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="xMidYMid"
                      viewBox="0 0 256 290"
                    >
                      <path
                        fill="#FF004F"
                        d="M189.72 104.421c18.678 13.345 41.56 21.197 66.273 21.197v-47.53a67.114 67.114 0 0 1-13.918-1.456v37.413c-24.711 0-47.59-7.851-66.272-21.195v96.996c0 48.523-39.356 87.855-87.9 87.855-18.113 0-34.949-5.473-48.934-14.86 15.962 16.313 38.222 26.432 62.848 26.432 48.548 0 87.905-39.332 87.905-87.857v-96.995h-.002Zm17.17-47.952c-9.546-10.423-15.814-23.893-17.17-38.785v-6.113h-13.189c3.32 18.927 14.644 35.097 30.358 44.898ZM69.673 225.607a40.008 40.008 0 0 1-8.203-24.33c0-22.192 18.001-40.186 40.21-40.186a40.313 40.313 0 0 1 12.197 1.883v-48.593c-4.61-.631-9.262-.9-13.912-.801v37.822a40.268 40.268 0 0 0-12.203-1.882c-22.208 0-40.208 17.992-40.208 40.187 0 15.694 8.997 29.281 22.119 35.9Z"
                      />
                      <path d="M175.803 92.849c18.683 13.344 41.56 21.195 66.272 21.195V76.631c-13.794-2.937-26.005-10.141-35.186-20.162-15.715-9.802-27.038-25.972-30.358-44.898h-34.643v189.843c-.079 22.132-18.049 40.052-40.21 40.052-13.058 0-24.66-6.221-32.007-15.86-13.12-6.618-22.118-20.206-22.118-35.898 0-22.193 18-40.187 40.208-40.187 4.255 0 8.356.662 12.203 1.882v-37.822c-47.692.985-86.047 39.933-86.047 87.834 0 23.912 9.551 45.589 25.053 61.428 13.985 9.385 30.82 14.86 48.934 14.86 48.545 0 87.9-39.335 87.9-87.857V92.85h-.001Z" />
                      <path
                        fill="#00F2EA"
                        d="M242.075 76.63V66.516a66.285 66.285 0 0 1-35.186-10.047 66.47 66.47 0 0 0 35.186 20.163ZM176.53 11.57a67.788 67.788 0 0 1-.728-5.457V0h-47.834v189.845c-.076 22.13-18.046 40.05-40.208 40.05a40.06 40.06 0 0 1-18.09-4.287c7.347 9.637 18.949 15.857 32.007 15.857 22.16 0 40.132-17.918 40.21-40.05V11.571h34.643ZM99.966 113.58v-10.769a88.787 88.787 0 0 0-12.061-.818C39.355 101.993 0 141.327 0 189.845c0 30.419 15.467 57.227 38.971 72.996-15.502-15.838-25.053-37.516-25.053-61.427 0-47.9 38.354-86.848 86.048-87.833Z"
                      />
                    </svg>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="256"
                      height="256"
                      preserveAspectRatio="xMidYMid"
                      viewBox="0 0 256 256"
                    >
                      <path
                        fill="#0A0A08"
                        d="M128 23.064c34.177 0 38.225.13 51.722.745 12.48.57 19.258 2.655 23.769 4.408 5.974 2.322 10.238 5.096 14.717 9.575 4.48 4.479 7.253 8.743 9.575 14.717 1.753 4.511 3.838 11.289 4.408 23.768.615 13.498.745 17.546.745 51.723 0 34.178-.13 38.226-.745 51.723-.57 12.48-2.655 19.257-4.408 23.768-2.322 5.974-5.096 10.239-9.575 14.718-4.479 4.479-8.743 7.253-14.717 9.574-4.511 1.753-11.289 3.839-23.769 4.408-13.495.616-17.543.746-51.722.746-34.18 0-38.228-.13-51.723-.746-12.48-.57-19.257-2.655-23.768-4.408-5.974-2.321-10.239-5.095-14.718-9.574-4.479-4.48-7.253-8.744-9.574-14.718-1.753-4.51-3.839-11.288-4.408-23.768-.616-13.497-.746-17.545-.746-51.723 0-34.177.13-38.225.746-51.722.57-12.48 2.655-19.258 4.408-23.769 2.321-5.974 5.095-10.238 9.574-14.717 4.48-4.48 8.744-7.253 14.718-9.575 4.51-1.753 11.288-3.838 23.768-4.408 13.497-.615 17.545-.745 51.723-.745M128 0C93.237 0 88.878.147 75.226.77c-13.625.622-22.93 2.786-31.071 5.95-8.418 3.271-15.556 7.648-22.672 14.764C14.367 28.6 9.991 35.738 6.72 44.155 3.555 52.297 1.392 61.602.77 75.226.147 88.878 0 93.237 0 128c0 34.763.147 39.122.77 52.774.622 13.625 2.785 22.93 5.95 31.071 3.27 8.417 7.647 15.556 14.763 22.672 7.116 7.116 14.254 11.492 22.672 14.763 8.142 3.165 17.446 5.328 31.07 5.95 13.653.623 18.012.77 52.775.77s39.122-.147 52.774-.77c13.624-.622 22.929-2.785 31.07-5.95 8.418-3.27 15.556-7.647 22.672-14.763 7.116-7.116 11.493-14.254 14.764-22.672 3.164-8.142 5.328-17.446 5.95-31.07.623-13.653.77-18.012.77-52.775s-.147-39.122-.77-52.774c-.622-13.624-2.786-22.929-5.95-31.07-3.271-8.418-7.648-15.556-14.764-22.672C227.4 14.368 220.262 9.99 211.845 6.72c-8.142-3.164-17.447-5.328-31.071-5.95C167.122.147 162.763 0 128 0Zm0 62.27C91.698 62.27 62.27 91.7 62.27 128c0 36.302 29.428 65.73 65.73 65.73 36.301 0 65.73-29.428 65.73-65.73 0-36.301-29.429-65.73-65.73-65.73Zm0 108.397c-23.564 0-42.667-19.103-42.667-42.667S104.436 85.333 128 85.333s42.667 19.103 42.667 42.667-19.103 42.667-42.667 42.667Zm83.686-110.994c0 8.484-6.876 15.36-15.36 15.36-8.483 0-15.36-6.876-15.36-15.36 0-8.483 6.877-15.36 15.36-15.36 8.484 0 15.36 6.877 15.36 15.36Z"
                      />
                    </svg>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1200"
                      height="1227"
                      fill="none"
                      viewBox="0 0 1200 1227"
                    >
                      <path
                        fill="#000"
                        d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
                      />
                    </svg>
                    <span className="sr-only">Compartir en X(Twitter)</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Compartir en X(Twitter)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </Card>
      </div>
    </div>
  );
}
