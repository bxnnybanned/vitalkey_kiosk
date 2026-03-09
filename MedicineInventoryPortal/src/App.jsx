import { useMemo, useState } from "react";

const initialRx = [
  { id: "RX-002", patient: "Juan dela Cruz", doctor: "Dr. Rivera", date: "Mar 9", status: "Pending" },
  { id: "RX-004", patient: "Rosa Mendoza", doctor: "Dr. Rivera", date: "Mar 9", status: "Pending" },
  { id: "RX-005", patient: "Ana Reyes", doctor: "Dr. Rivera", date: "Mar 8", status: "Ready" },
  { id: "RX-001", patient: "Maria Santos", doctor: "Dr. Rivera", date: "Mar 8", status: "Dispensed" }
];

const initialStock = [
  { id: "M-001", name: "Amoxicillin 500mg", qty: 150, expiration: "2026-12-01" },
  { id: "M-002", name: "Paracetamol 500mg", qty: 12, expiration: "2026-06-15" },
  { id: "M-003", name: "Ibuprofen 400mg", qty: 80, expiration: "2026-09-30" },
  { id: "M-004", name: "Metformin 850mg", qty: 5, expiration: "2026-03-20" },
  { id: "M-005", name: "Amlodipine 5mg", qty: 200, expiration: "2027-01-10" },
  { id: "M-006", name: "Losartan 50mg", qty: 8, expiration: "2026-04-05" },
  { id: "M-007", name: "Omeprazole 20mg", qty: 95, expiration: "2026-11-20" },
  { id: "M-008", name: "Cetirizine 10mg", qty: 60, expiration: "2026-08-14" }
];

const initialHistory = [
  { medicine: "Amoxicillin 500mg", qty: 21, date: "Mar 9", rxId: "RX-001", keeper: "K. Dela Rosa" },
  { medicine: "Paracetamol 500mg", qty: 6, date: "Mar 9", rxId: "RX-001", keeper: "K. Dela Rosa" },
  { medicine: "Ibuprofen 400mg", qty: 10, date: "Mar 8", rxId: "RX-003", keeper: "K. Dela Rosa" },
  { medicine: "Metformin 850mg", qty: 30, date: "Mar 7", rxId: "RX-006", keeper: "K. Dela Rosa" },
  { medicine: "Amlodipine 5mg", qty: 30, date: "Mar 7", rxId: "RX-007", keeper: "K. Dela Rosa" }
];

const rxMedicineMap = {
  "RX-001": { medicine: "Amoxicillin 500mg", qty: 21 },
  "RX-002": { medicine: "Paracetamol 500mg", qty: 6 },
  "RX-004": { medicine: "Losartan 50mg", qty: 8 },
  "RX-005": { medicine: "Metformin 850mg", qty: 5 }
};

const weeklyDispensing = [6, 4, 8, 3, 7, 2, 1];
const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function icon(name) {
  if (name === "grid") return <svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>;
  if (name === "file") return <svg viewBox="0 0 24 24"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/></svg>;
  if (name === "pulse") return <svg viewBox="0 0 24 24"><path d="M3 12h4l2-5 3 10 2-6h7"/></svg>;
  if (name === "arrow") return <svg viewBox="0 0 24 24"><path d="M5 12h13"/><path d="M13 6l6 6-6 6"/></svg>;
  if (name === "list") return <svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>;
  if (name === "alert") return <svg viewBox="0 0 24 24"><path d="M12 4l8 14H4z"/><path d="M12 9v4"/><circle cx="12" cy="16.5" r=".8"/></svg>;
  if (name === "history") return <svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 109-9"/><path d="M3 4v8h8"/><path d="M12 8v5l3 2"/></svg>;
  if (name === "calendar") return <svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>;
  if (name === "bell") return <svg viewBox="0 0 24 24"><path d="M12 4a5 5 0 00-5 5v2.7c0 .8-.2 1.6-.6 2.3L5 16h14l-1.4-2c-.4-.7-.6-1.5-.6-2.3V9a5 5 0 00-5-5z"/><path d="M10 18a2 2 0 004 0"/></svg>;
  if (name === "logo") return <svg viewBox="0 0 24 24"><path d="M3 12h4l2-6 3 12 2-7h7"/></svg>;
  if (name === "box") return <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M4 10h16"/></svg>;
  if (name === "warn") return <svg viewBox="0 0 24 24"><path d="M12 4l8 14H4z"/></svg>;
  if (name === "logout") return <svg viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4"/><path d="M13 16l5-4-5-4"/><path d="M18 12H9"/></svg>;
  return <svg viewBox="0 0 24 24"><path d="M4 12h16"/></svg>;
}

