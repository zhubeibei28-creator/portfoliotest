import Home from '../../page';
import {notFound} from 'next/navigation';
const titles:Record<string,string>={shuxia:'述夏 SHUXIA',graft:'GRÆFT',pocklet:'POCKLET',roofbook:'檐行记'};
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return {title:`${titles[slug]??'Work'} — Beibei (Anna) Zhu`};}
export default async function WorkPage({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<{lang?:string}>}){
 const {slug}=await params;if(!titles[slug])notFound();const {lang}=await searchParams;
 return <Home initialWorkSlug={slug} initialLanguage={lang==='zh'?'zh':'en'}/>;
}
