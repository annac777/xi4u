'use client';
import {useEffect,useRef,useState} from 'react';
import {gardenTheme} from './garden-theme';
import {createGardenClock} from './garden-clock';
import {renderStyles,isGardenRenderStyle,type GardenRenderStyle} from './render-style';
import {Tabs,TabsList,TabsTrigger} from '@/components/ui/tabs';
import {Sun,Moon,CloudRain,Snowflake,CloudSun,RotateCcw,Pause,Play,Volume2,VolumeX,Camera,Maximize2} from 'lucide-react';

type Locale='zh'|'en';
declare const __MINITOOL__: boolean;
const playlist=__MINITOOL__?[]:[
 './music/spring-rain-1.m4a','./music/spring-rain-2.m4a',
 './music/cicada-veranda-1.m4a','./music/cicada-veranda-2.m4a',
 './music/maple-room-1.m4a','./music/maple-room-2.m4a',
] as const;
const seasons=[
 {id:'spring',name:'春',en:'SPRING',title:{zh:'花落一溪春',en:'Blossoms Drift into Spring'},detail:{zh:'嫩草初醒，檐下小猫酣睡',en:'New grass wakes as the cat sleeps beneath the eaves'},color:gardenTheme.spring.accent},
 {id:'summer',name:'夏',en:'SUMMER',title:{zh:'风过，夏日长',en:'A Breeze, a Long Summer'},detail:{zh:'书页遮面，风扇轻转',en:'A book shades the face; the fan turns softly'},color:gardenTheme.summer.accent},
 {id:'autumn',name:'秋',en:'AUTUMN',title:{zh:'听一片叶落下',en:'Listen to a Falling Leaf'},detail:{zh:'松鼠翻叶，寻一颗松果',en:'A squirrel rustles through leaves for a pinecone'},color:gardenTheme.autumn.accent},
 {id:'winter',name:'冬',en:'WINTER',title:{zh:'煮雪，等茶开',en:'Boil Snow, Await Tea'},detail:{zh:'枝上薄雪，小鸟临溪饮水',en:'Snow rests on branches; a bird drinks by the stream'},color:gardenTheme.winter.accent},
] as const;
const nightDetails:Record<string,{zh:string,en:string}>={
 spring:{zh:'树下猫眠，一床被褥等夜深',en:'The cat sleeps under the tree; a quilt waits indoors'},
 summer:{zh:'障子轻合，流萤绕溪',en:'Shoji doors close as fireflies gather by the stream'},
 autumn:{zh:'收起茶歇，小蝶掠过书页',en:'Tea is cleared; small butterflies pass the open book'},
 winter:{zh:'炭火未熄，折被候暖',en:'Embers remain, with a folded quilt nearby'},
};
const englishPeriods=['MIDNIGHT','LATE NIGHT','PRE-DAWN','DAWN','MORNING','LATE MORNING','NOON','AFTERNOON','LATE AFTERNOON','DUSK','EVENING','LATE EVENING'] as const;
const copy={
 zh:{
  world:'可单指旋转、双指平移缩放、鼠标左键旋转和右键平移的溪边回廊三维场景',brand:'溪畔 · 四时庭园',title:'溪间四时',seal:'四時',edition:'一隅回廊',editionSub:'一溪光阴',language:'切换界面语言',tools:'场景工具',
  reset:'恢复视角',resetAria:'恢复初始视角',capture:'保存画面',captureAria:'保存当前画面',fullscreen:'全屏',fullscreenAria:'全屏观察',day:'昼',night:'夜',paused:'此刻停留',moving:'风物轻动中',loading:'正在铺开一溪光阴…',loadError:'场景未能启动',
  seasons:'选择季节',render:'画面风格',jumpDay:'跳到白天',noon:'跳到正午',jumpNight:'跳到黑夜',nightTime:'跳到夜晚',clear:'晴天',rain:'下雨',springRain:'夜间雷雨',springRainTitle:'春夜雷雨',snow:'下雪',
  resume:'继续动画',pause:'暂停动画',resumeTitle:'继续动画与时间',pauseTitle:'暂停动画与时间',soundOff:'关闭环境音',soundOn:'开启环境音',timeGroup:'时辰与自动四季',timeTitle:'6分钟一日 · 12分钟一季',timeSlider:'调整时辰',stopClock:'停止时间和四季流转',startClock:'继续时间和四季流转',auto:'自动流转',hold:'时间停留',gesture:'单指旋转 · 双指平移缩放',duration:'一日 6 分钟 · 一季 12 分钟',
 },
 en:{
  world:'A streamside veranda garden. Drag with one finger or the left mouse button to rotate; use two fingers to pan and pinch, or the right mouse button to pan.',brand:'STREAMSIDE · SEASONAL GARDEN',title:'Four Seasons',seal:'四時',edition:'A QUIET VERANDA',editionSub:'BESIDE THE STREAM',language:'Change interface language',tools:'Scene tools',
  reset:'Reset view',resetAria:'Restore the initial view',capture:'Save image',captureAria:'Save the current view',fullscreen:'Full screen',fullscreenAria:'View in full screen',day:'DAY',night:'NIGHT',paused:'TIME IS HELD',moving:'THE GARDEN STIRS',loading:'Opening the garden…',loadError:'The garden could not start: ',
  seasons:'Choose a season',render:'Visual style',jumpDay:'Go to daytime',noon:'Go to noon',jumpNight:'Go to night',nightTime:'Go to late evening',clear:'Clear weather',rain:'Rain',springRain:'Night thunderstorm',springRainTitle:'Spring night thunderstorm',snow:'Snow',
  resume:'Resume animation',pause:'Pause animation',resumeTitle:'Resume animation and time',pauseTitle:'Pause animation and time',soundOff:'Turn ambient sound off',soundOn:'Turn ambient sound on',timeGroup:'Time and seasonal cycle',timeTitle:'6 minutes per day · 12 minutes per season',timeSlider:'Adjust time of day',stopClock:'Pause time and seasonal cycle',startClock:'Resume time and seasonal cycle',auto:'AUTO',hold:'HOLD',gesture:'ONE-FINGER ROTATE · TWO-FINGER PAN AND PINCH',duration:'6 MINUTES PER DAY · 12 MINUTES PER SEASON',
 },
} as const;

