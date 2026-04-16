import { useState, useEffect } from "react";

const DEPT_CODES = {
  "Front Office": "FRNT", "Clinical": "CLIN", "Billing": "BILL",
  "Human Resources": "HR", "Operations": "OPS", "Marketing": "MKT", "Compliance": "COMP",
};

const STATUSES = {
  draft:            { label: "Draft",                bg: "#F1F5F9", fg: "#475569", dot: "#94A3B8" },
  open_suggestions: { label: "Open for Suggestions", bg: "#FEF9C3", fg: "#854D0E", dot: "#EAB308" },
  dept_review:      { label: "Dept. Review",         bg: "#DBEAFE", fg: "#1E40AF", dot: "#3B82F6" },
  president_review: { label: "Awaiting President",   bg: "#EDE9FE", fg: "#5B21B6", dot: "#7C3AED" },
  approved:         { label: "Master — Approved",    bg: "#DCFCE7", fg: "#14532D", dot: "#16A34A" },
};

const STAGE_ORDER = ["draft","open_suggestions","dept_review","president_review","approved"];

const WORKFLOW = {
  draft:            { next: "open_suggestions", action: "Submit for Team Suggestions",     roles: ["contributor","dept_head","president"] },
  open_suggestions: { next: "dept_review",      action: "Advance to Dept. Review",         roles: ["dept_head","president"] },
  dept_review:      { next: "president_review", action: "Send to President for Approval",  roles: ["dept_head","president"] },
  president_review: { next: "approved",         action: "Approve and Publish as Master",   roles: ["president"] },
  approved:         { next: null,               action: null,                               roles: [] },
};

const ROLES = {
  contributor: { label: "Team Member",          color: "#475569" },
  dept_head:   { label: "Dept. Head / Reviewer",color: "#1E40AF" },
  president:   { label: "President",             color: "#5B21B6" },
};

