import { ClipsTable } from "@/components/dashboard/clips-table";
import { ClipService } from "@/services/db/clips";

export default async function Demos() {
  const clips = await ClipService.getClips();
  return (
    <div>
      <h1 className="text-2xl font-bold">Demos</h1>
      <p className="text-muted-foreground mb-4 text-sm">
        Here you can see some demos of the app.
      </p>
      <div>
        <ClipsTable
          clips={clips.data}
          classNameGrid="xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2"
        />
      </div>
    </div>
  );
}
