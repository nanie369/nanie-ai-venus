'use client';
import { useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<{role:string,text:string}[]>([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userText = input;
    setMsgs(m => [...m, {role:'user', text:userText}]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({messages:[{role:'user', content:userText}]})
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      setMsgs(m => [...m, {role:'assistant', text:''}]);
      if (reader) {
        while (true) {
          const {done, value} = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const text = JSON.parse(line.slice(2));
                assistantText += text;
                setMsgs(prev => {
                  const copy = [...prev];
                  copy[copy.length-1] = {role:'assistant', text:assistantText};
                  return copy;
                });
              } catch {
                // ignore
              }
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setMsgs(m => [...m, {role:'assistant', text:'Error: Check API key in .env.local'}]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{maxWidth:700, margin:'0 auto', padding:20, fontFamily:'sans-serif'}}>
      <h1 style={{textAlign:'center'}}>NANIE AI VENUS 🌕</h1>
      <p style={{textAlign:'center', color:'#666'}}>COM8 • D4→IN1 • Dubai • Better than CHINNA</p>
      <div style={{border:'1px solid #ddd', height:400, overflowY:'auto', padding:10, borderRadius:8, marginBottom:10}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{marginBottom:8, textAlign:m.role==='user'?'right':'left'}}>
            <span style={{background:m.role==='user'?'#0070f3':'#eee', color:m.role==='user'?'white':'black', padding:'6px 12px', borderRadius:12, display:'inline-block'}}>
              {m.text}
            </span>
          </div>
        ))}
        {loading && <div>Thinking...</div>}
      </div>
      <div style={{display:'flex', gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask NANIE AI..." style={{flex:1, padding:10, borderRadius:8, border:'1px solid #ddd'}} />
        <button onClick={send} disabled={loading} style={{padding:'10px 20px', background:'#0070f3', color:'white', border:'none', borderRadius:8}}>Send</button>
      </div>
    </div>
  );
}