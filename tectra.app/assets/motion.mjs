// Progressive enhancement: content remains visible without JavaScript or reduced motion.
const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
if (!preference.matches && 'IntersectionObserver' in window) {
  const items=[...document.querySelectorAll('.reveal')];
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries) if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
  },{threshold:0.08});
  document.documentElement.classList.add('js-motion');
  for(const item of items) observer.observe(item);
  const revealAll=()=>{document.documentElement.classList.remove('js-motion');observer.disconnect();};
  preference.addEventListener('change',e=>{if(e.matches)revealAll();});
  // Keep anchored destinations visible when using keyboard navigation.
  document.addEventListener('focusin',e=>e.target.closest('.reveal')?.classList.add('is-visible'));
}
