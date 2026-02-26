"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

// ── Utilities ─────────────────────────────────────────────
const fmt = (n) => n >= 1e12 ? `$${(n/1e12).toFixed(2)}T` : n >= 1e9 ? `$${(n/1e9).toFixed(1)}B` : n >= 1e6 ? `$${(n/1e6).toFixed(1)}M` : `$${n?.toLocaleString()}`;
const fmtPrice = (n) => n >= 1000 ? `$${n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}` : n >= 1 ? `$${n.toFixed(2)}` : `$${n.toFixed(4)}`;
const fmtPct = (n) => `${n > 0 ? "+" : ""}${n?.toFixed(2)}%`;
const pctColor = (n) => n > 2 ? "#00ff88" : n > 0 ? "#4ade80" : n < -2 ? "#ff4444" : n < 0 ? "#f87171" : "#94a3b8";

export default function Home() {
  const [page, setPage] = useState("overview");
  const [data, setData] = useState({ crypto: [], stocks: [] });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");

  useEffect(() => {
    fetch("/api/market-data")
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLastUpdate(new Date().toLocaleTimeString());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const allData = [...(data.crypto||[]), ...(data.stocks||[])];
  const totalMktCap = allData.reduce((s,d) => s+(d.market_cap||0), 0);
  const avgChange = allData.length ? allData.reduce((s,d) => s+(d.price_change_percentage_24h||0), 0) / allData.length : 0;
  const gainers = allData.filter(d => d.price_change_percentage_24h > 0).length;

  const nav = [
    {id:"overview", label:"Overview"},
    {id:"crypto", label:"Crypto"},
    {id:"stocks", label:"Stocks & ETFs"},
    {id:"gainers", label:"Gainers / Losers"},
    {id:"cross", label:"Cross-Asset"},
  ];

  if (loading) return (
    <div style={{minHeight:"100vh",background:"#060d16",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:48,height:48,border:"2px solid #1e2a3a",borderTop:"2px solid #00ff88",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 16px"}}/>
        <p style={{color:"#475569",fontFamily:"monospace",fontSize:13}}>Loading market data from Databricks...</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#060d16",fontFamily:"system-ui,sans-serif",color:"#e2e8f0"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#060d16}
        ::-webkit-scrollbar-thumb{background:#1e2a3a;border-radius:4px}
        tr:hover td{background:#1e2a3a22}
      `}</style>

      {/* Header */}
      <header style={{borderBottom:"1px solid #1e2a3a",padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",height:64,position:"sticky",top:0,background:"#060d16ee",backdropFilter:"blur(12px)",zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#00ff88,#0ea5e9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>⚡</div>
          <span style={{fontSize:18,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>Fin<span style={{color:"#00ff88"}}>Pulse</span></span>
          <span style={{color:"#1e2a3a",fontSize:18}}>|</span>
          <span style={{color:"#475569",fontSize:11,fontFamily:"'Space Mono',monospace"}}>LIVE MARKET DATA</span>
        </div>
        <nav style={{display:"flex",gap:4}}>
          {nav.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              style={{padding:"8px 16px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:500,background:page===n.id?"#1e2a3a":"transparent",color:page===n.id?"#00ff88":"#64748b",transition:"all 0.2s"}}>
              {n.label}
            </button>
          ))}
        </nav>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:"#00ff88",boxShadow:"0 0 8px #00ff88"}}/>
          <span style={{color:"#475569",fontSize:11,fontFamily:"'Space Mono',monospace"}}>Updated {lastUpdate}</span>
        </div>
      </header>

      <main style={{padding:32,maxWidth:1400,margin:"0 auto"}}>

        {/* Overview */}
        {page==="overview" && (
          <div>
            <div style={{marginBottom:32}}>
              <h1 style={{fontSize:32,fontWeight:700,letterSpacing:-1,marginBottom:8}}>Market <span style={{color:"#00ff88"}}>Overview</span></h1>
              <p style={{color:"#475569",fontSize:14}}>Real-time data · Databricks Unity Catalog · Bronze → Silver → Gold</p>
            </div>
            <div style={{display:"flex",gap:16,marginBottom:32}}>
              {[
                {label:"Total Market Cap", value:fmt(totalMktCap), sub:"All tracked assets"},
                {label:"Avg 24h Change", value:fmtPct(avgChange), sub:"Across all assets", color:pctColor(avgChange)},
                {label:"Gainers Today", value:`${gainers}/${allData.length}`, sub:"Assets positive"},
                {label:"Assets Tracked", value:allData.length, sub:`${data.crypto?.length} crypto · ${data.stocks?.length} stocks`},
              ].map(c => (
                <div key={c.label} style={{flex:1,background:"#0d1117",borderRadius:16,padding:24,border:"1px solid #1e2a3a"}}>
                  <div style={{color:"#64748b",fontSize:11,fontFamily:"'Space Mono',monospace",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>{c.label}</div>
                  <div style={{color:c.color||"#00ff88",fontSize:24,fontFamily:"'Space Mono',monospace",fontWeight:700,marginBottom:4}}>{c.value}</div>
                  <div style={{color:"#475569",fontSize:11}}>{c.sub}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
              <BarChart data={data.crypto||[]} title="Crypto — 24hr %"/>
              <BarChart data={data.stocks||[]} title="Stocks & ETFs — 24hr %"/>
            </div>
          </div>
        )}

        {/* Crypto */}
        {page==="crypto" && (
          <div>
            <div style={{marginBottom:32}}>
              <h1 style={{fontSize:32,fontWeight:700,letterSpacing:-1,marginBottom:8}}><span style={{color:"#00ff88"}}>Crypto</span> Markets</h1>
              <p style={{color:"#475569",fontSize:14}}>Top cryptocurrencies · Click columns to sort</p>
            </div>
            <div style={{background:"#0d1117",borderRadius:16,border:"1px solid #1e2a3a",overflow:"hidden",marginBottom:24}}>
              <DataTable data={data.crypto||[]} showSector={false}/>
            </div>
            <BarChart data={data.crypto||[]} title="24hr Price Change %"/>
          </div>
        )}

        {/* Stocks */}
        {page==="stocks" && (
          <div>
            <div style={{marginBottom:32}}>
              <h1 style={{fontSize:32,fontWeight:700,letterSpacing:-1,marginBottom:8}}><span style={{color:"#0ea5e9"}}>Stocks</span> & ETFs</h1>
              <p style={{color:"#475569",fontSize:14}}>Top stocks and index funds · Click columns to sort</p>
            </div>
            <div style={{background:"#0d1117",borderRadius:16,border:"1px solid #1e2a3a",overflow:"hidden",marginBottom:24}}>
              <DataTable data={data.stocks||[]} showSector={true}/>
            </div>
            <BarChart data={data.stocks||[]} title="24hr Price Change %"/>
          </div>
        )}

        {/* Gainers / Losers */}
        {page==="gainers" && (
          <div>
            <div style={{marginBottom:32}}>
              <h1 style={{fontSize:32,fontWeight:700,letterSpacing:-1,marginBottom:8}}>
                Top <span style={{color:"#00ff88"}}>Gainers</span> & <span style={{color:"#ff4444"}}>Losers</span>
              </h1>
              <p style={{color:"#475569",fontSize:14}}>Best and worst performers across all asset classes</p>
            </div>
            <GainersLosers data={allData}/>
          </div>
        )}

        {/* Cross Asset */}
        {page==="cross" && (
          <div>
            <div style={{marginBottom:32}}>
              <h1 style={{fontSize:32,fontWeight:700,letterSpacing:-1,marginBottom:8}}>
                Cross-Asset <span style={{color:"#8b5cf6"}}>Comparison</span>
              </h1>
              <p style={{color:"#475569",fontSize:14}}>Crypto vs Stocks vs ETFs side by side</p>
            </div>
            <CrossAsset data={allData}/>
          </div>
        )}
      </main>
    </div>
  );
}

// ── Sub Components ────────────────────────────────────────
function BarChart({ data, title }) {
  const sorted = [...data].sort((a,b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0,8);
  const max = Math.max(...sorted.map(d => Math.abs(d.price_change_percentage_24h||0)), 1);
  return (
    <div style={{background:"#0d1117",borderRadius:16,padding:24,border:"1px solid #1e2a3a"}}>
      <h3 style={{color:"#94a3b8",fontSize:12,fontFamily:"'Space Mono',monospace",letterSpacing:2,marginBottom:20,textTransform:"uppercase"}}>{title}</h3>
      {sorted.map(d => (
        <div key={d.symbol||d.coin_id} style={{display:"flex",alignItems:"center",marginBottom:10,gap:10}}>
          <span style={{color:"#e2e8f0",fontSize:11,fontFamily:"'Space Mono',monospace",width:50,flexShrink:0}}>{d.symbol||d.coin_id}</span>
          <div style={{flex:1,background:"#1e2a3a",borderRadius:4,height:20,overflow:"hidden"}}>
            <div style={{width:`${(Math.abs(d.price_change_percentage_24h||0)/max)*100}%`,height:"100%",background:d.price_change_percentage_24h>=0?"linear-gradient(90deg,#00ff88,#00cc6a)":"linear-gradient(90deg,#ff4444,#cc2222)",borderRadius:4,transition:"width 1s ease"}}/>
          </div>
          <span style={{color:pctColor(d.price_change_percentage_24h),fontSize:11,fontFamily:"'Space Mono',monospace",width:55,textAlign:"right",flexShrink:0}}>{fmtPct(d.price_change_percentage_24h||0)}</span>
        </div>
      ))}
    </div>
  );
}

function DataTable({ data, showSector }) {
  const [sort, setSort] = useState("market_cap");
  const [dir, setDir] = useState(-1);
  const sorted = [...data].sort((a,b) => dir*((a[sort]||0)-(b[sort]||0)));
  const Col = ({k,label}) => (
    <th onClick={()=>{setSort(k);setDir(sort===k?-dir:-1);}}
      style={{color:sort===k?"#00ff88":"#64748b",fontSize:11,fontFamily:"'Space Mono',monospace",letterSpacing:1,padding:"10px 16px",textAlign:k==="symbol"||k==="coin_id"||k==="name"||k==="coin_name"?"left":"right",cursor:"pointer",whiteSpace:"nowrap",userSelect:"none",textTransform:"uppercase"}}>
      {label}{sort===k?(dir===-1?"↓":"↑"):""}
    </th>
  );
  return (
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead>
          <tr style={{borderBottom:"1px solid #1e2a3a"}}>
            <th style={{color:"#64748b",fontSize:11,fontFamily:"'Space Mono',monospace",padding:"10px 16px",textAlign:"left",textTransform:"uppercase"}}>#</th>
            <Col k="name" label="Name"/>
            <Col k="current_price" label="Price"/>
            <Col k="price_change_percentage_24h" label="24h %"/>
            <Col k="market_cap" label="Mkt Cap"/>
            <Col k="total_volume" label="Volume"/>
            {showSector && <Col k="sector" label="Sector"/>}
          </tr>
        </thead>
        <tbody>
          {sorted.map((d,i) => (
            <tr key={d.symbol||d.coin_id} style={{borderBottom:"1px solid #0d1117"}}>
              <td style={{padding:"14px 16px",color:"#475569",fontSize:12,fontFamily:"'Space Mono',monospace"}}>{i+1}</td>
              <td style={{padding:"14px 16px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:32,height:32,borderRadius:8,background:"#1e2a3a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#00ff88",fontFamily:"'Space Mono',monospace",fontWeight:700,flexShrink:0}}>
                    {(d.symbol||d.coin_id||"").slice(0,3).toUpperCase()}
                  </div>
                  <div>
                    <div style={{color:"#e2e8f0",fontSize:13,fontWeight:600}}>{d.name||d.coin_name}</div>
                    <div style={{color:"#475569",fontSize:11,fontFamily:"'Space Mono',monospace"}}>{d.symbol||d.coin_id}</div>
                  </div>
                </div>
              </td>
              <td style={{padding:"14px 16px",textAlign:"right",color:"#e2e8f0",fontSize:13,fontFamily:"'Space Mono',monospace",fontWeight:600}}>{fmtPrice(d.current_price||0)}</td>
              <td style={{padding:"14px 16px",textAlign:"right"}}>
                <span style={{color:pctColor(d.price_change_percentage_24h),fontSize:13,fontFamily:"'Space Mono',monospace",fontWeight:700}}>{fmtPct(d.price_change_percentage_24h||0)}</span>
              </td>
              <td style={{padding:"14px 16px",textAlign:"right",color:"#94a3b8",fontSize:12,fontFamily:"'Space Mono',monospace"}}>{fmt(d.market_cap||0)}</td>
              <td style={{padding:"14px 16px",textAlign:"right",color:"#64748b",fontSize:12,fontFamily:"'Space Mono',monospace"}}>{fmt(d.total_volume||0)}</td>
              {showSector && <td style={{padding:"14px 16px",textAlign:"right",color:"#64748b",fontSize:11}}>{d.sector}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GainersLosers({ data }) {
  const sorted = [...data].sort((a,b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
  const gainers = sorted.slice(0,5);
  const losers = sorted.slice(-5).reverse();
  const Card = ({d, isGainer}) => (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:"#0d1117",borderRadius:10,border:`1px solid ${isGainer?"#00ff8822":"#ff444422"}`,marginBottom:8}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:36,height:36,borderRadius:8,background:isGainer?"#00ff8811":"#ff444411",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:isGainer?"#00ff88":"#ff4444",fontFamily:"'Space Mono',monospace",fontWeight:700}}>
          {(d.symbol||d.coin_id||"").slice(0,3).toUpperCase()}
        </div>
        <div>
          <div style={{color:"#e2e8f0",fontSize:13,fontWeight:600}}>{d.name||d.coin_name}</div>
          <div style={{color:"#475569",fontSize:11}}>{fmtPrice(d.current_price||0)}</div>
        </div>
      </div>
      <div style={{color:isGainer?"#00ff88":"#ff4444",fontSize:18,fontFamily:"'Space Mono',monospace",fontWeight:700}}>
        {fmtPct(d.price_change_percentage_24h||0)}
      </div>
    </div>
  );
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
      <div>
        <h3 style={{color:"#00ff88",fontSize:13,fontFamily:"'Space Mono',monospace",letterSpacing:2,marginBottom:16,textTransform:"uppercase"}}>🚀 Top Gainers</h3>
        {gainers.map(d => <Card key={d.symbol||d.coin_id} d={d} isGainer={true}/>)}
      </div>
      <div>
        <h3 style={{color:"#ff4444",fontSize:13,fontFamily:"'Space Mono',monospace",letterSpacing:2,marginBottom:16,textTransform:"uppercase"}}>💥 Top Losers</h3>
        {losers.map(d => <Card key={d.symbol||d.coin_id} d={d} isGainer={false}/>)}
      </div>
    </div>
  );
}

function CrossAsset({ data }) {
  const byClass = data.reduce((acc,d) => {
    const k = d.asset_class||d.asset_type||"crypto";
    if(!acc[k]) acc[k]=[];
    acc[k].push(d);
    return acc;
  }, {});
  const avgPct = arr => arr.reduce((s,d) => s+(d.price_change_percentage_24h||0), 0)/arr.length;
  const classes = Object.entries(byClass).map(([k,v]) => ({name:k, avg:avgPct(v), count:v.length}));
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
        {classes.map(c => (
          <div key={c.name} style={{background:"#0d1117",borderRadius:16,padding:24,textAlign:"center",border:`1px solid ${pctColor(c.avg)}22`}}>
            <div style={{color:"#64748b",fontSize:11,fontFamily:"'Space Mono',monospace",textTransform:"uppercase",letterSpacing:2,marginBottom:8}}>{c.name}</div>
            <div style={{color:pctColor(c.avg),fontSize:32,fontFamily:"'Space Mono',monospace",fontWeight:700}}>{fmtPct(c.avg)}</div>
            <div style={{color:"#475569",fontSize:11,marginTop:4}}>avg 24h · {c.count} assets</div>
          </div>
        ))}
      </div>
      <BarChart data={data} title="All Assets — 24hr Performance"/>
    </div>
  );
}