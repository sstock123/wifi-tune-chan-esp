
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

class ESPDeviceAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "http://192.168.1.1";
  }

  setBaseUrl(url: string) {
    this.baseUrl = url.startsWith("http") ? url : `http://${url}`;
    console.log("Base URL set to:", this.baseUrl);
  }

  async getStatus(): Promise<DeviceStatus> {
    const response = await fetch(`${this.baseUrl}/api/status`);
    const data = await response.json();
    return data;
  }

  async scanNetworks(): Promise<Network[]> {
    const response = await fetch(`${this.baseUrl}/api/scan`);
    const networks = await response.json();
    return networks;
  }

  async updateWiFi(ssid: string, password: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/wifi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ssid, password }),
    });

    if (!response.ok) {
      throw new Error('Failed to update WiFi settings');
    }
  }

  async verifyWiFi(): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/api/wifi/verify`);
    const data = await response.json();
    return data.connected === true;
  }

  async searchYouTubeChannel(query: string): Promise<YouTubeChannel | null> {
    const response = await fetch(`${this.baseUrl}/api/youtube/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  }

  async updateYoutubeChannel(channelId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/youtube`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channelId }),
    });

    if (!response.ok) {
      throw new Error('Failed to update YouTube channel');
    }
  }

  async verifyYoutubeChannel(channelId: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/api/youtube/verify?channelId=${encodeURIComponent(channelId)}`);
    const data = await response.json();
    return data.verified === true;
  }
}

export const espApi = new ESPDeviceAPI();
