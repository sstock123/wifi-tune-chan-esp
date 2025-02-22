
import { useState } from "react";
import ConfigCard from "@/components/ConfigCard";
import StatusIndicator from "@/components/StatusIndicator";
import WiFiForm from "@/components/WiFiForm";
import YoutubeForm from "@/components/YoutubeForm";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [deviceStatus, setDeviceStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("disconnected");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleWiFiSubmit = async (ssid: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual API call to ESP device
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulated delay
      toast({
        title: "Success",
        description: "WiFi settings updated successfully",
      });
      setDeviceStatus("connected");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update WiFi settings",
        variant: "destructive",
      });
      setDeviceStatus("disconnected");
    } finally {
      setIsLoading(false);
    }
  };

  const handleYoutubeSubmit = async (channelId: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual API call to ESP device
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulated delay
      toast({
        title: "Success",
        description: "YouTube channel ID updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update YouTube channel ID",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            ESP Device Configuration
          </h1>
          <p className="mt-2 text-gray-600">
            Update your device's WiFi and YouTube settings
          </p>
        </div>

        <StatusIndicator
          status={deviceStatus}
          className="mx-auto w-fit rounded-full bg-white px-4 py-2 shadow-sm"
        />

        <ConfigCard title="WiFi Settings">
          <WiFiForm onSubmit={handleWiFiSubmit} isLoading={isLoading} />
        </ConfigCard>

        <ConfigCard title="YouTube Settings">
          <YoutubeForm onSubmit={handleYoutubeSubmit} isLoading={isLoading} />
        </ConfigCard>
      </div>
    </div>
  );
};

export default Index;
