/* Small narrative diagrams, using the project's vessel metaphor. */
export default function PockletRitualVisual({stage}:{stage:number}){
 const colors=['#e9efb5','#ded4ef','#ccebdc','#f8e79c'];
 return <svg className="pk-ritual-diagram" viewBox="0 0 260 180" role="img" aria-label={['An object and its story held in a jar','A little distance between the object and everyday life','Returning to notice a change in attachment','An object continuing onward with care'][stage]}>
 <path d="M92 39h76v13h-7v15c0 10 25 16 25 43v35c0 13-9 20-22 20H96c-13 0-22-7-22-20v-35c0-27 25-33 25-43V52h-7z" fill={colors[stage]} fillOpacity=".65" />
 <circle cx="130" cy={stage===3?80:122} r={stage===2?9:14} fill={stage===0?'#cfb9e0':stage===1?'#a9c9b8':stage===2?'#b6a1ce':'#e0c67a'} fillOpacity={stage===2?.5:.85}/>
 </svg>
}
