import { create } from "zustand";

type Layer = {
  id: "content" | "camera";
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

type VideoState = {
  videoFile: File | null;
  setVideoFile: (file: File) => void;
  layers: Layer[];
  selectLayer: (id: Layer["id"]) => void;
  updateLayer: (id: Layer["id"], props: Partial<Layer>) => void;
  selectedLayerId: Layer["id"];
};

export const useVideoState = create<VideoState>((set) => ({
  videoFile: null,
  setVideoFile: (file) => set({ videoFile: file }),
  layers: [
    { id: "content", x: 0, y: 0, scale: 1, rotation: 0 },
    { id: "camera", x: 0, y: 0, scale: 1, rotation: 0 },
  ],
  selectedLayerId: "content",
  selectLayer: (id) => set({ selectedLayerId: id }),
  updateLayer: (id, props) =>
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, ...props } : l)),
    })),
}));
