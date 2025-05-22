import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  ClipCreateValues,
  type LayerState,
  LayoutGroups,
  type LayoutVariant,
  LayoutVariantNames,
  type OutputOptions,
} from "@/types/editor";
import {
  Layers,
  LayoutGrid,
  ListFilter,
  Scissors,
  SettingsIcon,
} from "lucide-react"; // Added icons
import React from "react";
import { GenerateClipModal } from "./generate-clip-modal";
import LayerControl from "./layer-control";

interface SettingsPanelProps {
  outputLayout: LayoutVariant;
  outputOptions: OutputOptions;
  onLayoutChange: (layout: LayoutVariant) => void;
  onOutputOptionsChange: (options: Partial<OutputOptions>) => void;
  layers: Record<LayerState["id"], LayerState>;
  selectedLayerId: LayerState["id"] | null;
  onLayerUpdate: (id: LayerState["id"], newProps: Partial<LayerState>) => void;
  onLayerSelect: (id: LayerState["id"] | null) => void; // Allow null for deselection
  disabled?: boolean;
  onClipCreate?: (clipData: ClipCreateValues) => void;
  isClipping?: boolean; // Added for button state
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  outputLayout,
  outputOptions,
  onLayoutChange,
  onOutputOptionsChange,
  layers,
  selectedLayerId,
  onLayerUpdate,
  onLayerSelect,
  disabled,
  onClipCreate,
  isClipping,
}) => {
  const handleBlurBgChange = (checked: boolean) => {
    onOutputOptionsChange({ addBlurredBackground: checked });
  };

  const handleGenerateSubtitlesChange = (checked: boolean) => {
    onOutputOptionsChange({ addAiSubtitles: checked });
  };

  return (
    <Card className="h-full max-h-[calc(100vh-9.5rem)] overflow-y-auto border-l pt-0 pb-0 mt-4">
      {/* Subtle background, shadow */}
      <CardHeader className="sticky top-0 bg-card/80 backdrop-blur-sm z-10 border-b px-4 pt-4 !pb-2">
        {/* Sticky header */}
        <CardTitle className="flex items-center text-xl">
          <SettingsIcon className="mr-2 h-6 w-6 text-primary" />
          Settings & Layers
        </CardTitle>
      </CardHeader>
      <CardContent
        className={`p-4 space-y-6 pb-0 ${
          // Consistent padding
          disabled ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <div>
          <Label
            htmlFor="output-layout"
            className="text-sm font-medium flex items-center mb-1.5"
          >
            <LayoutGrid className="mr-2 h-4 w-4 text-muted-foreground" />
            Output Layout
          </Label>
          <Select
            value={outputLayout}
            onValueChange={(value) => onLayoutChange(value as LayoutVariant)}
            disabled={disabled}
          >
            <SelectTrigger id="output-layout" className="w-full">
              <SelectValue placeholder="Select layout..." />
            </SelectTrigger>
            <SelectContent>
              {LayoutGroups.map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.variants.map((variant) => (
                    <SelectItem key={variant} value={variant}>
                      {LayoutVariantNames[variant]}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium flex items-center mb-2">
            <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
            Output Options
          </h3>
          <div className="flex items-center justify-between space-x-2 p-3 rounded-md border bg-background/50">
            <div>
              <Label htmlFor="blur-bg" className="cursor-pointer flex-grow">
                Blurred Background
              </Label>
              <p className="text-[10px] text-muted-foreground">
                Adds a blurred version of the main content as background.
              </p>
            </div>
            <Switch
              id="blur-bg"
              checked={outputOptions.addBlurredBackground}
              onCheckedChange={handleBlurBgChange}
              disabled={disabled}
            />
          </div>
          <div className="flex items-center justify-between space-x-2 p-3 rounded-md border bg-background/50 mt-2">
            <div>
              <Label
                htmlFor="generate-subtitles"
                className="cursor-pointer flex-grow"
              >
                Generate Subtitles
              </Label>
              <p className="text-[10px] text-muted-foreground">
                Generates subtitles for the clip using AI.
              </p>
            </div>
            <Switch
              id="generate-subtitles"
              checked={outputOptions.addAiSubtitles}
              onCheckedChange={handleGenerateSubtitlesChange}
              disabled={disabled}
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium flex items-center mb-2">
            <Layers className="mr-2 h-4 w-4 text-muted-foreground" />
            Input Layers
          </h3>
          {Object.keys(layers).length > 0 ? (
            Object.values(layers)
              .sort((a, b) => a.zIndex - b.zIndex) // Sort by zIndex for intuitive order
              .map((layer) => (
                <LayerControl
                  key={layer.id}
                  layer={layer}
                  isSelected={selectedLayerId === layer.id}
                  onUpdate={onLayerUpdate}
                  onSelect={onLayerSelect}
                  disabled={disabled}
                />
              ))
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Load a video to see and manage layers.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="sticky bottom-0 bg-card/30 py-4 backdrop-blur-sm z-10 outline-card outline-4 flex flex-col items-start">
        <h3 className="text-sm font-medium flex items-center mb-2">
          <Scissors className="mr-2 h-4 w-4 text-muted-foreground" />
          Actions
        </h3>
        <GenerateClipModal
          disabled={disabled}
          layers={layers}
          isClipping={isClipping}
          onClipCreate={onClipCreate}
        />
      </CardFooter>
    </Card>
  );
};

export default SettingsPanel;
