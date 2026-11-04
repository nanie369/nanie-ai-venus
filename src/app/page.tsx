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
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({messages:[{role:'user', content:userText}]})
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let aiText = '';
      setMsgs(m => [...m, {role:'ai', text:''}]);
      if (reader) {
        while(true){
          const {done,value} = await reader.read();
          if(done) break;
          const chunk = decoder.decode(value);
          for(const line of chunk.split('\n')){
            if(line.startsWith('0:"')){
              try{
                const t = JSON.parse(line.slice(2));
                aiText+=t;
                setMsgs(m=>{
                  const n=[...m];
                  n[n.length-1].text=aiText;
                  return n;
                });
              }catch{}
            }
          }
        }
      }
    } catch(e:any){ setMsgs(m=>[...m,{role:'ai',text:'Error: '+e.message}]) }
    setLoading(false);
  }

  return (
    <div style={{minHeight:'100vh', background:'black', color:'white', padding:'32px', fontFamily:'system-ui'}}>
      <div style={{border:'1px solid rgba(255,255,255,0.2)', display:'inline-block', padding:'4px 12px', fontSize:'10px', letterSpacing:'0.3em'}}>[ CONNECTED INTELLIGENCE ]</div>
      <h1 style={{fontSize:'64px', fontWeight:100, letterSpacing:'0.2em', margin:'20px 0 8px'}}>NANIE AI</h1>
      <p style={{fontSize:'12px', letterSpacing:'0.3em', opacity:0.5, marginBottom:'32px'}}>CHAT • VOICE • MEDIA • HOME</p>
      
      <div style={{maxWidth:'700px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'24px', padding:'16px', height:'400px', overflow:'auto', marginBottom:'16px'}}>
        {msgs.length===0 && <p style={{opacity:0.3, textAlign:'center', marginTop:'150px'}}>What should we explore? Type hello bro below!</p>}
        {msgs.map((m,i)=>(
          <div key={i} style={{marginBottom:'12px', textAlign: m.role==='user'?'right':'left'}}>
            <div style={{display:'inline-block', padding:'10px 16px', borderRadius:'16px', fontSize:'14px', background: m.role==='user'?'white':'rgba(255,255,255,0.1)', color: m.role==='user'?'black':'white'}}>{m.text}</div>
          </div>
        ))}
        {loading && <p style={{fontSize:'12px', opacity:0.4}}>NANIE thinking...</p>}
      </div>

      <div style={{maxWidth:'700px', display:'flex', gap:'8px', background:'rgba(255,255,255,0.1)', borderRadius:'999px', padding:'8px'}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask anything..." style={{flex:1, background:'transparent', border:'none', outline:'none', padding:'0 16px', color:'white'}} />
        <button onClick={send} style={{background:'white', color:'black', width:'40px', height:'40px', borderRadius:'999px', border:'none', cursor:'pointer'}}>↑</button>
      </div>
    </div>
  );
} 