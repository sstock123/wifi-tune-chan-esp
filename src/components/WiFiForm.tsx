
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface WiFiFormProps {
  onSubmit: (ssid: string, password: string) => void;
  isLoading?: boolean;
}

const WiFiForm = ({ onSubmit, isLoading }: WiFiFormProps) => {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ssid || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    onSubmit(ssid, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="ssid" className="text-sm font-medium">
          Network Name (SSID)
        </label>
        <Input
          id="ssid"
          value={ssid}
          onChange={(e) => setSsid(e.target.value)}
          placeholder="Enter network name"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter network password"
            className="w-full pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        variant="default"
      >
        {isLoading ? "Updating..." : "Update WiFi Settings"}
      </Button>
    </form>
  );
};

export default WiFiForm;