const SEED = [
  {
    id:"sop-001", policyNumber:"FDH-FRNT-2026-001", title:"Broken Appointment Protocol",
    category:"Front Office", status:"approved", version:"1.0",
    createdAt:"2026-01-10T09:00:00Z", updatedAt:"2026-01-28T15:00:00Z",
    createdBy:"Sarah M.", approvedAt:"2026-01-28T15:00:00Z", approvedBy:"Dr. Williams",
    tags:["broken appointment","no-show","scheduling","patient accountability"],
    content:`PURPOSE\nThis SOP outlines the procedure for handling broken or missed patient appointments to minimize schedule disruption and maintain patient accountability.\n\nSCOPE\nAll front office team members at Freedom Dental Health.\n\nPROCEDURE\n1. If a patient has not arrived within 10 minutes of scheduled time, contact the patient via phone immediately.\n2. Document the missed appointment in Open Dental under patient chart notes with date, time, and outcome of contact attempt.\n3. A broken appointment fee of $50.00 may be applied at the provider's discretion after the second occurrence.\n4. Schedule a callback within 24 business hours to reschedule the patient.\n5. After three broken appointments without a documented emergency, flag account for provider review.\n\nEXCEPTIONS\nVerified medical or family emergencies documented within 24 hours of the missed appointment will be reviewed case-by-case by the office manager.`,
    comments:[
      {id:"c1",stage:"open_suggestions",author:"Jessica T.",role:"contributor",text:"Should we add a note about texting patients before calling? Most patients prefer text reminders.",ctype:"suggestion",at:"2026-01-15T10:00:00Z"},
      {id:"c2",stage:"dept_review",author:"Mike R.",role:"dept_head",text:"Good suggestion. Approved for president review. Suggest incorporating text outreach in next revision.",ctype:"approval",at:"2026-01-20T11:30:00Z"},
    ],
    history:[
      {action:"SOP Created",by:"Sarah M.",at:"2026-01-10T09:00:00Z"},
      {action:"Submitted for Team Suggestions",by:"Sarah M.",at:"2026-01-12T10:00:00Z"},
      {action:"Advanced to Dept. Review",by:"Mike R.",at:"2026-01-20T11:30:00Z"},
      {action:"Approved and Published as Master",by:"Dr. Williams",at:"2026-01-28T15:00:00Z"},
    ],
  },
  {
    id:"sop-002", policyNumber:"FDH-FRNT-2026-002", title:"New Patient Intake and Registration",
    category:"Front Office", status:"dept_review", version:"0.9",
    createdAt:"2026-02-01T09:00:00Z", updatedAt:"2026-03-15T11:00:00Z",
    createdBy:"Amanda K.", approvedAt:null, approvedBy:null,
    tags:["new patient","intake","registration","insurance","HIPAA"],
    content:`PURPOSE\nEstablish a consistent and welcoming registration process for all new patients.\n\nSCOPE\nAll front office and scheduling team members.\n\nPROCEDURE\n1. Upon scheduling, collect patient name, DOB, contact info, insurance information, and referring provider.\n2. Send new patient forms via Weave patient portal at least 48 hours before appointment.\n3. Verify insurance eligibility no later than 24 hours before appointment.\n4. Greet new patients by name upon arrival and confirm form completion.\n5. Enter all insurance and demographic data into Open Dental before seating the patient.\n\nCOMPLIANCE NOTES\nHIPAA release and financial agreement must be signed before treatment begins.`,
    comments:[
      {id:"c3",stage:"open_suggestions",author:"Chris L.",role:"contributor",text:"Should we specify which forms go through Weave vs. paper backup? Weave sometimes has outages.",ctype:"suggestion",at:"2026-02-10T09:00:00Z"},
    ],
    history:[
      {action:"SOP Created",by:"Amanda K.",at:"2026-02-01T09:00:00Z"},
      {action:"Submitted for Team Suggestions",by:"Amanda K.",at:"2026-02-05T10:00:00Z"},
      {action:"Advanced to Dept. Review",by:"Mike R.",at:"2026-03-15T11:00:00Z"},
    ],
  },
  {
    id:"sop-003", policyNumber:"FDH-BILL-2026-001", title:"Insurance Claim Submission and AR Follow-Up",
    category:"Billing", status:"president_review", version:"1.0",
    createdAt:"2026-01-20T09:00:00Z", updatedAt:"2026-04-01T09:00:00Z",
    createdBy:"Tony B.", approvedAt:null, approvedBy:null,
    tags:["insurance","billing","claims","AR","collections","EOB","follow-up"],
    content:`PURPOSE\nStandardize claim submission and AR follow-up to minimize denial rates and accelerate collections.\n\nSCOPE\nBilling department team members.\n\nPROCEDURE\n1. Submit all primary insurance claims within 24 hours of date of service.\n2. Attach required documentation (x-rays, narratives, perio charts) for applicable procedure codes.\n3. Review EOBs within 3 business days of receipt.\n4. File secondary claims within 5 business days of primary EOB receipt.\n5. Claims unpaid after 30 days enter the follow-up queue and must be contacted weekly.\n6. Claims over 90 days are flagged for supervisor review.\n\nDOCUMENTATION\nAll claim status calls must be logged in Open Dental with date, rep name, and reference number.`,
    comments:[
      {id:"c4",stage:"dept_review",author:"Mike R.",role:"dept_head",text:"Comprehensive policy. Tony has covered all major claim scenarios. Recommending presidential approval.",ctype:"approval",at:"2026-03-28T10:00:00Z"},
    ],
    history:[
      {action:"SOP Created",by:"Tony B.",at:"2026-01-20T09:00:00Z"},
      {action:"Submitted for Team Suggestions",by:"Tony B.",at:"2026-01-25T10:00:00Z"},
      {action:"Advanced to Dept. Review",by:"Tony B.",at:"2026-02-10T11:00:00Z"},
      {action:"Sent to President for Approval",by:"Mike R.",at:"2026-03-28T10:00:00Z"},
    ],
  },
  {
    id:"sop-004", policyNumber:"FDH-CLIN-2026-001", title:"Instrument Sterilization and Infection Control",
    category:"Clinical", status:"open_suggestions", version:"0.8",
    createdAt:"2026-03-01T09:00:00Z", updatedAt:"2026-03-20T09:00:00Z",
    createdBy:"Lisa P.", approvedAt:null, approvedBy:null,
    tags:["sterilization","infection control","OSHA","CDC","autoclave","clinical"],
    content:`PURPOSE\nEnsure all clinical instruments are properly sterilized to OSHA and CDC standards.\n\nSCOPE\nAll clinical staff including dental assistants and hygienists.\n\nPROCEDURE\n1. Process all instruments through the ultrasonic cleaner immediately after use.\n2. Package instruments in sterilization pouches with internal and external chemical indicators.\n3. Run autoclave cycle at 132C for 4 minutes (pre-vacuum) or 121C for 15 minutes (gravity displacement).\n4. Allow instruments to dry completely before sealed storage.\n5. Log every sterilization cycle with date, cycle type, load contents, and operator initials.\n\nMONITORING\nWeekly biological spore testing is required. A failed spore test triggers immediate autoclave removal from service and protocol review by the clinical director.`,
    comments:[],
    history:[
      {action:"SOP Created",by:"Lisa P.",at:"2026-03-01T09:00:00Z"},
      {action:"Submitted for Team Suggestions",by:"Lisa P.",at:"2026-03-20T09:00:00Z"},
    ],
  },
  {
    id:"sop-005", policyNumber:"FDH-HR-2026-001", title:"Employee Onboarding Checklist",
    category:"Human Resources", status:"draft", version:"0.1",
    createdAt:"2026-04-10T09:00:00Z", updatedAt:"2026-04-10T09:00:00Z",
    createdBy:"Hammer",approvedAt:null,approvedBy:null,
    tags:["onboarding","HR","new hire","training"],
    content:`PURPOSE\nProvide a consistent onboarding experience for all new Freedom Dental Health employees.\n\nSCOPE\nAll departments. Administered by Human Resources.\n\nPROCEDURE\n1. Complete I-9 and W-4 documentation on first day.\n2. Issue employee badge and system credentials within 24 hours of start date.\n3. Schedule shadowing sessions with department lead during week one.\n4. Complete all required HIPAA and OSHA training within first 5 business days.\n5. Assign 30-60-90 day performance check-in schedule.\n\nNOTES\nAll training completion must be documented in the employee file.`,
    comments:[],
    history:[{action:"SOP Created",by:"Hammer",at:"2026-04-10T09:00:00Z"}],
  },
];

