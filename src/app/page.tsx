'use client';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div style={{maxWidth:700, margin:'0 auto', padding:20, fontFamily:'sans-serif'}}>
      <h1 style={{textAlign:'center'}}>NANIE AI VENUS 🌕</h1>
      <p style={{textAlign:'center', color:'#666'}}>COM8 • D4→IN1 • Dubai • Better than CHINNA • BRAIN v6 - Grey Always</p>
      <div style={{border:'1px solid #ddd', height:400, overflowY:'auto', padding:10, borderRadius:8, marginBottom:10}}>
        {messages.map(m=>{
          const text = (m as any).content || (m.parts ? m.parts.filter((p:any)=>p.type==='text').map((p:any)=>p.text).join('') : '');
          return (
            <div key={m.id} style={{marginBottom:8, textAlign:m.role==='user'?'right':'left'}}>
              <span style={{background:m.role==='user'?'#0070f3':'#eee', color:m.role==='user'?'white':'black', padding:'6px 12px', borderRadius:12, display:'inline-block', whiteSpace:'pre-wrap'}}>
                {text}
              </span>
            </div>
          );
        })}
      </div>
      <form onSubmit={onSubmit} style={{display:'flex', gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask NANIE AI..." style={{flex:1, padding:10, borderRadius:8, border:'1px solid #ddd'}} />
        <button type="submit" style={{padding:'10px 20px', background:'#0070f3', color:'white', border:'none', borderRadius:8}}>Send</button>
      </form>
    </div>
  );
}