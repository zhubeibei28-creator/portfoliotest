'use client';

import { useEffect, useState } from 'react';

export default function ShuxiaProject({onBack}: {onBack: () => void}) {
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
    <article className="shuxia-project">
      <header className="sx-heading">
        <div className="sx-topline"><span>SELECTED PROJECT / 03</span><button onClick={onBack}>Back to work ↗</button></div>
        <h1><span lang="zh">述夏</span> SHUXIA</h1>
        <p>Memory and scent of summer.</p>
      </header>

      <div className="sx-hero"><img src="/assets/shuxia/summer-banner.webp" alt="SHUXIA’s handwritten white wordmark over a green field and summer sky" fetchPriority="high" /></div>

      <section className="sx-overview" aria-label="Project overview">
        <div className="sx-overview-copy"><h2>OVERVIEW</h2><p>SHUXIA is a summer-inspired scent brand that remembers the season through atmosphere, texture, and small sensory moments: humid air, after-rain freshness, soft greenery, and the quiet feeling of staying cool.</p><p>Rather than the bright, energetic image of summer, the identity explores its softer side. Scent, tactile materials, and illustration connect a collection of everyday objects with a calm, familiar world.</p></div>
        <div><h2>YEAR</h2><p>2026</p></div>
        <div><h2>PROJECT</h2><p>Independent<br />Brand concept</p></div>
        <div><h2>MY ROLE</h2><p>Concept development<br />Visual identity<br />Illustration & mascot<br />Product & packaging<br />Website design<br />Storefront concept</p></div>
      </section>

      <section className="sx-section" aria-labelledby="sx-identity">
        <div className="sx-section-heading"><h2 id="sx-identity">01 / VISUAL IDENTITY</h2><div className="sx-description"><p>The identity combines three elements: a flowing handwritten wordmark, illustrated summer characters, and a repeating pattern inspired by bamboo cooling mats. Together, they connect scent with familiar textures and everyday summer memories.</p><p>The wordmark and character outlines share an informal, hand-drawn quality. The pattern adds a more structured rhythm, appearing across the packaging, hanging panels, and storefront curtain.</p></div></div>
        <div className="sx-pair sx-identity-pair">{photo('wordmark','Hand-drawn Chinese SHUXIA wordmark')}{photo('mascots','SHUXIA’s two line-drawn summer mascots')}</div>
        <div className="sx-section-heading sx-subheading"><h3>WORDMARK / CLEAR SPACE</h3><p>The spacing diagram defines a consistent area around the wordmark, keeping its loose, organic silhouette legible when placed over photography.</p></div>
        {photo('logo-clearspace','SHUXIA white wordmark with size and clear-space guides on water photography','sx-logo-sizing')}
        <div className="sx-palette-section"><div className="sx-type-system"><h3>TYPOGRAPHY</h3>
          <div className="sx-type-example"><img src="/assets/shuxia/type-expressive-full.webp" alt="述夏 SHUXIA set in 字由点字稻草人" /><h4>字由点字稻草人 / Expressive typeface</h4><p>Used for the wordmark and expressive text, bringing a loose, handwritten quality to the identity.</p></div>
          <div className="sx-type-example"><img src="/assets/shuxia/type-copperplate-full.webp" alt="Copperplate typeface specimen" /><h4>Copperplate / Supporting typeface</h4><p>Used for English product names and packaging headlines, adding structure alongside the handwritten forms.</p></div>
        </div>
        <div className="sx-palette-copy"><h3>BRAND COLOR</h3><div className="sx-palette" aria-label="SHUXIA color palette derived from the illustrations">
          {[
            {name:'Paper',hex:'#E5DDD4',role:'Warm neutral / background'},
            {name:'Summer green',hex:'#9BD3AE',role:'Primary illustration color'},
            {name:'Rain blue',hex:'#728E9B',role:'Secondary color'},
            {name:'Umbrella coral',hex:'#E58469',role:'Illustration accent'},
          ].map(color=><div className="sx-color" key={color.hex} style={{backgroundColor:color.hex}}><div className="sx-color-info"><span>{color.name}</span><span>{color.hex}</span></div><p>{color.role}</p></div>)}
        </div>
        <p className="sx-small-note">Representative screen colors sampled from the artwork / HEX values.</p></div></div>
        <div className="sx-section-heading sx-subheading"><h3>PATTERN / FROM REFERENCE TO SYSTEM</h3><p>The repeated strips, joints, and open spaces of woven cooling mats informed the vertical rhythm of the pattern. The designed motif carries this material reference into a graphic repeat and a cut-out surface.</p></div>
        <div className="sx-inspiration-board"><h4>INSPIRATION / REFERENCES</h4><div className="sx-inspiration-row">{[1,2,3,4].map(n=><div key={n}>{photo(`inspiration-mat-${n}`,`Inspiration reference ${n}: bamboo weaving and cooling mat texture`)}</div>)}</div><p className="sx-small-note">Bamboo weaving and cooling mats / reference imagery, not original SHUXIA design.</p></div>
        <div className="sx-section-heading sx-subheading"><h3>ORIGINAL PATTERN / GRAPHIC TO MATERIAL</h3><p>The repeating motif becomes a cut-out hanging panel, a packaging sleeve, and a storefront curtain. Keeping the same vertical rhythm connects the graphic identity to tactile objects and the spatial concept.</p></div>
        {photo('pattern-application','Original SHUXIA cut-out pattern shown together with its hanging panel application','sx-pattern-combined')}
        <div className="sx-pattern-labels"><span>Material application / hanging panel</span><span>Original SHUXIA pattern design</span></div>
      </section>

      <section className="sx-section" aria-labelledby="sx-packaging">
        <div className="sx-section-heading"><h2 id="sx-packaging">02 / PRODUCTS & PACKAGING</h2><p>A cooling soap and scent pack turn summer memories into a small daily ritual. Botanical illustrations preview the ingredients before the package is opened.</p></div>
        <div className="sx-packaging-pair">{photo('soap-set','Cooling soap packaging set with wooden box and printed elements')}{photo('cooling-soap-packaging-design','Flat artwork for the cooling soap packaging, with summer photography and illustrated mascots')}</div>
        <div className="sx-packaging-copy"><p className="sx-small-note">Cooling soap / packaging application & flat design</p><div className="sx-description"><p>The wooden container holds the soap, a mesh pouch, and illustrated paper elements. The patterned sleeve repeats the visual language of the cooling mat, while the scent pack introduces the botanical ingredients before opening.</p><p>These pieces extend the identity beyond a logo: texture, pattern, and illustration shape how the product is discovered and handled.</p></div></div>
        <div className="sx-pair">{photo('package-open','Opened wooden SHUXIA package with illustrated inserts')}{photo('scent-pack','Soap, mesh pouch and botanical scent cards inside the wooden package')}</div>
        <div className="sx-crossword">{photo('crossword','Two promotional crossword slips introducing SHUXIA products and scent notes')}<div className="sx-description"><h4>TAKEAWAY / BRAND CROSSWORD</h4><p>A playful crossword introduces products, ingredients, and scent vocabulary. It acts as both a product guide and a small printed takeaway, translating the brand’s everyday summer mood into an interaction.</p></div></div>
      </section>

      <section className="sx-section" aria-labelledby="sx-postcards">
        <div className="sx-section-heading sx-postcard-heading"><h2 id="sx-postcards">03 / ILLUSTRATION & POSTCARDS</h2><div className="sx-description"><p>A continuous postcard story follows the characters through a picnic, a rainy bus stop, and a quiet afternoon at home. The same characters and textured drawing style carry the identity through different scenes.</p><p>The postcards extend the scent experience into images of weather, rest, and companionship—small summer memories that can be kept or shared.</p></div></div>
        <div className="sx-postcard-story"><div>{photo('postcards-water','Two SHUXIA illustrated postcards photographed in rippling water')}</div><div><div className="sx-postcard-column">{photo('illustration-picnic','The two mascots enjoying a summer picnic')}{photo('illustration-rain','The mascots sharing an umbrella at a rainy bus stop')}{photo('illustration-home','The mascots resting on a bamboo mat at home')}</div></div></div><div className="sx-postcard-captions"><span>Postcard application / water mockup</span><span>Postcard series / three full artwork designs</span></div>
        {photo('postcards-studio','Front and back of the SHUXIA postcard collection on a pale background','sx-postcards-studio')}
      </section>

      <section className="sx-section" aria-labelledby="sx-website">
        <div className="sx-section-heading"><h2 id="sx-website">04 / WEBSITE DESIGN</h2><p>The brand’s quiet visual language continues online, from an atmospheric homepage to scent navigation and a product detail view.</p></div>
        <div className="sx-website-pair">{photo('website-grass','SHUXIA website displayed on a laptop in summer grass')}<div className="sx-web-main sx-laptop-video">
          <div className="sx-laptop-screen"><video autoPlay muted loop playsInline preload="metadata" poster="/assets/shuxia/website-demo-poster.webp" aria-label="SHUXIA website demonstration"><source src="/assets/shuxia/website-demo.mp4" type="video/mp4" /></video></div>
          <img className="sx-laptop-frame" src="/assets/shuxia/laptop-frame-video.webp" alt="Laptop frame surrounding the SHUXIA website video" />
        </div></div>
      </section>

      <section className="sx-section" aria-labelledby="sx-store">
        <div className="sx-section-heading"><h2 id="sx-store">05 / STOREFRONT CONCEPT</h2><p>Warm wood, soft lighting, and rain-textured glass extend the identity into a quiet scent shop. Window illustrations and the patterned curtain bring its handmade details into the space.</p></div>
        <div className="sx-store-pair">{photo('storefront','SHUXIA storefront concept with illustrated windows and patterned curtain')}{photo('signage','Warm illuminated SHUXIA sign with botanical motifs')}</div>
        <p className="sx-small-note">Storefront & light-box signage / concept visualizations</p>
      </section>

      <footer className="sx-end"><span>述夏 SHUXIA / Memory and scent of summer</span><button onClick={onBack}>Back to selected work ↗</button></footer>
      {zoom && <div className="sx-lightbox" role="dialog" aria-modal="true" aria-label={zoom.alt} onClick={() => setZoom(null)}><button autoFocus className="sx-lightbox-close" onClick={() => setZoom(null)}>Close ×</button><img src={zoom.src} alt={zoom.alt} /></div>}
    </article>
  );
}
