'use client';

import { useEffect, useRef, useState } from 'react';
import VisibilityVideo from './VisibilityVideo';
import useProjectReveal from './useProjectReveal';
import {previewText,type PreviewLanguage} from './preview-language';

export default function ShuxiaProject({onBack,onNext,nextTitle,language='en'}: {language?:PreviewLanguage;onBack: () => void;onNext?:()=>void;nextTitle?:string}) {
  const article=useRef<HTMLElement>(null);
  useProjectReveal(article);
  const t=(text:string)=>previewText(text,language);
  const [zoom, setZoom] = useState<{src:string; alt:string} | null>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setZoom(null); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  const photo = (name:string, alt:string, className = '') => (
    <button className={`sx-image ${className}`} onClick={() => setZoom({src:`/assets/shuxia/${name}.webp`,alt})} aria-label={`Enlarge: ${alt}`}>
      <img src={`/assets/shuxia/${name}.webp`} alt={alt} loading="lazy" decoding="async" />
    </button>
  );
  return (
    <article ref={article} className="shuxia-project">
      <header className="sx-heading">
        <div className="sx-topline"><span>{t("SELECTED PROJECT / 01")}</span><button onClick={onBack}>{t("Back to work ↗")}</button></div>
        <h1><span lang="zh">述夏</span>{t(" SHUXIA")}</h1>
        <p>{t("Memory and scent of summer.")}</p>
      </header>

      <div className="sx-hero"><img src="/assets/shuxia/header-interior-lossless.webp" alt="SHUXIA white wordmark over a warm interior photograph" width={1456} height={728} fetchPriority="high" /></div>

      <section className="sx-overview" aria-label="Project overview">
        <div className="sx-overview-copy"><h2>{t("OVERVIEW")}</h2><p>{t("SHUXIA is a summer-inspired scent brand that remembers the season through atmosphere, texture, and small sensory moments: humid air, after-rain freshness, soft greenery, and the quiet feeling of staying cool.")}</p><p>{t("Rather than the bright, energetic image of summer, the identity explores its softer side. A courtyard space brings this atmosphere into an architectural setting; scent, tactile materials, and illustration extend it into everyday objects.")}</p></div>
        <div className="sx-project-meta"><div><h2>{t("YEAR")}</h2><p>2026</p></div>
        <div><h2>{t("PROJECT")}</h2><p>{t("Independent")}<br />{t("Brand concept")}</p></div>
        <div><h2>{t("MY ROLE")}</h2><p>{t("Concept development")}<br />{t("Visual identity")}<br />{t("Illustration & mascot")}<br />{t("Product & packaging")}<br />{t("Website design")}<br />{t("Spatial design & visualization")}</p></div></div>
      </section>

      <section className="sx-section sx-mood-section" aria-labelledby="sx-mood-title">
        <div className="sx-section-heading"><h2 id="sx-mood-title">{t('MOODBOARD / SUMMER ATMOSPHERE')}</h2><p>{t('Courtyards, shade, moving air, and the small pauses of an ordinary summer.')}</p></div>
        <div className="sx-moodboard" aria-label={language==='zh'?'夏日氛围参考情绪板':'Summer atmosphere reference moodboard'}>
          {[{"name": "courtyard", "width": 2014, "height": 1342, "alt": "A shaded courtyard with washing, plants and dappled sunlight"}, {"name": "fan", "width": 1621, "height": 1080, "alt": "A green fan and a slice of watermelon beside a rice field"}, {"name": "water", "width": 1080, "height": 1618, "alt": "A small bridge beneath trees reflected in green water"}, {"name": "window", "width": 1080, "height": 1440, "alt": "Sunlit trees seen through the dark interior of a bus"}, {"name": "garden", "width": 1080, "height": 1440, "alt": "A garden house surrounded by foliage and hydrangeas"}].map((image,i)=><button key={image.name} className={`sx-image sx-mood-photo sx-mood-${image.name}`} data-reveal-photo="true" style={{'--reveal-delay':`${i*110}ms`} as React.CSSProperties} onClick={()=>setZoom({src:`/assets/shuxia/mood-${image.name}.webp`,alt:image.alt})} aria-label={`${language==='zh'?'放大参考图片':'Enlarge reference image'}: ${image.alt}`}><img src={`/assets/shuxia/mood-${image.name}.webp`} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" /></button>)}
        </div>
      </section>

      <section className="sx-section" aria-labelledby="sx-identity">
        <div className="sx-section-heading"><h2 id="sx-identity">{t("01 / VISUAL IDENTITY")}</h2><div className="sx-description"><p>{t("The identity combines three elements: a flowing handwritten wordmark, illustrated summer characters, and a repeating pattern inspired by bamboo cooling mats. Together, they connect scent with familiar textures and everyday summer memories.")}</p><p>{t("述夏 (Shùxià) means “telling stories of summer.” In 述, a tree topped with a raindrop reinterprets the original form as 木 (wood) + 水 (water). The same silhouette becomes one of the mascots.")}</p></div></div>
        <div className="sx-description sx-mascot-inspiration"><h3>{t('RAIN / CHARACTER INSPIRATION')}</h3><p>{t('Umbrellas, rain-soaked grass, and droplets resting on leaves shaped the mascot world. The central character holds a leaf; the figure on the left is a tree carrying raindrops, while the one on the right is a fishbowl filled with water. Rainy days also become part of the two characters’ shared stories.')}</p></div>
        <div className="sx-rain-board">{[{name:'umbrella',alt:'A yellow umbrella above a rain-soaked lawn'},{name:'droplets',alt:'Raindrops resting on green leaves'},{name:'grass',alt:'Long blades of grass covered in rain'}].map((image,i)=><button key={image.name} className={`sx-image sx-rain-photo sx-rain-${image.name}`} data-reveal-photo="true" style={{'--reveal-delay':`${i*140}ms`} as React.CSSProperties} onClick={()=>setZoom({src:`/assets/shuxia/mood-${image.name}.webp`,alt:image.alt})} aria-label={`${language==='zh'?'放大参考图片':'Enlarge reference image'}: ${image.alt}`}><img src={`/assets/shuxia/mood-${image.name}.webp`} alt={image.alt} width={1080} height={image.name==='umbrella'?1621:image.name==='droplets'?1920:1440} loading="lazy" /></button>)}</div>
        <div className="sx-pair sx-identity-pair"><figure className="sx-identity-panel"><button className="sx-image sx-wordmark-guides" onClick={()=>setZoom({src:'/assets/shuxia/wordmark-clearspace.svg',alt:'SHUXIA wordmark with vector clear-space guides'})} aria-label={language==='zh'?'放大述夏字标与安全空间':'Enlarge SHUXIA wordmark and clear-space guides'}><img src="/assets/shuxia/wordmark-clearspace.svg" alt={language==='zh'?'述夏黑色字标及矢量安全空间辅助线':'Black SHUXIA wordmark with vector clear-space guides'} loading="lazy" /></button><figcaption>{language==='zh'?'主字标':'PRIMARY WORDMARK'}</figcaption></figure><figure className="sx-identity-panel">{photo('mascots','SHUXIA’s two line-drawn summer mascots')}<figcaption>{language==='zh'?'角色版标志':'MASCOT LOGO'}</figcaption></figure></div>
        <div className="sx-palette-section"><div className="sx-type-system"><h3>{t("TYPOGRAPHY")}</h3>
          <div className="sx-type-example"><img src="/assets/shuxia/type-expressive-full.webp" alt="述夏 SHUXIA set in 字由点字稻草人" /><h4>{t("字由点字稻草人 / Expressive typeface")}</h4><p>{t("Used for the wordmark and expressive text, bringing a loose, handwritten quality to the identity.")}</p></div>
          <div className="sx-type-example"><img src="/assets/shuxia/type-copperplate-full.webp" alt="Copperplate typeface specimen" /><h4>{t("Copperplate / Supporting typeface")}</h4><p>{t("Used for English product names and packaging headlines, adding structure alongside the handwritten forms.")}</p></div>
        </div>
        <div className="sx-palette-copy"><h3>{t("BRAND COLOR")}</h3><div className="sx-palette" aria-label="SHUXIA color palette derived from the illustrations">
          {[
            {name:'Paper',hex:'#E5DDD4',role:'Warm neutral / background'},
            {name:'Summer green',hex:'#9BD3AE',role:'Primary illustration color'},
            {name:'Rain blue',hex:'#728E9B',role:'Secondary color'},
            {name:'Umbrella coral',hex:'#E58469',role:'Illustration accent'},
          ].map(color=><div className="sx-color" key={color.hex} style={{backgroundColor:color.hex}}><div className="sx-color-info"><span>{t(color.name)}</span><span>{color.hex}</span></div><p>{t(color.role)}</p></div>)}
        </div>
        </div></div>
        <div className="sx-section-heading sx-subheading"><h3>{t("PATTERN / FROM REFERENCE TO SYSTEM")}</h3><p>{t("The repeated strips, joints, and open spaces of woven cooling mats informed the vertical rhythm of the pattern. The designed motif carries this material reference into a graphic repeat and a cut-out surface.")}</p></div>
        <div className="sx-inspiration-board"><h4>{t("INSPIRATION / REFERENCES")}</h4><div className="sx-inspiration-row">{[1,2,3,4].map(n=><div key={n}>{photo(`inspiration-mat-${n}`,`Inspiration reference ${n}: bamboo weaving and cooling mat texture`)}</div>)}</div><p className="sx-small-note">{t("Bamboo weaving and cooling mats / reference imagery, not original SHUXIA design.")}</p></div>
        <div className="sx-section-heading sx-subheading"><h3>{t("ORIGINAL PATTERN / GRAPHIC TO MATERIAL")}</h3><p>{t("The repeating motif becomes a cut-out hanging panel, a packaging sleeve, and a storefront curtain. Keeping the same vertical rhythm connects the graphic identity to tactile objects and the spatial concept.")}</p></div>
        {photo('pattern-application','Original SHUXIA cut-out pattern shown together with its hanging panel application','sx-pattern-combined')}
        <div className="sx-pattern-labels"><span>{t("Material application / hanging panel")}</span><span>{t("Original SHUXIA pattern design")}</span></div>
      </section>

      <section className="sx-section sx-spatial" aria-labelledby="sx-store">
        <div className="sx-section-heading"><h2 id="sx-store">{t("02 / SPATIAL EXPERIENCE")}</h2><p>{t("A journey from the street into a courtyard scent space. Planting, filtered daylight, warm wood, and places to pause bring SHUXIA’s quiet summer atmosphere into a space visitors can move through.")}</p></div>
        <figure className="sx-courtyard-film">
          <VisibilityVideo src="/assets/shuxia/courtyard-walkthrough.mp4" poster="/assets/shuxia/courtyard-poster.webp" label="SHUXIA spatial walkthrough, from the street through the courtyard and scent shop" />
          <figcaption className="sx-small-note">{t("Spatial walkthrough / street, courtyard & interior")}</figcaption>
        </figure>
        <div className="sx-section-heading sx-subheading"><h3>{t("STOREFRONT & SIGNAGE STUDIES")}</h3><p>{t("Window illustrations, the patterned curtain, and illuminated signage explore how the graphic identity meets the architecture.")}</p></div>
        <div className="sx-store-pair">{photo('storefront','SHUXIA storefront concept with illustrated windows and patterned curtain')}{photo('signage','Warm illuminated SHUXIA sign with botanical motifs')}</div>
        <p className="sx-small-note">{t("Storefront & light-box signage / concept studies")}</p>
      </section>

      <section className="sx-section" aria-labelledby="sx-packaging">
        <div className="sx-section-heading"><h2 id="sx-packaging">{t("03 / PRODUCTS & PACKAGING")}</h2><p>{t("A cooling soap and scent pack turn summer memories into a small daily ritual. Botanical illustrations preview the ingredients before the package is opened.")}</p></div>
        <div className="sx-packaging-pair">{photo('soap-set','Cooling soap packaging set with wooden box and printed elements')}{photo('cooling-soap-packaging-design','Flat artwork for the cooling soap packaging, with summer photography and illustrated mascots')}</div>
        <div className="sx-packaging-copy"><p className="sx-small-note">{t("Cooling soap / packaging application & flat design")}</p><div className="sx-description"><p>{t("The wooden container holds the soap, a mesh pouch, and illustrated paper elements. The patterned sleeve repeats the visual language of the cooling mat, while the scent pack introduces the botanical ingredients before opening.")}</p><p>{t("These pieces extend the identity beyond a logo: texture, pattern, and illustration shape how the product is discovered and handled.")}</p></div></div>
        <div className="sx-pair sx-soap-views">{photo('package-open','Opened wooden SHUXIA package with illustrated inserts')}{photo('scent-pack','Soap, mesh pouch and botanical scent cards inside the wooden package')}</div>
        <div className="sx-crossword">{photo('crossword','Two promotional crossword slips introducing SHUXIA products and scent notes')}<div className="sx-description"><h4>{t("TAKEAWAY / BRAND CROSSWORD")}</h4><p>{t("A playful crossword introduces products, ingredients, and scent vocabulary. It acts as both a product guide and a small printed takeaway, translating the brand’s everyday summer mood into an interaction.")}</p></div></div>
      </section>

      <section className="sx-section" aria-labelledby="sx-postcards">
        <div className="sx-section-heading sx-postcard-heading"><h2 id="sx-postcards">{t("04 / ILLUSTRATION & POSTCARDS")}</h2><div className="sx-description"><p>{t("A continuous postcard story follows the characters through a picnic, a rainy bus stop, and a quiet afternoon at home. The same characters and textured drawing style carry the identity through different scenes.")}</p><p>{t("The postcards extend the scent experience into images of weather, rest, and companionship—small summer memories that can be kept or shared.")}</p></div></div>
        <div className="sx-postcard-story"><div>{photo('postcards-water','Two SHUXIA illustrated postcards photographed in rippling water')}</div><div><div className="sx-postcard-column">{photo('illustration-picnic','The two mascots enjoying a summer picnic')}{photo('illustration-rain','The mascots sharing an umbrella at a rainy bus stop')}{photo('illustration-home','The mascots resting on a bamboo mat at home')}</div></div></div><div className="sx-postcard-captions"><span>{t("Postcard application / water mockup")}</span><span>{t("Postcard series / three full artwork designs")}</span></div>
        {photo('postcards-studio','Front and back of the SHUXIA postcard collection on a pale background','sx-postcards-studio')}
      </section>

      <section className="sx-section" aria-labelledby="sx-website">
        <div className="sx-section-heading"><h2 id="sx-website">{t("05 / WEBSITE DESIGN")}</h2><p>{t("The brand’s quiet visual language continues online, from an atmospheric homepage to scent navigation and a product detail view.")}</p></div>
        <div className="sx-website-pair">{photo('website-grass','SHUXIA website displayed on a laptop in summer grass')}<div className="sx-web-main sx-laptop-video">
          <div className="sx-laptop-screen"><video autoPlay muted loop playsInline preload="metadata" poster="/assets/shuxia/website-demo-poster.webp" aria-label="SHUXIA website demonstration"><source src="/assets/shuxia/website-demo.mp4" type="video/mp4" /></video></div>
          <img className="sx-laptop-frame" src="/assets/shuxia/laptop-frame-video.webp" alt="Laptop frame surrounding the SHUXIA website video" />
        </div></div>
      </section>



      <footer className="sx-end"><span>{t("述夏 SHUXIA / Memory and scent of summer")}</span><button onClick={onNext??onBack}>{onNext?`${language==='zh'?'下一个项目':'Next'} / ${nextTitle} ↗`:t('Back to selected work ↗')}</button></footer>
      {zoom && <div className="sx-lightbox" role="dialog" aria-modal="true" aria-label={zoom.alt} onClick={() => setZoom(null)}><button autoFocus className="sx-lightbox-close" onClick={() => setZoom(null)}>{t("Close ×")}</button><img src={zoom.src} alt={zoom.alt} /></div>}
    </article>
  );
}
