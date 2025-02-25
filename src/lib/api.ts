
interface DeviceStatus {
  wifi_status: "connected" | "disconnected";
  ip: string;
  channel_id: string;
}

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

// Dummy data for testing
const MOCK_NETWORKS: Network[] = [
  { ssid: "Home WiFi", strength: 90, channel: 6 },
  { ssid: "Neighbor's Network", strength: 75, channel: 1 },
  { ssid: "Coffee Shop", strength: 60, channel: 11 },
  { ssid: "Guest Network", strength: 85, channel: 3 },
  { ssid: "5G Network", strength: 95, channel: 36 }, // This one will be filtered out
];

const MOCK_CHANNELS: Record<string, YouTubeChannel> = {
  "MKBHD": {
    id: "UCBJycsmduvYEL83R_U4JriQ",
    title: "Marques Brownlee",
    thumbnail: "https://yt3.googleusercontent.com/lkH37D712tiyphnu0Id0D5MwwQ7IRuwgQLVD05iMXlDWO-kDHut3uI4MgIEAQ9StK0qOST7fiA=s176-c-k-c0x00ffffff-no-rj"
  },
  "linus": {
    id: "UCXuqSBlHAE6Xw-yeJA0Tunw",
    title: "Linus Tech Tips",
    thumbnail: "https://yt3.googleusercontent.com/ytc/AIf8zZTI4CYr7TnRBKyOVT5n_4sKgzvCaOvn0RvMduR5=s176-c-k-c0x00ffffff-no-rj"
  },
  "pewdiepie": {
    id: "UC-lHJZR3Gqxm24_Vd_AJ5Yw",
    title: "PewDiePie",
    thumbnail: "https://yt3.googleusercontent.com/ytc/AIf8zZQkPUe-A3ooqP8OEz9K0JdrQbFqGsLPvJtIYhJh=s176-c-k-c0x00ffffff-no-rj"
  }
};

class ESPDeviceAPI {
  private baseUrl: string;
  private mockConnected: boolean = false;
  private mockChannelId: string = "";

  constructor() {
    this.baseUrl = "http://192.168.1.1";
  }

  setBaseUrl(url: string) {
    this.baseUrl = url.startsWith("http") ? url : `http://${url}`;
    console.log("Base URL set to:", this.baseUrl);
  }

  async getStatus(): Promise<DeviceStatus> {
    await this.simulateDelay();
    return {
      wifi_status: this.mockConnected ? "connected" : "disconnected",
      ip: this.mockConnected ? "192.168.1.100" : "",
      channel_id: this.mockChannelId
    };
  }

  async scanNetworks(): Promise<Network[]> {
    await this.simulateDelay();
    // Only return 2.4GHz networks (channels 1-13)
    return MOCK_NETWORKS.filter(network => network.channel >= 1 && network.channel <= 13);
  }

  async updateWiFi(ssid: string, password: string): Promise<void> {
    await this.simulateDelay();
    console.log("Connecting to WiFi:", ssid, "with password:", password);
    
    // Simulate connection failure for networks without password
    if (!password && ssid !== "Guest Network") {
      throw new Error("Password required");
    }
    
    this.mockConnected = true;
  }

  async verifyWiFi(): Promise<boolean> {
    await this.simulateDelay();
    return this.mockConnected;
  }

  async searchYouTubeChannel(query: string): Promise<YouTubeChannel | null> {
    await this.simulateDelay();
    
    // Convert query to lowercase for case-insensitive search
    const searchTerm = query.toLowerCase();
    
    // Search through mock channels
    const foundChannel = Object.entries(MOCK_CHANNELS).find(([key]) => 
      key.toLowerCase().includes(searchTerm)
    );
    
    return foundChannel ? foundChannel[1] : null;
  }

  async updateYoutubeChannel(channelId: string): Promise<void> {
    await this.simulateDelay();
    this.mockChannelId = channelId;
    console.log("Updated channel ID to:", channelId);
  }

  async verifyYoutubeChannel(channelId: string): Promise<boolean> {
    await this.simulateDelay();
    return this.mockChannelId === channelId;
  }

  // Helper method to simulate network delay
  private async simulateDelay(min: number = 500, max: number = 1500): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

export const espApi = new ESPDeviceAPI();
