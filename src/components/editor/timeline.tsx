import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play } from "lucide-react";
import React from "react";

interface TimelineProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onSeek: (time: number) => void;
  onPlayPause: () => void;
  disabled?: boolean;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds === Infinity || seconds < 0) return "00:00";
  const date = new Date(0);
  date.setSeconds(seconds);
  const timeString = date.toISOString();
  return timeString.length > 19 && seconds >= 3600
    ? timeString.substr(11, 8)
    : timeString.substr(14, 5);
};

const Timeline: React.FC<TimelineProps> = ({
  currentTime,
  duration,
  isPlaying,
  onSeek,
  onPlayPause,
  disabled = false,
}) => {
  const handleSliderChange = (value: number[]) => {
    if (!disabled) {
      onSeek(value[0]);
    }
  };

  return (
    <div
      className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-card rounded-lg shadow ${
        disabled ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <Button
        onClick={onPlayPause}
        variant="ghost"
        size="icon"
        disabled={disabled}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <Play className="h-4 w-4 sm:h-5 sm:w-5" />
        )}
      </Button>
      <span className="text-xs sm:text-sm font-mono text-muted-foreground min-w-[40px] sm:min-w-[50px] text-center">
        {formatTime(currentTime)}
      </span>
      <Slider
        value={[currentTime]}
        max={duration || 0}
        step={0.1}
        onValueChange={handleSliderChange}
        className="flex-grow cursor-pointer"
        disabled={disabled || duration <= 0}
      />
      <span className="text-xs sm:text-sm font-mono text-muted-foreground min-w-[40px] sm:min-w-[50px] text-center">
        {formatTime(duration)}
      </span>
    </div>
  );
};

export default Timeline;
