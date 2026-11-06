'use client';
import { useChat } from '@ai-sdk/react';
import { useState, useEffect } from 'react';

export default function Page() {
  const [input, setInput] = useState('');
  const [dark, setDark] = useState(false);
  const { messages, sendMessage } = useChat();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div style={{maxWidth:800, margin:'0 auto', padding:20, fontFamily:'sans-serif', background:dark?'#111':'#fff', color:dark?'#fff':'#000', minHeight:'100vh'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1 style={{textAlign:'center', flex:1}}>NANIE AI VENUS 🌕</h1>
        <button onClick={()=>setDark(!dark)} style={{padding:'6px 12px', borderRadius:20, border:'1px solid #ddd', cursor:'pointer'}}>{dark?'☀️ Light':'🌙 Dark'}</button>
      </div>
      <p style={{textAlign:'center', color:'#666'}}>Free AI Agent • Brain v21 - Super Brain • Memory + Tools + Voice</p>
      <div style={{display:'flex', gap:8, justifyContent:'center', margin:'10px 0'}}>
        <a href="https://apps.apple.com/app/nanie-ai-venus" target="_blank" style={{background:'#000', color:'#fff', padding:'8px 16px', borderRadius:20, textDecoration:'none', fontSize:14}}>🍎 Download on iOS</a>
        <a href="https://play.google.com/store/apps/details?id=com.nanieaivenus" target="_blank" style={{background:'#01875f', color:'#fff', padding:'8px 16px', borderRadius:20, textDecoration:'none', fontSize:14}}>▶️ Get on Android</a>
        <button onClick={()=>alert('Tap Share → Add to Home Screen to install NANIE AI VENUS app!')} style={{background:'#0070f3', color:'#fff', padding:'8px 16px', borderRadius:20, border:'none', cursor:'pointer', fontSize:14}}>📱 Install App</button>
      </div>
      <div style={{display:'flex', gap:6, flexWrap:'wrap', justifyContent:'center', marginBottom:10}}>
        {['💡 Ideas','💻 Code','🧮 Math','🌍 Translate','🎥 YouTube Summary','🎵 TikTok Caption'].map(t=>(
          <button key={t} onClick={()=>{setInput(t+' ');}} style={{padding:'6px 12px', borderRadius:20, border:'1px solid #ddd', background:dark?'#222':'#f5f5f5', cursor:'pointer'}}>{t}</button>
        ))}
      </div>
      <div style={{border:'1px solid #ddd', height:420, overflowY:'auto', padding:12, borderRadius:12, marginBottom:10, background:dark?'#1a1a1a':'#fff'}}>
        {messages.length===0 && <p style={{textAlign:'center', color:'#888'}}>Hey bro! NANIE AI VENUS here, what's up? Try: "Explain ENOTFOUND" or "Write TikTok caption for AI" or "Code in Python"</p>}
        {messages.map(m=>{
          const text = (m as any).content || (m.parts ? m.parts.filter((p:any)=>p.type==='text').map((p:any)=>p.text).join('') : '');
          return (
            <div key={m.id} style={{marginBottom:10, textAlign:m.role==='user'?'right':'left'}}>
              <span style={{background:m.role==='user'?'#0070f3':'#eee', color:m.role==='user'?'white':'black', padding:'8px 14px', borderRadius:16, display:'inline-block', whiteSpace:'pre-wrap', maxWidth:'80%'}}>{text}</span>
            </div>
          );
        })}
      </div>
      <form onSubmit={onSubmit} style={{display:'flex', gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask NANIE AI VENUS - Code, Math, Ideas, TikTok, YouTube..." style={{flex:1, padding:12, borderRadius:20, border:'1px solid #ddd', background:dark?'#222':'#fff', color:dark?'#fff':'#000'}} />
        <button type="submit" style={{padding:'12px 24px', background:'#0070f3', color:'white', border:'none', borderRadius:20, cursor:'pointer'}}>Send 🚀</button>
      </form>
      <p style={{textAlign:'center', fontSize:12, color:'#888', marginTop:12}}>Facebook: facebook.com/profile.php?id=61596158015235 • Instagram: @nanieaivenus • YouTube: @nanieaivenus • TikTok: @nanieaivenus • Snapchat: NANIE AI VENUS</p>
      <p style={{textAlign:'center', fontSize:12, color:'#888'}}>iOS: apps.apple.com/app/nanie-ai-venus • Android: play.google.com/store/apps/details?id=com.nanieaivenus • Web: nanie-ai-venus-7.vercel.app</p>
    </div>
  );
}