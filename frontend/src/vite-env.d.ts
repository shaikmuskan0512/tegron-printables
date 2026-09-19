/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_CURRENCY?: string;
  readonly VITE_ETSY_URL?: string;
  readonly VITE_INSTAGRAM_URL?: string;
  readonly VITE_PINTEREST_URL?: string;
  readonly VITE_YOUTUBE_URL?: string;
  readonly VITE_CONTACT_EMAIL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
