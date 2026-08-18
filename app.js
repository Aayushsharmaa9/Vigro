/* ============================================
   Daily Grind — App State & Shared Logic
   ============================================ */
const STATE_KEY = "dailygrind_state_v1";

function defaultState(){
  return {
    profile:{ name:"Ayush", age:null, experience:"Beginner", goals:"General Fitness", location:"Home" },
    settings:{ theme:"light", units:"metric", duration:30, difficulty:"Beginner", equipment:"None", daysPerWeek:5, workoutTime:"Evening",
      notif:{ workout:true, hydration:true, progress:true } },
    xp:0,
    log:{},          // "2026-08-17": {type:'workout'|'rest', workoutId, name, duration, exDone, exTotal}
    prs:{},          // exerciseId -> {value, unit, date}
    achievements:[],
    bestStreak:0,
    totalSets:0,
    customSession:null
  };
}

function loadState(){
  try{
    const raw = localStorage.getItem(STATE_KEY);
    if(!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultState(), parsed, {
      profile:Object.assign(defaultState().profile, parsed.profile||{}),
      settings:Object.assign(defaultState().settings, parsed.settings||{}, {notif:Object.assign(defaultState().settings.notif, (parsed.settings&&parsed.settings.notif)||{})})
    });
  }catch(e){ return defaultState(); }
}
function saveState(s){ localStorage.setItem(STATE_KEY, JSON.stringify(s)); }

function dateKey(d){ return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function todayKey(){ return dateKey(new Date()); }
function dayName(d){ return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()]; }
function dayNameFull(d){ return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()]; }

/* ---- Streak ---- */
function computeStreak(state){
  let streak=0;
  for(let i=0;;i++){
    const d=new Date(); d.setDate(d.getDate()-i);
    const k=dateKey(d);
    if(state.log[k]) streak++;
    else if(i===0) continue;
    else break;
  }
  return streak;
}

/* ---- XP / Level ---- */
function addXP(state, amount){
  state.xp += amount;
  return state.xp;
}
function xpProgress(xp){
  const lvl = levelFromXP(xp);
  const cur = xpForLevel(lvl);
  const next = xpForLevel(lvl+1);
  const pct = Math.max(2, Math.min(100, Math.round(((xp-cur)/(next-cur))*100)));
  return { lvl, name:levelName(lvl), cur, next, pct, into:xp-cur, span:next-cur };
}

/* ---- Log a workout / rest day ---- */
function logDay(state, entry){
  const k = todayKey();
  state.log[k] = entry;
  if(entry.type==='workout'){
    state.totalSets += (entry.setsCompleted||0);
  }
  const streak = computeStreak(state);
  if(streak > state.bestStreak) state.bestStreak = streak;
  return state;
}

/* ---- Achievements ---- */
function checkNewAchievements(state){
  const unlocked = [];
  ACHIEVEMENTS.forEach(a=>{
    if(!state.achievements.includes(a.id) && a.check(state)){
      state.achievements.push(a.id);
      unlocked.push(a);
    }
  });
  return unlocked;
}

/* ---- Theme ---- */
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme==='dark' ? 'dark':'light');
}

/* ---- Quote of the day (stable per day) ---- */
function quoteOfDay(){
  const d = new Date();
  const seed = d.getFullYear()*372 + d.getMonth()*31 + d.getDate();
  return QUOTES[seed % QUOTES.length];
}

/* ---- Nav rendering ---- */
const NAV_ITEMS = [
  {href:"index.html", icon:"🏠", label:"Home"},
  {href:"workouts.html", icon:"💪", label:"Workouts"},
  {href:"progress.html", icon:"📈", label:"Progress"},
  {href:"nutrition.html", icon:"🍎", label:"Nutrition"},
  {href:"more.html", icon:"⋯", label:"More"}
];
const TOP_NAV_ITEMS = [
  {href:"index.html", icon:"🏠", label:"Home"},
  {href:"workouts.html", icon:"💪", label:"Workouts"},
  {href:"exercises.html", icon:"📚", label:"Exercises"},
  {href:"plans.html", icon:"🗓️", label:"Plans"},
  {href:"progress.html", icon:"📈", label:"Progress"},
  {href:"nutrition.html", icon:"🍎", label:"Nutrition"},
  {href:"recovery.html", icon:"🛌", label:"Recovery"},
  {href:"settings.html", icon:"⚙️", label:"Settings"}
];

function currentPage(){
  const p = location.pathname.split("/").pop();
  return p || "index.html";
}

function renderNav(){
  const page = currentPage();
  const bottomWrap = document.getElementById("bottomnav");
  if(bottomWrap){
    bottomWrap.className = "bottomnav glass";
    bottomWrap.innerHTML = NAV_ITEMS.map(it=>{
      const active = (it.href===page) || (it.href==='more.html' && ['exercises.html','plans.html','recovery.html','settings.html','help.html','workout-player.html'].includes(page));
      return `<a href="${it.href}" class="${active?'active':''}"><span class="ic">${it.icon}</span>${it.label}</a>`;
    }).join("");
  }
  const topWrap = document.getElementById("topnav");
  if(topWrap){
    topWrap.className = "topnav glass";
    topWrap.innerHTML = TOP_NAV_ITEMS.map(it=>{
      const active = it.href===page;
      return `<a href="${it.href}" class="${active?'active':''}">${it.icon} ${it.label}</a>`;
    }).join("");
  }
}

/* ---- Celebration toast/modal ---- */
function showCelebration(items, onClose){
  const wrap = document.createElement("div");
  wrap.className = "toast-wrap";
  wrap.innerHTML = `<div class="toast-backdrop"></div>`;
  document.body.appendChild(wrap);

  let idx = 0;
  function renderStep(){
    const old = wrap.querySelector(".toast-card");
    if(old) old.remove();
    const item = items[idx];
    const card = document.createElement("div");
    card.className = "toast-card glass";
    card.innerHTML = `
      <div class="toast-emoji">${item.emoji}</div>
      <div class="toast-title">${item.title}</div>
      <div class="toast-sub">${item.sub}</div>
      <button class="btn btn-primary btn-full tap" id="toastNext">${idx<items.length-1 ? "Next" : "Continue"}</button>
    `;
    wrap.appendChild(card);
    card.querySelector("#toastNext").onclick = ()=>{
      idx++;
      if(idx>=items.length){
        wrap.classList.remove("show");
        setTimeout(()=>{ wrap.remove(); if(onClose) onClose(); }, 300);
      } else {
        renderStep();
      }
    };
  }
  renderStep();
  requestAnimationFrame(()=> wrap.classList.add("show"));
}

/* ---- Boot ---- */
document.addEventListener("DOMContentLoaded", ()=>{
  const state = loadState();
  applyTheme(state.settings.theme);
  renderNav();
});
