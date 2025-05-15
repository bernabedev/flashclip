import { z } from "zod";

export interface LayerState {
  id: "content" | "camera";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  visible: boolean;
}

export type LayoutVariant =
  | "tiktok-content-only"
  | "tiktok-cam-top"
  | "tiktok-cam-bottom"
  | "youtube-content-only"
  | "youtube-pip-tl"
  | "youtube-pip-tr"
  | "youtube-pip-bl"
  | "youtube-pip-br"
  | "square-content-only"
  | "other-16:9"
  | "other-9:16";

export const LayoutAspectRatios: Record<LayoutVariant, number> = {
  "tiktok-content-only": 9 / 16,
  "tiktok-cam-top": 9 / 16,
  "tiktok-cam-bottom": 9 / 16,
  "youtube-content-only": 16 / 9,
  "youtube-pip-tl": 16 / 9,
  "youtube-pip-tr": 16 / 9,
  "youtube-pip-bl": 16 / 9,
  "youtube-pip-br": 16 / 9,
  "square-content-only": 1 / 1,
  "other-16:9": 16 / 9,
  "other-9:16": 9 / 16,
};

export const LayoutAspectRatiosString: Record<LayoutVariant, string> = {
  "tiktok-content-only": "9 / 16",
  "tiktok-cam-top": "9 / 16",
  "tiktok-cam-bottom": "9 / 16",
  "youtube-content-only": "16 / 9",
  "youtube-pip-tl": "16 / 9",
  "youtube-pip-tr": "16 / 9",
  "youtube-pip-bl": "16 / 9",
  "youtube-pip-br": "16 / 9",
  "square-content-only": "1 / 1",
  "other-16:9": "16 / 9",
  "other-9:16": "9 / 16",
} as const;

export const LayoutVariantNames: Record<LayoutVariant, string> = {
  "tiktok-content-only": "TikTok (Content Only)",
  "tiktok-cam-top": "TikTok (Camera Top)",
  "tiktok-cam-bottom": "TikTok (Camera Bottom)",
  "youtube-content-only": "YouTube (Content Only)",
  "youtube-pip-tl": "YouTube (PiP Top-Left)",
  "youtube-pip-tr": "YouTube (PiP Top-Right)",
  "youtube-pip-bl": "YouTube (PiP Bottom-Left)",
  "youtube-pip-br": "YouTube (PiP Bottom-Right)",
  "square-content-only": "Square (Content Only)",
  "other-16:9": "Landscape (16:9)",
  "other-9:16": "Portrait (9:16)",
};

export const LayoutGroups = [
  {
    label: "TikTok (9:16)",
    variants: [
      "tiktok-cam-top",
      "tiktok-cam-bottom",
      "tiktok-content-only",
      "other-9:16",
    ] as LayoutVariant[],
  },
  {
    label: "YouTube (16:9)",
    variants: [
      "youtube-pip-tl",
      "youtube-pip-tr",
      "youtube-pip-bl",
      "youtube-pip-br",
      "youtube-content-only",
      "other-16:9",
    ] as LayoutVariant[],
  },
  {
    label: "Other",
    variants: ["square-content-only"] as LayoutVariant[],
  },
];

export interface OutputOptions {
  addBlurredBackground: boolean;
}

export const clipCreateSchema = z.object({
  title: z.string().min(1).max(100),
  isPublic: z.boolean(),
});

export type ClipCreateValues = z.infer<typeof clipCreateSchema>;
