export type PreviewArt = {project:number;src:string;thumb:string;label:string};
export const previewProjects = [
 {id:'01',title:'述夏 SHUXIA',type:'Brand identity / Scent & space',year:'2025',description:'An independent summer scent brand connecting identity, objects, packaging and a courtyard storefront.',detailIndex:2},
 {id:'02',title:'GRÆFT',type:'Visual identity / Festival experience',year:'2024',description:'A fictional underground music festival, built through visual identity, spatial applications and promotional materials.',detailIndex:3},
 {id:'03',title:'POCKLET',type:'Experience design / Digital & physical',year:'2025',description:'An app and physical release kit that creates a gentle ritual for letting go of emotionally significant objects.',detailIndex:4},
 {id:'04',title:'ICEPACT',type:'Identity / Motion',year:'2026',description:'A nonprofit identity exploring glacier protection through motion, merchandise and a proposed pop-up space.',detailIndex:null},
 {id:'05',title:'檐行记',type:'Editorial design / Bookbinding',year:'2025',description:'A hand-bound travelogue exploring rooflines, climate and shelter through two reading directions.',detailIndex:1},
];
const labels=['Postcards & summer memories','Underground environment','Objects & packaging','Glacier identity','Book & reading rhythm','Courtyard space','Botanical tile identity','Hand-sewn structure'];
export const previewArt:PreviewArt[] = [0,1,2,3,4,0,1,4].map((project,i)=>({project,src:i===0?'/assets/shuxia/home-workshop-cover.webp':i===1?'/assets/graft/cover-promo-v2.webp':`/assets/intro/orbit-${i}-large.webp`,thumb:i===0?'/assets/shuxia/home-workshop-cover.webp':i===1?'/assets/graft/cover-promo-v2.webp':`/assets/intro/orbit-${i}-thumb.webp`,label:i===0?'SHUXIA wordmark over a soap-making workshop':i===1?'GRÆFT promotional poster in a subway station':labels[i]}));
export type PreviewSelection={project:number;art?:PreviewArt};