function statusClass(s) {
  return s.toLowerCase().replace(" ", "-");
}

function stockStatus(qty) {
  if (qty <= 5) return "Critical";
  if (qty <= 20) return "Low Stock";
  return "In Stock";
}

function daysUntil(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
}

function formatShortDate(dateObj) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(dateObj);
}

function Login({ onLogin }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  function submit(e) {
    e.preventDefault();
    if (u.trim().toLowerCase() === "keeper" && p === "vitalkey2026") {
      setErr("");
      onLogin();
      return;
    }
    setErr("Invalid credentials. Use keeper / vitalkey2026.");
  }

  return (
    <main className="login-page">
      <section className="login-left">
        <div className="brand-head"><span className="logo">{icon("logo")}</span><div><h1>VitalKey</h1><p>Inventory Portal</p></div></div>
        <h2>Medicine inventory and dispensing made reliable.</h2>
        <p>Track stock, process prescription requests, and release medicines with one secure system.</p>
      </section>
      <section className="login-right">
        <form className="login-card" onSubmit={submit}>
          <h3>Welcome back</h3>
          <p>Sign in to your VitalKey medicine account.</p>
          <label>Username</label>
          <input value={u} onChange={(e)=>setU(e.target.value)} placeholder="Enter username" />
          <label>Password</label>
          <input type="password" value={p} onChange={(e)=>setP(e.target.value)} placeholder="Enter password" />
          {err ? <div className="error">{err}</div> : null}
          <button type="submit">Sign In</button>
          <code>keeper / vitalkey2026</code>
        </form>
      </section>
    </main>
  );
}

function Sidebar({ page, setPage, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <span className="sb-logo">{icon("logo")}</span>
        <div><strong>VitalKey</strong><p>INVENTORY</p></div>
      </div>

      <div className="sb-group"><h4>OVERVIEW</h4>
        <button className={page==="dashboard"?"active": ""} onClick={()=>setPage("dashboard")}>{icon("grid")}Dashboard</button>
      </div>

      <div className="sb-group"><h4>PRESCRIPTIONS</h4>
        <button className={page==="rx-requests"?"active": ""} onClick={()=>setPage("rx-requests")}>{icon("file")}Rx Requests</button>
        <button className={page==="process-rx"?"active": ""} onClick={()=>setPage("process-rx")}>{icon("pulse")}Process Rx</button>
        <button className={page==="release"?"active": ""} onClick={()=>setPage("release")}>{icon("arrow")}Release</button>
      </div>

      <div className="sb-group"><h4>INVENTORY</h4>
        <button className={page==="manage-stock"?"active": ""} onClick={()=>setPage("manage-stock")}>{icon("list")}Manage Stock</button>
        <button className={page==="alerts"?"active": ""} onClick={()=>setPage("alerts")}>{icon("alert")}Alerts</button>
        <button className={page==="history"?"active": ""} onClick={()=>setPage("history")}>{icon("history")}History</button>
      </div>

      <button type="button" className="sb-user" onClick={onLogout} aria-label="Log out">
        <span>KD</span>
        <div className="sb-user-meta"><strong>K. Dela Rosa</strong><p>Medicine Keeper · Logout</p></div>
        <i className="sb-logout-icon">{icon("logout")}</i>
      </button>
    </aside>
  );
}

