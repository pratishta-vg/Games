import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Save, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ApiSettings = () => {
  const [apiUrl, setApiUrl] = useState(
    localStorage.getItem('django_api_url') || 'http://localhost:8000/api/v1'
  );
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    localStorage.setItem('django_api_url', apiUrl);
    toast({
      title: "Settings Saved",
      description: "API URL has been updated. Refresh the page to apply changes.",
    });
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      const response = await fetch(`${apiUrl}/grades/`);
      if (response.ok) {
        toast({
          title: "Connection Successful",
          description: "Successfully connected to your Django backend!",
        });
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to the Django backend. Please check the URL and ensure your server is running.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Django API Configuration
        </CardTitle>
        <CardDescription>
          Configure the connection to your Django gamified-learning backend
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-url">Django API Base URL</Label>
          <Input
            id="api-url"
            type="url"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="http://localhost:8000/api/v1"
          />
          <p className="text-sm text-muted-foreground">
            Enter the base URL of your Django REST API (usually ends with /api/v1)
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
          <Button 
            variant="outline" 
            onClick={testConnection}
            disabled={isTestingConnection}
            className="flex items-center gap-2"
          >
            <TestTube className="h-4 w-4" />
            {isTestingConnection ? 'Testing...' : 'Test Connection'}
          </Button>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Quick Setup Instructions:</h4>
          <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
            <li>Clone your Django project: <code className="text-xs bg-background px-1 rounded">git clone https://github.com/dashrath199/gamified-learning</code></li>
            <li>Set up the backend following the README instructions</li>
            <li>Run your Django server: <code className="text-xs bg-background px-1 rounded">python manage.py runserver</code></li>
            <li>Update the API URL above if different from localhost:8000</li>
            <li>Test the connection to ensure everything is working</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiSettings;