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
  onLayerSelect: (id: LayerState["id"]) => void;
  disabled?: boolean;
  onClipCreate?: () => void;
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
}) => {
  const handleBlurBgChange = (checked: boolean) => {
    onOutputOptionsChange({ addBlurredBackground: checked });
  };

  return (
    <Card className={`h-full overflow-y-auto ${disabled ? "bg-muted/50" : ""}`}>
      <CardHeader>
        <CardTitle>Settings & Layers</CardTitle>
      </CardHeader>
      <CardContent
        className={`space-y-6 ${
          disabled ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <div>
          <Label htmlFor="output-layout">Output Layout</Label>
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
          <h3 className="text-lg font-semibold mb-3">Output Options</h3>
          <div className="flex items-center justify-between space-x-2 p-2 rounded-md border">
            <Label htmlFor="blur-bg" className="cursor-pointer">
              Blurred Background
            </Label>
            <Switch
              id="blur-bg"
              checked={outputOptions.addBlurredBackground}
              onCheckedChange={handleBlurBgChange}
              disabled={disabled}
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-3">Input Layers</h3>
          {Object.keys(layers).length > 0 ? (
            Object.values(layers)
              .sort((a, b) => a.id.localeCompare(b.id))
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
            <p className="text-sm text-muted-foreground">
              Load a video to see layers.
            </p>
          )}
        </div>
        <Separator />
        <div>
          <h3 className="text-lg font-semibold mb-3">Actions</h3>
          <Button
            className="w-full"
            disabled={disabled || !Object.values(layers).some((l) => l.visible)}
            onClick={onClipCreate}
          >
            Create Clip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsPanel;
