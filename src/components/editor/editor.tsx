import { api } from "@/services/api";
import { ClipDataToSave } from "@/types/clip";
import {
  ClipCreateValues,
  type LayerState,
  LayoutAspectRatios,
  LayoutAspectRatiosString,
  type LayoutVariant,
  type OutputOptions,
} from "@/types/editor";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ClipLoadingScreen from "../clip-loading-screen";
import OutputPreview from "./output-preview";
import SettingsPanel from "./settings-panel";
import Timeline from "./timeline";
import VideoStage from "./video-stage";

const initialLayers: Record<LayerState["id"], LayerState> = {
  content: {
    id: "content",
    x: 0,
    y: 0,
    width: 1280,
    height: 720,
    rotation: 0,
    zIndex: 1,
    visible: true,
  },
  camera: {
    id: "camera",
    x: 10,
    y: 10,
    width: 256,
    height: 144,
    rotation: 0,
    zIndex: 2,
    visible: true,
  },
};

const initialOutputOptions: OutputOptions = {
  addBlurredBackground: false,
};

interface EditorProps {
  videoFile?: File;
}

export default function Editor({ videoFile }: EditorProps) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [layers, setLayers] =
    useState<Record<LayerState["id"], LayerState>>(initialLayers);
  const [selectedLayerId, setSelectedLayerId] = useState<
    LayerState["id"] | null
  >(null);
  const [outputLayout, setOutputLayout] =
    useState<LayoutVariant>("tiktok-cam-top");
  const [outputOptions, setOutputOptions] =
    useState<OutputOptions>(initialOutputOptions);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [inputVideoDimensions, setInputVideoDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [isVideoMetadataLoaded, setIsVideoMetadataLoaded] =
    useState<boolean>(false);

  const videoElementRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoSrc(url);
      toast.info("Processing video...", {
        id: "video-load",
        description: videoFile.name,
      });
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setVideoSrc(null);
      setInputVideoDimensions(null);
      setIsVideoMetadataLoaded(false);
      setDuration(0);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [videoFile]);

  const handleLoadedMetadata = () => {
    if (videoElementRef.current) {
      const {
        videoWidth,
        videoHeight,
        duration: videoDuration,
      } = videoElementRef.current;
      if (videoWidth > 0 && videoHeight > 0) {
        setInputVideoDimensions({ width: videoWidth, height: videoHeight });
        setIsVideoMetadataLoaded(true);
        if (
          !isNaN(videoDuration) &&
          videoDuration !== Infinity &&
          videoDuration > 0
        ) {
          setDuration(videoDuration);
        } else {
          setDuration(0);
          toast.warning("Video Warning", {
            description: "Could not read video duration.",
          });
        }

        const contentWidth = videoWidth;
        const contentHeight = videoHeight;
        const targetCameraWidth = Math.min(480, videoWidth * 0.25);
        const cameraWidth = Math.max(1, targetCameraWidth);
        const targetCameraHeight = (cameraWidth / 16) * 9;
        const cameraHeight = Math.max(1, targetCameraHeight);

        setLayers({
          content: {
            id: "content",
            x: (contentWidth - contentWidth / 2) / 2,
            y: contentHeight - contentHeight,
            width: contentWidth / 2,
            height: contentHeight,
            rotation: 0,
            zIndex: 1,
            visible: true,
          },
          camera: {
            id: "camera",
            x: contentWidth - cameraWidth - 10,
            y: contentHeight - cameraHeight - 10,
            width: cameraWidth,
            height: cameraHeight,
            rotation: 0,
            zIndex: 10,
            visible: true,
          },
        });

        setSelectedLayerId(null);
        toast.success("Video Ready", {
          id: "video-load",
          description: `Dimensions: ${videoWidth}x${videoHeight}`,
        });
      } else {
        setIsVideoMetadataLoaded(false);
        setInputVideoDimensions(null);
        setDuration(0);
        toast.error("Video Error", {
          id: "video-load",
          description: "Could not read video dimensions.",
        });
      }
    } else {
      setIsVideoMetadataLoaded(false);
      setInputVideoDimensions(null);
      setDuration(0);
    }
  };

  const handleLayerUpdate = (
    id: LayerState["id"],
    newProps: Partial<LayerState>
  ) => {
    setLayers((prev) => ({ ...prev, [id]: { ...prev[id], ...newProps } }));
  };

  const handleLayerSelect = (id: LayerState["id"] | null) => {
    setSelectedLayerId(id);
  };

  const handleOutputOptionsChange = (options: Partial<OutputOptions>) => {
    setOutputOptions((prev) => ({ ...prev, ...options }));
  };

  const handleTimeUpdate = (time: number) => {
    if (Math.abs(currentTime - time) > 0.05) {
      setCurrentTime(time);
    }
  };
  const handleDurationChange = (newDuration: number) => {
    if (
      duration !== newDuration &&
      !isNaN(newDuration) &&
      newDuration !== Infinity &&
      newDuration > 0
    ) {
      setDuration(newDuration);
    } else if (
      duration !== 0 &&
      (isNaN(newDuration) || newDuration === Infinity || newDuration <= 0)
    ) {
      setDuration(0);
    }
  };
  const handleSeek = (time: number) => {
    if (videoElementRef.current && isVideoMetadataLoaded) {
      const newTime = Math.max(0, Math.min(time, duration));
      videoElementRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  const handlePlayPause = () => {
    const video = videoElementRef.current;
    if (!video || !isVideoMetadataLoaded) return;
    if (isPlaying) {
      video.pause();
    } else {
      if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        video.play().catch((error) => {
          toast.error("Playback Error", {
            description: `Could not start video playback. ${error.message}`,
          });
          setIsPlaying(false);
        });
      } else {
        toast.info("Video Loading", {
          description: "Please wait for the video to load further.",
        });
        return;
      }
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const video = videoElementRef.current;
    if (!video) return;
    const syncPlayState = () => {
      const currentlyPaused = video.paused;
      if (currentlyPaused === isPlaying) {
        setIsPlaying(!currentlyPaused);
      }
    };
    video.addEventListener("play", syncPlayState);
    video.addEventListener("pause", syncPlayState);
    video.addEventListener("ended", syncPlayState);
    return () => {
      video.removeEventListener("play", syncPlayState);
      video.removeEventListener("pause", syncPlayState);
      video.removeEventListener("ended", syncPlayState);
    };
  }, [videoSrc, isPlaying]);

  const [isClipping, setIsClipping] = useState<boolean>(false);

  const { user, isSignedIn } = useUser();
  const handleCreateClip = async (clipData: ClipCreateValues) => {
    if (!videoFile || !isVideoMetadataLoaded || duration <= 0 || isClipping) {
      toast.warning("Cannot create clip", {
        description: "Please load a video and wait for it to be ready.",
      });
      return;
    }
    setIsClipping(true);
    const visibleLayers = Object.values(layers)
      .filter((layer) => layer.visible && layer.width > 0 && layer.height > 0)
      .map((layer) => ({
        id: layer.id,
        sourceRect: {
          x: Math.round(layer.x),
          y: Math.round(layer.y),
          width: Math.round(layer.width),
          height: Math.round(layer.height),
        },
        rotation: layer.rotation,
        zIndex: layer.zIndex,
      }));
    if (visibleLayers.length === 0) {
      toast.error("Cannot create clip", {
        id: "clip-process",
        description:
          "No visible layers selected or layers have invalid dimensions.",
      });
      setIsClipping(false);
      return;
    }
    const clipInstructions = {
      source: {
        type: "file_reference",
        identifier: videoFile.name,
        originalDimensions: inputVideoDimensions
          ? {
              width: inputVideoDimensions.width,
              height: inputVideoDimensions.height,
            }
          : null,
      },
      clip: {
        startTime: 0,
        endTime: duration,
        outputLayout: outputLayout,
      },
      layers: visibleLayers,
      options: {
        addBlurredBackground: outputOptions.addBlurredBackground,
      },
      outputMetadata: {
        filename_suggestion: `clip_${outputLayout}_${videoFile.name.replace(
          /\.[^/.]+$/,
          ""
        )}.mp4`,
      },
    };
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("instructions", JSON.stringify(clipInstructions));
    try {
      const res = await fetch("https://api.flashclip.app/clip/process", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success("Clip processed successfully", {
        id: "clip-process",
        description: data.message,
      });

      if (isSignedIn && user && data.url) {
        toast.info("Saving clip to your account...", {
          id: "db-save-process",
        });

        const clipDataToSave: ClipDataToSave = {
          title:
            clipData.title ||
            clipInstructions.outputMetadata.filename_suggestion ||
            `Clip from ${videoFile.name.replace(/\.[^/.]+$/, "")}`,
          url: data.url,
          thumbnailUrl: data.thumbnail_url,
          authorName: user.username || user.firstName || videoFile.name,
          duration: Math.round(duration * 1000),

          width: outputLayout
            ? LayoutAspectRatios[outputLayout]
              ? typeof LayoutAspectRatios[outputLayout] === "number"
                ? LayoutAspectRatios[outputLayout] * (data.output_height || 720)
                : parseInt(
                    LayoutAspectRatiosString[outputLayout].split("/")[0]
                  ) * 100
              : inputVideoDimensions?.width || 1280
            : inputVideoDimensions?.width || 1280,
          height: outputLayout
            ? LayoutAspectRatios[outputLayout]
              ? typeof LayoutAspectRatios[outputLayout] === "number"
                ? data.output_height || 720
                : parseInt(
                    LayoutAspectRatiosString[outputLayout].split("/")[1]
                  ) * 100
              : inputVideoDimensions?.height || 720
            : inputVideoDimensions?.height || 720,
          isPublic: clipData.isPublic,
        };

        try {
          await api.clip.save(clipDataToSave); // USA TU SERVICIO AQUÍ
          toast.success("Clip saved to your account!", {
            id: "db-save-process",
            description: `You can find it in your dashboard.`,
          });
        } catch (e: unknown) {
          console.error("Error saving clip to DB:", e);
          toast.error("Failed to save clip to your account", {
            id: "db-save-process",
            description:
              "The clip was processed, but not saved. Please try saving it later if needed.",
          });
        }
      }

      router.push(
        `/clip/${Date.now()}?url=${data.url}&title=${clipData.title}&streamer=${
          user?.username
        }`
      );
    } catch (error) {
      setIsClipping(false);
      console.error("Error processing clip:", error);
      toast.error("Failed to process clip", {
        id: "clip-process",
        description: "See console for details.",
      });
    }
  };

  const isAppDisabled = !isVideoMetadataLoaded;

  const inputContainerAspectRatio =
    inputVideoDimensions &&
    inputVideoDimensions.width > 0 &&
    inputVideoDimensions.height > 0
      ? `${inputVideoDimensions.width} / ${inputVideoDimensions.height}`
      : "16 / 9";

  const outputContainerAspectRatioValue = LayoutAspectRatios[outputLayout];
  const outputContainerAspectRatioString =
    typeof outputContainerAspectRatioValue === "number"
      ? outputContainerAspectRatioValue.toString()
      : "9 / 16";

  return (
    <>
      {isClipping && <ClipLoadingScreen />}
      <div className="flex gap-5 h-full">
        <div className="flex flex-1 flex-col h-[calc(100vh-7.4rem)] py-4 border-e border-dashed pe-6">
          <div className="flex-grow flex flex-col md:flex-row gap-4 overflow-hidden">
            <div className="flex flex-col md:flex-[2_1_0%] min-h-[250px] md:min-h-0 overflow-hidden">
              <h2 className="text-sm sm:text-base font-semibold mb-2 text-muted-foreground flex-shrink-0">
                INPUT
              </h2>
              <div
                className="flex-grow flex items-center justify-center relative bg-slate-50 dark:bg-white/5 p-1 rounded-lg shadow-inner "
                style={{
                  aspectRatio: inputContainerAspectRatio,
                  maxHeight: "400px",
                }}
              >
                <VideoStage
                  videoSrc={videoSrc}
                  layers={layers}
                  selectedLayerId={selectedLayerId}
                  currentTime={currentTime}
                  videoElementRef={
                    videoElementRef as React.RefObject<HTMLVideoElement>
                  }
                  inputVideoDimensions={inputVideoDimensions}
                  onLayerUpdate={handleLayerUpdate}
                  onLayerSelect={handleLayerSelect}
                  onTimeUpdate={handleTimeUpdate}
                  onDurationChange={handleDurationChange}
                  onLoadedMetadata={handleLoadedMetadata}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-[1_1_0%] min-h-[250px] md:min-h-0 overflow-hidden">
              <h2 className="text-sm sm:text-base font-semibold mb-2 text-muted-foreground flex-shrink-0">
                OUTPUT PREVIEW
              </h2>
              <div
                className="flex-grow flex items-center justify-center relative bg-slate-50 dark:bg-white/5 p-1 rounded-lg shadow-inner overflow-hidden"
                style={{
                  aspectRatio: outputContainerAspectRatioString,
                  maxHeight: "624px",
                }}
              >
                <OutputPreview
                  layout={outputLayout}
                  outputOptions={outputOptions}
                  sourceVideoElement={videoElementRef.current}
                  isPlaying={isPlaying}
                  currentTime={currentTime}
                  layers={layers}
                  inputVideoDimensions={inputVideoDimensions}
                  isVideoReady={isVideoMetadataLoaded}
                />
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 mt-2">
            <Timeline
              currentTime={currentTime}
              duration={duration}
              isPlaying={isPlaying}
              onSeek={handleSeek}
              onPlayPause={handlePlayPause}
              disabled={isAppDisabled || duration <= 0}
            />
          </div>
        </div>
        <div className="order-2 h-full overflow-hidden max-w-[22rem]">
          <SettingsPanel
            outputLayout={outputLayout}
            outputOptions={outputOptions}
            onLayoutChange={setOutputLayout}
            onOutputOptionsChange={handleOutputOptionsChange}
            layers={layers}
            selectedLayerId={selectedLayerId}
            onLayerUpdate={handleLayerUpdate}
            onLayerSelect={handleLayerSelect}
            disabled={isAppDisabled}
            onClipCreate={handleCreateClip}
            isClipping={isClipping}
          />
        </div>
      </div>
    </>
  );
}
