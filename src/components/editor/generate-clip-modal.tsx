import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { clipCreateSchema, ClipCreateValues, LayerState } from "@/types/editor";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilRulerIcon, Scissors } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface GenerateClipModalProps {
  disabled?: boolean;
  layers: Record<string, LayerState>;
  isClipping?: boolean;
  onClipCreate?: (clipData: ClipCreateValues) => void;
}

export function GenerateClipModal({
  disabled,
  layers,
  isClipping,
  onClipCreate,
}: GenerateClipModalProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<ClipCreateValues>({
    resolver: zodResolver(clipCreateSchema),
    defaultValues: {
      title: "",
      isPublic: true,
    },
  });

  const onSubmit = (data: ClipCreateValues) => {
    if (onClipCreate) onClipCreate(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full text-base py-3"
          size="lg"
          disabled={
            disabled ||
            !Object.values(layers).some((l) => l.visible) ||
            isClipping
          }
        >
          {!isClipping && <Scissors className="mr-2 h-5 w-5" />}
          {isClipping ? "Processing..." : "Create Clip"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Clip</DialogTitle>
          <DialogDescription>
            Complete the clip generation process.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Clip Title" {...field} />
                  </FormControl>
                  <FormDescription>
                    A short description for your clip.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Make clip public</FormLabel>
                </FormItem>
              )}
            />
            <div className="flex justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="min-w-40"
              >
                <PencilRulerIcon className="h-5 w-5" />
                Continue Editing
              </Button>
              <Button type="submit" disabled={isClipping} className="min-w-40">
                <Scissors className="h-5 w-5" />
                Generate Clip
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