function Topbar({ title }) {
  const d = useMemo(()=>new Intl.DateTimeFormat("en-US", { weekday:"short", month:"short", day:"numeric", year:"numeric" }).format(new Date()), []);
  return (
    <header className="topbar">
      <h1>{title}</h1>
      <div className="top-right"><div className="date">{d}</div><button className="bell">{icon("bell")}<span className="dot"/></button><span className="avatar">KD</span></div>
    </header>
  );
}

function Dashboard({ rx }) {
  const pending = rx.filter((x)=>x.status==="Pending").length;
  const total = 8;
  return (
    <div className="content">
      <section className="title-block"><h2>Inventory Dashboard</h2><p>Stock levels and prescription overview.</p></section>
      <section className="cards4">
        <article className="card blue"><span>{icon("box")}</span><h3>{total}</h3><p>Total Medicines</p></article>
        <article className="card orange"><span>{icon("warn")}</span><h3>3</h3><p>Low Stock</p></article>
        <article className="card red"><span>{icon("calendar")}</span><h3>2</h3><p>Expiring Soon</p></article>
        <article className="card violet"><span>{icon("file")}</span><h3>{pending}</h3><p>Pending Rx</p></article>
      </section>
      <section className="dash-grid">
        <article className="panel"><h3>Weekly Dispensing</h3><p>Units released per day</p><div className="bars">{weeklyDispensing.map((v,i)=><div key={dayLabels[i]} className="bar-wrap"><div className={`bar ${i===5?"sat":""}`} style={{height:`${v*16}px`}}/><small>{dayLabels[i]}</small></div>)}</div></article>
        <article className="panel"><h3>Stock Status</h3><div className="donut"/><ul className="legend"><li><span className="g"/>In Stock <b>5</b></li><li><span className="o"/>Low Stock <b>2</b></li><li><span className="r"/>Critical <b>1</b></li></ul></article>
      </section>
    </div>
  );
}

function RxRequests({ rx, onProcess }) {
  return (
    <div className="content">
      <section className="title-block"><h2>Prescription Requests</h2><p>{rx.filter((x)=>x.status==="Pending").length} pending</p></section>
      <section className="panel table-panel">
        <table><thead><tr><th>RX ID</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th><th/></tr></thead><tbody>
          {rx.map((r)=><tr key={r.id}><td>{r.id}</td><td>{r.patient}</td><td>{r.doctor}</td><td>{r.date}</td><td><span className={`status ${statusClass(r.status)}`}>{r.status}</span></td><td><button className="act" onClick={()=>onProcess(r.id)}>Process</button></td></tr>)}
        </tbody></table>
      </section>
    </div>
  );
}

function ProcessRx({ selected, rx, setPage, updateStatus }) {
  const data = rx.find((x)=>x.id===selected) || rx[0];
  const [currentStep, setCurrentStep] = useState(0);

  function doneStep() {
    setCurrentStep((prev) => {
      const next = Math.min(prev + 1, 3);
      if (next === 3) {
        updateStatus(data.id, "Ready");
      }
      return next;
    });
  }

  function rowClass(i) {
    if (i < currentStep) return "done";
    if (i === currentStep && currentStep < 3) return "active";
    return "pending";
  }

  function rowIcon(i) {
    if (i < currentStep) return "\u2713";
    return String(i + 1);
  }

  return (
    <div className="content">
      <div className="process-head"><button className="back" onClick={()=>setPage("rx-requests")}>{"< Back"}</button><h2>Process {data.id}</h2></div>
      <section className="proc-grid">
        <article className="panel"><h3>PRESCRIPTION INFO</h3><div className="kv"><div><span>Patient</span><b>{data.patient}</b></div><div><span>Doctor</span><b>{data.doctor}</b></div><div><span>Date</span><b>March 9, 2026</b></div><div><span>Status</span><b>{currentStep === 3 ? "Ready" : data.status}</b></div></div></article>
        <article className="panel"><h3>WORKFLOW</h3>
          <div className={`wf ${rowClass(0)}`}><span>{rowIcon(0)}</span>Check Availability{currentStep===0?<button onClick={doneStep}>Done</button>:null}</div>
          <div className={`wf ${rowClass(1)}`}><span>{rowIcon(1)}</span>Prepare Medicines{currentStep===1?<button onClick={doneStep}>Done</button>:null}</div>
          <div className={`wf ${rowClass(2)}`}><span>{rowIcon(2)}</span>Mark Ready{currentStep===2?<button onClick={doneStep}>Done</button>:null}</div>
          {currentStep === 3 ? <div className="ready-msg">{"\u2713 Ready for patient pickup."}</div> : null}
        </article>
      </section>
      <section className="panel table-panel"><h3>PRESCRIPTION ITEMS</h3><table><thead><tr><th>Medicine</th><th>Dosage</th><th>Qty</th><th>Stock</th><th>Availability</th></tr></thead><tbody><tr><td>Amoxicillin 500mg</td><td>1 cap 3x/day x 7d</td><td>21</td><td>150</td><td><span className="status ready">In Stock</span></td></tr><tr><td>Paracetamol 500mg</td><td>1 tab q4h PRN</td><td>6</td><td>12</td><td><span className="status ready">In Stock</span></td></tr></tbody></table></section>
    </div>
  );
}

