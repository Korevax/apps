/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import{a as o,w as s}from"./p-C23AVPx9.js";import{a as r,s as t}from"./p-Bd72UYI2.js";import{c as a}from"./p-CFuOr1Tu.js";import"./p-Dojwmvde.js";const m=()=>{const m=window;m.addEventListener("statusTap",(()=>{o((()=>{const o=document.elementFromPoint(m.innerWidth/2,m.innerHeight/2);if(!o)return;const n=r(o);n&&new Promise((o=>a(n,o))).then((()=>{s((async()=>{n.style.setProperty("--overflow","hidden"),await t(n,300),n.style.removeProperty("--overflow")}))}))}))}))};export{m as startStatusTap}