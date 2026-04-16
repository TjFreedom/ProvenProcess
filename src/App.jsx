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
  // ── SOPs WITH FULL CONTENT FROM NOTION ──
  {
    id:"sop-n01", policyNumber:"FDH-MKT-2026-001", title:"Campaign Rollout",
    category:"Marketing", status:"approved", version:"1.1",
    createdAt:"2025-10-02T19:58:00Z", updatedAt:"2026-01-15T14:11:00Z",
    createdBy:"Marketing Dept.", approvedAt:"2026-01-15T14:11:00Z", approvedBy:"Dr. Williams",
    tags:["marketing","campaign","rollout","advertising","front desk"],
    content:"PURPOSE\nProvide a step-by-step guide to rolling out a new marketing campaign, including how and when to communicate each step to all impacted parties.\n\nSCOPE\nMarketing Department (specifically the Marketing Coordinator). Others involved include Office Managers, Clinical Managers, and the Front Desk team.\n\nRESPONSIBILITY\nThe Marketing Director ensures this policy is utilized correctly. The HR Manager and Director of Operations may also step in as necessary.\n\nPROCEDURE\nMarketing Coordinator:\n1. Before a campaign launches, communicate specifics to the Office Manager via email including:\n   - Dates (Start - End)\n   - Patient Type (New, Current, Medicaid, etc.)\n   - Details of the offer and where it will be advertised\n   - How patients take advantage of the offer (code, coupon, etc.)\n   - Staff script for delivering instructions to patients\n   - Limitations (one per patient, scheduling deadlines, etc.)\n   - Responsibilities of office vs. marketing department\n2. Attach creative for offer, voucher (if applicable), and in-office flyer (if applicable).\n\nOffice Manager:\n1. Communicate campaign information to staff, especially the front desk team.\n2. Provide phone scripting and instructions for reflecting discounts in the system.\n\nDEFINITIONS\nCampaign: A series of advertisements to gain a specific type of patient, which may include a discount offer.\nCreative: The design used in the advertisement.",
    comments:[], history:[
      {action:"SOP Created",by:"Marketing Dept.",at:"2025-10-02T19:58:00Z"},
      {action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"},
    ],
  },
  {
    id:"sop-n02", policyNumber:"FDH-CLIN-2026-001", title:"Adjunct Preventative Care Services",
    category:"Clinical", status:"approved", version:"1.0",
    createdAt:"2025-10-02T19:55:00Z", updatedAt:"2026-01-15T14:12:00Z",
    createdBy:"Clinical Dept.", approvedAt:"2026-01-15T14:12:00Z", approvedBy:"Dr. Williams",
    tags:["preventative care","sealants","fluoride","SDF","clinical","hygiene"],
    content:"PURPOSE\nOutline protocols for adjunct preventative dental care services, including sealants, medicament applications, and OTC product recommendations, ensuring compliance with clinical guidelines and patient safety.\n\nSCOPE\nAll Registered Dental Hygienists (RDHs) and Doctors within Freedom Dental Health.\n\nPROCEDURE\nFluoride Varnish:\n1. RDH will recommend fluoride varnish as needed and apply with patient consent.\n\nSealants on Non-Carious Teeth:\n1. RDH may recommend sealants following a doctor's exam when no clinical carious findings are present.\n2. Apply to occlusal surfaces of molars and premolars to prevent decay.\n3. Follow proper isolation and curing techniques.\n4. Document sealant placement in patient chart.\n\nChairside Medicament Application:\n- Silver Diamine Fluoride (SDF) & Curodont: Must be approved by doctor. Used for incipient/carious lesions. Inform patients of potential staining.\n- Arestin & Periodontal Antibiotics: Application in non-responsive sites post-scaling must be approved by doctor. Schedule follow-up.\n- Desensitizer: RDH may apply based on patient need during/post preventative care.\n\nHomecare Product Recommendations:\n- RDH may recommend electric toothbrushes, Waterpiks, oral rinses, toothpastes.\n- Whitening products: Only if no pain-related carious lesions; educate on sensitivity risks.\n\nDOCUMENTATION & COMPLIANCE\nAll services must be documented in patient chart. Informed consent required for medicaments and whitening. Maintain OSHA and ADA compliance.",
    comments:[], history:[
      {action:"SOP Created",by:"Clinical Dept.",at:"2025-10-02T19:55:00Z"},
      {action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"},
    ],
  },
  {
    id:"sop-n03", policyNumber:"FDH-COMP-2026-001", title:"CPR Certification & Training",
    category:"Compliance", status:"approved", version:"1.0",
    createdAt:"2025-10-02T19:54:00Z", updatedAt:"2026-01-15T14:10:00Z",
    createdBy:"Compliance Dept.", approvedAt:"2026-01-15T14:10:00Z", approvedBy:"Dr. Williams",
    tags:["CPR","certification","training","BLS","ACLS","compliance","clinical"],
    content:"PURPOSE\nOutline the required process for scheduling, obtaining, and maintaining CPR certification for clinical team members at Freedom Dental Health Services.\n\nTRAINING SCHEDULE & REQUIREMENTS\n1. CPR training is scheduled every two years for renewal compliance.\n2. All clinical team members must hold active CPR certification for licensure.\n3. If certification is needed outside scheduled FDHS training, team members must attend independently or visit another FDHS location.\n4. Hands-on training required for Delaware license renewals (BLS, first aid, AED).\n5. Sedation team members must complete Advanced CPR Certification (ACLS).\n\nAPPROVED CPR VENDORS\n- Beacon Safety: (302) 428-6073 | www.beaconsafety.com\n- Tri State First Aid & CPR: Matt at 610-733-6730\n- CPR Delaware: www.cprdelaware.com\n\nALTERNATIVE TRAINING OPTIONS\n- Cardiology centers at local hospitals\n- College or school-based training programs\n- Local firehouses offering CPR certification\n- Community-hosted CPR events\n\nCERTIFICATION DOCUMENTATION\n1. Physical copy placed in employee file.\n2. Digital copy stored in designated practice folder for audits.\n\nREVIEW & COMPLIANCE\nCertifications reviewed annually. Non-compliance may result in practice restrictions until training is completed.",
    comments:[], history:[
      {action:"SOP Created",by:"Compliance Dept.",at:"2025-10-02T19:54:00Z"},
      {action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"},
    ],
  },
  {
    id:"sop-n04", policyNumber:"FDH-BILL-2026-001", title:"Redo Submissions",
    category:"Billing", status:"approved", version:"1.0",
    createdAt:"2025-10-10T01:45:00Z", updatedAt:"2026-01-15T14:07:00Z",
    createdBy:"Billing Dept.", approvedAt:"2026-01-15T14:07:00Z", approvedBy:"Dr. Williams",
    tags:["billing","redo","collections","adjustments","provider"],
    content:"PURPOSE\nMaking adjustments to COLLECTIONS when a provider has redone or taken over another provider's treatment for a patient.\n\nPROCEDURE\n1. Navigate to the patient's LEDGER.\n2. Click Payments/Adjustments.\n3. Under the Adjustments tab, change all to COLLECTION.\n4. The provider who originally completed the work should be a DEBIT ADJUSTMENT (+).\n5. The provider who recompleted the work should be a CREDIT ADJUSTMENT (-) — this adds the collections to their income and removes it from the other provider.\n\nTO CHECK YOUR WORK\nReports > Monthly Report > Income Allocation > Select Provider > Date > Print/Preview. Collections will appear under INCOME.\n\nEXAMPLE\nDr. Doe completed a Crown on #14. Patient presented back in 4 months for hygiene and Dr. Jane noticed decay under the crown. Always try to have the original provider redo the work. However, with scheduling, vacations, or patient preferences, another provider may recomplete.",
    comments:[], history:[
      {action:"SOP Created",by:"Billing Dept.",at:"2025-10-10T01:45:00Z"},
      {action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"},
    ],
  },
  {
    id:"sop-n05", policyNumber:"FDH-BILL-2026-002", title:"Insurance Payment Posting & Reconciliation",
    category:"Billing", status:"approved", version:"1.0",
    createdAt:"2025-08-29T21:44:00Z", updatedAt:"2025-08-29T22:12:00Z",
    createdBy:"RCM Team", approvedAt:"2025-08-29T22:12:00Z", approvedBy:"Dr. Williams",
    tags:["insurance","payment posting","reconciliation","EFT","EOB","billing"],
    content:"PURPOSE\nOutline the procedures for insurance payment posting and reconciliation to streamline processes, ensure consistency, and reduce errors.\n\nRESPONSIBILITY\nPost EFTs, Checks, and VCCs. Update EOBs in patient files, support ledger adjustments from EOB entries, and reconcile all insurance payments on a daily basis.\n\nKEY AREAS\n- Payment Posting Guidelines\n- Documentation & Chart Management\n- Payment Posting Timelines\n- Reconciliation & Reporting\n\nMETRIC\n98%+ of all received payments posted within 24 hours. This has a direct impact on other teams' goals and the company's financial health.",
    comments:[], history:[
      {action:"SOP Created",by:"RCM Team",at:"2025-08-29T21:44:00Z"},
      {action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"},
    ],
  },
  // ── NOTION SOPs (FILE-BASED — TITLES & CATEGORIES IMPORTED) ──
  {
    id:"sop-n06", policyNumber:"FDH-CLIN-2026-002", title:"N2O Administration",
    category:"Clinical", status:"approved", version:"1.0",
    createdAt:"2025-10-02T19:53:00Z", updatedAt:"2026-01-15T14:07:00Z",
    createdBy:"Clinical Dept.", approvedAt:"2026-01-15T14:07:00Z", approvedBy:"Dr. Williams",
    tags:["N2O","nitrous oxide","sedation","clinical","administration"],
    content:"PURPOSE\nDefine the standard operating procedure for Nitrous Oxide (N2O) administration in clinical settings.\n\nSCOPE\nAll clinical staff authorized to administer N2O at Freedom Dental Health.\n\nNOTE\nFull procedure details are maintained in the source document: SOP_for_N2O_Administration.docx. Refer to the original document for complete clinical protocols, dosage guidelines, monitoring requirements, and emergency procedures.",
    comments:[], history:[{action:"SOP Created",by:"Clinical Dept.",at:"2025-10-02T19:53:00Z"},{action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"}],
  },
  {
    id:"sop-n07", policyNumber:"FDH-BILL-2026-003", title:"Write-Off Policy",
    category:"Billing", status:"approved", version:"1.0",
    createdAt:"2025-10-02T19:53:00Z", updatedAt:"2026-01-15T14:07:00Z",
    createdBy:"Billing Dept.", approvedAt:"2026-01-15T14:07:00Z", approvedBy:"Dr. Williams",
    tags:["write-off","billing","adjustments","collections","admin"],
    content:"PURPOSE\nEstablish guidelines for when and how write-offs may be applied to patient accounts.\n\nSCOPE\nBilling department and administrative team members.\n\nNOTE\nFull procedure details are maintained in the source document: SOP_for_Write-Off_Policy.docx. Refer to the original document for complete write-off thresholds, approval workflows, and documentation requirements.",
    comments:[], history:[{action:"SOP Created",by:"Billing Dept.",at:"2025-10-02T19:53:00Z"},{action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"}],
  },
  {
    id:"sop-n08", policyNumber:"FDH-CLIN-2026-003", title:"Dental Radiographs",
    category:"Clinical", status:"approved", version:"1.0",
    createdAt:"2026-02-24T21:35:00Z", updatedAt:"2026-02-24T21:35:00Z",
    createdBy:"Clinical Dept.", approvedAt:"2026-02-24T21:35:00Z", approvedBy:"Dr. Williams",
    tags:["radiographs","x-rays","imaging","clinical","diagnostics"],
    content:"PURPOSE\nStandardize protocols for dental radiograph acquisition, processing, and documentation.\n\nSCOPE\nAll clinical staff performing radiographic procedures at Freedom Dental Health.\n\nNOTE\nFull procedure details are maintained in the source document: SOP_Dental_Radiographs.docx. Refer to the original document for complete imaging protocols, safety standards, and quality assurance procedures.",
    comments:[], history:[{action:"SOP Created",by:"Clinical Dept.",at:"2026-02-24T21:35:00Z"},{action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"}],
  },
  {
    id:"sop-n09", policyNumber:"FDH-BILL-2026-004", title:"Patient Refund",
    category:"Billing", status:"approved", version:"1.0",
    createdAt:"2026-03-27T19:51:00Z", updatedAt:"2026-03-27T19:51:00Z",
    createdBy:"Billing Dept.", approvedAt:"2026-03-27T19:51:00Z", approvedBy:"Dr. Williams",
    tags:["refund","patient","billing","payments","collections"],
    content:"PURPOSE\nDefine the process for issuing patient refunds accurately and in a timely manner.\n\nSCOPE\nBilling department team members.\n\nNOTE\nFull procedure details are maintained in the source document: Patient_Refund_SOP.pdf. Refer to the original document for complete refund criteria, approval workflows, and processing timelines.",
    comments:[], history:[{action:"SOP Created",by:"Billing Dept.",at:"2026-03-27T19:51:00Z"},{action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"}],
  },
  {
    id:"sop-n10", policyNumber:"FDH-OPS-2026-001", title:"Who to Contact",
    category:"Operations", status:"approved", version:"1.0",
    createdAt:"2025-10-02T19:54:00Z", updatedAt:"2026-01-15T14:07:00Z",
    createdBy:"Operations Dept.", approvedAt:"2026-01-15T14:07:00Z", approvedBy:"Dr. Williams",
    tags:["contacts","directory","operations","communication","who to contact"],
    content:"PURPOSE\nProvide a reference guide for staff on who to contact for various operational needs.\n\nSCOPE\nAll Freedom Dental Health team members.\n\nNOTE\nFull contact directory and escalation procedures are maintained in the source document: FDHS_Who_to_Contact_SOP.docx.",
    comments:[], history:[{action:"SOP Created",by:"Operations Dept.",at:"2025-10-02T19:54:00Z"},{action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"}],
  },
  {
    id:"sop-n11", policyNumber:"FDH-COMP-2026-002", title:"Compliance Reporting",
    category:"Compliance", status:"approved", version:"1.0",
    createdAt:"2025-10-02T19:59:00Z", updatedAt:"2026-01-15T14:11:00Z",
    createdBy:"Compliance Dept.", approvedAt:"2026-01-15T14:11:00Z", approvedBy:"Dr. Williams",
    tags:["compliance","reporting","regulatory","audit"],
    content:"PURPOSE\nDefine the process and requirements for compliance reporting across all Freedom Dental Health locations.\n\nSCOPE\nAll department heads and compliance officers.\n\nNOTE\nFull reporting procedures, templates, and schedules are maintained in the source document: SOP-Compliance_Reporting.docx.",
    comments:[], history:[{action:"SOP Created",by:"Compliance Dept.",at:"2025-10-02T19:59:00Z"},{action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"}],
  },
  {
    id:"sop-n12", policyNumber:"FDH-CLIN-2026-004", title:"Endo Access Closure",
    category:"Clinical", status:"approved", version:"1.0",
    createdAt:"2025-10-02T19:54:00Z", updatedAt:"2026-01-15T14:08:00Z",
    createdBy:"Clinical Dept.", approvedAt:"2026-01-15T14:08:00Z", approvedBy:"Dr. Williams",
    tags:["endodontic","access closure","clinical","restorative"],
    content:"PURPOSE\nStandardize the procedure for endodontic access closure following root canal treatment.\n\nSCOPE\nAll providers performing endodontic procedures at Freedom Dental Health.\n\nNOTE\nFull clinical procedure, material specifications, and documentation requirements are maintained in the source document: SOP_for_ENDO_ACCESS_CLOSURE.docx.",
    comments:[], history:[{action:"SOP Created",by:"Clinical Dept.",at:"2025-10-02T19:54:00Z"},{action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"}],
  },
  {
    id:"sop-n13", policyNumber:"FDH-CLIN-2026-005", title:"Blood Pressure Protocol",
    category:"Clinical", status:"approved", version:"1.0",
    createdAt:"2026-03-26T16:39:00Z", updatedAt:"2026-03-26T16:39:00Z",
    createdBy:"Clinical Dept.", approvedAt:"2026-03-26T16:39:00Z", approvedBy:"Dr. Williams",
    tags:["blood pressure","vitals","clinical","patient safety"],
    content:"PURPOSE\nDefine the standard protocol for blood pressure screening and management during dental visits.\n\nSCOPE\nAll clinical staff at Freedom Dental Health.\n\nNOTE\nFull blood pressure ranges, escalation protocols, and documentation requirements are maintained in the source document: SOP-Blood_Pressure.pdf.",
    comments:[], history:[{action:"SOP Created",by:"Clinical Dept.",at:"2026-03-26T16:39:00Z"},{action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"}],
  },
  {
    id:"sop-n14", policyNumber:"FDH-HR-2026-001", title:"Inclement Weather",
    category:"Human Resources", status:"approved", version:"1.0",
    createdAt:"2025-10-02T19:52:00Z", updatedAt:"2026-01-15T14:08:00Z",
    createdBy:"HR Dept.", approvedAt:"2026-01-15T14:08:00Z", approvedBy:"Dr. Williams",
    tags:["inclement weather","closures","HR","safety","operations"],
    content:"PURPOSE\nEstablish guidelines for office operations during inclement weather events.\n\nSCOPE\nAll Freedom Dental Health employees across all locations.\n\nNOTE\nFull procedures including notification protocols, pay policies, and decision-making authority are maintained in the source document: SOP-Inclement_Weather.pdf.",
    comments:[], history:[{action:"SOP Created",by:"HR Dept.",at:"2025-10-02T19:52:00Z"},{action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"}],
  },
  {
    id:"sop-n15", policyNumber:"FDH-HR-2026-002", title:"Uniform Policy",
    category:"Human Resources", status:"approved", version:"1.0",
    createdAt:"2025-11-06T15:38:00Z", updatedAt:"2026-01-15T14:07:00Z",
    createdBy:"HR Dept.", approvedAt:"2026-01-15T14:07:00Z", approvedBy:"Dr. Williams",
    tags:["uniform","dress code","HR","appearance","policy"],
    content:"PURPOSE\nDefine the dress code and uniform requirements for all Freedom Dental Health employees.\n\nSCOPE\nAll employees across all departments and locations.\n\nNOTE\nFull uniform specifications, exceptions, and enforcement guidelines are maintained in the source document: SOP_for_Uniform_Policy.pdf.",
    comments:[], history:[{action:"SOP Created",by:"HR Dept.",at:"2025-11-06T15:38:00Z"},{action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"}],
  },
  {
    id:"sop-n16", policyNumber:"FDH-CLIN-2026-006", title:"Needle Stick Protocol",
    category:"Clinical", status:"approved", version:"1.0",
    createdAt:"2026-01-15T13:56:00Z", updatedAt:"2026-01-15T13:56:00Z",
    createdBy:"Clinical Dept.", approvedAt:"2026-01-15T13:56:00Z", approvedBy:"Dr. Williams",
    tags:["needle stick","safety","OSHA","clinical","exposure","infection control"],
    content:"PURPOSE\nDefine the immediate response protocol when a needle stick or sharps injury occurs.\n\nSCOPE\nAll clinical staff at Freedom Dental Health.\n\nNOTE\nFull exposure response procedures, documentation requirements, and follow-up testing protocols are maintained in the source document: SOP_Needle_Stick.pdf.",
    comments:[], history:[{action:"SOP Created",by:"Clinical Dept.",at:"2026-01-15T13:56:00Z"},{action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"}],
  },
  {
    id:"sop-n17", policyNumber:"FDH-BILL-2026-005", title:"Provider Reconciliation",
    category:"Billing", status:"approved", version:"1.0",
    createdAt:"2025-10-14T06:07:00Z", updatedAt:"2026-01-15T14:07:00Z",
    createdBy:"Billing Dept.", approvedAt:"2026-01-15T14:07:00Z", approvedBy:"Dr. Williams",
    tags:["provider","reconciliation","billing","collections","reporting"],
    content:"PURPOSE\nStandardize the provider reconciliation process to ensure accurate income allocation and reporting.\n\nSCOPE\nBilling department team members.\n\nNOTE\nFull reconciliation procedures, reporting templates, and deadlines are maintained in the source document: FDHS_Provider_Reconciliation_SOP.docx.",
    comments:[], history:[{action:"SOP Created",by:"Billing Dept.",at:"2025-10-14T06:07:00Z"},{action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"}],
  },
  {
    id:"sop-n18", policyNumber:"FDH-OPS-2026-002", title:"Facility Repairs & Maintenance",
    category:"Operations", status:"approved", version:"1.0",
    createdAt:"2025-10-02T19:54:00Z", updatedAt:"2026-01-15T14:08:00Z",
    createdBy:"Operations Dept.", approvedAt:"2026-01-15T14:08:00Z", approvedBy:"Dr. Williams",
    tags:["facility","repairs","maintenance","operations","building"],
    content:"PURPOSE\nDefine the process for reporting and resolving facility repairs and maintenance issues.\n\nSCOPE\nAll Freedom Dental Health locations and staff.\n\nNOTE\nFull reporting procedures, vendor contacts, and escalation protocols are maintained in the source document: SOP_for_Facility_Repairs_Maintenance.docx.",
    comments:[], history:[{action:"SOP Created",by:"Operations Dept.",at:"2025-10-02T19:54:00Z"},{action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"}],
  },
  {
    id:"sop-n19", policyNumber:"FDH-CLIN-2026-007", title:"Temp RDH Procedures",
    category:"Clinical", status:"approved", version:"1.0",
    createdAt:"2025-10-02T19:52:00Z", updatedAt:"2026-01-15T14:06:00Z",
    createdBy:"Clinical Dept.", approvedAt:"2026-01-15T14:06:00Z", approvedBy:"Dr. Williams",
    tags:["temp","RDH","hygienist","staffing","clinical"],
    content:"PURPOSE\nDefine onboarding and operational procedures for temporary Registered Dental Hygienists.\n\nSCOPE\nOffice managers, clinical leads, and temporary RDH staff.\n\nNOTE\nFull onboarding checklist, system access procedures, and clinical protocols for temp RDHs are maintained in the source document: SOP-Temp_RDH.docx.",
    comments:[], history:[{action:"SOP Created",by:"Clinical Dept.",at:"2025-10-02T19:52:00Z"},{action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"}],
  },
  {
    id:"sop-n20", policyNumber:"FDH-CLIN-2026-008", title:"Waterline Testing",
    category:"Clinical", status:"approved", version:"1.0",
    createdAt:"2026-02-05T19:25:00Z", updatedAt:"2026-02-05T19:26:00Z",
    createdBy:"Clinical Dept.", approvedAt:"2026-02-05T19:26:00Z", approvedBy:"Dr. Williams",
    tags:["waterline","testing","infection control","clinical","compliance"],
    content:"PURPOSE\nEnsure dental unit waterlines meet CDC safety standards through regular testing and maintenance.\n\nSCOPE\nAll clinical staff and office managers at Freedom Dental Health.\n\nNOTE\nFull testing protocols, frequency requirements, and corrective action procedures are maintained in the source document: SOP_Waterline_Testing.pdf.",
    comments:[], history:[{action:"SOP Created",by:"Clinical Dept.",at:"2026-02-05T19:25:00Z"},{action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"}],
  },
  {
    id:"sop-n21", policyNumber:"FDH-COMP-2026-003", title:"Compliance Training",
    category:"Compliance", status:"approved", version:"1.0",
    createdAt:"2025-10-02T19:59:00Z", updatedAt:"2026-01-15T14:11:00Z",
    createdBy:"Compliance Dept.", approvedAt:"2026-01-15T14:11:00Z", approvedBy:"Dr. Williams",
    tags:["compliance","training","HIPAA","OSHA","regulatory"],
    content:"PURPOSE\nDefine required compliance training programs and schedules for all Freedom Dental Health employees.\n\nSCOPE\nAll employees across all departments.\n\nNOTE\nFull training requirements, schedules, completion tracking, and vendor information are maintained in the source document: SOP-Compliance_Training.pdf.",
    comments:[], history:[{action:"SOP Created",by:"Compliance Dept.",at:"2025-10-02T19:59:00Z"},{action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"}],
  },
  {
    id:"sop-n22", policyNumber:"FDH-CLIN-2026-009", title:"Dental Equipment Repairs",
    category:"Clinical", status:"approved", version:"1.0",
    createdAt:"2025-10-02T19:55:00Z", updatedAt:"2026-01-15T14:10:00Z",
    createdBy:"Clinical Dept.", approvedAt:"2026-01-15T14:10:00Z", approvedBy:"Dr. Williams",
    tags:["equipment","repairs","dental","maintenance","clinical"],
    content:"PURPOSE\nDefine the process for reporting and resolving dental equipment malfunctions and repairs.\n\nSCOPE\nAll clinical staff and office managers.\n\nNOTE\nFull equipment repair procedures, vendor contacts, and escalation protocols are maintained in the source document: SOP_Dental_Equipment_Repairs.docx.",
    comments:[], history:[{action:"SOP Created",by:"Clinical Dept.",at:"2025-10-02T19:55:00Z"},{action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"}],
  },
  {
    id:"sop-n23", policyNumber:"FDH-BILL-2026-006", title:"In Office Adjustments",
    category:"Billing", status:"approved", version:"1.0",
    createdAt:"2026-04-02T19:57:00Z", updatedAt:"2026-04-02T19:57:00Z",
    createdBy:"Billing Dept.", approvedAt:"2026-04-02T19:57:00Z", approvedBy:"Dr. Williams",
    tags:["adjustments","in office","billing","collections","ledger"],
    content:"PURPOSE\nStandardize the process for making in-office billing adjustments to patient accounts.\n\nSCOPE\nBilling department and front office staff.\n\nNOTE\nFull adjustment types, approval thresholds, and documentation requirements are maintained in the source document: In_Office_Adjustments_SOP.docx.",
    comments:[], history:[{action:"SOP Created",by:"Billing Dept.",at:"2026-04-02T19:57:00Z"},{action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"}],
  },
  {
    id:"sop-n24", policyNumber:"FDH-FRNT-2026-001", title:"Freedom Dental Warranty",
    category:"Front Office", status:"approved", version:"1.0",
    createdAt:"2026-02-25T18:57:00Z", updatedAt:"2026-02-25T18:57:00Z",
    createdBy:"Operations Dept.", approvedAt:"2026-02-25T18:57:00Z", approvedBy:"Dr. Williams",
    tags:["warranty","dental","patient","front office","restorative"],
    content:"PURPOSE\nDefine the warranty policy for dental procedures performed at Freedom Dental Health.\n\nSCOPE\nFront office, billing, and clinical teams.\n\nNOTE\nFull warranty terms, eligible procedures, claim process, and patient communication scripts are maintained in the source document: Freedom_Dental_Warranty_SOP.pdf.",
    comments:[], history:[{action:"SOP Created",by:"Operations Dept.",at:"2026-02-25T18:57:00Z"},{action:"Imported from Notion",by:"System",at:"2026-04-16T12:00:00Z"}],
  },
  {
    id:"sop-n25", policyNumber:"FDH-HR-2026-003", title:"Employee Onboarding Checklist",
    category:"Human Resources", status:"draft", version:"0.1",
    createdAt:"2026-04-10T09:00:00Z", updatedAt:"2026-04-10T09:00:00Z",
    createdBy:"Hammer",approvedAt:null,approvedBy:null,
    tags:["onboarding","HR","new hire","training"],
    content:"PURPOSE\nProvide a consistent onboarding experience for all new Freedom Dental Health employees.\n\nSCOPE\nAll departments. Administered by Human Resources.\n\nPROCEDURE\n1. Complete I-9 and W-4 documentation on first day.\n2. Issue employee badge and system credentials within 24 hours of start date.\n3. Schedule shadowing sessions with department lead during week one.\n4. Complete all required HIPAA and OSHA training within first 5 business days.\n5. Assign 30-60-90 day performance check-in schedule.\n\nNOTES\nAll training completion must be documented in the employee file.",
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
      const stored = localStorage.getItem("fdh-sops-v3");
      setSops(stored ? JSON.parse(stored) : SEED);
    } catch { setSops(SEED); }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem("fdh-sops-v3", JSON.stringify(sops)); } catch {}
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