function genId() { return `sop-${Date.now()}-${Math.random().toString(36).slice(2,6)}`; }
function genCid() { return `c-${Date.now()}-${Math.random().toString(36).slice(2,6)}`; }
function nowISO() { return new Date().toISOString(); }

function genPolicyNum(category, sops) {
  const code = DEPT_CODES[category] || "GEN";
  const year = new Date().getFullYear();
  const prefix = `FDH-${code}-${year}-`;
  const nums = sops.filter(s => s.policyNumber.startsWith(prefix)).map(s => parseInt(s.policyNumber.slice(-3), 10)).filter(n => !isNaN(n));
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}

function fmtDate(iso) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtDT(iso) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}
function bumpMajor(v) {
  const [maj] = v.split(".").map(Number);
  return `${maj + 1}.0`;
}

function StatusPill({ status, size = "sm" }) {
  const s = STATUSES[status] || {};
  const pad = size === "sm" ? "2px 8px" : "4px 12px";
  const fs = size === "sm" ? 11 : 13;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:s.bg, color:s.fg, borderRadius:999, padding:pad, fontSize:fs, fontWeight:500, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:s.dot, flexShrink:0 }} />
      {s.label}
    </span>
  );
}

function Tag({ label }) {
  return <span style={{ display:"inline-flex", background:"#EFF6FF", color:"#1D4ED8", borderRadius:999, padding:"2px 9px", fontSize:11, fontWeight:500 }}>{label}</span>;
}

