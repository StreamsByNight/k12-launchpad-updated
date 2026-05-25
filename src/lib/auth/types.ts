export type AuthMode = "canvas" | "demo";

export type UserSession = {
  mode: AuthMode;
  canvasBaseUrl: string;
  accessToken: string;
  userName?: string;
};
