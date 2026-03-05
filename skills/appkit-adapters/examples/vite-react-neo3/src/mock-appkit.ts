// Minimal local mock of @reown/appkit and adapters for compile-time demo
export type AppKitConfig = {
  projectId: string
  adapters?: any[]
  networks?: any[]
  metadata?: Record<string, any>
  universalProviderConfigOverride?: any
}

export function createAppKit(_cfg: AppKitConfig) {
  // Return a minimal runtime object that a UI might use
  return {
    projectId: _cfg.projectId,
    adapters: _cfg.adapters || [],
    networks: _cfg.networks || [],
    metadata: _cfg.metadata || {},
    connect: async () => ({ connected: true }),
    disconnect: async () => ({ connected: false })
  }
}

export const Neo3Constants = {
  OVERRIDES: { dummy: true }
}

export const StellarConstants = {
  OVERRIDES: { dummy: true }
}
