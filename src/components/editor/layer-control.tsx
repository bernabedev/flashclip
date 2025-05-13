import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { capitalize } from "@/lib/utils";
import type { LayerState } from "@/types/editor";
import { Eye, EyeOff } from "lucide-react";
import React from "react";

interface LayerControlProps {
  layer: LayerState;
  isSelected: boolean;
  onUpdate: (id: LayerState["id"], newProps: Partial<LayerState>) => void;
  onSelect: (id: LayerState["id"]) => void;
  disabled?: boolean;
}

const LayerControl: React.FC<LayerControlProps> = ({
  layer,
  isSelected,
  onUpdate,
  onSelect,
  disabled,
}) => {
  const handleValueChange = (
    key: keyof LayerState,
    value: number | string | boolean
  ) => {
    let updateValue: number | boolean;
    if (typeof value === "boolean") {
      updateValue = value;
    } else {
      const numericValue =
        typeof value === "string" ? parseFloat(value) : value;
      if (isNaN(numericValue)) return;
      updateValue = numericValue;
    }
    onUpdate(layer.id, { [key]: updateValue });
  };

  const handleVisibilityToggle = (checked: boolean) => {
    handleValueChange("visible", checked);
  };

  return (
    <Card
      className={`mb-4 transition-all ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${isSelected ? "border-primary ring-2 ring-primary" : "border-border"}`}
      onClick={() => !disabled && onSelect(layer.id)}
    >
      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">{capitalize(layer.id)}</CardTitle>
        <div className="flex items-center space-x-2">
          {layer.visible ? (
            <Eye className="h-4 w-4 text-green-500" />
          ) : (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          )}
          <Switch
            id={`${layer.id}-visible`}
            checked={layer.visible}
            onCheckedChange={handleVisibilityToggle}
            disabled={disabled}
            aria-label={`Toggle ${layer.id} layer visibility`}
          />
        </div>
      </CardHeader>
      {isSelected && !disabled && (
        <CardContent className="p-4 pt-0 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor={`${layer.id}-x`}>X</Label>
              <Input
                id={`${layer.id}-x`}
                type="number"
                value={layer.x.toFixed(0)}
                onChange={(e) => handleValueChange("x", e.target.value)}
                disabled={disabled}
              />
            </div>
            <div>
              <Label htmlFor={`${layer.id}-y`}>Y</Label>
              <Input
                id={`${layer.id}-y`}
                type="number"
                value={layer.y.toFixed(0)}
                onChange={(e) => handleValueChange("y", e.target.value)}
                disabled={disabled}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor={`${layer.id}-width`}>Width</Label>
              <Input
                id={`${layer.id}-width`}
                type="number"
                value={layer.width.toFixed(0)}
                min={1}
                onChange={(e) => handleValueChange("width", e.target.value)}
                disabled={disabled}
              />
            </div>
            <div>
              <Label htmlFor={`${layer.id}-height`}>Height</Label>
              <Input
                id={`${layer.id}-height`}
                type="number"
                value={layer.height.toFixed(0)}
                min={1}
                onChange={(e) => handleValueChange("height", e.target.value)}
                disabled={disabled}
              />
            </div>
          </div>
          <div>
            <Label htmlFor={`${layer.id}-rotation`}>
              Rotation ({layer.rotation.toFixed(0)}°)
            </Label>
            <Slider
              id={`${layer.id}-rotation`}
              min={-180}
              max={180}
              step={1}
              value={[layer.rotation]}
              onValueChange={(value) => handleValueChange("rotation", value[0])}
              className="my-2"
              disabled={disabled}
            />
          </div>
          <div>
            <Label htmlFor={`${layer.id}-zindex`}>Stack Order (z)</Label>
            <Input
              id={`${layer.id}-zindex`}
              type="number"
              step={1}
              value={layer.zIndex}
              onChange={(e) => handleValueChange("zIndex", e.target.value)}
              disabled={disabled}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default LayerControl;
