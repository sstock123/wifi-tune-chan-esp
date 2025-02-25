
interface DeviceStatus {
  wifi_status: "connected" | "disconnected";
  ip: string;
  channel_id: string;
}

interface Network {
  ssid: string;
  strength: number;
  channel: number;  // Added channel information
}

class ESPDeviceAPI {
  private baseUrl: string;

  constructor() {
    // For now, we'll use a hardcoded IP. Later we can add mDNS discovery
    this.baseUrl = "http://192.168.1.1";
  }

  setBaseUrl(url: string) {
    this.baseUrl = url.startsWith("http") ? url : `http://${url}`;
  }

  async getStatus(): Promise<DeviceStatus> {
    const response = await fetch(`${this.baseUrl}/status`);
    if (!response.ok) {
      throw new Error("Failed to get device status");
    }
    return response.json();
  }

  async scanNetworks(): Promise<Network[]> {
    const response = await fetch(`${this.baseUrl}/wifi/scan`);
    if (!response.ok) {
      throw new Error("Failed to scan networks");
    }
    const networks: Network[] = await response.json();
    // Filter to only show 2.4GHz networks (channels 1-13)
    return networks.filter(network => network.channel >= 1 && network.channel <= 13);
  }

  async updateWiFi(ssid: string, password: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/wifi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ssid, password }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to update WiFi settings");
    }
  }

  async verifyWiFi(): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/wifi/verify`);
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data.connected === true;
  }

  async updateYoutubeChannel(channelId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/youtube`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channelId }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to update YouTube channel");
    }
  }

  async verifyYoutubeChannel(channelId: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/youtube/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channelId }),
    });
    
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data.valid === true;
  }
}

export const espApi = new ESPDeviceAPI();
