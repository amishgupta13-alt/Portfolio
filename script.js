const header=document.getElementById('siteHeader');
const progress=document.getElementById('progressLine');
const nav=document.getElementById('nav');
const menu=document.getElementById('menuToggle');
const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu?.setAttribute('aria-expanded','false')}));

const sections=[...document.querySelectorAll('main section[id]')];
const links=[...document.querySelectorAll('.nav a')];
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+e.target.id));}})},{rootMargin:'-35% 0px -55% 0px',threshold:0});
sections.forEach(s=>observer.observe(s));

const revealObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target)}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

function updateScroll(){const y=window.scrollY;header.classList.toggle('scrolled',y>40);const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=max>0?`${(y/max)*100}%`:'0%'}
window.addEventListener('scroll',updateScroll,{passive:true});updateScroll();

if(!prefersReduced){document.querySelectorAll('[data-tilt]').forEach(card=>{card.addEventListener('pointermove',e=>{if(window.innerWidth<851)return;const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${y*-4}deg) rotateY(${x*4}deg) translateY(-6px)`});card.addEventListener('pointerleave',()=>card.style.transform='')})}

const counters=document.querySelectorAll('[data-count]');
const countObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;const target=Number(el.dataset.count);if(prefersReduced){el.textContent=target;countObserver.unobserve(el);return}let start=0;const step=()=>{start+=1;el.textContent=start;if(start<target)requestAnimationFrame(step)};requestAnimationFrame(step);countObserver.unobserve(el)})},{threshold:.8});
counters.forEach(c=>countObserver.observe(c));

document.getElementById('contactForm')?.addEventListener('submit',e=>{e.preventDefault();const form=new FormData(e.currentTarget);const subject=encodeURIComponent(form.get('subject'));const body=encodeURIComponent(`Name: ${form.get('name')}\nEmail: ${form.get('email')}\n\n${form.get('message')}`);window.location.href=`mailto:amishgupta13@gmail.com?subject=${subject}&body=${body}`});

document.getElementById('year').textContent=new Date().getFullYear();
