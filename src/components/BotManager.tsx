import React, { useState, useEffect } from 'react';
import { Play, Pause, Plus, Settings2 } from 'lucide-react';
import { TradingBot } from '../services/bot/TradingBot';
import { defaultConfig } from '../config/config';
import { Switch } from './ui/switch';
import { Input } from './ui/input';

export const BotManager = () => {
  const [bots, setBots] = useState<Map<string, TradingBot>>(new Map());
  const [newBotName, setNewBotName] = useState('');
  const [selectedBot, setSelectedBot] = useState<string | null>(null);

  const createBot = () => {
    if (!newBotName || bots.has(newBotName)) return;

    const bot = new TradingBot(defaultConfig);
    bots.set(newBotName, bot);
    setBots(new Map(bots));
    setNewBotName('');
  };

  const startBot = async (botName: string) => {
    const bot = bots.get(botName);
    if (bot) {
      await bot.start();
      setBots(new Map(bots));
    }
  };

  const stopBot = async (botName: string) => {
    const bot = bots.get(botName);
    if (bot) {
      await bot.stop();
      setBots(new Map(bots));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Bot Yönetimi</h3>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Bot İsmi"
              value={newBotName}
              onChange={(e) => setNewBotName(e.target.value)}
              className="w-48"
            />
            <button
              onClick={createBot}
              className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {Array.from(bots.entries()).map(([name, bot]) => (
            <div
              key={name}
              className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
            >
              <div>
                <div className="font-medium">{name}</div>
                <div className="text-sm text-gray-400">
                  Aktif Pozisyonlar: {bot.getActivePositions().length}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedBot(name)}
                  className="text-blue-500 hover:text-blue-400"
                >
                  <Settings2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => bot.isRunning ? stopBot(name) : startBot(name)}
                  className={`p-2 rounded-lg ${
                    bot.isRunning
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {bot.isRunning ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedBot && (
        <BotSettings
          bot={bots.get(selectedBot)!}
          onClose={() => setSelectedBot(null)}
        />
      )}
    </div>
  );
};

interface BotSettingsProps {
  bot: TradingBot;
  onClose: () => void;
}

const BotSettings: React.FC<BotSettingsProps> = ({ bot, onClose }) => {
  // Bot ayarları komponenti implementasyonu
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        {/* Bot ayarları içeriği */}
      </div>
    </div>
  );
};