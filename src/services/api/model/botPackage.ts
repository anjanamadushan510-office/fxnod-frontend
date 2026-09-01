/**
 * FXNod Platform API - Bot Packages & Licensing
 */

export type BotPackageStatus = "available" | "claimed" | "revoked";

export interface BotPackage {
  id: string;
  creator_user_id: string;
  strategy_id: string;
  name: string;
  display_password: string;
  status: BotPackageStatus;
  claimed_by_user_id?: string;
  claimed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ListBotPackagesResponse {
  packages: BotPackage[];
}

export interface CreateBotPackageRequest {
  name: string;
  strategy_id: string;
  password: string;
  config: Record<string, unknown>;
}

export interface CreateBotPackageResponse {
  package: BotPackage;
  file_content: string;
  file_name: string;
}

export interface ClaimBotPackageRequest {
  package_id?: string;
  file_content?: string;
  password: string;
}

export interface ClaimBotPackageResponse {
  package_id: string;
  strategy_id: string;
  name: string;
  config: Record<string, unknown>;
  claimed_at: string;
}

export interface DownloadPackageFileResponse {
  file_content: string;
  file_name: string;
}
