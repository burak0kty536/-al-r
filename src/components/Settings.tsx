import React, { useState } from 'react';
import { Settings2, Bell, Shield, Zap } from 'lucide-react';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';

export const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    autoUpdate: true,
    highSecurity: true,
    mevProtection: true,
    gasLimit: 50,
    slippageTolerance: 0.5,
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-6">
          <Settings2 className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">General Settings</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-gray-400" />
              <div>
                <div className="font-medium">Notifications</div>
                <div className="text-sm text-gray-400">Receive trade alerts and updates</div>
              </div>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) => updateSetting('notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-400" />
              <div>
                <div className="font-medium">Enhanced Security</div>
                <div className="text-sm text-gray-400">Additional security checks for trades</div>
              </div>
            </div>
            <Switch
              checked={settings.highSecurity}
              onCheckedChange={(checked) => updateSetting('highSecurity', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-gray-400" />
              <div>
                <div className="font-medium">MEV Protection</div>
                <div className="text-sm text-gray-400">Protect trades from front-running</div>
              </div>
            </div>
            <Switch
              checked={settings.mevProtection}
              onCheckedChange={(checked) => updateSetting('mevProtection', checked)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Default Gas Limit ({settings.gasLimit}%)
            </label>
            <Slider
              value={[settings.gasLimit]}
              onValueChange={([value]) => updateSetting('gasLimit', value)}
              min={1}
              max={100}
              step={1}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Slippage Tolerance ({settings.slippageTolerance}%)
            </label>
            <Slider
              value={[settings.slippageTolerance]}
              onValueChange={([value]) => updateSetting('slippageTolerance', value)}
              min={0.1}
              max={5}
              step={0.1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};