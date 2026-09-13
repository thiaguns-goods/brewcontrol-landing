export type DemoId='production'|'assets'|'commercial'|'logistics'|'brewpub'|'finance'|'dashboard'|'inventory';
export type DemoConfig={id:DemoId;source:string;width:number;height:number;fps:number;trimStartFrame?:number;trimEndFrame?:number;durationInFrames?:number;enabled:boolean};
const make=(id:DemoId):DemoConfig=>({id,source:`raw/${id}.webm`,width:1440,height:810,fps:30,enabled:false});
export const demos:Record<DemoId,DemoConfig>=Object.fromEntries((['production','assets','commercial','logistics','brewpub','finance','dashboard','inventory'] as DemoId[]).map(id=>[id,make(id)])) as Record<DemoId,DemoConfig>;
