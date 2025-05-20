import { BASE_URL } from "@/lib/constants";
import { ClipDataToSave } from "@/types/clip";

export const api = {
  clip: {
    get: async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/clips`, {
          credentials: "include",
        });
        const data = await response.json();
        console.log({ data });
        return data;
      } catch (error) {
        console.error("Error fetching clips:", error);
        return [];
      }
    },
    save: async (body: ClipDataToSave) => {
      try {
        const saveResponse = await fetch("/api/clips", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          credentials: "include",
        });

        const saveData = await saveResponse.json();

        if (!saveResponse.ok) {
          throw new Error(
            saveData.message || "Failed to save clip to your account."
          );
        }
      } catch (error) {
        console.error("Error saving clip to DB:", error);
      }
    },
  },
} as const;