export default function Page(){
 const mount=useRef<HTMLDivElement>(null),api=useRef<any>(null),settings=useRef<any>({}),music=useRef<HTMLAudioElement>(null);
 const [clock,setClock]=useState(()=>createGardenClock().getSnapshot());
 const [weather,setWeather]=useState('clear'),[paused,setPaused]=useState(false),[sound,setSound]=useState(!__MINITOOL__);
 const [renderStyle,setRenderStyle]=useState<GardenRenderStyle>('clear'),[locale,setLocale]=useState<Locale>('zh'),[track,setTrack]=useState(0),[ready,setReady]=useState(false),[error,setError]=useState('');
 const {season,night}=clock,pixelated=renderStyle==='pixel',t=copy[locale];
 settings.current={season,night,hour:clock.hour,clockRunning:clock.running,weather,paused,sound,renderStyle,pixelated,locale};
 function configure(patch:Record<string,unknown>){api.current?.setState(patch);}
 function chooseWeather(value:string){setWeather(value);configure({weather:value,manualWeather:true});}
 useEffect(()=>{
  const flex=document.createElement('div');flex.style.cssText='position:absolute;visibility:hidden;display:flex;flex-direction:column;row-gap:1px';flex.appendChild(document.createElement('div'));flex.appendChild(document.createElement('div'));document.body.appendChild(flex);
  if(flex.scrollHeight===1)document.documentElement.classList.add('supports-flex-gap');flex.remove();
 },[]);
 useEffect(()=>{
  document.documentElement.lang=locale==='zh'?'zh-CN':'en';
  document.title=locale==='zh'?'溪间四时':'Four Seasons by the Stream';
  document.querySelector('meta[name="description"]')?.setAttribute('content',locale==='zh'?'一隅回廊，一溪四季。可旋转的日式庭院三维沙盘。':'A rotating streamside garden shaped by four seasons, weather, and the passing hours.');
 },[locale]);
 useEffect(()=>{
  let dead=false,instance:any;
  import('./world').then(({createWorld})=>{
   if(dead||!mount.current)return;
   instance=createWorld(mount.current,{onTimeChange:(snapshot:any)=>{if(dead)return;setClock(snapshot);setWeather(snapshot.weather);}});
   api.current=instance;setReady(true);
  }).catch(e=>setError(e instanceof Error?e.message:String(e)));
  return()=>{dead=true;instance?.dispose();api.current=null;};
 },[]);
 // Clock updates flow from the scene to the UI, never back into its timeline.
 useEffect(()=>{api.current?.setState({paused,sound,renderStyle});},[paused,sound,renderStyle,ready]);
 useEffect(()=>{
  const player=music.current;if(__MINITOOL__||!player)return;player.volume=.36;
  if(sound&&!paused)player.play().catch(()=>{});else player.pause();
 },[sound,paused,track]);
 useEffect(()=>{
  if(__MINITOOL__)return;
  const unlock=()=>{if(sound&&!paused){music.current?.play().catch(()=>{});api.current?.setState({sound:true});}};
  window.addEventListener('pointerdown',unlock);window.addEventListener('keydown',unlock);
  return()=>{window.removeEventListener('pointerdown',unlock);window.removeEventListener('keydown',unlock);};
 },[sound,paused]);
 function toggleSound(){
  const next=!sound;setSound(next);
  if(next)music.current?.play().catch(()=>{});else music.current?.pause();
 }
 useEffect(()=>{
  const context=(document as any).modelContext;if(!context?.registerTool)return;
  const lifecycle=new AbortController();
  Promise.resolve(context.registerTool({
   name:'configure_garden',description:'Change the visible garden season, time of day, weather, or rendering style.',
   inputSchema:{type:'object',properties:{season:{type:'string',enum:['spring','summer','autumn','winter']},night:{type:'boolean'},hour:{type:'number',minimum:0,maximum:24},clockRunning:{type:'boolean'},renderStyle:{type:'string',enum:renderStyles.map(style=>style.id)},pixelated:{type:'boolean'},weather:{type:'string',enum:['clear','rain','snow']}},additionalProperties:false},
   annotations:{readOnlyHint:false,untrustedContentHint:false},
   async execute(input:any){
    if(input.season!==undefined&&!seasons.some(s=>s.id===input.season))throw new Error('Invalid season');
    if(input.weather!==undefined&&!['clear','rain','snow'].includes(input.weather))throw new Error('Invalid weather');
    for(const key of ['night','pixelated','clockRunning'])if(input[key]!==undefined&&typeof input[key]!=='boolean')throw new Error('Invalid '+key);
    if(input.hour!==undefined&&(!Number.isFinite(input.hour)||input.hour<0||input.hour>24))throw new Error('Invalid hour');
    if(input.renderStyle!==undefined&&!isGardenRenderStyle(input.renderStyle))throw new Error('Invalid render style');
    const nextStyle=input.renderStyle??(input.pixelated!==undefined?(input.pixelated?'pixel':'clear'):settings.current.renderStyle);
    const nextSeason=input.season??settings.current.season;
    let nextWeather=input.weather??settings.current.weather;
    if((nextWeather==='snow'&&nextSeason!=='winter')||(nextWeather==='rain'&&nextSeason==='winter'))nextWeather='clear';
    setWeather(nextWeather);setRenderStyle(nextStyle);
    if(!api.current)throw new Error('Garden is still loading');
    api.current.setState({...input,weather:nextWeather,renderStyle:nextStyle});
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    return {updated:true,...settings.current};
   },
  },{signal:lifecycle.signal})).catch(()=>{});
  return()=>lifecycle.abort();
 },[]);
 const s=seasons.find(s=>s.id===season)!;
 const minutes=Math.floor(clock.hour*60),timeLabel=`${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;
 const periodLabel=locale==='zh'?clock.periodName:englishPeriods[clock.periodIndex];
 return <main data-season={season} className={`${night?'experience night':'experience'} ${pixelated?'pixel-view':'smooth-view'} locale-${locale}`} style={{'--accent':s.color,'--season-background':gardenTheme[season].day} as any}>
  {!__MINITOOL__&&<audio ref={music} src={playlist[track]} preload="metadata" onEnded={()=>setTrack(value=>(value+1)%playlist.length)}/>}
  <div ref={mount} className="world" aria-label={t.world}/>
  <header className="masthead">
   <div className="seal">{t.seal}</div>
   <div className="brand"><p className="eyebrow">{t.brand}</p><h1>{t.title}</h1></div>
   <div className="header-aside">
    <div className="edition">{t.edition}<br/><span>{t.editionSub}</span></div>
    <div className="language-switch" role="group" aria-label={t.language}>
     <button type="button" className={locale==='zh'?'selected':''} aria-pressed={locale==='zh'} aria-label={locale==='zh'?'中文':'Chinese'} onClick={()=>setLocale('zh')}>中</button>
     <i aria-hidden="true">/</i>
     <button type="button" className={locale==='en'?'selected':''} aria-pressed={locale==='en'} aria-label={locale==='zh'?'英文':'English'} onClick={()=>setLocale('en')}>EN</button>
    </div>
    <div className="right-tools" role="group" aria-label={t.tools}>
     <button aria-label={t.resetAria} title={t.reset} onClick={()=>api.current?.reset()}><RotateCcw/></button>
     <button aria-label={t.captureAria} title={t.capture} onClick={()=>api.current?.capture(locale)}><Camera/></button>
     {!__MINITOOL__&&<button aria-label={t.fullscreenAria} title={t.fullscreen} onClick={()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.()}><Maximize2/></button>}
     {!__MINITOOL__&&<a href="https://github.com/annac777/xi4u" target="_blank" rel="noopener noreferrer" aria-label={locale==='zh'?'在 GitHub 查看开源代码':'View source on GitHub'} title={locale==='zh'?'开源代码 · AC':'Source code · AC'}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 19c-4 1.2-4-2-6-2m12 5v-3.5a3 3 0 0 0-.8-2.3c2.7-.3 5.6-1.3 5.6-6A4.7 4.7 0 0 0 18.5 7a4.3 4.3 0 0 0-.1-3.2S17.4 3.5 15 5a11 11 0 0 0-6 0C6.6 3.5 5.6 3.8 5.6 3.8A4.3 4.3 0 0 0 5.5 7a4.7 4.7 0 0 0-1.3 3.3c0 4.7 2.9 5.7 5.6 6A3 3 0 0 0 9 18.5V22"/></svg></a>}
    </div>
   </div>
  </header>
  <div key={season} className="scene-caption"><p className="eyebrow">{locale==='zh'?`${s.name} / ${night?t.night:t.day}`:`${s.en} / ${night?t.night:t.day}`}</p><h2>{s.title[locale]}</h2><p>{night?nightDetails[season][locale]:s.detail[locale]}</p><div className="live"><i className={paused?'still':''}/>{paused?t.paused:t.moving}</div></div>
  {!ready&&<div className="loading" role="status">{error?(locale==='zh'?t.loadError:t.loadError+error):t.loading}</div>}
  <footer>
   <div className="controls">
    <div className="control-main">
     <Tabs value={season} onValueChange={v=>configure({season:String(v)})} className="season-tabs"><TabsList aria-label={t.seasons}>{seasons.map(x=><TabsTrigger key={x.id} value={x.id}><b>{locale==='zh'?x.name:x.en}</b></TabsTrigger>)}</TabsList></Tabs>
     <div className="divider season-divider"/>
     <div className="control-settings">
      <div className="render-mode-control" role="group" aria-label={t.render}>{renderStyles.map(style=><button type="button" key={style.id} className={renderStyle===style.id?'selected':''} aria-pressed={renderStyle===style.id} onClick={()=>setRenderStyle(style.id)}>{locale==='zh'?style.labelZh:style.labelEn}</button>)}</div>
      <div className="divider"/>
      <div className="toggles"><button className={!night?'selected':''} aria-pressed={!night} aria-label={t.jumpDay} title={t.noon} onClick={()=>configure({hour:12,timeTransition:true})}><Sun/></button><button className={night?'selected':''} aria-pressed={night} aria-label={t.jumpNight} title={t.nightTime} onClick={()=>configure({hour:22,timeTransition:true})}><Moon/></button></div>
      <div className="divider"/>
      <div className="toggles weather">
       <button className={weather==='clear'?'selected':''} aria-label={t.clear} aria-pressed={weather==='clear'} onClick={()=>chooseWeather('clear')}><CloudSun/></button>
       {season!=='winter'?<button className={weather==='rain'?'selected':''} aria-label={season==='spring'&&night?t.springRain:t.rain} title={season==='spring'&&night?t.springRainTitle:t.rain} aria-pressed={weather==='rain'} onClick={()=>chooseWeather('rain')}><CloudRain/></button>:<button className={weather==='snow'?'selected':''} aria-label={t.snow} aria-pressed={weather==='snow'} onClick={()=>chooseWeather('snow')}><Snowflake/></button>}
      </div>
      <div className="divider"/>
      <div className="toggles"><button aria-label={paused?t.resume:t.pause} title={paused?t.resumeTitle:t.pauseTitle} aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?<Play/>:<Pause/>}</button>{!__MINITOOL__&&<button aria-label={sound?t.soundOff:t.soundOn} aria-pressed={sound} onClick={toggleSound}>{sound?<Volume2/>:<VolumeX/>}</button>}</div>
     </div>
    </div>
    <div className="time-control" role="group" aria-label={t.timeGroup} title={t.timeTitle}>
     <span className="time-readout"><b>{periodLabel}</b><time>{timeLabel}</time></span>
     <input type="range" min="0" max="23.99" step="0.01" value={clock.hour} aria-label={t.timeSlider} aria-valuetext={`${periodLabel} ${timeLabel}`} onChange={e=>configure({hour:Number(e.target.value)})}/>
     <button className={clock.running?'selected':''} aria-pressed={clock.running} aria-label={clock.running?t.stopClock:t.startClock} onClick={()=>configure({clockRunning:!clock.running})}>{clock.running?t.auto:t.hold}</button>
    </div>
   </div>
   <div className="hints"><span>{t.gesture}</span><span>{t.duration}</span></div>
  </footer>
 </main>;
}
