import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useRef } from "react";

interface VideoInputProps {
  onVideoSelect: (file: File) => void;
  // TODO: Add props for Twitch URL handling if needed later
}

const VideoInput: React.FC<VideoInputProps> = ({ onVideoSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onVideoSelect(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="video-upload">Upload Video</Label>
        <Input
          id="video-upload"
          type="file"
          accept="video/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden" // Hide default input, use button instead
        />
        <Button
          onClick={handleButtonClick}
          variant="outline"
          className="w-full mt-2"
        >
          Choose File
        </Button>
      </div>
      {/* Placeholder for Twitch Input */}
      {/*
       <div>
         <Label htmlFor="twitch-url">Or Twitch VOD/Clip URL</Label>
         <Input id="twitch-url" type="text" placeholder="Enter Twitch URL..." disabled />
         <Button className="mt-2 w-full" disabled>Load Twitch Video</Button>
       </div>
       */}
    </div>
  );
};

export default VideoInput;
