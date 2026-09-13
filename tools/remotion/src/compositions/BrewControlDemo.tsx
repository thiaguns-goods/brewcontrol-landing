import React from 'react'; import {Video} from '@remotion/media'; import {AbsoluteFill,staticFile} from 'remotion';
export type BrewControlDemoProps={source:string;trimStartFrame?:number;trimEndFrame?:number};
export const BrewControlDemo:React.FC<BrewControlDemoProps>=({source,trimStartFrame=0,trimEndFrame})=><AbsoluteFill><Video src={staticFile(source)} startFrom={trimStartFrame} endAt={trimEndFrame} volume={0} style={{width:'100%',height:'100%',objectFit:'contain'}}/></AbsoluteFill>;
