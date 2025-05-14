import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  onClipCreate?: () => void;
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

  return (
    <Card className="h-full max-h-[calc(100vh-10rem)] overflow-y-auto border-l pt-0 pb-0">
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
          {/* Add more output options here in the future */}
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
        <Separator className="mb-0" />
        <div className="sticky bottom-0 bg-white/90 py-8 backdrop-blur-sm z-10 outline-white outline-4">
          <h3 className="text-sm font-medium flex items-center mb-2">
            <Scissors className="mr-2 h-4 w-4 text-muted-foreground" />
            Actions
          </h3>
          <Button
            className="w-full text-base py-3" // Slightly larger
            size="lg"
            disabled={
              disabled ||
              !Object.values(layers).some((l) => l.visible) ||
              isClipping
            }
            onClick={onClipCreate}
            variant="default" // Make it primary
          >
            {isClipping ? "Processing..." : "Create Clip"}
            {!isClipping && <Scissors className="ml-2 h-5 w-5" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsPanel;
