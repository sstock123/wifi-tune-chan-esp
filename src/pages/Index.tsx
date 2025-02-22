
import { useState, useEffect } from "react";
import ConfigCard from "@/components/ConfigCard";
import StatusIndicator from "@/components/StatusIndicator";
import WiFiForm from "@/components/WiFiForm";
import YoutubeForm from "@/components/YoutubeForm";
import { useToast } from "@/hooks/use-toast";
import { espApi } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [deviceStatus, setDeviceStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("disconnected");
  const [isLoading, setIsLoading] = useState(false);
  const [deviceIp, setDeviceIp] = useState("");
  const { toast } = useToast();

  const connectToDevice = async (ip: string) => {
    try {
      espApi.setBaseUrl(ip);
      setDeviceStatus("connecting");
      const status = await espApi.getStatus();
      setDeviceStatus(status.wifi_status);
      toast({
        title: "Success",
        description: "Connected to ESP device",
      });
    } catch (error) {
      setDeviceStatus("disconnected");
      toast({
        title: "Error",
        description: "Failed to connect to ESP device",
        variant: "destructive",
      });
    }
  };

  const handleWiFiSubmit = async (ssid: string, password: string) => {
    setIsLoading(true);
    try {
      await espApi.updateWiFi(ssid, password);
      toast({
        title: "Success",
        description: "WiFi settings updated successfully",
      });
      // Wait a bit for the device to reconnect, then check status
      setTimeout(async () => {
        try {
          const status = await espApi.getStatus();
          setDeviceStatus(status.wifi_status);
        } catch (error) {
          setDeviceStatus("disconnected");
        }
      }, 5000);
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
      await espApi.updateYoutubeChannel(channelId);
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

        <ConfigCard title="Device Connection">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter ESP device IP address"
                value={deviceIp}
                onChange={(e) => setDeviceIp(e.target.value)}
              />
              <Button onClick={() => connectToDevice(deviceIp)}>Connect</Button>
            </div>
            <StatusIndicator
              status={deviceStatus}
              className="w-fit rounded-full bg-white px-4 py-2 shadow-sm"
            />
          </div>
        </ConfigCard>

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
