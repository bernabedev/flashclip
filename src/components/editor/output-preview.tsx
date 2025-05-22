import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  type LayerState,
  LayoutAspectRatios,
  type LayoutVariant,
  type OutputOptions,
} from "@/types/editor";
import React, { useCallback, useEffect, useRef } from "react";
import { Card } from "../ui/card";

interface OutputPreviewProps {
  layout: LayoutVariant;
  outputOptions: OutputOptions;
  sourceVideoElement: HTMLVideoElement | null;
  layers: Record<LayerState["id"], LayerState>;
  inputVideoDimensions: { width: number; height: number } | null;
  isPlaying: boolean;
  currentTime: number;
  isVideoReady: boolean;
}

const TIKTOK_CAM_HEIGHT_RATIO = 0.25;
const YOUTUBE_PIP_WIDTH_RATIO = 0.25;
const PIP_PADDING_RATIO = 0.02;
const BLUR_AMOUNT = 10; // px
const BLUR_BRIGHTNESS = 0.6; // 60% brightness

const OutputPreview: React.FC<OutputPreviewProps> = ({
  layout,
  outputOptions,
  sourceVideoElement,
  layers,
  inputVideoDimensions,
  isPlaying,
  currentTime,
  isVideoReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const video = sourceVideoElement;
    const canDraw =
      isVideoReady &&
      ctx &&
      canvas &&
      video &&
      inputVideoDimensions &&
      video.videoWidth > 0 &&
      video.videoHeight > 0;

    if (!canDraw) {
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const dpr = window.devicePixelRatio || 1;
        const baseFontSize = 14;
        ctx.font = `${baseFontSize * dpr}px sans-serif`;
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          "Waiting for video...",
          canvas.width / 2,
          canvas.height / 2
        );
      }
      if (isPlaying && canvasRef.current) {
        animationFrameId.current = requestAnimationFrame(drawFrame);
      } else if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const canvasWidthCss = canvas.width / dpr;
    const canvasHeightCss = canvas.height / dpr;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- Draw Blurred Background if enabled ---
    if (outputOptions.addBlurredBackground) {
      ctx.save();
      // Calculate scaling to cover canvas while maintaining video aspect ratio
      const videoAspect = video.videoWidth / video.videoHeight;
      const canvasAspect = canvasWidthCss / canvasHeightCss;
      let drawWidth, drawHeight, offsetX, offsetY;

      if (canvasAspect > videoAspect) {
        // Canvas is wider than video
        drawWidth = canvasWidthCss;
        drawHeight = canvasWidthCss / videoAspect;
        offsetX = 0;
        offsetY = (canvasHeightCss - drawHeight) / 2; // Center vertically
      } else {
        // Canvas is taller or same aspect as video
        drawHeight = canvasHeightCss;
        drawWidth = canvasHeightCss * videoAspect;
        offsetY = 0;
        offsetX = (canvasWidthCss - drawWidth) / 2; // Center horizontally
      }

      // Apply filter
      ctx.filter = `blur(${BLUR_AMOUNT}px) brightness(${BLUR_BRIGHTNESS})`;
      // Draw scaled video to cover canvas
      ctx.drawImage(
        video,
        0,
        0,
        video.videoWidth,
        video.videoHeight,
        offsetX * dpr,
        offsetY * dpr,
        drawWidth * dpr,
        drawHeight * dpr
      );
      // Reset filter for subsequent draws
      ctx.filter = "none";
      ctx.restore();
    }
    // --- End Blurred Background ---

    const drawLayer = (
      layerId: "content" | "camera",
      destRect: { x: number; y: number; w: number; h: number }
    ) => {
      const layerState = layers[layerId];
      if (!layerState || !layerState.visible) return;
      if (
        layerState.width <= 0 ||
        layerState.height <= 0 ||
        video.videoWidth === 0 ||
        video.videoHeight === 0
      )
        return;

      const sx = layerState.x;
      const sy = layerState.y;
      const sw = layerState.width;
      const sh = layerState.height;
      const dx = destRect.x;
      const dy = destRect.y;
      const dw = destRect.w;
      const dh = destRect.h;

      ctx.save();
      const centerX = dx + dw / 2;
      const centerY = dy + dh / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate((layerState.rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);

      const sourceXValid = sx >= 0 && sx < video.videoWidth;
      const sourceYValid = sy >= 0 && sy < video.videoHeight;
      const sourceWValid = sx + sw <= video.videoWidth + 0.01;
      const sourceHValid = sy + sh <= video.videoHeight + 0.01;

      if (!sourceXValid || !sourceYValid || !sourceWValid || !sourceHValid) {
        console.warn(`Layer '${layerId}' source rect out of bounds:`, {
          sx,
          sy,
          sw,
          sh,
          videoW: video.videoWidth,
          videoH: video.videoHeight,
        });
        ctx.restore();
        return;
      }

      try {
        ctx.drawImage(video, sx, sy, sw, sh, dx, dy, dw, dh);
      } catch (e) {
        console.error(`Error drawing layer ${layerId}:`, e, {
          sx,
          sy,
          sw,
          sh,
          dx,
          dy,
          dw,
          dh,
        });
      }
      ctx.restore();
    };

    let contentRect: { x: number; y: number; w: number; h: number } | null =
      null;
    let cameraRect: { x: number; y: number; w: number; h: number } | null =
      null;
    const backgroundLayerId: LayerState["id"] =
      layers.content.zIndex < layers.camera.zIndex ? "content" : "camera";

    switch (layout) {
      case "tiktok-cam-top":
        if (layers.camera.visible) {
          const camTopH = canvasHeightCss * TIKTOK_CAM_HEIGHT_RATIO;
          cameraRect = { x: 0, y: 0, w: canvasWidthCss, h: camTopH };
        }
        if (layers.content.visible) {
          const camTopH = layers.camera.visible
            ? canvasHeightCss * TIKTOK_CAM_HEIGHT_RATIO
            : 0;
          contentRect = {
            x: 0,
            y: camTopH,
            w: canvasWidthCss,
            h: canvasHeightCss - camTopH,
          };
        }
        break;
      case "tiktok-cam-bottom":
        if (layers.content.visible) {
          const camBottomH = layers.camera.visible
            ? canvasHeightCss * TIKTOK_CAM_HEIGHT_RATIO
            : 0;
          contentRect = {
            x: 0,
            y: 0,
            w: canvasWidthCss,
            h: canvasHeightCss - camBottomH,
          };
        }
        if (layers.camera.visible) {
          const camBottomH = canvasHeightCss * TIKTOK_CAM_HEIGHT_RATIO;
          cameraRect = {
            x: 0,
            y: canvasHeightCss - camBottomH,
            w: canvasWidthCss,
            h: camBottomH,
          };
        }
        break;
      case "tiktok-content-only":
      case "other-9:16":
        if (layers.content.visible) {
          contentRect = { x: 0, y: 0, w: canvasWidthCss, h: canvasHeightCss };
        }
        break;
      case "youtube-pip-tl":
      case "youtube-pip-tr":
      case "youtube-pip-bl":
      case "youtube-pip-br":
      case "youtube-content-only":
      case "other-16:9":
        if (layers.content.visible) {
          contentRect = { x: 0, y: 0, w: canvasWidthCss, h: canvasHeightCss };
        }
        if (
          layout !== "youtube-content-only" &&
          layout !== "other-16:9" &&
          layers.camera.visible
        ) {
          const padding =
            Math.min(canvasWidthCss, canvasHeightCss) * PIP_PADDING_RATIO;
          const pipW = canvasWidthCss * YOUTUBE_PIP_WIDTH_RATIO;
          const camAspect = layers.camera.width / layers.camera.height;
          const pipH =
            !isNaN(camAspect) && camAspect > 0
              ? pipW / camAspect
              : (pipW / 16) * 9;
          let pipX = 0;
          let pipY = 0;
          if (layout === "youtube-pip-tl") {
            pipX = padding;
            pipY = padding;
          } else if (layout === "youtube-pip-tr") {
            pipX = canvasWidthCss - pipW - padding;
            pipY = padding;
          } else if (layout === "youtube-pip-bl") {
            pipX = padding;
            pipY = canvasHeightCss - pipH - padding;
          } else if (layout === "youtube-pip-br") {
            pipX = canvasWidthCss - pipW - padding;
            pipY = canvasHeightCss - pipH - padding;
          }
          cameraRect = { x: pipX, y: pipY, w: pipW, h: pipH };
        }
        break;
      case "square-content-only":
        if (layers.content.visible) {
          contentRect = { x: 0, y: 0, w: canvasWidthCss, h: canvasHeightCss };
        }
        break;
      default:
        if (layers.content.visible) {
          contentRect = { x: 0, y: 0, w: canvasWidthCss, h: canvasHeightCss };
        }
    }

    const scaleRect = (
      rect: { x: number; y: number; w: number; h: number } | null
    ) => {
      if (!rect) return null;
      return {
        x: rect.x * dpr,
        y: rect.y * dpr,
        w: rect.w * dpr,
        h: rect.h * dpr,
      };
    };
    const scaledContentRect = scaleRect(contentRect);
    const scaledCameraRect = scaleRect(cameraRect);

    if (backgroundLayerId === "content") {
      if (scaledContentRect) drawLayer("content", scaledContentRect);
      if (scaledCameraRect) drawLayer("camera", scaledCameraRect);
    } else {
      if (scaledCameraRect) drawLayer("camera", scaledCameraRect);
      if (scaledContentRect) drawLayer("content", scaledContentRect);
    }

    if (isPlaying) {
      animationFrameId.current = requestAnimationFrame(drawFrame);
    }
  }, [
    sourceVideoElement,
    layers,
    inputVideoDimensions,
    isPlaying,
    layout,
    isVideoReady,
    outputOptions,
  ]); // Added outputOptions

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      const aspectRatio = LayoutAspectRatios[layout];
      let canvasWidth, canvasHeight;
      const containerAspect = width / height;
      if (containerAspect > aspectRatio) {
        canvasHeight = height;
        canvasWidth = height * aspectRatio;
      } else {
        canvasWidth = width;
        canvasHeight = width / aspectRatio;
      }
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvasWidth * dpr);
      canvas.height = Math.round(canvasHeight * dpr);
      const ctx = canvas.getContext("2d");
      ctx?.resetTransform();
      ctx?.scale(dpr, dpr);
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      requestAnimationFrame(drawFrame);
    });
    resizeObserver.observe(container);
    requestAnimationFrame(drawFrame);
    return () => {
      resizeObserver.disconnect();
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    };
  }, [layout, drawFrame, isVideoReady]);

  useEffect(() => {
    if (isPlaying && isVideoReady) {
      if (!animationFrameId.current) {
        animationFrameId.current = requestAnimationFrame(drawFrame);
      }
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      requestAnimationFrame(drawFrame);
    }
    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    };
  }, [isPlaying, isVideoReady, drawFrame]);

  useEffect(() => {
    if (!isPlaying && isVideoReady && sourceVideoElement) {
      requestAnimationFrame(drawFrame);
    }
  }, [currentTime, isPlaying, isVideoReady, sourceVideoElement, drawFrame]);

  const containerAspectRatio = LayoutAspectRatios[layout];
  return (
    <Card
      ref={containerRef}
      className="w-full p-2 flex items-center justify-center overflow-hidden rounded-xl"
    >
      <AspectRatio
        ratio={containerAspectRatio}
        className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden"
      >
        <canvas ref={canvasRef} className="bg-black" />
      </AspectRatio>
    </Card>
  );
};

export default OutputPreview;
