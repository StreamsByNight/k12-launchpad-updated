/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CANVAS_CLIENT_ID?: string;
  readonly VITE_CANVAS_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
