import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { espApi } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Wifi, Youtube, CheckCircle, XCircle, Search, ArrowLeft, Eye, EyeOff } from "lucide-react";
import confetti from "canvas-confetti";

interface Network {
  ssid: string;
  strength: number;
  channel: number;
}

interface YouTubeChannel {
  id: string;
  title: string;
  thumbnail: string;
}

const Index = () => {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [selectedSsid, setSelectedSsid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [channelId, setChannelId] = useState("");
  const [channelSearch, setChannelSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundChannel, setFoundChannel] = useState<YouTubeChannel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [wifiVerified, setWifiVerified] = useState<boolean | null>(null);
  const [channelVerified, setChannelVerified] = useState<boolean | null>(null);
  const [showNetworks, setShowNetworks] = useState(false);
  const [showWifiStep, setShowWifiStep] = useState(true);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [searchResults, setSearchResults] = useState<YouTubeChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<YouTubeChannel | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  const searchYouTubeChannel = async () => {
    if (!channelSearch.trim()) return;
    
    setIsSearching(true);
    setSelectedChannel(null);
    try {
      const channel = await espApi.searchYouTubeChannel(channelSearch);
      if (channel) {
        setSearchResults([channel]);
        toast({
          title: "Channels Found!",
          description: "Click on a channel to select it",
        });
      } else {
        setSearchResults([]);
        toast({
          title: "Channel Not Found",
          description: "Could not find a channel with that username or URL",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Could not search for YouTube channel",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
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

  const handleWiFiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      espApi.setBaseUrl("http://192.168.4.1");
      await espApi.updateWiFi(selectedSsid, password);
      const wifiOk = await verifyWiFi();
      
      if (!wifiOk) {
        throw new Error("WiFi verification failed");
      }

      toast({
        title: "WiFi Connected!",
        description: "Your device is now online. You can now search for your YouTube channel.",
      });
      
      setIsTransitioning(true);
      setTimeout(() => {
        setShowWifiStep(false);
        setIsTransitioning(false);
      }, 600);
      
      espApi.setBaseUrl("192.168.1.1");
      setShowPasswordDialog(false);
      
    } catch (error) {
      toast({
        title: "WiFi Setup Failed",
        description: "Could not connect to WiFi. Please check your settings and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNetworkSelect = (network: Network) => {
    setSelectedSsid(network.ssid);
    setPassword("");
    setShowPassword(false);
    setWifiVerified(null);
    setShowPasswordDialog(true);
  };

  const handleChannelSelect = (channel: YouTubeChannel) => {
    if (selectedChannel?.id === channel.id) {
      setSelectedChannel(null);
      setChannelSearch('');
      setChannelId('');
      setFoundChannel(null);
    } else {
      setSelectedChannel(channel);
      setChannelSearch(channel.title);
      setChannelId(channel.id);
      setFoundChannel(channel);
    }
  };

  const handleChannelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await espApi.updateYoutubeChannel(channelId);
      const channelOk = await verifyChannel();
      if (!channelOk) {
        throw new Error("Channel verification failed");
      }
      
      triggerConfetti();
      setShowCompletionDialog(true);

    } catch (error) {
      toast({
        title: "Channel Setup Failed",
        description: "Could not setup the YouTube channel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartScan = async () => {
    await scanNetworks();
  };

  const handleBackToWifi = () => {
    setShowWifiStep(true);
    setWifiVerified(null);
    setSelectedSsid("");
    setPassword("");
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
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-md space-y-4">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Youtube className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              Subscriber Tracker
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure your device to track your subscriber count
          </p>
        </div>

        {showWifiStep ? (
          <Card className={`${isTransitioning ? 'animate-slide-down' : ''}`}>
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  Step 1: WiFi Setup
                </div>
                {wifiVerified === true && (
                  <CheckCircle className="h-5 w-5 text-green-500 animate-fade-in" />
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Only showing 2.4GHz networks</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    WiFi Network
                  </label>
                  <Button
                    type="button"
                    onClick={handleStartScan}
                    disabled={isScanning}
                    variant="outline"
                    className="w-full"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {isScanning ? "Searching..." : networks.length ? "Search Again" : "Search for Networks"}
                  </Button>
                </div>

                {networks.length > 0 && (
                  <div className="space-y-2 animate-fade-up">
                    {networks.map((network, index) => (
                      <div
                        key={index}
                        onClick={() => handleNetworkSelect(network)}
                        className="p-3 rounded-md hover:bg-muted transition-colors cursor-pointer border border-input"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleNetworkSelect(network);
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Wifi className={`h-5 w-5 ${network.strength > 70 ? 'text-green-500' : network.strength > 40 ? 'text-yellow-500' : 'text-red-500'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {network.ssid}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Signal: {network.strength}% - Channel: {network.channel}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="animate-slide-up">
            <CardHeader className="space-y-1 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Step 1</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="text-muted-foreground mx-2">→</span>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Youtube className="h-4 w-4" />
                    Step 2: YouTube Channel
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToWifi}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to WiFi
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChannelSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="channelSearch" className="text-sm font-medium">
                    Search YouTube Channel
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="channelSearch"
                      placeholder="Enter channel username, URL, or email"
                      value={channelSearch}
                      onChange={(e) => {
                        setChannelSearch(e.target.value);
                        if (selectedChannel) {
                          setSelectedChannel(null);
                          setChannelId('');
                        }
                      }}
                      className="h-9"
                    />
                    <Button
                      type="button"
                      onClick={searchYouTubeChannel}
                      disabled={isSearching || !channelSearch.trim()}
                      className="h-9"
                    >
                      {isSearching ? (
                        "Searching..."
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-2 animate-fade-up">
                    {searchResults.map((channel) => (
                      <div
                        key={channel.id}
                        onClick={() => handleChannelSelect(channel)}
                        className={`p-3 rounded-md hover:bg-muted transition-colors cursor-pointer border border-input ${
                          selectedChannel?.id === channel.id ? 'bg-muted' : ''
                        }`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleChannelSelect(channel);
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={channel.thumbnail}
                            alt={channel.title}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {channel.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              ID: {channel.id}
                            </p>
                          </div>
                          {selectedChannel?.id === channel.id && (
                            <CheckCircle className="h-5 w-5 text-green-500 animate-bounce-in" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-9 text-sm bg-primary text-white hover:bg-primary/90"
                  disabled={isLoading || !selectedChannel}
                >
                  {isLoading ? "Setting up..." : "Setup Channel"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to Network</DialogTitle>
            <DialogDescription>
              Enter the password for "{selectedSsid}"
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWiFiSubmit}>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-9 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowPasswordDialog(false);
                  setPassword("");
                  setShowPassword(false);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-white hover:bg-primary/90"
              >
                {isLoading ? "Connecting..." : "Connect"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Setup Complete! 🎉</DialogTitle>
            <DialogDescription>
              Your YouTube Tracker has been successfully configured and is ready to use. You can now close this window.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button
              onClick={() => setShowCompletionDialog(false)}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
