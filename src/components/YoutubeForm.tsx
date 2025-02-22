
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface YoutubeFormProps {
  onSubmit: (channelId: string) => void;
  isLoading?: boolean;
}

const YoutubeForm = ({ onSubmit, isLoading }: YoutubeFormProps) => {
  const [channelId, setChannelId] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelId) {
      toast({
        title: "Error",
        description: "Please enter a channel ID",
        variant: "destructive",
      });
      return;
    }
    onSubmit(channelId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="channelId" className="text-sm font-medium">
          YouTube Channel ID
        </label>
        <Input
          id="channelId"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
          placeholder="Enter YouTube channel ID"
          className="w-full"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        variant="default"
      >
        {isLoading ? "Updating..." : "Update Channel ID"}
      </Button>
    </form>
  );
};

export default YoutubeForm;
