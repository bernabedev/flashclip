import { Toaster } from "@/components/ui/sonner";
import {
  type LayerState,
  type LayoutVariant,
  LayoutVariantNames,
  type OutputOptions,
} from "@/types/editor";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import OutputPreview from "./output-preview";
import SettingsPanel from "./settings-panel";
import Timeline from "./timeline";
import VideoStage from "./video-stage";

const initialLayers: Record<LayerState["id"], LayerState> = {
  /**
   * Initial state of the "content" layer.
   *
   * @property {number} x - X coordinate of the layer.
   * @property {number} y - Y coordinate of the layer.
   * @property {number} width - Width of the layer.
   * @property {number} height - Height of the layer.
   * @property {number} rotation - Rotation of the layer in degrees.
   * @property {number} zIndex - Z-index of the layer.
   * @property {boolean} visible - Whether the layer is visible or not.
   */
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

  // const handleVideoSelect = (file: File) => {
  //   setVideoSrc(null);
  //   setInputVideoDimensions(null);
  //   setIsVideoMetadataLoaded(false);
  //   setDuration(0);
  //   setCurrentTime(0);
  //   setIsPlaying(false);
  //   setLayers(initialLayers);
  //   setSelectedLayerId(null);
  //   setOutputOptions(initialOutputOptions);
  // };

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

        // --- Robust Size Calculation ---
        const targetCameraWidth = Math.min(320, videoWidth * 0.25);
        // Ensure minimum width of 1px
        const cameraWidth = Math.max(1, targetCameraWidth);
        // Calculate height based on potentially clamped width
        const targetCameraHeight = (cameraWidth / 16) * 9;
        // Ensure minimum height of 1px
        const cameraHeight = Math.max(1, targetCameraHeight);
        // --- End Robust Size Calculation ---

        setLayers({
          content: {
            id: "content",
            x: 0,
            y: 0,
            width: contentWidth,
            height: contentHeight,
            rotation: 0,
            zIndex: 1,
            visible: true,
          },
          camera: {
            id: "camera",
            x: 20,
            y: 20,
            width: cameraWidth,
            height: cameraHeight,
            rotation: 0,
            zIndex: 2,
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
  const handleCreateClip = async () => {
    if (!videoFile || !isVideoMetadataLoaded || duration <= 0 || isClipping) {
      toast.warning("Cannot create clip", {
        description: "Please load a video and wait for it to be ready.",
      });
      return;
    }

    setIsClipping(true);
    toast.info("Preparing clip instructions...", { id: "clip-process" });

    // 1. Gather Visible Layers Data
    const visibleLayers = Object.values(layers)
      .filter((layer) => layer.visible && layer.width > 0 && layer.height > 0)
      .map((layer) => ({
        id: layer.id,
        sourceRect: {
          // Structure for clarity in backend
          x: Math.round(layer.x), // Send rounded integers
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

    // 2. Construct the Instructions Payload
    const clipInstructions = {
      // --- Source Video Information ---
      source: {
        // How the backend identifies the video.
        // 'file_reference' assumes the backend has access based on the identifier.
        // Could also be 'url' for Twitch/external links, or require upload.
        type: "file_reference",
        identifier: videoFile.name, // Using filename as a simple identifier
        // Optional: Original dimensions might be useful for backend validation
        originalDimensions: inputVideoDimensions
          ? {
              width: inputVideoDimensions.width,
              height: inputVideoDimensions.height,
            }
          : null,
      },

      // --- Clip Details ---
      clip: {
        startTime: 0, // TODO: Add UI for selecting start/end times later
        endTime: duration,
        outputLayout: outputLayout, // e.g., "tiktok-cam-top"
      },

      // --- Layer Configuration ---
      layers: visibleLayers, // Array of visible layer objects

      // --- Output Options ---
      options: {
        addBlurredBackground: outputOptions.addBlurredBackground,
        // Add other options here in the future (e.g., audio adjustments, filters)
      },

      // --- Optional Output Metadata ---
      outputMetadata: {
        // Suggestion for the output filename
        filename_suggestion: `clip_${outputLayout}_${videoFile.name.replace(
          /\.[^/.]+$/,
          ""
        )}.mp4`,
      },
    };

    // 3. Simulate Sending to Backend

    console.log({
      clipInstructions: JSON.stringify(clipInstructions, null, 2),
    }); // Pretty print JSON

    // --- Replace this block with actual fetch/axios call ---
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
    const success = true; // Simulate backend response
    // --- End of simulation block ---

    if (success) {
      // Replace with check of actual backend response
      toast.success("Clip Instructions Sent (Simulated)", {
        id: "clip-process",
        description: "Check console for the JSON payload.",
      });
    } else {
      toast.error("Failed to Send Clip Instructions (Simulated)", {
        id: "clip-process",
        description: "See console/network tab for details.",
      });
    }

    setIsClipping(false); // Re-enable button
  };

  const isAppDisabled = !isVideoMetadataLoaded;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Toaster position="top-right" richColors closeButton />
      <header className="p-4 border-b sticky top-0 bg-background/95 backdrop-blur z-10 flex-shrink-0">
        {" "}
        <h1 className="text-2xl font-bold">Video Clipper</h1>{" "}
      </header>
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
        <div className="flex flex-col min-h-[250px] sm:min-h-[300px] overflow-hidden">
          <h2 className="text-sm sm:text-base font-semibold mb-2 text-center text-muted-foreground flex-shrink-0">
            INPUT STAGE
          </h2>
          <div className="flex-grow flex items-center justify-center relative bg-black/10 dark:bg-white/5 p-1 rounded-lg shadow-inner overflow-hidden">
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
        <div className="flex flex-col min-h-[250px] sm:min-h-[300px] overflow-hidden max-h-[calc(100vh-32rem)]">
          <h2 className="text-sm sm:text-base font-semibold mb-2 text-center text-muted-foreground flex-shrink-0">
            OUTPUT PREVIEW ({LayoutVariantNames[outputLayout]})
          </h2>
          <div className="flex-grow relative bg-black/10 dark:bg-white/5 p-1 rounded-lg shadow-inner overflow-hidden">
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
        {" "}
        <Timeline
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          onSeek={handleSeek}
          onPlayPause={handlePlayPause}
          disabled={isAppDisabled || duration <= 0}
        />{" "}
      </div>
      <div className="order-2 h-full overflow-hidden fixed right-4 z-50 max-w-[22rem]">
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
        />
      </div>
    </div>
  );
}
