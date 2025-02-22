
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { espApi } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Youtube } from "lucide-react";

const Index = () => {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [channelId, setChannelId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Set base URL to the ESP device's AP address
      espApi.setBaseUrl("http://192.168.4.1");

      // Update WiFi settings
      await espApi.updateWiFi(ssid, password);
      
      // Update YouTube channel
      await espApi.updateYoutubeChannel(channelId);
      
      toast({
        title: "Success!",
        description: "Device configured successfully. Please wait while it connects to your network.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to configure device. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            YouTube Tracker Setup
          </h1>
          <p className="mt-2 text-gray-600">
            Configure your device to track subscriber count
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Wifi className="h-5 w-5" />
              Network Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="ssid" className="text-sm font-medium">
                  WiFi Network Name
                </label>
                <Input
                  id="ssid"
                  placeholder="Enter your WiFi network name"
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  WiFi Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your WiFi password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="channelId" className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Youtube className="h-5 w-5" />
                    YouTube Channel ID
                  </div>
                </label>
                <Input
                  id="channelId"
                  placeholder="Enter YouTube channel ID"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Configuring..." : "Configure Device"}
              </Button>

              <p className="text-center text-sm text-gray-500">
                After configuration, the device will connect to your WiFi network
                and begin tracking subscribers.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