function Release({ rx, onRelease }) {
  const ready = rx.filter((x)=>x.status==="Ready");
  const dispensed = rx.filter((x)=>x.status==="Dispensed").length;
  return (
    <div className="content release-page">
      <section className="title-block"><h2>Medicine Release</h2></section>
      <section className="release-grid">
        <article className="panel"><h3>READY FOR PICKUP</h3><table><thead><tr><th>RX ID</th><th>Patient</th><th>Date</th><th/></tr></thead><tbody>{ready.length?ready.map((r)=><tr key={r.id}><td>{r.id}</td><td>{r.patient}</td><td>{r.date}</td><td><button className="release" onClick={()=>onRelease(r.id)}>Release</button></td></tr>):<tr><td colSpan="4">No ready prescriptions.</td></tr>}</tbody></table></article>
        <article className="panel"><h3>TODAY'S SUMMARY</h3><div className="sum"><div><span>Medicines Released</span><b>{dispensed}</b></div><div><span>Transactions</span><b>{dispensed + ready.length}</b></div><div><span>Pending Pickups</span><b>{ready.length}</b></div></div></article>
      </section>
    </div>
  );
}

function ManageStock({ stock, onAdd, onUpdate, onDelete }) {
  return (
    <div className="content">
      <section className="title-block stock-title">
        <div>
          <h2>Manage Stock</h2>
          <p>{stock.length} medicines tracked</p>
        </div>
        <button className="act stock-add" onClick={onAdd}>+ Add Medicine</button>
      </section>

      <section className="panel table-panel stock-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Qty</th>
              <th>Expiration</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {stock.map((m) => {
              const status = stockStatus(m.qty);
              const ratio = Math.min(100, Math.max(2, (m.qty / 200) * 100));
              return (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>
                    <div className="qty-wrap">
                      <span className={`qty-bar ${statusClass(status)}`} style={{ width: `${ratio}%` }} />
                      <b>{m.qty}</b>
                    </div>
                  </td>
                  <td>{m.expiration}</td>
                  <td><span className={`status ${statusClass(status)}`}>{status}</span></td>
                  <td className="stock-actions">
                    <button className="stock-btn" onClick={() => onUpdate(m.id)}>Update</button>
                    <button className="stock-btn danger" onClick={() => onDelete(m.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function AlertsPage({ stock, onReorder }) {
  const low = stock.filter((m) => m.qty <= 20);
  const expiring = stock
    .map((m) => ({ ...m, daysLeft: daysUntil(m.expiration) }))
    .filter((m) => m.daysLeft >= 0 && m.daysLeft <= 30)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="content alerts-page">
      <section className="title-block"><h2>Inventory Alerts</h2></section>

      <h4 className="section-label danger">LOW STOCK</h4>
      <div className="alert-list">
        {low.map((item) => {
          const status = stockStatus(item.qty);
          return (
            <article key={item.id} className={`alert-row ${statusClass(status)}`}>
              <div>
                <h5>{item.name}</h5>
                <p>{item.qty} units . Expires {item.expiration}</p>
              </div>
              <div className="alert-actions">
                <span className={`status ${statusClass(status)}`}>{status}</span>
                <button className="act" onClick={() => onReorder(item.id)}>Reorder</button>
              </div>
            </article>
          );
        })}
      </div>

      <h4 className="section-label warn">EXPIRING SOON</h4>
      <div className="alert-list">
        {expiring.map((item) => (
          <article key={`exp-${item.id}`} className="alert-row expiring">
            <div>
              <h5>{item.name}</h5>
              <p>Expires {item.expiration} . {item.daysLeft} days remaining</p>
            </div>
            <span className="status low-stock">Expiring Soon</span>
          </article>
        ))}
      </div>
    </div>
  );
}

function HistoryPage({ history }) {
  return (
    <div className="content history-page">
      <section className="title-block"><h2>Dispensing History</h2></section>
      <section className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Qty Released</th>
              <th>Date</th>
              <th>RX ID</th>
              <th>Keeper</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row, idx) => (
              <tr key={`${row.rxId}-${idx}`}>
                <td>{row.medicine}</td>
                <td>{row.qty} units</td>
                <td>{row.date}</td>
                <td>{row.rxId}</td>
                <td>{row.keeper}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function InventoryApp({ onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [rx, setRx] = useState(initialRx);
  const [stock, setStock] = useState(initialStock);
  const [history, setHistory] = useState(initialHistory);
  const [selected, setSelected] = useState("RX-002");

  function updateStatus(id, status) {
    setRx((prev)=>prev.map((r)=>r.id===id?{...r,status}:r));
  }

  function onProcess(id) {
    setSelected(id);
    setPage("process-rx");
  }

  function addStock() {
    const nextId = `M-${String(stock.length + 1).padStart(3, "0")}`;
    setStock((prev) => [
      ...prev,
      { id: nextId, name: "New Medicine", qty: 40, expiration: "2026-12-31" }
    ]);
  }

  function updateStock(id) {
    setStock((prev) => prev.map((m) => m.id === id ? { ...m, qty: m.qty + 10 } : m));
  }

  function deleteStock(id) {
    setStock((prev) => prev.filter((m) => m.id !== id));
  }

  function reorderStock(id) {
    setStock((prev) => prev.map((m) => m.id === id ? { ...m, qty: m.qty + 50 } : m));
  }

  function releaseRx(id) {
    updateStatus(id, "Dispensed");
    const map = rxMedicineMap[id] || { medicine: "Medicine", qty: 1 };
    setHistory((prev) => [
      {
        medicine: map.medicine,
        qty: map.qty,
        date: formatShortDate(new Date()),
        rxId: id,
        keeper: "K. Dela Rosa"
      },
      ...prev
    ]);
  }

  const titleMap = {
    dashboard: "Dashboard",
    "rx-requests": "Rx Requests",
    "process-rx": "Process Rx",
    release: "Release",
    "manage-stock": "Manage Stock",
    alerts: "Alerts",
    history: "History"
  };

  return (
    <main className="portal">
      <Sidebar page={page} setPage={setPage} onLogout={onLogout} />
      <section className="main">
        <Topbar title={titleMap[page]} />
        {page === "dashboard" ? <Dashboard rx={rx} /> : null}
        {page === "rx-requests" ? <RxRequests rx={rx} onProcess={onProcess} /> : null}
        {page === "process-rx" ? <ProcessRx key={selected} selected={selected} rx={rx} setPage={setPage} updateStatus={updateStatus} /> : null}
        {page === "release" ? <Release rx={rx} onRelease={releaseRx} /> : null}
        {page === "manage-stock" ? <ManageStock stock={stock} onAdd={addStock} onUpdate={updateStock} onDelete={deleteStock} /> : null}
        {page === "alerts" ? <AlertsPage stock={stock} onReorder={reorderStock} /> : null}
        {page === "history" ? <HistoryPage history={history} /> : null}
      </section>
    </main>
  );
}

export default function App() {
  const [ok, setOk] = useState(false);
  if (!ok) return <Login onLogin={()=>setOk(true)} />;
  return <InventoryApp onLogout={() => setOk(false)} />;
}
