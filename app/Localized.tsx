'use client';
import {Children,Fragment,createContext,useContext,cloneElement,isValidElement,type ReactNode,type ReactElement} from 'react';
import {previewText,type PreviewLanguage} from './preview-language';
export const PortfolioLanguage=createContext<PreviewLanguage>('en');
const chineseWords=new Intl.Segmenter('zh',{granularity:'word'});
/** Keep a short final phrase together without hard-coding line breaks or widths. */
function protectTail(node:ReactNode):ReactNode{
 if(typeof node==='string'){
  const characters=[...node.matchAll(/\p{Script=Han}/gu)];let start=-1;
  if(characters.length>=8){
   start=characters[characters.length-4].index!;
   for(const word of chineseWords.segment(node)){if(word.index<=start&&word.index+word.segment.length>start){start=word.index;break;}}
  }else if(!characters.length&&node.trim().split(/\s+/).length>=5){
   const match=node.match(/\S+\s+\S+\s*$/);if(match&&match[0].trim().length<=24)start=match.index!;
  }
  if(start<=0)return node;
  return <Fragment key="copy-tail-group">{node.slice(0,start)}<span className="copy-tail">{node.slice(start)}</span></Fragment>;
 }
 if(Array.isArray(node)){const result=[...node];for(let i=result.length-1;i>=0;i--){if(result[i]===null||typeof result[i]==='boolean'||typeof result[i]==='string'&&!String(result[i]).trim())continue;result[i]=protectTail(result[i]);break;}return result;}
 if(isValidElement(node)){
  const el=node as ReactElement<Record<string,unknown>>;
  if(el.props.className==='copy-tail'||el.type==='br')return node;
  if(el.props.children!==undefined)return cloneElement(el,{children:protectTail(el.props.children as ReactNode)});
 }
 return node;
}
function localize(node:ReactNode,language:PreviewLanguage):ReactNode{
 if(typeof node==='string')return previewText(node,language);
 if(Array.isArray(node))return Children.map(node,child=>localize(child,language));
 if(!isValidElement(node))return node;
 const element=node as ReactElement<Record<string,unknown>>,props=element.props;
 if(props.className==='copy-tail')return node;
 const translated:Record<string,unknown>={};
 for(const key of ['alt','aria-label','title','placeholder'])if(typeof props[key]==='string')translated[key]=previewText(props[key] as string,language);
 if(props.children!==undefined){
  let children=localize(props.children as ReactNode,language);
  if(typeof element.type==='string'&&(/^(p|h[1-6]|figcaption|li|blockquote)$/.test(element.type)||/\b(about-intro-paragraph|experience-copy-line|sx-photo-caption)\b/.test(String(props.className||''))))children=protectTail(children);
  translated.children=children;
 }
 return cloneElement(element,translated);
}
export default function Localized({children}:{children:ReactNode}){const language=useContext(PortfolioLanguage);return localize(children,language);}
