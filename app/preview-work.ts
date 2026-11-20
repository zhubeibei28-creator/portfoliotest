export type PreviewArt = {project:number;src:string;thumb:string;label:string};
export const previewProjects = [
 {id:'01',title:'述夏 SHUXIA',type:'Brand identity / Scent & space',detailIndex:2},
 {id:'02',title:'GRÆFT',type:'Visual identity / Festival experience',detailIndex:3},
 {id:'03',title:'POCKLET',type:'Experience design / Digital & physical',detailIndex:4},
 {id:'04',title:'ICEPACT',type:'Identity / Motion',detailIndex:null},
 {id:'05',title:'檐行记',type:'Editorial design / Bookbinding',detailIndex:1},
];
const labels=['Postcards & summer memories','Underground environment','Objects & packaging','Glacier identity','Book & reading rhythm','Courtyard space','Botanical tile identity','Hand-sewn structure'];
export const previewArt:PreviewArt[] = [0,1,2,3,4,0,1,4].map((project,i)=>({project,src:`/assets/intro/orbit-${i}-large.webp`,thumb:`/assets/intro/orbit-${i}-thumb.webp`,label:labels[i]}));
export type PreviewSelection={project:number;art?:PreviewArt};
