/**
 * FXNod Platform API - Bot Presets
 * Saved, named configurations for automated trading bots.
 */

export interface BotPreset<TConfig = Record<string, unknown>> {
  id: string;
  name: string;
  strategy_id: string;
  config: TConfig;
  created_at: string;
  updated_at: string;
}

export interface ListBotPresets200<TConfig = Record<string, unknown>> {
  presets: BotPreset<TConfig>[];
}

export interface CreateBotPresetRequest<TConfig = Record<string, unknown>> {
  name: string;
  strategy_id: string;
  config: TConfig;
}

export interface UpdateBotPresetRequest<TConfig = Record<string, unknown>> {
  name?: string;
  config?: TConfig;
}
