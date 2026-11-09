(function(){'use strict';var root=document.documentElement;var LANG=root.getAttribute('data-lang')||'en';var ROOT_PREFIX=root.getAttribute('data-root')||'';var STR=window.OM_STR||{};var REDUCED=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;function enterPage(){requestAnimationFrame(function(){requestAnimationFrame(function(){root.classList.remove('entering');});});}
var navigating=false;function navigate(url){if(!url)return;if(REDUCED){window.location.href=url;return;}
if(navigating)return;navigating=true;root.classList.add('leaving');window.location.href=url;}
window.addEventListener('pageshow',function(e){navigating=false;root.classList.remove('leaving');if(e.persisted){root.classList.add('entering');enterPage();}});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enterPage);else enterPage();setTimeout(function(){root.classList.remove('entering');},1200);function isInternalLink(a){if(!a||a.target==='_blank'||a.hasAttribute('download'))return false;if(a.hasAttribute('data-no-transition')||a.hasAttribute('data-search-open'))return false;var href=a.getAttribute('href')||'';if(!href||href.charAt(0)==='#')return false;if(/^(https?:)?\/\//i.test(href)||/^(mailto|tel|data|javascript):/i.test(href))return false;return true;}
document.addEventListener('click',function(e){if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;var a=e.target.closest?e.target.closest('a[href]'):null;if(!isInternalLink(a))return;var url=new URL(a.href,window.location.href);if(url.origin!==window.location.origin)return;if(url.pathname===window.location.pathname&&url.hash)return;e.preventDefault();navigate(a.href);},true);try{localStorage.setItem('om-lang',LANG);}catch(e){}
document.addEventListener('DOMContentLoaded',function(){if(window.OMLanguage)return;var langBtn=document.getElementById('lang-btn');if(langBtn)langBtn.addEventListener('click',function(){var target=langBtn.getAttribute('data-target');if(target){try{localStorage.setItem('om-lang',LANG==='en'?'ru':'en');}catch(e){}navigate(target);}});});var toast=document.getElementById('toast'),toastTimer;function showToast(msg){if(!toast)return;toast.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(function(){toast.classList.remove('show');},1600);}
document.addEventListener('click',function(e){var chip=e.target.closest('[data-copy]');if(!chip)return;var text=chip.getAttribute('data-copy');function done(){showToast(STR.copied||'Copied!');}
if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(done,function(){fallback();});}else fallback();function fallback(){var ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');done();}catch(err){}
document.body.removeChild(ta);}});var STAGGER_SEL='.card-grid,.feature-grid,.item-grid,.grid-2,.gif-row,.media-grid,.recipe-list,.steps,.faq,.download-meta';document.querySelectorAll(STAGGER_SEL).forEach(function(grid){Array.prototype.forEach.call(grid.children,function(child,i){if(!child.classList.contains('reveal'))child.classList.add('reveal');child.style.setProperty('--rd',Math.min(i,8)*70+'ms');});});var revealEls=document.querySelectorAll('.reveal');if('IntersectionObserver'in window&&revealEls.length&&!REDUCED){var io=new IntersectionObserver(function(entries){entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{threshold:0.08,rootMargin:'0px 0px -40px 0px'});revealEls.forEach(function(el){io.observe(el);});}else{revealEls.forEach(function(el){el.classList.add('in');});}
var counters=document.querySelectorAll('[data-count]');if('IntersectionObserver'in window&&counters.length){var cio=new IntersectionObserver(function(entries){entries.forEach(function(en){if(!en.isIntersecting)return;cio.unobserve(en.target);var el=en.target,target=parseInt(el.getAttribute('data-count'),10),suffix=el.getAttribute('data-suffix')||'';if(REDUCED){el.textContent=target+suffix;return;}
var t0=null,dur=1100;function tick(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/dur);k=1-Math.pow(1-k,3);el.textContent=Math.round(target*k)+suffix;if(k<1)requestAnimationFrame(tick);}
requestAnimationFrame(tick);});},{threshold:0.4});counters.forEach(function(el){cio.observe(el);});}else{counters.forEach(function(el){el.textContent=el.getAttribute('data-count')+(el.getAttribute('data-suffix')||'');});}
var progress=document.getElementById('progress'),toTop=document.getElementById('toTop');var header=document.querySelector('.site-header');function onScroll(){var h=document.documentElement;var max=h.scrollHeight-h.clientHeight;if(progress)progress.style.width=(max>0?(h.scrollTop/max)*100:0)+'%';if(toTop)toTop.classList.toggle('show',h.scrollTop>600);if(header)header.classList.toggle('scrolled',h.scrollTop>8);}
document.addEventListener('scroll',onScroll,{passive:true});onScroll();if(toTop)toTop.addEventListener('click',function(){window.scrollTo({top:0,behavior:REDUCED?'auto':'smooth'});});var tocLinks=document.querySelectorAll('.wiki-toc a');if(tocLinks.length){var heads=[];tocLinks.forEach(function(a){var id=a.getAttribute('href').slice(1);var el=document.getElementById(id);if(el)heads.push({el:el,a:a});});function spy(){var y=window.scrollY+100,current=null;heads.forEach(function(h){if(h.el.offsetTop<=y)current=h;});tocLinks.forEach(function(a){a.classList.remove('active');});if(current)current.a.classList.add('active');}
document.addEventListener('scroll',spy,{passive:true});spy();}
var lb=document.getElementById('lightbox');if(lb){var lbImg=lb.querySelector('img'),lbCap=lb.querySelector('.lightbox-cap');function closeLb(){lb.classList.remove('open');document.body.style.overflow='';}
document.addEventListener('click',function(e){var media=e.target.closest('[data-lightbox]');if(media){var img=media.tagName==='IMG'?media:media.querySelector('img');if(!img)return;lbImg.src=img.src;lbImg.alt=img.alt||'';var cap=media.closest('figure');lbCap.textContent=cap&&cap.querySelector('figcaption')?cap.querySelector('figcaption').textContent:(img.alt||'');lb.classList.add('open');document.body.style.overflow='hidden';return;}
if(e.target.closest('#lightbox'))closeLb();});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lb.classList.contains('open'))closeLb();});}
var overlay=document.getElementById('search-overlay');var input=document.getElementById('search-input');var resultsBox=document.getElementById('search-results');var INDEX=(window.OM_INDEX||[]).filter(function(p){return p.lang===LANG;});var sel=-1,currentResults=[];function openSearch(){if(!overlay)return;overlay.classList.add('open');document.body.style.overflow='hidden';input.value='';render('');setTimeout(function(){input.focus();},30);}
function closeSearch(){if(!overlay)return;overlay.classList.remove('open');document.body.style.overflow='';}
function esc(s){return s.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function highlight(text,q){var safe=esc(text);if(!q)return safe;var words=q.toLowerCase().split(/\s+/).filter(Boolean);words.forEach(function(w){if(w.length<2)return;var re=new RegExp('('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig');safe=safe.replace(re,'<mark>$1</mark>');});return safe;}
function snippet(text,q){var lower=text.toLowerCase(),idx=-1;var words=q.toLowerCase().split(/\s+/).filter(Boolean);for(var i=0;i<words.length;i++){idx=lower.indexOf(words[i]);if(idx>=0)break;}
if(idx<0)return text.slice(0,120)+(text.length>120?'…':'');var start=Math.max(0,idx-40);return(start>0?'…':'')+text.slice(start,start+150)+'…';}
function render(q){sel=-1;q=q.trim();if(!q){currentResults=INDEX.slice(0,8);resultsBox.innerHTML=currentResults.map(function(p,i){return resultHTML(p,'',i);}).join('')||'<div class="search-empty">'+(STR.search_empty||'')+'</div>';return;}
var words=q.toLowerCase().split(/\s+/).filter(Boolean);var scored=[];INDEX.forEach(function(p){var title=p.title.toLowerCase(),body=p.text.toLowerCase(),crumb=(p.crumb||'').toLowerCase();var score=0,ok=true;words.forEach(function(w){var t=title.indexOf(w),b=body.indexOf(w),c=crumb.indexOf(w);if(t<0&&b<0&&c<0){ok=false;return;}
if(t>=0)score+=10+(t===0?5:0);if(c>=0)score+=4;if(b>=0)score+=2;});if(ok&&score>0)scored.push({p:p,score:score});});scored.sort(function(a,b){return b.score-a.score;});currentResults=scored.slice(0,12).map(function(s){return s.p;});if(!currentResults.length){resultsBox.innerHTML='<div class="search-empty">'+(STR.search_none||'Nothing found')+'</div>';return;}
resultsBox.innerHTML=currentResults.map(function(p,i){return resultHTML(p,q,i);}).join('');}
function resultHTML(p,q,i){return'<a class="search-result" data-i="'+i+'" href="'+ROOT_PREFIX+p.url+'">'+'<div class="sr-title">'+highlight(p.title,q)+'</div>'+'<div class="sr-crumb">'+esc(p.crumb||'')+'</div>'+
(q?'<div class="sr-snippet">'+highlight(snippet(p.text,q),q)+'</div>':'')+'</a>';}
function moveSel(d){var items=resultsBox.querySelectorAll('.search-result');if(!items.length)return;sel=(sel+d+items.length)%items.length;items.forEach(function(el,i){el.classList.toggle('sel',i===sel);});items[sel].scrollIntoView({block:'nearest'});}
if(overlay&&input){document.addEventListener('click',function(e){if(e.target.closest('[data-search-open]')){e.preventDefault();openSearch();}
if(e.target===overlay)closeSearch();});input.addEventListener('input',function(){render(input.value);});input.addEventListener('keydown',function(e){if(e.key==='ArrowDown'){e.preventDefault();moveSel(1);}
else if(e.key==='ArrowUp'){e.preventDefault();moveSel(-1);}
else if(e.key==='Enter'){var items=resultsBox.querySelectorAll('.search-result');var target=items[sel>=0?sel:0];if(target){closeSearch();navigate(target.getAttribute('href'));}}});document.addEventListener('keydown',function(e){if(e.key==='Escape')closeSearch();});}})();
(function(){
if(window.__omV4){return}
window.__omV4=1;
var fine=window.matchMedia&&window.matchMedia('(pointer:fine)').matches;
var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!fine||reduced){return}
var cards=document.querySelectorAll('.addon-card,.feature,.item-card,.minicard,.recipe-card,.download-panel');
var raf=null;
Array.prototype.forEach.call(cards,function(card){
card.addEventListener('pointermove',function(e){
if(raf){return}
raf=requestAnimationFrame(function(){
raf=null;
var r=card.getBoundingClientRect();
card.style.setProperty('--mx',(e.clientX-r.left)+'px');
card.style.setProperty('--my',(e.clientY-r.top)+'px');
});
});
card.addEventListener('pointerleave',function(){
card.style.removeProperty('--mx');
card.style.removeProperty('--my');
});
});
var hero=document.querySelector('.hero');
var emblem=document.querySelector('.hero-emblem img');
if(hero&&emblem){
hero.addEventListener('pointermove',function(e){
var r=hero.getBoundingClientRect();
var x=(e.clientX-r.left)/r.width-.5;
var y=(e.clientY-r.top)/r.height-.5;
emblem.style.translate=(x*14)+'px '+(y*10)+'px';
});
hero.addEventListener('pointerleave',function(){emblem.style.translate='0px 0px'});
}
})();
