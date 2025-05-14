import { capitalize, cn } from "@/lib/utils";
import { type LayerState } from "@/types/editor";
import React, { useCallback, useEffect, useRef, useState } from "react"; // Import useCallback, useState
import {
  type DraggableData,
  type Position,
  type ResizableDelta,
  Rnd,
} from "react-rnd";

interface VideoStageProps {
  videoSrc: string | null;
  layers: Record<LayerState["id"], LayerState>;
  selectedLayerId: LayerState["id"] | null;
  currentTime: number;
  videoElementRef: React.RefObject<HTMLVideoElement>;
  inputVideoDimensions: { width: number; height: number } | null;
  onLayerUpdate: (id: LayerState["id"], newProps: Partial<LayerState>) => void;
  onLayerSelect: (id: LayerState["id"] | null) => void;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onLoadedMetadata: () => void;
}

// Helper type for layout calculation result
type StageVideoLayout = {
  scale: number;
  offsetX: number;
  offsetY: number;
  renderedVideoWidth: number;
  renderedVideoHeight: number;
  stageWidth: number;
  stageHeight: number;
};

const VideoStage: React.FC<VideoStageProps> = ({
  videoSrc,
  layers,
  selectedLayerId,
  currentTime,
  videoElementRef,
  inputVideoDimensions,
  onLayerUpdate,
  onLayerSelect,
  onTimeUpdate,
  onDurationChange,
  onLoadedMetadata,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  // State to store the calculated layout for reuse
  const [stageLayout, setStageLayout] = useState<StageVideoLayout | null>(null);

  // --- Recalculate layout on resize or when video dimensions change ---
  const calculateStageVideoLayout = useCallback(() => {
    const stage = stageRef.current;
    const video = videoElementRef.current;
    // Ensure video metadata and stage are ready
    if (
      !stage ||
      !video ||
      !inputVideoDimensions ||
      video.videoWidth === 0 ||
      video.videoHeight === 0 ||
      stage.offsetWidth === 0 ||
      stage.offsetHeight === 0
    ) {
      setStageLayout(null);
      return null;
    }
    const stageWidth = stage.offsetWidth;
    const stageHeight = stage.offsetHeight;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Calculate scale factor based on object-contain logic
    const scale = Math.min(stageWidth / videoWidth, stageHeight / videoHeight);

    // Calculate the actual pixel size of the video displayed on the stage
    const renderedVideoWidth = videoWidth * scale;
    const renderedVideoHeight = videoHeight * scale;

    // Calculate the offset (black bars) of the video within the stage
    const offsetX = (stageWidth - renderedVideoWidth) / 2;
    const offsetY = (stageHeight - renderedVideoHeight) / 2;

    const layout = {
      scale,
      offsetX,
      offsetY,
      renderedVideoWidth,
      renderedVideoHeight,
      stageWidth,
      stageHeight,
    };
    setStageLayout(layout);
    return layout;
  }, [inputVideoDimensions, videoElementRef, stageRef]);

  // --- Update layout on mount and resize ---
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    calculateStageVideoLayout(); // Initial calculation

    const resizeObserver = new ResizeObserver(() => {
      calculateStageVideoLayout();
    });
    resizeObserver.observe(stage);

    return () => resizeObserver.disconnect();
  }, [calculateStageVideoLayout]); // Dependency on the memoized function

  // Recalculate when video metadata is loaded
  useEffect(() => {
    if (inputVideoDimensions) {
      calculateStageVideoLayout();
    }
  }, [inputVideoDimensions, calculateStageVideoLayout]);

  useEffect(() => {
    const video = videoElementRef.current;
    if (
      video &&
      video.duration > 0 &&
      Math.abs(video.currentTime - currentTime) > 0.1
    ) {
      // Only seek if necessary to avoid interrupting smooth playback/scrubbing
      video.currentTime = currentTime;
    }
  }, [currentTime, videoElementRef]);

  const handleTimeUpdateInternal = (
    event: React.SyntheticEvent<HTMLVideoElement>
  ) => {
    onTimeUpdate(event.currentTarget.currentTime);
  };
  const handleDurationChangeInternal = (
    event: React.SyntheticEvent<HTMLVideoElement>
  ) => {
    const duration = event.currentTarget.duration;
    if (!isNaN(duration) && duration !== Infinity && duration > 0) {
      onDurationChange(duration);
    }
  };
  const handleMetadataLoadedInternal = () => {
    onLoadedMetadata(); // This triggers inputVideoDimensions update
    // The useEffect depending on inputVideoDimensions will then calculate layout
  };

  // --- Convert Stage Coordinates/Size back to Video Intrinsic Coordinates/Size ---
  const handleDragStop = (id: LayerState["id"], d: DraggableData): void => {
    const layout = stageLayout; // Use state value
    const currentLayer = layers[id];
    if (!layout || layout.scale === 0 || !inputVideoDimensions || !currentLayer)
      return;
    const { scale, offsetX, offsetY } = layout;

    // Convert stage coords (d.x, d.y) back to video intrinsic coords
    const videoX = (d.x - offsetX) / scale;
    const videoY = (d.y - offsetY) / scale;

    // Clamp position so the layer doesn't go entirely outside the video bounds
    const clampedX = Math.max(
      0,
      Math.min(videoX, inputVideoDimensions.width - currentLayer.width)
    );
    const clampedY = Math.max(
      0,
      Math.min(videoY, inputVideoDimensions.height - currentLayer.height)
    );

    if (currentLayer.x !== clampedX || currentLayer.y !== clampedY) {
      onLayerUpdate(id, { x: clampedX, y: clampedY });
    }
  };

  const handleResizeStop = (
    id: LayerState["id"],
    _e: MouseEvent | TouchEvent,
    _dir: string,
    ref: HTMLElement,
    _delta: ResizableDelta,
    pos: Position // Rnd position (top-left corner) in stage coords
  ): void => {
    const layout = stageLayout; // Use state value
    if (!layout || layout.scale === 0 || !inputVideoDimensions) return;
    const { scale, offsetX, offsetY } = layout;

    // Get final size from Rnd component's style (in stage pixels)
    const newStageWidth = parseFloat(ref.style.width);
    const newStageHeight = parseFloat(ref.style.height);

    // Convert stage position (pos.x, pos.y) back to video intrinsic position
    const videoX = (pos.x - offsetX) / scale;
    const videoY = (pos.y - offsetY) / scale;

    // Convert stage dimensions back to video intrinsic dimensions
    const videoWidth = newStageWidth / scale;
    const videoHeight = newStageHeight / scale;

    // Clamp position and size to video boundaries
    // Ensure position is not negative
    const clampedX = Math.max(0, videoX);
    const clampedY = Math.max(0, videoY);
    // Ensure size is at least 1px and fits within video from the clamped position
    const clampedW = Math.max(
      1,
      Math.min(videoWidth, inputVideoDimensions.width - clampedX)
    );
    const clampedH = Math.max(
      1,
      Math.min(videoHeight, inputVideoDimensions.height - clampedY)
    );

    // Check if update is needed (comparing clamped values)
    if (
      layers[id].width !== clampedW ||
      layers[id].height !== clampedH ||
      layers[id].x !== clampedX ||
      layers[id].y !== clampedY
    ) {
      onLayerUpdate(id, {
        width: clampedW,
        height: clampedH,
        x: clampedX,
        y: clampedY,
      });
    }
  };

  // --- onClick handles selection ONLY ---
  const handleLayerClick = (
    e: React.MouseEvent | React.TouchEvent,
    id: LayerState["id"]
  ) => {
    e.stopPropagation(); // Prevent click from bubbling to stage deselect or other handlers
    if (selectedLayerId !== id) {
      onLayerSelect(id);
    }
  };

  // --- Convert Layer State (Video Coords) to Rnd Props (Stage Coords) ---
  const getRndProps = (layer: LayerState) => {
    const layout = stageLayout; // Use state value
    if (!layout || layout.scale === 0 || !layer) {
      // Return default/hidden props if layout not ready
      return {
        size: { width: 0, height: 0 },
        position: { x: -9999, y: -9999 },
        style: { display: "none" },
      };
    }
    const { scale, offsetX, offsetY } = layout;
    const stageX = layer.x * scale + offsetX;
    const stageY = layer.y * scale + offsetY;
    const stageWidth = Math.max(1, layer.width * scale); // Ensure min 1px for Rnd display
    const stageHeight = Math.max(1, layer.height * scale);

    const isSelected = selectedLayerId === layer.id;
    const layerColor =
      layer.id === "content" ? "rgba(0, 255, 0," : "rgba(255, 0, 255,";

    const handleSize = 8;

    const resizeHandleStyle = {
      width: `${handleSize}px`,
      height: `${handleSize}px`,
      border: "1px solid #ff027f",
      backgroundColor: isSelected ? "#ff027fb0" : `${layerColor} 0.7)`,
    };

    return {
      size: { width: stageWidth, height: stageHeight },
      position: { x: stageX, y: stageY },
      style: {
        // Directly apply styles needed for Rnd visibility and interaction
        transform: `rotate(${layer.rotation}deg)`,
        backgroundColor: `${layerColor} 0.1)`,
        outline: isSelected
          ? `2px solid #ff027f`
          : `2px solid ${layerColor} 0.6)`, // More prominent selection outline
        outlineOffset: isSelected ? "0px" : "-1px",
        border: isSelected ? `2px solid #ff027f` : `2px dashed transparent`, // Clearer selection border
        zIndex: isSelected ? 50 : layer.zIndex, // Ensure selected is on top
        cursor: "move", // Explicitly set cursor
        boxShadow: isSelected ? "0 0 10px rgba(59, 130, 246, 0.5)" : "none", // Add glow on select
        transition:
          "opacity 0.15s ease-in-out, border 0.15s ease-in-out, box-shadow 0.15s ease-in-out", // Smooth transitions
        opacity: isSelected ? 1 : 0.8,
      },
      className: `absolute group hover:border-gray-400 hover:opacity-100`, // Base classes
      resizeHandleStyles: isSelected
        ? {
            topLeft: { ...resizeHandleStyle },
            topRight: { ...resizeHandleStyle },
            bottomLeft: { ...resizeHandleStyle },
            bottomRight: { ...resizeHandleStyle },
          }
        : {},
    };
  };

  const stageAspectRatio =
    inputVideoDimensions && inputVideoDimensions.height > 0
      ? inputVideoDimensions.width / inputVideoDimensions.height
      : 16 / 9; // Fallback aspect ratio

  return (
    <div
      ref={stageRef}
      className="relative w-full bg-black border border-muted rounded-md shadow-inner"
      style={{
        aspectRatio: stageAspectRatio,
        perspective: "1000px", // For potential 3D transforms if needed later
        maxWidth: "100%",
        maxHeight: "100%",
        margin: "auto", // Center the stage if container is larger
      }}
      onClick={() => onLayerSelect(null)} // Click on stage background deselects layers
    >
      {/* Video element remains mostly unchanged */}
      {videoSrc && (
        <video
          ref={videoElementRef}
          src={videoSrc}
          // muted
          onTimeUpdate={handleTimeUpdateInternal}
          onDurationChange={handleDurationChangeInternal}
          onLoadedMetadata={handleMetadataLoadedInternal}
          playsInline // Important for mobile playback
          className="absolute inset-0 w-full h-full object-contain pointer-events-none" // Keep object-contain
        />
      )}
      {/* Render Rnd components using calculated props */}
      {videoSrc &&
        inputVideoDimensions &&
        stageLayout && // Only render layers when video and layout are ready
        Object.values(layers)
          .filter(
            (layer) => layer?.visible && layer.width > 0 && layer.height > 0
          ) // Filter visible and valid layers
          .sort((a, b) => a.zIndex - b.zIndex) // Sort by zIndex
          .map((layer) => {
            if (!layer) return null; // Should not happen with filter, but safe guard
            const rndProps = getRndProps(layer); // Calculate props based on current layout
            const isSelected = selectedLayerId === layer.id;

            return (
              <Rnd
                key={layer.id}
                {...rndProps} // Spread calculated size, position, and style
                // Interaction handlers remain the same, they use the calculated layout internally
                onDragStart={(e) => e.stopPropagation()} // Prevent stage deselect on drag start
                onResizeStart={(e) => e.stopPropagation()} // Prevent stage deselect on resize start
                onDragStop={(_e, d) => handleDragStop(layer.id, d)}
                onResizeStop={(e, dir, ref, delta, pos) =>
                  handleResizeStop(layer.id, e, dir, ref, delta, pos)
                }
                onClick={
                  (e: React.MouseEvent | React.TouchEvent) =>
                    handleLayerClick(e, layer.id) // Use specific click handler
                }
                bounds="parent" // Keep bounds to parent stage
                lockAspectRatio={true}
                // minWidth/minHeight can be set based on layout scale if needed
                // minWidth={10 / layout.scale}
                // minHeight={10 / layout.scale}
              >
                {/* Label for the layer */}
                <div
                  className={`absolute -top-5 left-1/2 -translate-x-1/2 w-max pointer-events-none transition-opacity duration-200 ${
                    isSelected
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-90"
                  }`}
                  style={{ zIndex: 51 }} // Ensure label is above the box outline/border
                >
                  <span
                    className={cn(
                      "text-white text-xs px-1.5 py-0.5 rounded bg-primary"
                    )}
                  >
                    {capitalize(layer.id)}
                  </span>
                </div>
              </Rnd>
            );
          })}
    </div>
  );
};

export default VideoStage;
