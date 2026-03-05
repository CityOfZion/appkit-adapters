// local mock wrapper to simulate @reown/appkit createAppKit API
export type AppKitConfig = {
  projectId: string
  adapters?: any[]
  networks?: any[]
  metadata?: Record<string, any>
  universalProviderConfigOverride?: any
}

export function createAppKit(_cfg: AppKitConfig){
  return {
    projectId:_cfg.projectId,
    connect: async ()=>({connected:true}),
    disconnect: async ()=>({connected:false}),
    adapters:_cfg.adapters||[]
  }
}
