/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EXPERT_PERSON_URL: string
  readonly VITE_HMAC_CLIENT_ID: string
  readonly VITE_HMAC_CLIENT_KEY: string
  readonly VITE_TEST_TENANT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
