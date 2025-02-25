
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { espApi } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Youtube, CheckCircle, XCircle, Sparkles, Search } from "lucide-react";
import confetti from "canvas-confetti";

interface Network {
  ssid: string;
  strength: number;
}

const Index = () => {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [selectedSsid, setSelectedSsid] = useState("");
  const [password, setPassword] = useState("");
  const [channelId, setChannelId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [wifiVerified, setWifiVerified] = useState<boolean | null>(null);
  const [channelVerified, setChannelVerified] = useState<boolean | null>(null);
  const { toast } = useToast();

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const scanNetworks = async () => {
    setIsScanning(true);
    try {
      const response = await espApi.scanNetworks();
      setNetworks(response);
      toast({
        title: "Scan Complete",
        description: `Found ${response.length} networks`,
      });
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Could not scan for networks",
        variant: "destructive",
      });
    }
    setIsScanning(false);
  };

  const verifyWiFi = async () => {
    try {
      const isVerified = await espApi.verifyWiFi();
      setWifiVerified(isVerified);
      
      if (isVerified) {
        triggerConfetti();
      }
      
      toast({
        title: isVerified ? "WiFi Connected!" : "WiFi Connection Failed",
        description: isVerified 
          ? "Successfully connected to the network" 
          : "Could not connect to the network. Please check your credentials.",
        variant: isVerified ? "default" : "destructive",
      });
      
      return isVerified;
    } catch (error) {
      setWifiVerified(false);
      return false;
    }
  };

  const verifyChannel = async () => {
    try {
      const isVerified = await espApi.verifyYoutubeChannel(channelId);
      setChannelVerified(isVerified);
      
      if (isVerified) {
        triggerConfetti();
      }
      
      toast({
        title: isVerified ? "Channel Verified!" : "Channel Verification Failed",
        description: isVerified 
          ? "Successfully verified YouTube channel" 
          : "Could not verify the channel. Please check the ID.",
        variant: isVerified ? "default" : "destructive",
      });
      
      return isVerified;
    } catch (error) {
      setChannelVerified(false);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Set base URL to the ESP device's AP address
      espApi.setBaseUrl("http://192.168.4.1");

      // Update and verify WiFi settings
      await espApi.updateWiFi(selectedSsid, password);
      const wifiOk = await verifyWiFi();
      if (!wifiOk) {
        throw new Error("WiFi verification failed");
      }
      
      // Update and verify YouTube channel
      await espApi.updateYoutubeChannel(channelId);
      const channelOk = await verifyChannel();
      if (!channelOk) {
        throw new Error("Channel verification failed");
      }
      
      // Final success celebration
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 }
        });
      }, 300);

      toast({
        title: "Success!",
        description: "Device configured successfully. Your subscriber count will now be tracked.",
      });
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Could not complete the setup. Please check your settings and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const StatusIcon = ({ verified }: { verified: boolean | null }) => {
    if (verified === null) return null;
    return verified ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="mx-auto max-w-md space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">
            YouTube Tracker Setup
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Configure your device to track your subscriber count
          </p>
          
          <Button
            onClick={triggerConfetti}
            variant="outline"
            className="mt-4 border-zinc-700 bg-zinc-800/50 text-white hover:bg-zinc-700"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Test Confetti Effect
          </Button>
        </div>

        <Card className="border-zinc-800 bg-zinc-800/50 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Wifi className="h-4 w-4" />
              Network Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="network" className="text-sm font-medium text-zinc-300">
                  WiFi Network
                </label>
                <div className="flex items-center gap-2">
                  <select
                    id="network"
                    value={selectedSsid}
                    onChange={(e) => setSelectedSsid(e.target.value)}
                    className="w-full h-9 rounded-md border border-zinc-700 bg-zinc-800/50 text-white px-3 focus:outline-none focus:ring-2 focus:ring-zinc-600"
                  >
                    <option value="">Select a network...</option>
                    {networks.map((network, index) => (
                      <option key={index} value={network.ssid}>
                        {network.ssid} ({network.strength}%)
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    onClick={scanNetworks}
                    disabled={isScanning}
                    variant="outline"
                    className="border-zinc-700 bg-zinc-800/50 text-white hover:bg-zinc-700"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                  <StatusIcon verified={wifiVerified} />
                </div>
              </div>

              {selectedSsid && (
                <div className="space-y-1 animate-fade-up">
                  <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                    WiFi Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-9 border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="channelId" className="text-sm font-medium text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Youtube className="h-4 w-4" />
                    YouTube Channel ID
                  </div>
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    id="channelId"
                    placeholder="Enter channel ID"
                    value={channelId}
                    onChange={(e) => setChannelId(e.target.value)}
                    required
                    className="h-9 border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500"
                  />
                  <StatusIcon verified={channelVerified} />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-9 text-sm bg-white text-zinc-900 hover:bg-zinc-200"
                disabled={isLoading || !selectedSsid}
              >
                {isLoading ? "Configuring..." : "Configure Device"}
              </Button>

              <p className="text-xs text-center text-zinc-500 mt-2">
                Device will connect to WiFi after configuration
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
