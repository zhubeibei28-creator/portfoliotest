'use client';
import {createContext,useContext,cloneElement,isValidElement,type ReactNode,type ReactElement} from 'react';
import {previewText,type PreviewLanguage} from './preview-language';
export const PortfolioLanguage=createContext<PreviewLanguage>('en');
function localize(node:ReactNode,language:PreviewLanguage):ReactNode{
 if(typeof node==='string')return previewText(node,language);
 if(Array.isArray(node))return node.map(child=>localize(child,language));
 if(!isValidElement(node))return node;
 const element=node as ReactElement<Record<string,unknown>>,props=element.props;
 const translated:Record<string,unknown>={};
 for(const key of ['alt','aria-label','title','placeholder'])if(typeof props[key]==='string')translated[key]=previewText(props[key] as string,language);
 if(props.children!==undefined)translated.children=localize(props.children as ReactNode,language);
 return cloneElement(element,translated);
}
export default function Localized({children}:{children:ReactNode}){const language=useContext(PortfolioLanguage);return language==='en'?children:localize(children,language);}
