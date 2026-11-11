'use client';

import { useEffect, useRef, useState } from 'react';

export default function VisibilityVideo({src,poster,label,preferSound=false,controls=true}:{src:string;poster?:string;label:string;preferSound?:boolean;controls?:boolean}) {
  const ref=useRef<HTMLVideoElement>(null);
  const visible=useRef(false);
  const sound=useRef(preferSound);
  const programmedMute=useRef<boolean|null>(null);
  const [soundBlocked,setSoundBlocked]=useState(false);
  useEffect(()=>{
    const video=ref.current;
    if(!video)return;
    let disposed=false;
    const saved=sessionStorage.getItem(`video-sound:${src}`);
    if(saved!==null)sound.current=saved==='on';
    const mute=(value:boolean)=>{if(video.muted!==value){programmedMute.current=value;video.muted=value;}};
    const play=async()=>{
      if(!visible.current||document.hidden)return;
      mute(!sound.current);
      try{await video.play();if(!disposed)setSoundBlocked(false);}
      catch{
        if(!visible.current||disposed)return;
        mute(true);
        try{await video.play();if(!disposed)setSoundBlocked(sound.current);}catch{}
      }
      if(!visible.current||document.hidden)video.pause();
    };
    const observer=new IntersectionObserver(entries=>{
      visible.current=entries[0].isIntersecting&&entries[0].intersectionRatio>=.2;
      if(visible.current)void play();else video.pause();
    },{root:video.closest('.graft-project'),threshold:[0,.2,.5]});
    observer.observe(video);
    const onVisibility=()=>{if(document.hidden)video.pause();else void play();};
    document.addEventListener('visibilitychange',onVisibility);
    return()=>{disposed=true;observer.disconnect();video.pause();document.removeEventListener('visibilitychange',onVisibility);};
  },[]);
  return <div className="gf-video-player"><video ref={ref} muted={!preferSound} loop playsInline controls={controls} preload="metadata" poster={poster} aria-label={label} onVolumeChange={()=>{const v=ref.current;if(!v)return;if(programmedMute.current===v.muted){programmedMute.current=null;return;}programmedMute.current=null;sound.current=!v.muted&&v.volume>0;sessionStorage.setItem(`video-sound:${src}`,sound.current?'on':'off');setSoundBlocked(false);}}><source src={src} type="video/mp4"/></video>{soundBlocked&&<button className="gf-enable-sound" onClick={()=>{const v=ref.current;if(v){sound.current=true;sessionStorage.setItem(`video-sound:${src}`,'on');v.muted=false;void v.play();setSoundBlocked(false);}}}>开启声音 / Enable sound</button>}</div>;
}