export default function SOPSystem() {
  const [sops, setSops] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [role, setRole] = useState("contributor");
  const [view, setView] = useState("dashboard");
  const [selectedId, setSelectedId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [commentText, setCommentText] = useState("");
  const [commentType, setCommentType] = useState("suggestion");
  const [toast, setToast] = useState(null);
  const [sideOpen, setSideOpen] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("fdh-sops-v2");
      setSops(stored ? JSON.parse(stored) : SEED);
    } catch { setSops(SEED); }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem("fdh-sops-v2", JSON.stringify(sops)); } catch {}
  }, [sops, loaded]);

  function notify(msg, type = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function advance(id) {
    setSops(prev => prev.map(s => {
      if (s.id !== id) return s;
      const wf = WORKFLOW[s.status];
      if (!wf?.next) return s;
      const entry = { action: wf.action, by: ROLES[role].label, at: nowISO() };
      const upd = { ...s, status: wf.next, updatedAt: nowISO(), history: [...s.history, entry] };
      if (wf.next === "approved") { upd.approvedAt = nowISO(); upd.approvedBy = ROLES[role].label; upd.version = bumpMajor(s.version); }
      return upd;
    }));
    notify("Status advanced successfully.");
  }

  function returnToDraft(id) {
    setSops(prev => prev.map(s => {
      if (s.id !== id) return s;
      return { ...s, status: "draft", updatedAt: nowISO(), history: [...s.history, { action: "Returned to Draft for Revision", by: ROLES[role].label, at: nowISO() }] };
    }));
    notify("SOP returned to draft.", "warn");
  }

  function addComment(id) {
    if (!commentText.trim()) return;
    const sop = sops.find(s => s.id === id);
    const c = { id: genCid(), stage: sop.status, author: ROLES[role].label, role, text: commentText.trim(), ctype: commentType, at: nowISO() };
    setSops(prev => prev.map(s => s.id === id ? { ...s, comments: [...s.comments, c], updatedAt: nowISO() } : s));
    setCommentText("");
    notify("Comment added.");
  }

  function saveSop(data) {
    if (data.id) {
      setSops(prev => prev.map(s => s.id !== data.id ? s : { ...s, title: data.title, category: data.category, content: data.content, tags: data.tags, updatedAt: nowISO(), history: [...s.history, { action: "Content Updated", by: ROLES[role].label, at: nowISO() }] }));
      setView("detail");
      notify("SOP updated.");
    } else {
      const newSop = { id: genId(), policyNumber: genPolicyNum(data.category, sops), title: data.title, category: data.category, content: data.content, status: "draft", version: "0.1", createdAt: nowISO(), updatedAt: nowISO(), createdBy: ROLES[role].label, approvedAt: null, approvedBy: null, tags: data.tags, comments: [], history: [{ action: "SOP Created", by: ROLES[role].label, at: nowISO() }] };
      setSops(prev => [...prev, newSop]);
      setSelectedId(newSop.id);
      setView("detail");
      notify(`${newSop.policyNumber} created.`);
    }
  }

  function doSearch() {
    if (!searchQ.trim()) { setSearchResults(null); return; }
    setSearching(true);
    const q = searchQ.toLowerCase();
    setSearchResults(sops.filter(s => s.title.toLowerCase().includes(q) || s.tags.some(t => t.includes(q)) || s.content.toLowerCase().includes(q)).map(s => s.id));
    setSearching(false);
  }

  const sel = sops.find(s => s.id === selectedId);
  const queueSops = sops.filter(s => WORKFLOW[s.status]?.roles.includes(role) && s.status !== "draft");
  const cats = [...new Set(sops.map(s => s.category))];

  const libSops = searchResults !== null
    ? searchResults.map(id => sops.find(s => s.id === id)).filter(Boolean)
    : sops.filter(s => (statusFilter === "all" || s.status === statusFilter) && (catFilter === "all" || s.category === catFilter));

  const stats = {
    total: sops.length,
    approved: sops.filter(s => s.status === "approved").length,
    inReview: sops.filter(s => ["open_suggestions","dept_review","president_review"].includes(s.status)).length,
    queue: queueSops.length,
  };

  const C = {
    bg: "#F4F2EC",
    sidebar: "#0C1B33",
    white: "#FFFFFF",
    navy: "#0C1B33",
    teal: "#0E7490",
    text: "#1E293B",
    muted: "#64748B",
    border: "#E2E8F0",
    input: "padding:10px 14px; borderRadius:8px; border:1px solid #E2E8F0; fontSize:14px; fontFamily:'DM Sans',system-ui,sans-serif; width:100%; background:#fff; color:#1E293B; outline:none",
  };

  if (!loaded) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", fontFamily:"system-ui", color:C.muted }}>
      Loading Freedom Dental SOP System...
    </div>
  );

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'DM Sans',system-ui,sans-serif", background:C.bg, overflow:"hidden", fontSize:14 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:4px}
        .hover-card:hover{box-shadow:0 4px 20px rgba(0,0,0,0.1);transform:translateY(-1px)}
        .hover-card{transition:all .18s ease}
        .nav-btn{width:100%;display:flex;align-items:center;gap:10px;padding:9px 20px;background:none;border:none;border-left:3px solid transparent;color:rgba(255,255,255,.55);cursor:pointer;font-size:13px;font-family:inherit;text-align:left;transition:all .15s}
        .nav-btn:hover{background:rgba(255,255,255,.07);color:rgba(255,255,255,.85)}
        .nav-btn.active{background:rgba(255,255,255,.1);border-left-color:#38BDF8;color:#fff;font-weight:500}
        .btn{border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-family:inherit;font-weight:500;cursor:pointer;transition:all .15s}
        .btn-primary{background:#0C1B33;color:#fff}
        .btn-primary:hover{background:#1E3A5F}
        .btn-green{background:#15803D;color:#fff}
        .btn-green:hover{background:#166534}
        .btn-red{background:#fff;color:#DC2626;border:1px solid #FECACA}
        .btn-red:hover{background:#FEF2F2}
        .btn-ghost{background:#fff;color:#374151;border:1px solid #E2E8F0}
        .btn-ghost:hover{background:#F8FAFC}
        textarea,input,select{font-family:'DM Sans',system-ui,sans-serif}
        textarea:focus,input:focus,select:focus{outline:2px solid #38BDF8;outline-offset:1px;border-color:transparent!important}
      `}</style>

      {toast && (
        <div style={{ position:"fixed", top:20, right:20, zIndex:9999, background: toast.type==="ok" ? "#15803D" : toast.type==="warn" ? "#B45309" : "#DC2626", color:"#fff", padding:"11px 18px", borderRadius:10, fontSize:13, fontWeight:500, boxShadow:"0 4px 20px rgba(0,0,0,.25)" }}>
          {toast.msg}
        </div>
      )}

      {/* SIDEBAR */}
      <div style={{ width:230, background:C.sidebar, display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"22px 20px 14px", borderBottom:"1px solid rgba(255,255,255,.08)" }}>
          <div style={{ fontFamily:"'DM Serif Display',serif", color:"#fff", fontSize:16, lineHeight:1.2 }}>Freedom Dental</div>
          <div style={{ color:"#38BDF8", fontSize:10, fontWeight:600, letterSpacing:2.5, textTransform:"uppercase", marginTop:3 }}>SOP Management</div>
        </div>

        <nav style={{ padding:"12px 0", flex:1 }}>
          {[
            ["dashboard","Dashboard","⊞"],
            ["library","SOP Library","📁"],
            ["queue",`My Queue${queueSops.length ? ` (${queueSops.length})` : ""}`,"✅"],
          ].map(([id, label, icon]) => (
            <button key={id} className={`nav-btn ${view===id?"active":""}`} onClick={() => setView(id)}>
              <span style={{ fontSize:15 }}>{icon}</span>{label}
            </button>
          ))}
          <div style={{ padding:"14px 20px 6px", fontSize:9, fontWeight:600, color:"rgba(255,255,255,.3)", letterSpacing:2, textTransform:"uppercase" }}>Actions</div>
          <button className="nav-btn" onClick={() => { setEditData({}); setView("editor"); }}>
            <span style={{ fontSize:16 }}>＋</span> Create New SOP
          </button>
        </nav>

        <div style={{ padding:14, borderTop:"1px solid rgba(255,255,255,.08)" }}>
          <div style={{ fontSize:9, fontWeight:600, color:"rgba(255,255,255,.3)", letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>Demo Role</div>
          {Object.entries(ROLES).map(([k, v]) => (
            <button key={k} onClick={() => setRole(k)} style={{ width:"100%", display:"flex", alignItems:"center", gap:7, padding:"6px 10px", marginBottom:3, borderRadius:7, border:role===k?"1px solid rgba(56,189,248,.4)":"1px solid transparent", background:role===k?"rgba(56,189,248,.08)":"none", color:role===k?"#7DD3FC":"rgba(255,255,255,.45)", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:role===k?"#38BDF8":"rgba(255,255,255,.2)", flexShrink:0 }} />
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Topbar */}
        <div style={{ height:58, background:"#fff", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px", flexShrink:0 }}>
          <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:C.navy, fontWeight:400 }}>
            {view==="dashboard"&&"Dashboard"}
            {view==="library"&&"SOP Library"}
            {view==="detail"&&sel ? `${sel.policyNumber} — ${sel.title}` : view==="detail"?"SOP Detail":""}
            {view==="editor"&&(editData?.id?"Edit SOP":"Create New SOP")}
            {view==="queue"&&"My Approval Queue"}
          </h1>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:12, color:C.muted }}>Logged in as:</span>
            <span style={{ fontSize:12, fontWeight:600, color:ROLES[role].color, background:"#F8FAFC", padding:"4px 10px", borderRadius:6, border:`1px solid ${C.border}` }}>{ROLES[role].label}</span>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex:1, overflow:"auto", padding:28 }}>

          {/* ── DASHBOARD ── */}
          {view==="dashboard" && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:28 }}>
                {[
                  { label:"Total SOPs",      value:stats.total,    color:"#0C1B33", icon:"📋" },
                  { label:"Master Approved", value:stats.approved, color:"#15803D", icon:"✅" },
                  { label:"In Review",       value:stats.inReview, color:"#B45309", icon:"🔄" },
                  { label:"My Queue",        value:stats.queue,    color:"#5B21B6", icon:"⏳" },
                ].map(s => (
                  <div key={s.label} style={{ background:"#fff", borderRadius:12, padding:"18px 20px", borderLeft:`4px solid ${s.color}`, boxShadow:"0 1px 6px rgba(0,0,0,.05)" }}>
                    <div style={{ fontSize:22 }}>{s.icon}</div>
                    <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:34, color:s.color, marginTop:2 }}>{s.value}</div>
                    <div style={{ fontSize:12, color:C.muted, fontWeight:500, marginTop:2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
                <div style={{ background:"#fff", borderRadius:12, padding:22, boxShadow:"0 1px 6px rgba(0,0,0,.05)" }}>
                  <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:17, color:C.navy, fontWeight:400, marginBottom:16 }}>Recently Updated</h2>
                  {[...sops].sort((a,b) => new Date(b.updatedAt)-new Date(a.updatedAt)).slice(0,5).map(sop => (
                    <div key={sop.id} onClick={() => { setSelectedId(sop.id); setView("detail"); }} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${C.border}`, cursor:"pointer" }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:500, color:C.text }}>{sop.title}</div>
                        <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{sop.policyNumber} · {fmtDate(sop.updatedAt)}</div>
                      </div>
                      <StatusPill status={sop.status} />
                    </div>
                  ))}
                </div>

                <div style={{ background:"#fff", borderRadius:12, padding:22, boxShadow:"0 1px 6px rgba(0,0,0,.05)" }}>
                  <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:17, color:C.navy, fontWeight:400, marginBottom:16 }}>Pending Your Action</h2>
                  {queueSops.length === 0
                    ? <div style={{ textAlign:"center", padding:"30px 0", color:C.muted, fontSize:13 }}>Nothing pending your review right now.</div>
                    : queueSops.slice(0,5).map(sop => (
                        <div key={sop.id} onClick={() => { setSelectedId(sop.id); setView("detail"); }} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${C.border}`, cursor:"pointer" }}>
                          <div>
                            <div style={{ fontSize:13, fontWeight:500, color:C.text }}>{sop.title}</div>
                            <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{sop.policyNumber}</div>
                          </div>
                          <StatusPill status={sop.status} />
                        </div>
                      ))
                  }
                  {queueSops.length > 0 && <button className="btn btn-primary" onClick={() => setView("queue")} style={{ width:"100%", marginTop:14 }}>View Full Queue</button>}
                </div>
              </div>
            </div>
          )}

          {/* ── LIBRARY ── */}
          {view==="library" && (
            <div>
              <div style={{ background:"#fff", borderRadius:12, padding:20, marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.05)" }}>
                <div style={{ display:"flex", gap:10, marginBottom:12 }}>
                  <input value={searchQ} onChange={e => setSearchQ(e.target.value)} onKeyDown={e => e.key==="Enter"&&doSearch()} placeholder='Search by topic, keyword, or phrase — e.g. "broken appointments", "sterilization"...' style={{ flex:1, padding:"10px 14px", borderRadius:8, border:`1px solid ${C.border}`, fontSize:14, color:C.text }} />
                  <button className="btn btn-primary" onClick={doSearch} disabled={searching} style={{ minWidth:120 }}>{searching ? "Searching..." : "AI Search"}</button>
                  {searchResults !== null && <button className="btn btn-ghost" onClick={() => { setSearchResults(null); setSearchQ(""); }}>Clear</button>}
                </div>
                {searchResults === null ? (
                  <div style={{ display:"flex", gap:8 }}>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding:"7px 12px", borderRadius:8, border:`1px solid ${C.border}`, fontSize:12, cursor:"pointer", background:"#fff", color:C.text }}>
                      <option value="all">All Statuses</option>
                      {Object.entries(STATUSES).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ padding:"7px 12px", borderRadius:8, border:`1px solid ${C.border}`, fontSize:12, cursor:"pointer", background:"#fff", color:C.text }}>
                      <option value="all">All Departments</option>
                      {cats.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                ) : (
                  <div style={{ fontSize:12, color:C.muted }}>AI returned {libSops.length} result{libSops.length!==1?"s":""} for "{searchQ}"</div>
                )}
              </div>

              {libSops.length === 0
                ? <div style={{ textAlign:"center", padding:"60px 0", color:C.muted }}>No SOPs match your search.</div>
                : (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:14 }}>
                    {libSops.map(sop => (
                      <div key={sop.id} className="hover-card" onClick={() => { setSelectedId(sop.id); setView("detail"); }} style={{ background:"#fff", borderRadius:12, padding:20, cursor:"pointer", boxShadow:"0 1px 6px rgba(0,0,0,.05)", borderTop:`3px solid ${STATUSES[sop.status]?.dot||"#E2E8F0"}` }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                          <span style={{ fontSize:10, fontWeight:600, color:C.muted, letterSpacing:1 }}>{sop.policyNumber}</span>
                          <StatusPill status={sop.status} />
                        </div>
                        <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:16, color:C.navy, fontWeight:400, marginBottom:8, lineHeight:1.35 }}>{sop.title}</h3>
                        <div style={{ fontSize:11, color:C.muted, marginBottom:10 }}>{sop.category} · v{sop.version} · {fmtDate(sop.updatedAt)}</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                          {sop.tags.slice(0,3).map(t => <Tag key={t} label={t} />)}
                          {sop.tags.length > 3 && <span style={{ fontSize:11, color:C.muted }}>+{sop.tags.length-3} more</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {/* ── DETAIL ── */}
          {view==="detail" && sel && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20, alignItems:"start" }}>
              <div>
                {/* Header */}
                <div style={{ background:"#fff", borderRadius:12, padding:24, marginBottom:16, boxShadow:"0 1px 6px rgba(0,0,0,.05)" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <span style={{ fontSize:11, fontWeight:600, color:C.muted, letterSpacing:1 }}>{sel.policyNumber}</span>
                      <span style={{ color:C.border }}>·</span>
                      <span style={{ fontSize:11, color:C.muted }}>v{sel.version}</span>
                      <StatusPill status={sel.status} />
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button className="btn btn-ghost" onClick={() => setView("library")} style={{ fontSize:12, padding:"6px 12px" }}>← Library</button>
                      {(sel.status==="draft"||(role==="president"&&sel.status!=="approved")) && (
                        <button className="btn btn-ghost" onClick={() => { setEditData({ id:sel.id, title:sel.title, category:sel.category, content:sel.content, tags:sel.tags }); setView("editor"); }} style={{ fontSize:12, padding:"6px 12px" }}>Edit</button>
                      )}
                    </div>
                  </div>
                  <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:24, color:C.navy, fontWeight:400, marginBottom:12 }}>{sel.title}</h1>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:16, fontSize:12, color:C.muted }}>
                    <span>📂 {sel.category}</span>
                    <span>👤 {sel.createdBy}</span>
                    <span>📅 Created {fmtDate(sel.createdAt)}</span>
                    <span>🔄 Updated {fmtDate(sel.updatedAt)}</span>
                    {sel.approvedAt && <span>✅ Approved {fmtDate(sel.approvedAt)} by {sel.approvedBy}</span>}
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginTop:10 }}>
                    {sel.tags.map(t => <Tag key={t} label={t} />)}
                  </div>
                </div>

                {/* Content */}
                <div style={{ background:"#fff", borderRadius:12, padding:24, marginBottom:16, boxShadow:"0 1px 6px rgba(0,0,0,.05)" }}>
                  <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:17, color:C.navy, fontWeight:400, marginBottom:16, paddingBottom:12, borderBottom:`1px solid ${C.border}` }}>Procedure Content</h2>
                  <pre style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:14, color:C.text, lineHeight:1.9, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>{sel.content}</pre>
                </div>

                {/* Comments */}
                {sel.comments.length > 0 && (
                  <div style={{ background:"#fff", borderRadius:12, padding:24, marginBottom:16, boxShadow:"0 1px 6px rgba(0,0,0,.05)" }}>
                    <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:17, color:C.navy, fontWeight:400, marginBottom:16 }}>Suggestions and Comments</h2>
                    {sel.comments.map(c => (
                      <div key={c.id} style={{ borderLeft:`3px solid ${c.ctype==="approval"?"#16A34A":c.ctype==="rejection"?"#DC2626":"#3B82F6"}`, paddingLeft:14, marginBottom:16 }}>
                        <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4, flexWrap:"wrap" }}>
                          <span style={{ fontSize:13, fontWeight:500, color:C.text }}>{c.author}</span>
                          <span style={{ fontSize:11, color:C.muted }}>{fmtDT(c.at)}</span>
                          <span style={{ fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:999, background: c.ctype==="approval"?"#DCFCE7":c.ctype==="rejection"?"#FEE2E2":"#DBEAFE", color: c.ctype==="approval"?"#14532D":c.ctype==="rejection"?"#7F1D1D":"#1E3A8A" }}>{c.ctype}</span>
                          <span style={{ fontSize:10, color:C.muted }}>at: {STATUSES[c.stage]?.label||c.stage}</span>
                        </div>
                        <p style={{ fontSize:14, color:C.text, lineHeight:1.7 }}>{c.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add comment */}
                {sel.status !== "draft" && sel.status !== "approved" && (
                  <div style={{ background:"#fff", borderRadius:12, padding:24, boxShadow:"0 1px 6px rgba(0,0,0,.05)" }}>
                    <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:17, color:C.navy, fontWeight:400, marginBottom:16 }}>Add Comment or Suggestion</h2>
                    <select value={commentType} onChange={e => setCommentType(e.target.value)} style={{ padding:"8px 12px", borderRadius:8, border:`1px solid ${C.border}`, fontSize:13, marginBottom:10, cursor:"pointer", background:"#fff", color:C.text, display:"block" }}>
                      <option value="suggestion">Suggestion</option>
                      <option value="approval">Approval Note</option>
                      <option value="rejection">Request Revision</option>
                    </select>
                    <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Type your comment here..." style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:`1px solid ${C.border}`, fontSize:14, minHeight:90, display:"block", resize:"vertical", color:C.text }} />
                    <button className="btn btn-primary" onClick={() => addComment(sel.id)} style={{ marginTop:10 }}>Submit Comment</button>
                  </div>
                )}
              </div>

              {/* RIGHT PANEL */}
              <div>
                {/* Workflow */}
                <div style={{ background:"#fff", borderRadius:12, padding:20, boxShadow:"0 1px 6px rgba(0,0,0,.05)", marginBottom:14 }}>
                  <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:15, color:C.navy, fontWeight:400, marginBottom:16 }}>Approval Workflow</h3>
                  {STAGE_ORDER.map((st, i) => {
                    const curIdx = STAGE_ORDER.indexOf(sel.status);
                    const done = i < curIdx;
                    const cur = st === sel.status;
                    return (
                      <div key={st} style={{ display:"flex", gap:10, marginBottom:12, alignItems:"flex-start" }}>
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                          <div style={{ width:22, height:22, borderRadius:"50%", background: done?"#15803D":cur?STATUSES[st].dot:"#E2E8F0", display:"flex", alignItems:"center", justifyContent:"center", border: cur?`2px solid ${STATUSES[st].dot}`:"none" }}>
                            {done && <span style={{ color:"#fff", fontSize:11, lineHeight:1 }}>✓</span>}
                            {cur && <span style={{ width:6, height:6, borderRadius:"50%", background:"#fff", display:"inline-block" }} />}
                          </div>
                          {i < STAGE_ORDER.length-1 && <div style={{ width:2, height:16, background: done?"#16A34A":"#E2E8F0", marginTop:2 }} />}
                        </div>
                        <div style={{ paddingTop:2 }}>
                          <div style={{ fontSize:12, fontWeight: cur?600:400, color: cur?STATUSES[st].fg:i>curIdx?"#94A3B8":C.text }}>{STATUSES[st].label}</div>
                          {cur && <div style={{ fontSize:10, color:C.muted, marginTop:1 }}>Current stage</div>}
                        </div>
                      </div>
                    );
                  })}

                  {sel.status !== "approved" && (
                    <div style={{ marginTop:16, paddingTop:14, borderTop:`1px solid ${C.border}` }}>
                      {WORKFLOW[sel.status]?.roles.includes(role) ? (
                        <button className="btn btn-green" onClick={() => advance(sel.id)} style={{ width:"100%", marginBottom:8, fontSize:12 }}>{WORKFLOW[sel.status].action}</button>
                      ) : (
                        <div style={{ fontSize:11, color:C.muted, textAlign:"center", marginBottom:8 }}>You cannot advance this SOP at this stage.</div>
                      )}
                      {(role==="dept_head"||role==="president") && sel.status !== "draft" && (
                        <button className="btn btn-red" onClick={() => returnToDraft(sel.id)} style={{ width:"100%", fontSize:12 }}>Return to Draft</button>
                      )}
                    </div>
                  )}
                  {sel.status === "approved" && (
                    <div style={{ marginTop:14, padding:"10px 14px", background:"#DCFCE7", borderRadius:8, textAlign:"center" }}>
                      <div style={{ fontSize:12, fontWeight:600, color:"#14532D" }}>Published Master SOP</div>
                      <div style={{ fontSize:11, color:"#15803D", marginTop:3 }}>Approved {fmtDate(sel.approvedAt)}</div>
                    </div>
                  )}
                </div>

                {/* Audit trail */}
                <div style={{ background:"#fff", borderRadius:12, padding:20, boxShadow:"0 1px 6px rgba(0,0,0,.05)" }}>
                  <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:15, color:C.navy, fontWeight:400, marginBottom:14 }}>Audit Trail</h3>
                  {[...sel.history].reverse().map((h, i) => (
                    <div key={i} style={{ display:"flex", gap:10, marginBottom:12 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:i===0?"#0E7490":"#CBD5E1", marginTop:4, flexShrink:0 }} />
                      <div>
                        <div style={{ fontSize:12, fontWeight:500, color:C.text }}>{h.action}</div>
                        <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{h.by} · {fmtDT(h.at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── EDITOR ── */}
          {view==="editor" && (
            <EditorView
              data={editData}
              sops={sops}
              onSave={saveSop}
              onCancel={() => setView(editData?.id ? "detail" : "library")}
              DEPT_CODES={DEPT_CODES}
            />
          )}

          {/* ── QUEUE ── */}
          {view==="queue" && (
            <div>
              <div style={{ background:"#EFF6FF", border:"1px solid #BFDBFE", borderRadius:10, padding:"12px 18px", marginBottom:20, fontSize:13, color:"#1E40AF" }}>
                {queueSops.length === 0
                  ? "No items require your attention at this time."
                  : `${queueSops.length} SOP${queueSops.length!==1?"s":""} are waiting for your review as ${ROLES[role].label}.`}
              </div>
              {queueSops.map(sop => (
                <div key={sop.id} style={{ background:"#fff", borderRadius:12, padding:22, marginBottom:14, boxShadow:"0 1px 6px rgba(0,0,0,.05)", borderLeft:`4px solid ${STATUSES[sop.status]?.dot}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:10, fontWeight:600, color:C.muted, letterSpacing:1, marginBottom:4 }}>{sop.policyNumber}</div>
                      <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:18, color:C.navy, fontWeight:400, marginBottom:6 }}>{sop.title}</h3>
                      <div style={{ fontSize:12, color:C.muted, marginBottom:8 }}>{sop.category} · Updated {fmtDate(sop.updatedAt)}</div>
                      <StatusPill status={sop.status} size="md" />
                    </div>
                    <div style={{ display:"flex", gap:8, marginLeft:20 }}>
                      <button className="btn btn-ghost" onClick={() => { setSelectedId(sop.id); setView("detail"); }} style={{ fontSize:12, padding:"7px 14px" }}>Review</button>
                      <button className="btn btn-green" onClick={() => advance(sop.id)} style={{ fontSize:12, padding:"7px 14px" }}>{WORKFLOW[sop.status]?.action}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function EditorView({ data, sops, onSave, onCancel, DEPT_CODES }) {
  const isEdit = !!data?.id;
  const [form, setForm] = useState({
    id: data?.id || null,
    title: data?.title || "",
    category: data?.category || "Front Office",
    content: data?.content || "",
    tags: Array.isArray(data?.tags) ? data.tags.join(", ") : (data?.tags || ""),
  });

  const inputStyle = { padding:"10px 14px", borderRadius:8, border:"1px solid #E2E8F0", fontSize:14, width:"100%", color:"#1E293B", display:"block", background:"#fff" };
  const labelStyle = { display:"block", fontSize:12, fontWeight:500, color:"#374151", marginBottom:6 };

  function handleSave() {
    if (!form.title.trim() || !form.content.trim()) { alert("Title and content are required."); return; }
    onSave({ ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) });
  }

  const previewNum = !isEdit ? genPolicyNum(form.category, sops) : null;

  return (
    <div style={{ maxWidth:740 }}>
      <div style={{ background:"#fff", borderRadius:12, padding:30, boxShadow:"0 1px 6px rgba(0,0,0,.05)" }}>
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:"#0C1B33", fontWeight:400, marginBottom:24 }}>{isEdit ? "Edit SOP" : "Create New SOP"}</h2>

        <div style={{ marginBottom:18 }}>
          <label style={labelStyle}>SOP Title</label>
          <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} placeholder="e.g., Patient Check-In Procedure" style={inputStyle} />
        </div>

        <div style={{ marginBottom:18 }}>
          <label style={labelStyle}>Department / Category</label>
          <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))} style={{ ...inputStyle, cursor:"pointer" }}>
            {Object.keys(DEPT_CODES).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {!isEdit && <div style={{ fontSize:11, color:"#64748B", marginTop:5 }}>Auto-generated policy number: {previewNum}</div>}
        </div>

        <div style={{ marginBottom:18 }}>
          <label style={labelStyle}>Tags (comma-separated)</label>
          <input value={form.tags} onChange={e => setForm(f=>({...f,tags:e.target.value}))} placeholder="e.g., scheduling, patient, front office" style={inputStyle} />
        </div>

        <div style={{ marginBottom:24 }}>
          <label style={labelStyle}>Procedure Content</label>
          <div style={{ fontSize:11, color:"#64748B", marginBottom:6 }}>Recommended sections: PURPOSE — SCOPE — PROCEDURE — EXCEPTIONS / COMPLIANCE NOTES</div>
          <textarea value={form.content} onChange={e => setForm(f=>({...f,content:e.target.value}))} placeholder={"PURPOSE\nDescribe the goal of this SOP...\n\nSCOPE\nWho does this apply to?\n\nPROCEDURE\n1. Step one...\n2. Step two..."} style={{ ...inputStyle, minHeight:320, resize:"vertical" }} />
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button className="btn btn-primary" onClick={handleSave}>{isEdit ? "Save Changes" : "Create SOP"}</button>
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
