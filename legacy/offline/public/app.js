const { useState, useEffect, useMemo, useRef, withHooks } = window.HOOKS;
const MODS = window.WORKBOOK_SCHEMAS;
const STORAGE = 'kws-crm-v1';
const PREFERENCE = 'kws-crm-preferences';
const icons = {
    grid: React.createElement(React.Fragment, null,
        React.createElement("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }),
        React.createElement("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }),
        React.createElement("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }),
        React.createElement("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1" })),
    users: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }),
        React.createElement("circle", { cx: "9", cy: "7", r: "4" }),
        React.createElement("path", { d: "M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" })),
    person: React.createElement(React.Fragment, null,
        React.createElement("circle", { cx: "12", cy: "8", r: "4" }),
        React.createElement("path", { d: "M4 21a8 8 0 0 1 16 0" })),
    home: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" }),
        React.createElement("path", { d: "M9 21v-8h6v8" })),
    briefcase: React.createElement(React.Fragment, null,
        React.createElement("rect", { x: "3", y: "7", width: "18", height: "14", rx: "2" }),
        React.createElement("path", { d: "M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12c4 3 14 3 18 0" })),
    calendar: React.createElement(React.Fragment, null,
        React.createElement("rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }),
        React.createElement("path", { d: "M16 3v4M8 3v4M3 10h18" })),
    check: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "m4 12 5 5L20 6" })),
    chevron: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "m9 18 6-6-6-6" })),
    down: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "m6 9 6 6 6-6" })),
    search: React.createElement(React.Fragment, null,
        React.createElement("circle", { cx: "11", cy: "11", r: "7" }),
        React.createElement("path", { d: "m16 16 5 5" })),
    plus: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "M12 5v14M5 12h14" })),
    bell: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" })),
    arrow: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "M5 12h14m-6-6 6 6-6 6" })),
    up: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "m6 15 6-6 6 6" })),
    trend: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "m3 17 6-6 4 4 8-8M15 7h6v6" })),
    chart: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "M4 20V10m6 10V4m6 16v-7m5 7H2" })),
    target: React.createElement(React.Fragment, null,
        React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
        React.createElement("circle", { cx: "12", cy: "12", r: "5" }),
        React.createElement("circle", { cx: "12", cy: "12", r: "1" })),
    filter: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "M3 5h18M7 12h10M10 19h4" })),
    download: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4" })),
    upload: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "M12 16V4M7 9l5-5 5 5M4 16v5h16v-5" })),
    more: React.createElement(React.Fragment, null,
        React.createElement("circle", { cx: "5", cy: "12", r: "1" }),
        React.createElement("circle", { cx: "12", cy: "12", r: "1" }),
        React.createElement("circle", { cx: "19", cy: "12", r: "1" })),
    close: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "M18 6 6 18M6 6l12 12" })),
    edit: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "m15 5 4 4M4 20l5-1 12-12-4-4L5 15z" })),
    trash: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "M4 7h16M10 4h4M6 7l1 14h10l1-14M10 11v6M14 11v6" })),
    pin: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" }),
        React.createElement("circle", { cx: "12", cy: "10", r: "2" })),
    note: React.createElement(React.Fragment, null,
        React.createElement("rect", { x: "4", y: "3", width: "16", height: "18", rx: "2" }),
        React.createElement("path", { d: "M8 8h8M8 12h8M8 16h5" })),
    clock: React.createElement(React.Fragment, null,
        React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
        React.createElement("path", { d: "M12 7v5l4 3" })),
    wallet: React.createElement(React.Fragment, null,
        React.createElement("rect", { x: "3", y: "6", width: "18", height: "15", rx: "2" }),
        React.createElement("path", { d: "M3 10h18M16 15h2M6 6V3h11" })),
    heart: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "M20 4c-4-3-8 1-8 1S8 1 4 4c-5 5 1 11 8 16 7-5 13-11 8-16Z" })),
    chat: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "M21 11a8 8 0 0 1-8 8H5l-3 3V11a9 9 0 0 1 19 0z" })),
    sparkle: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" })),
    building: React.createElement(React.Fragment, null,
        React.createElement("rect", { x: "5", y: "3", width: "14", height: "18", rx: "1" }),
        React.createElement("path", { d: "M9 7h2m3 0h2M9 11h2m3 0h2M9 15h2m3 0h2M10 21v-4h4v4" })),
    link: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "m10 13 4-4M8 16H7a5 5 0 0 1 0-10h4M16 8h1a5 5 0 0 1 0 10h-4" })),
    shield: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "M12 2 4 5v6c0 6 3 9 8 11 5-2 8-5 8-11V5z" }),
        React.createElement("path", { d: "m9 12 2 2 4-4" })),
    help: React.createElement(React.Fragment, null,
        React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
        React.createElement("path", { d: "M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5M12 18h.01" })),
    menu: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "M3 6h18M3 12h18M3 18h18" })),
    copy: React.createElement(React.Fragment, null,
        React.createElement("rect", { x: "8", y: "8", width: "12", height: "13", rx: "2" }),
        React.createElement("path", { d: "M16 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2" })),
    money: React.createElement(React.Fragment, null,
        React.createElement("rect", { x: "2", y: "5", width: "20", height: "14", rx: "2" }),
        React.createElement("circle", { cx: "12", cy: "12", r: "3" }),
        React.createElement("path", { d: "M5 9v6M19 9v6" })),
    info: React.createElement(React.Fragment, null,
        React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
        React.createElement("path", { d: "M12 11v5M12 7h.01" })),
    sun: React.createElement(React.Fragment, null,
        React.createElement("circle", { cx: "12", cy: "12", r: "4" }),
        React.createElement("path", { d: "M12 2v2M12 20v2M4 12H2m20 0h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" })),
    moon: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "M20.8 14.6A9 9 0 0 1 9.4 3.2 9 9 0 1 0 20.8 14.6Z" })),
    sliders: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "M4 7h16M4 17h16" }),
        React.createElement("circle", { cx: "9", cy: "7", r: "3", fill: "currentColor" }),
        React.createElement("circle", { cx: "16", cy: "17", r: "3", fill: "currentColor" })),
    image: React.createElement(React.Fragment, null,
        React.createElement("rect", { x: "3", y: "3", width: "18", height: "18", rx: "3" }),
        React.createElement("circle", { cx: "9", cy: "9", r: "2" }),
        React.createElement("path", { d: "m4 18 5-5 4 3 3-5 4 6" })),
    layers: React.createElement(React.Fragment, null,
        React.createElement("rect", { x: "4", y: "4", width: "15", height: "15", rx: "2" }),
        React.createElement("path", { d: "M8 22h11a3 3 0 0 0 3-3V8" })),
    bed: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "M3 17V6M21 17V6M3 14h18M5 14V9h14v5M3 19v-2h18v2" })),
    bath: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "M4 14h16v2a7 7 0 0 1-14 0v-2M3 14h18M7 14V7a3 3 0 0 1 6 0" })),
    external: React.createElement(React.Fragment, null,
        React.createElement("path", { d: "M14 3h7v7M10 14 21 3" }),
        React.createElement("path", { d: "M21 13v7H4V3h7" }))
};
function Icon({ name, size = 18, strokeWidth = 1.8, className = '', ...rest }) { return React.createElement("svg", { "aria-hidden": "true", className: className, width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", ...rest }, icons[name] || icons.grid); }
const slug = str => String(str || '').toLowerCase().replace(/[\n\r]+/g, ' ').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const get = (rec, label) => rec?.[slug(label)];
const pad = n => String(n).padStart(2, '0');
const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const dateShift = (delta) => { const d = new Date(); d.setDate(d.getDate() + delta); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const readableDate = (d) => { if (!d)
    return '—'; const dat = new Date(String(d).length === 10 ? String(d) + 'T12:00:00' : d); return Number.isNaN(dat.valueOf()) ? String(d) : dat.toLocaleDateString('en-AE', { day: '2-digit', month: 'short', year: 'numeric' }); };
const compactDate = (d) => { if (!d)
    return '—'; const dat = new Date(String(d).length === 10 ? String(d) + 'T12:00:00' : d); return Number.isNaN(dat.valueOf()) ? String(d) : dat.toLocaleDateString('en-AE', { day: 'numeric', month: 'short' }); };
const AED = (n, digits = 0) => new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(Number(n) || 0);
const N = n => new Intl.NumberFormat('en-AE').format(Number(n) || 0);
const initials = t => String(t || 'K').split(/\s+/).slice(0, 2).map(v => v[0]).join('').toUpperCase();
const tidy = s => String(s || '').replaceAll('_', ' ');
const isDone = s => /^(completed|closed|done|paid|cancelled|lost|sold)$/i.test(String(s || ''));
const isLost = s => /lost|cancelled/i.test(String(s || ''));
const COLORS = ['#af8656', '#678f88', '#7b83a4', '#c28c7b', '#b3a077', '#839b90', '#a48eae'];
const nav = [
    { header: 'WORKSPACE', items: [['Dashboard', 'grid'], ['Client desk', 'search'], ['CRM insights', 'sparkle']] },
    { header: 'SALES & RELATIONSHIPS', items: [['Clients', 'users'], ['Contacts', 'person'], ['Properties', 'building'], ['Deals', 'briefcase'], ['Follow-ups', 'calendar'], ['Viewings', 'home'], ['Shortlist', 'target'], ['Interaction log', 'chat'], ['Client care', 'heart']] },
    { header: 'FINANCE & ANALYTICS', items: [['Payments', 'wallet'], ['Expenses', 'money'], ['Date search', 'clock'], ['Performance', 'chart']] },
    { header: 'RESOURCES', items: [['Guide', 'help']] }
];
const labels = { Dashboard: 'Overview', Deals: 'Deals & commissions', Clients: 'Clients & requirements', Contacts: 'Owners & contacts', Properties: 'Property portfolio', 'Follow-ups': 'Follow-ups & daily tasks', Viewings: 'Viewings & feedback', Payments: 'Commission receipts', Expenses: 'Business expenses', Shortlist: 'Property shortlist', 'Client desk': 'Client search & matching', 'Date search': 'Search by date', Performance: 'Performance & targets', 'Interaction log': 'Communication history', 'Client care': 'Client relationships', 'CRM insights': 'CRM intelligence', Guide: 'Getting started' };
const descriptions = { Clients: 'Manage relationships, qualification, budgets, and conversion.', Contacts: 'A single record for every owner, landlord, developer, and broker.', Properties: 'Organize listings, pricing, availability, and permit tracking.', Deals: 'Manage each transaction from offer to completion and commission.', 'Follow-ups': 'Stay in touch and never miss an important next action.', Viewings: 'Plan appointments, log feedback, and progress interested buyers.', Shortlist: 'Match opportunities with the right clients.', Payments: 'Track commission payments and outstanding receipts.', Expenses: 'Understand what you spend to grow your business.', 'Interaction log': 'The full story behind every client conversation.', 'Client care': 'Turn one successful transaction into a lasting relationship.' };
const preferredCols = {
    Clients: ['Client ID', 'Full name', 'Lead stage', 'Buy / rent', 'Preferred communities', 'Maximum budget AED', 'Lead quality score / 100', 'Next follow-up auto'],
    Contacts: ['Contact ID', 'Full name', 'Contact type', 'Company', 'Phone', 'Email'],
    Properties: ['Property ID', 'Listing title', 'Community', 'Property type', 'Sale / rental', 'Price / annual rent AED', 'Listing status', 'Ready / off-plan'],
    Deals: ['Deal ID', 'Client ID', 'Property ID', 'Deal stage', 'Pipeline type', 'Agreed value AED', 'Your expected fee AED', 'Next action due'],
    'Follow-ups': ['Activity ID', 'Client ID', 'Next action', 'Due date', 'Task status', 'Channel'],
    Viewings: ['Viewing ID', 'Client ID', 'Property ID', 'Appointment date & time', 'Viewing status', 'Next action'],
    Shortlist: ['Match ID', 'Client ID', 'Property ID', 'Date sent', 'Client response', 'Next action'],
    'Interaction log': ['Log ID', 'Client ID', 'Contacted on UAE time', 'Channel', 'Conversation topic', 'Next action', 'Action status'],
    'Client care': ['Care ID', 'Client ID', 'Touchpoint type', 'Next contact', 'Task status'],
    Payments: ['Payment ID', 'Deal ID', 'Receipt date', 'Your fee received AED ex VAT', 'Total received AED'],
    Expenses: ['Expense ID', 'Date paid', 'Expense category', 'Platform / supplier', 'Amount paid AED']
};
const OPTIONS = {
    'Lead stage': ['New', 'Contacted', 'Qualified', 'Viewing', 'Negotiation', 'Documentation', 'Closed', 'Lost', 'On hold'],
    'Deal stage': ['New', 'Qualified', 'Viewing', 'Offer', 'Negotiation', 'Documentation', 'Completed', 'Lost', 'Cancelled', 'On hold'],
    'Listing status': ['Available', 'Under offer', 'Rented', 'Sold', 'On hold', 'Unavailable', 'Withdrawn'],
    'Task status': ['Open', 'In progress', 'Completed', 'Cancelled'],
    'Viewing status': ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-show'],
    'Buy / rent': ['Buy', 'Rent'], 'Sale / rental': ['Sale', 'Rental', 'Holiday home'],
    'Emirate': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
    'Property type': ['Apartment', 'Studio', 'Villa', 'Townhouse', 'Penthouse', 'Duplex', 'Loft', 'Serviced apartment', 'Hotel apartment', 'Office', 'Retail', 'Shop', 'Showroom', 'Warehouse', 'Industrial', 'Commercial building', 'Residential building', 'Plot', 'Land', 'Other'],
    'Ready / off-plan': ['Ready', 'Off-plan'],
    'Price basis': ['Total price', 'Annual', 'Monthly', 'Weekly', 'Nightly'],
    'Priority': ['High', 'Medium', 'Low'],
    'Client type': ['Buyer / tenant', 'Buyer', 'Tenant', 'Seller', 'Landlord', 'Investor', 'Other'],
    'Finance type': ['Cash', 'Mortgage', 'Self-funded', 'Other'],
    'Mortgage stage': ['Not started', 'In progress', 'Pre-approved', 'Approved', 'Not applicable'],
    'Funds confirmed': ['Yes', 'No', 'Partially', 'Unknown'],
    'Decision maker': ['Yes', 'No', 'Joint'],
    'Buying / moving urgency': ['Immediately', 'Within 30 days', 'Within 60 days', 'Within 90 days', 'Exploring'],
    'Lead source': ['Referral', 'Instagram', 'TikTok', 'Website', 'Property Finder', 'Bayut', 'Facebook', 'LinkedIn', 'Walk-in', 'Cold outreach', 'Other'],
    'Preferred channel': ['WhatsApp', 'Phone', 'Email', 'SMS'],
    'Channel': ['WhatsApp', 'Phone', 'Email', 'SMS', 'In-person', 'Other'],
    'Contact permission': ['Yes', 'No', 'Unknown'],
    'Relationship status': ['Active', 'Past client', 'Referral partner', 'Inactive', 'Investor'],
    'Pipeline type': ['Off-plan sale', 'Secondary sale', 'Residential rental', 'Commercial sale', 'Commercial rental', 'Landlord acquisition'],
    'Fee basis': ['Percentage', 'Fixed'],
    'Document status': ['Pending', 'In progress', 'Complete', 'Missing'],
    'Contact type': ['Owner', 'Landlord', 'Developer', 'Broker', 'Partner', 'Supplier', 'Other'],
    'Furnishing': ['Furnished', 'Unfurnished', 'Part-furnished'],
    'Direction': ['Inbound', 'Outbound'],
    'Action status': ['Open', 'In progress', 'Completed', 'Cancelled'],
    'Objection category': ['Budget', 'Price', 'Location', 'Financing', 'Timing', 'Competition', 'No response', 'Property quality', 'Changed plans', 'Other'],
    'Lost reason': ['Budget', 'Price', 'Location', 'Financing', 'Timing', 'Competition', 'No response', 'Property quality', 'Changed plans', 'Other'],
    'Lost / cancelled reason': ['Budget', 'Price', 'Location', 'Financing', 'Timing', 'Competition', 'No response', 'Property quality', 'Changed plans', 'Other'],
    'Recontact possible': ['Yes', 'No', 'Unknown'],
    'Touchpoint type': ['Post-sale check-in', 'Lease renewal', 'Investor update', 'Referral request', 'Birthday / milestone', 'General check-in'],
    'Client relationship': ['New', 'Active', 'Past client', 'Investor', 'Inactive'],
    'Referral outcome': ['Not yet', 'Referral received', 'Meeting booked', 'Converted', 'None'],
    'Client response': ['Interested', 'Pending', 'Not interested', 'Viewing requested', 'Negotiating'],
    'Rental cheques': ['1', '2', '3', '4', '6', '12']
};
const computedByModule = {
    Clients: ['Duplicate contact', 'Last contact auto', 'Next follow-up auto', 'Follow-up status auto', 'Record check', 'Lead tier auto'],
    Deals: ['Gross fee AED ex VAT', 'After partner AED', 'Your expected fee AED', 'Your earned fee AED', 'Outstanding AED', 'Payment status', 'Record check'],
    Properties: ['Availability review', 'Permit date alert', 'Record check'],
    'Follow-ups': ['Due-date alert', 'Client name auto', 'Property title auto', 'Record check', 'Task order auto'],
    Viewings: ['Client name auto', 'Property title auto', 'Record check'],
    Shortlist: ['Client name auto', 'Property title auto', 'Record check'],
    Payments: ['Total received AED', 'Record check'],
    'Interaction log': ['Client name auto', 'Record check auto'],
    'Client care': ['Client name auto', 'Reminder auto', 'Record check auto'],
    Contacts: ['Record check'], Expenses: ['Record check']
};
const numRegex = /\b(AED|sq ft|budget|bedrooms|bathrooms|parking spaces|amount|cheques|fee rate|share %|score \/|deposit|nights|guests)\b/i;
const dateRegex = /(date|\bdue\b|expires|expiry|last verified|received on|contacted on|added on|next contact|last contact|next follow-up|last qualified|closed on|re-engage|opened|earned|payment due|available from)/i;
const longRegex = /(notes|summary|criteria|objection|commitment|description|feedback|blocker|interests|amenities|selling points|instructions)/i;
const computed = (mod, label) => (computedByModule[mod] || []).includes(label);
function colType(l) { if (dateRegex.test(l))
    return /time/i.test(l) ? 'datetime-local' : 'date'; if (numRegex.test(l))
    return 'number'; if (/email/i.test(l))
    return 'email'; if (/url/i.test(l))
    return 'url'; if (/phone/i.test(l))
    return 'tel'; if (longRegex.test(l))
    return 'textarea'; return 'text'; }
const richField = (m, f) => ({ ...f, key: slug(f.name), type: colType(f.name), calculated: computed(m, f.name), options: OPTIONS[f.name] || null });
const schema = (m) => (MODS[m] || []).map(f => richField(m, f));
const blank = () => Object.fromEntries(Object.keys(MODS).map(k => [k, []]));
const identifier = (mod) => ({ Clients: 'CL', Contacts: 'CT', Properties: 'PR', Deals: 'DL', 'Follow-ups': 'FU', Viewings: 'VW', Shortlist: 'MT', 'Interaction log': 'LG', 'Client care': 'CA', Payments: 'PM', Expenses: 'EX' }[mod] || 'RC');
const newId = (mod, records) => { const prefix = identifier(mod); const first = slug(schema(mod)[0].name); const used = new Set(records.map(r => String(r[first] || ''))); let i = records.length + 1; while (used.has(`${prefix}-${String(i).padStart(3, '0')}`))
    i++; return `${prefix}-${String(i).padStart(3, '0')}`; };
function deriveLeadScore(r) { const saved = Number(get(r, 'Lead quality score / 100')); if (saved > 0)
    return Math.min(100, saved); let score = 15; const text = (label) => String(get(r, label) || '').toLowerCase(); if (['yes'].includes(text('Funds confirmed')))
    score += 20; if (text('Decision maker') === 'yes')
    score += 15; if (/immediately|30 days/.test(text('Buying / moving urgency')))
    score += 20;
else if (/60 days/.test(text('Buying / moving urgency')))
    score += 12;
else if (/90 days/.test(text('Buying / moving urgency')))
    score += 6; if (get(r, 'Maximum budget AED'))
    score += 10; if (get(r, 'Preferred communities'))
    score += 10; if (/pre-approved|approved/.test(text('Mortgage stage')) || text('Finance type') === 'cash')
    score += 10; return Math.min(score, 100); }
const leadTier = (r) => { if (isLost(get(r, 'Lead stage')))
    return 'Lost'; if (/closed/i.test(String(get(r, 'Lead stage') || '')))
    return 'Converted'; const s = deriveLeadScore(r); return s >= 75 ? 'Hot' : s >= 50 ? 'Warm' : 'Nurture'; };
const feeNumber = (d) => { const b = Number(get(d, 'Agreed value AED')) || 0; const rate = Number(get(d, 'Fee rate %')) || 0; const fixed = Number(get(d, 'Fixed fee AED')) || 0; return /fixed/i.test(String(get(d, 'Fee basis') || '')) ? fixed : b * rate / 100; };
const yourFee = (d) => { const after = feeNumber(d) * (1 - (Number(get(d, 'Partner share %')) || 0) / 100); return after * (Number(get(d, 'Your share %')) || 0) / 100; };
const totalPaid = (deal, records) => records.Payments.filter(p => get(p, 'Deal ID') === get(deal, 'Deal ID')).reduce((sum, p) => sum + (Number(get(p, 'Your fee received AED ex VAT')) || 0), 0);
const amountOf = (r, label) => Number(get(r, label)) || 0;
const SUM = (items, fn) => items.reduce((s, r) => s + fn(r), 0);
const isDue = (r) => { const due = String(get(r, 'Due date') || get(r, 'Action due') || get(r, 'Next contact') || '').slice(0, 10); return due && due <= today() && !isDone(get(r, 'Task status') || get(r, 'Action status')); };
const monthOf = (d) => String(d || '').slice(0, 7);
const listingIntent = p => { const intent = String(get(p, 'Sale / rental') || '').toLowerCase().trim(); if (/holiday|short.term|vacation|daily/.test(intent))
    return 'Holiday home'; if (/rent|lease/.test(intent))
    return 'Rental'; return 'Sale'; };
const isCommercialProperty = p => /office|retail|shop|showroom|warehouse|industrial|commercial|factory|labour|hotel|building|land|plot/i.test(String(get(p, 'Property type') || ''));
const priceBasis = p => get(p, 'Price basis') || (listingIntent(p) === 'Sale' ? 'Total price' : listingIntent(p) === 'Holiday home' ? 'Nightly' : 'Annual');
const propertyPrice = p => `${AED(get(p, 'Price / annual rent AED'))}${({ 'Annual': ' / year', 'Monthly': ' / month', 'Weekly': ' / week', 'Nightly': ' / night' })[priceBasis(p)] || ''}`;
const mediaPhotos = r => Array.isArray(r?.media_photos) ? r.media_photos : [];
const mediaPlans = r => Array.isArray(r?.media_floorplans) ? r.media_floorplans : [];
const AMENITIES = ['Balcony', 'Covered parking', 'Swimming pool', 'Gym', 'Security', 'Concierge', 'Furnished', 'Sea view', 'City view', 'Garden', 'Private pool', 'Maid’s room', 'Pets allowed', 'Near metro', 'Smart home', 'Shared spa', 'Children’s play area', 'Built-in wardrobes', 'BBQ area', 'Beach access'];
const amenityList = r => String(get(r, 'Amenities') || '').split(',').map(x => x.trim()).filter(Boolean);
const MAX_MEDIA_TOTAL = 2900000;
const fileToData = file => new Promise((resolve, reject) => { const fr = new FileReader(); fr.onload = () => resolve(fr.result); fr.onerror = reject; fr.readAsDataURL(file); });
async function optimizeImage(file) { const url = URL.createObjectURL(file); try {
    const img = new Image();
    await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = url; });
    const canvas = document.createElement('canvas');
    let factor = Math.min(1, 1200 / Math.max(img.width, img.height));
    let quality = .78;
    for (let attempt = 0; attempt < 6; attempt++) {
        canvas.width = Math.max(1, Math.round(img.width * factor));
        canvas.height = Math.max(1, Math.round(img.height * factor));
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const src = canvas.toDataURL('image/jpeg', quality);
        if (src.length < 205000)
            return src;
        factor *= .82;
        quality = Math.max(.48, quality - .06);
    }
    return canvas.toDataURL('image/jpeg', .52);
}
finally {
    URL.revokeObjectURL(url);
} }
async function makeMediaAsset(file, kind) { const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type); if (!isImage && !(kind === 'plan' && file.type === 'application/pdf'))
    throw Error('Use JPEG, PNG or WebP images; floor plans may also be PDFs.'); if (file.size > 12 * 1024 * 1024)
    throw Error('Each file must be smaller than 12 MB.'); if (!isImage && file.size > 450 * 1024)
    throw Error('Please use a PDF smaller than 450 KB for browser storage.'); return { name: file.name, type: isImage ? 'image/jpeg' : file.type, src: isImage ? await optimizeImage(file) : await fileToData(file), added: today() }; }
function GalleryStrip({ record, onEdit }) { const photos = mediaPhotos(record); return React.createElement("div", { className: "media-gallery-strip" },
    photos.length ? React.createElement("div", { className: "media-photo-hero" },
        React.createElement("a", { href: photos[0].src, target: "_blank", rel: "noopener noreferrer", title: "Open cover photo" },
            React.createElement("img", { src: photos[0].src, alt: `${get(record, 'Listing title') || 'Property'} main photo` })),
        React.createElement("span", null,
            React.createElement(Icon, { name: "image", size: 16 }),
            photos.length,
            " photo",
            photos.length === 1 ? '' : 's')) : React.createElement("div", { className: "media-placeholder" },
        React.createElement(Icon, { name: "image", size: 27 }),
        React.createElement("strong", null, "No property photos yet"),
        React.createElement("span", null, "Add photos to make this listing presentation-ready."),
        onEdit && React.createElement("button", { type: "button", onClick: onEdit }, "Add property photos")),
    photos.length > 1 && React.createElement("div", { className: "media-photo-thumbs" }, photos.slice(1).map((p, i) => React.createElement("a", { href: p.src, target: "_blank", rel: "noopener noreferrer", key: i, title: `Open property photo ${i + 2}` },
        React.createElement("img", { src: p.src, alt: `Property photo ${i + 2}` }))))); }
const propertyListingTags = [{ key: 'All', label: 'All listings', icon: 'grid' }, { key: 'Sale', label: 'For sale', icon: 'home' }, { key: 'Rental', label: 'For rent', icon: 'calendar' }, { key: 'Holiday home', label: 'Holiday homes', icon: 'sun' }, { key: 'Off-plan', label: 'Off-plan', icon: 'building' }, { key: 'Commercial', label: 'Commercial', icon: 'briefcase' }];
const propertyMatchesPurpose = (p, purpose) => purpose === 'All' || (purpose === 'Off-plan' ? get(p, 'Ready / off-plan') === 'Off-plan' : purpose === 'Commercial' ? isCommercialProperty(p) : listingIntent(p) === purpose);
const prName = (data, id) => get(data.Properties.find(p => get(p, 'Property ID') === id), 'Listing title') || id || '—';
const clName = (data, id) => get(data.Clients.find(p => get(p, 'Client ID') === id), 'Full name') || id || '—';
function statusClass(val) { const s = String(val || '').toLowerCase(); return /hot|completed|closed|paid|available|confirmed|active|verified|yes|interested/.test(s) ? 'green' : /overdue|lost|cancelled|expired|no-show|rejected/.test(s) ? 'red' : /negotiation|in progress|viewing|pending|qualified|warm|under offer/.test(s) ? 'amber' : 'slate'; }
function Badge({ children, tone }) { return React.createElement("span", { className: 'badge badge-' + (tone || statusClass(children)) },
    React.createElement("span", { className: "badge-dot" }),
    children || '—'); }
function Button({ children, variant = 'primary', icon, onClick, disabled = false, title = '', className = '', type = 'button' }) { return React.createElement("button", { type: type, title: title, className: 'btn btn-' + variant + ' ' + className, onClick: onClick, disabled: disabled },
    icon && React.createElement(Icon, { name: icon, size: 16 }),
    React.createElement("span", null, children)); }
function Empty({ title = 'Nothing here yet', detail = 'Create your first record to get started.', icon = 'note', action }) { return React.createElement("div", { className: "empty" },
    React.createElement("div", { className: "empty-icon" },
        React.createElement(Icon, { name: icon, size: 26 })),
    React.createElement("h3", null, title),
    React.createElement("p", null, detail),
    action); }
function Metric({ name, value, sub, icon, trend, accent }) { return React.createElement("div", { className: "metric" },
    React.createElement("div", { className: "metric-head" },
        React.createElement("span", null, name),
        React.createElement("span", { className: 'metric-icon ' + (accent || '') },
            React.createElement(Icon, { name: icon, size: 19 }))),
    React.createElement("div", { className: "metric-value" }, value),
    React.createElement("div", { className: "metric-foot" },
        trend && React.createElement("span", { className: "trend" },
            React.createElement(Icon, { name: "trend", size: 12 }),
            trend),
        sub)); }
function LabelValue({ label, value }) { return React.createElement("div", { className: "label-value" },
    React.createElement("span", null, label),
    React.createElement("strong", null, value || '—')); }
function TitleSection({ heading, caption, action }) { return React.createElement("div", { className: "section-top" },
    React.createElement("div", null,
        React.createElement("h2", null, heading),
        caption && React.createElement("p", null, caption)),
    action); }
function BrandMark({ small = false }) { return React.createElement("span", { className: 'brand-logo ' + (small ? 'brand-logo-small' : '') },
    React.createElement("svg", { viewBox: "0 0 50 50", width: "30", height: "30", fill: "none" },
        React.createElement("path", { d: "M12 7v36M12 25 34 8M12 25l24 18", stroke: "currentColor", strokeWidth: "6", strokeLinecap: "round", strokeLinejoin: "round" }),
        React.createElement("circle", { cx: "37", cy: "9", r: "4", fill: "currentColor" }))); }
function dateNum(v) { const n = Date.parse(String(v || '')); return Number.isNaN(n) ? 0 : n; }
function computedVal(data, module, record, key) {
    if (module === 'Clients') {
        if (key === 'lead_tier_auto')
            return leadTier(record);
        if (key === 'last_contact_auto')
            return data['Follow-ups'].filter(x => get(x, 'Client ID') === get(record, 'Client ID')).map(x => get(x, 'Contact date')).sort().at(-1) || '';
        if (key === 'next_follow_up_auto')
            return data['Follow-ups'].filter(x => get(x, 'Client ID') === get(record, 'Client ID') && !isDone(get(x, 'Task status'))).map(x => get(x, 'Due date')).filter(Boolean).sort()[0] || '';
        if (key === 'follow_up_status_auto') {
            const next = computedVal(data, 'Clients', record, 'next_follow_up_auto');
            return !next ? 'No task' : next < today() ? 'Overdue' : next === today() ? 'Due today' : 'Scheduled';
        }
        if (key === 'duplicate_contact')
            return data.Clients.filter(c => c !== record && get(c, 'Phone') && get(c, 'Phone') === get(record, 'Phone')).length ? 'Duplicate' : '';
    }
    if (module === 'Deals') {
        if (key === 'gross_fee_aed_ex_vat')
            return feeNumber(record);
        if (key === 'after_partner_aed')
            return feeNumber(record) * (1 - (Number(get(record, 'Partner share %')) || 0) / 100);
        if (key === 'your_expected_fee_aed')
            return yourFee(record);
        if (key === 'your_earned_fee_aed')
            return get(record, 'Earned date') ? yourFee(record) : 0;
        if (key === 'outstanding_aed')
            return Math.max(0, (get(record, 'Earned date') ? yourFee(record) : 0) - totalPaid(record, data));
        if (key === 'payment_status')
            return !get(record, 'Earned date') ? 'Not earned' : computedVal(data, 'Deals', record, 'outstanding_aed') === 0 ? 'Paid' : 'Outstanding';
    }
    if (module === 'Payments' && key === 'total_received_aed')
        return amountOf(record, 'Your fee received AED ex VAT') + amountOf(record, 'VAT received AED');
    if (['Follow-ups', 'Viewings', 'Shortlist', 'Interaction log', 'Client care'].includes(module)) {
        if (key === 'client_name_auto')
            return clName(data, get(record, 'Client ID'));
        if (key === 'property_title_auto')
            return prName(data, get(record, 'Property ID'));
        if (key === 'due_date_alert')
            return isDue(record) ? 'Overdue' : 'On track';
        if (key === 'reminder_auto')
            return isDue(record) ? 'Due now' : 'Scheduled';
    }
    if (module === 'Properties') {
        if (key === 'availability_review')
            return !get(record, 'Last verified') ? 'Verify' : (dateNum(today()) - dateNum(get(record, 'Last verified')) > 14 * 86400000 ? 'Review' : 'Current');
        if (key === 'permit_date_alert') {
            const exp = get(record, 'Permit expiry');
            return !exp ? '—' : exp < today() ? 'Expired' : 'Valid';
        }
    }
    return get(record, key);
}
function valueOf(data, module, r, f) { return f.calculated ? computedVal(data, module, r, f.key) : r[f.key]; }
function formatValue(data, module, r, f) { let v = valueOf(data, module, r, f); if (v === undefined || v === null || v === '')
    return '—'; if (f.type === 'number' && (/AED|fee|amount|budget/i).test(f.name))
    return AED(v); if (f.type === 'date' || f.type === 'datetime-local')
    return readableDate(v); return String(v); }
function ErrorBoundaryFallback() { return React.createElement("div", { className: "empty" },
    React.createElement("h3", null, "Something went wrong"),
    React.createElement("p", null, "Try refreshing your browser. Data stays stored locally.")); }
function App() {
    const [db, setDb] = useState(() => { try {
        let saved = localStorage.getItem(STORAGE);
        return saved ? JSON.parse(saved) : { data: window.SEED_CRM(), demo: true, createdAt: new Date().toISOString() };
    }
    catch (e) {
        return { data: window.SEED_CRM(), demo: true };
    } });
    const data = db.data || blank();
    const [route, setRoute] = useState('Dashboard');
    const [query, setQuery] = useState('');
    const [tab, setTab] = useState('All');
    const [sort, setSort] = useState({ key: '', direction: 'asc' });
    const [page, setPage] = useState(0);
    const [drawer, setDrawer] = useState(null);
    const [mobileNav, setMobileNav] = useState(false);
    const [toast, setToast] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [detail, setDetail] = useState(null);
    const [viewMode, setViewMode] = useState('cards');
    const [propertyFilters, setPropertyFilters] = useState({ purpose: 'All', type: 'All', emirate: 'All', status: 'All', completion: 'All', bedrooms: 'All', maxPrice: '' });
    const [selectedClient, setSelectedClient] = useState('CL-001');
    const [dateFilter, setDateFilter] = useState({ type: 'New enquiries', start: dateShift(-30), end: today() });
    const [reportMonth, setReportMonth] = useState(today().slice(0, 7));
    const [settings, setSettings] = useState(() => { try {
        return JSON.parse(localStorage.getItem(PREFERENCE)) || { targets: {} };
    }
    catch (e) {
        return { targets: {} };
    } });
    const uploadRef = useRef(null);
    const restoreRef = useRef(null);
    useEffect(() => { try {
        localStorage.setItem(STORAGE, JSON.stringify(db));
    }
    catch (e) {
        alert('Browser storage is full. Export your records now; large datasets need a database-backed deployment.');
    } }, [db]);
    useEffect(() => { try {
        localStorage.setItem(PREFERENCE, JSON.stringify(settings));
    }
    catch (e) { } }, [settings]);
    useEffect(() => { const theme = settings.theme === 'dark' ? 'dark' : 'light'; document.documentElement.dataset.theme = theme; document.documentElement.style.colorScheme = theme; }, [settings.theme]);
    useEffect(() => { if (!toast)
        return; const t = setTimeout(() => setToast(''), 3800); return () => clearTimeout(t); }, [toast]);
    useEffect(() => { setTab('All'); setQuery(''); setSort({ key: '', direction: 'asc' }); setPage(0); setViewMode('cards'); setPropertyFilters({ purpose: 'All', type: 'All', emirate: 'All', status: 'All', completion: 'All', bedrooms: 'All', maxPrice: '' }); setMobileNav(false); }, [route]);
    useEffect(() => { const fn = e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
    } if (e.key === 'Escape') {
        setDrawer(null);
        setDetail(null);
        setShowMenu(false);
    } }; window.addEventListener('keydown', fn); return () => window.removeEventListener('keydown', fn); }, []);
    const records = Object.values(data).flat();
    const summary = useMemo(() => {
        const openLeads = data.Clients.filter(r => !isLost(get(r, 'Lead stage')) && !/closed/i.test(String(get(r, 'Lead stage') || '')));
        const activeDeals = data.Deals.filter(r => !isDone(get(r, 'Deal stage')));
        const tasks = data['Follow-ups'].filter(r => !isDone(get(r, 'Task status')));
        const dueTasks = tasks.filter(isDue);
        const earned = SUM(data.Deals, d => get(d, 'Earned date') ? yourFee(d) : 0);
        const receipts = SUM(data.Payments, p => amountOf(p, 'Your fee received AED ex VAT'));
        const expenses = SUM(data.Expenses, p => amountOf(p, 'Amount paid AED'));
        const upcoming = data.Viewings.filter(x => dateNum(get(x, 'Appointment date & time')) >= dateNum(today())).sort((a, b) => dateNum(get(a, 'Appointment date & time')) - dateNum(get(b, 'Appointment date & time')));
        return { openLeads, activeDeals, tasks, dueTasks, earned, receipts, expenses, upcoming, outstanding: Math.max(0, earned - receipts), hot: data.Clients.filter(x => leadTier(x) === 'Hot'), warm: data.Clients.filter(x => leadTier(x) === 'Warm'), clientCare: data['Client care'].filter(isDue) };
    }, [db]);
    const navigate = (name) => { setRoute(name); setDetail(null); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const notify = (message) => setToast(message);
    const updateRecords = (module, fn) => setDb(prev => ({ ...prev, data: { ...prev.data, [module]: fn(prev.data[module] || []) } }));
    const saveRecord = (module, record, original) => {
        const id = slug(schema(module)[0]?.name);
        const normalized = { ...record };
        if (module === 'Properties' && !normalized.price_basis)
            normalized.price_basis = normalized.sale_rental === 'Holiday home' ? 'Nightly' : normalized.sale_rental === 'Rental' ? 'Annual' : 'Total price';
        if (!String(normalized[id] || '').trim())
            return notify('A record ID is required.');
        const exist = data[module].find(row => row[id] === normalized[id] && row !== original);
        if (exist && (!original || original[id] !== normalized[id]))
            return notify('That record ID is already in use.');
        if (module === 'Properties' && JSON.stringify({ ...db, data: { ...data, Properties: original ? data.Properties.map(row => row[id] === original[id] ? normalized : row) : [normalized, ...data.Properties] } }).length > MAX_MEDIA_TOTAL)
            return notify('Browser media storage is nearly full. Remove some photos or export a full backup before adding more.');
        updateRecords(module, rows => original ? rows.map(row => row[id] === original[id] ? normalized : row) : [normalized, ...rows]);
        setDrawer(null);
        notify(original ? 'Record updated successfully' : 'Record added successfully');
    };
    const deleteRecord = (module, record) => {
        const id = schema(module)[0];
        if (!confirm(`Delete ${record[id.key]} permanently from this browser?`))
            return;
        updateRecords(module, rows => rows.filter(r => r[id.key] !== record[id.key]));
        setDrawer(null);
        setDetail(null);
        notify('Record removed');
    };
    const clearDemo = () => { if (!confirm('Start with an empty workspace? This replaces the demo records. Export first if you need your current data.'))
        return; setDb({ data: blank(), demo: false }); notify('Your blank CRM workspace is ready'); setRoute('Dashboard'); };
    const restoreDemo = () => { if (!confirm('Replace ALL local records with example data? Export your data first if you need it.'))
        return; setDb({ data: window.SEED_CRM(), demo: true }); notify('Example workspace restored'); };
    const downloadFullBackup = () => { const blob = new Blob([JSON.stringify({ format: 'keys-with-simoni-full-backup', version: 2, exportedAt: new Date().toISOString(), data, mediaIncluded: true }, null, 2)], { type: 'application/json' }); const href = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = href; a.download = `Keys_with_Simoni_Full_Backup_${today()}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(href), 1200); notify('Full backup exported with property media.'); };
    async function restoreFullBackup(ev) { const el = ev.currentTarget; const f = el.files?.[0]; if (!f)
        return; try {
        const obj = JSON.parse(await f.text());
        if (obj.format !== 'keys-with-simoni-full-backup' || !obj.data || !Array.isArray(obj.data.Properties))
            throw Error('This is not a Keys with Simoni full backup.');
        if (!confirm('Restore this full backup? It replaces current CRM records and attached media.'))
            return;
        const restored = Object.fromEntries(Object.keys(MODS).map(k => [k, Array.isArray(obj.data[k]) ? obj.data[k] : []]));
        if (JSON.stringify(restored).length > MAX_MEDIA_TOTAL)
            throw Error('Backup exceeds this browser edition’s storage limit.');
        setDb({ data: restored, demo: false });
        notify('Full backup restored with property photos and floor plans.');
        setRoute('Properties');
    }
    catch (e) {
        alert(e.message || 'Could not restore JSON backup.');
    }
    finally {
        el.value = '';
    } }
    const downloadRaw = () => { const link = document.createElement('a'); link.href = window.KWS_TEMPLATE_DATA || './data/Keys_with_Simoni_Real_Estate_CRM_Enhanced.xlsx'; link.download = 'Keys_with_Simoni_Real_Estate_CRM_Enhanced.xlsx'; link.click(); };
    const add = (module, pre = {}) => { const idField = schema(module)[0].key; setDrawer({ module, record: { [idField]: newId(module, data[module]), ...pre }, original: null }); };
    const edit = (module, rec) => setDrawer({ module, record: { ...rec }, original: rec });
    const dispatchRow = (module, record) => setDetail({ module, record });
    const recordText = (mod, r) => [...schema(mod).map(f => r[f.key]), clName(data, get(r, 'Client ID')), prName(data, get(r, 'Property ID'))].filter(Boolean).join(' ').toLowerCase();
    const filtered = (module, filterOverride) => {
        let arr = [...(data[module] || [])];
        const q = query.trim().toLowerCase();
        if (q)
            arr = arr.filter(r => recordText(module, r).includes(q));
        if (filterOverride)
            arr = arr.filter(filterOverride);
        if (sort.key) {
            arr.sort((a, b) => { let av = String(a[sort.key] ?? ''); let bv = String(b[sort.key] ?? ''); const v = av.localeCompare(bv, undefined, { numeric: true, sensitivity: 'base' }); return sort.direction === 'asc' ? v : -v; });
        }
        return arr;
    };
    function TableView({ module, arr, limit = true }) {
        const columns = schema(module);
        const pick = (preferredCols[module] || []).map(name => columns.find(f => f.name === name)).filter(Boolean);
        const perPage = limit ? 12 : 500;
        const start = page * perPage;
        const current = arr.slice(start, start + perPage);
        return React.createElement("div", { className: "table-shell" },
            React.createElement("div", { className: "table-scroll" },
                React.createElement("table", { className: "data-table" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            pick.map(f => React.createElement("th", { key: f.key },
                                React.createElement("button", { className: "table-sort", onClick: () => { setSort(s => ({ key: f.key, direction: s.key === f.key && s.direction === 'asc' ? 'desc' : 'asc' })); setPage(0); } },
                                    f.name.replace(/ AED$/, ''),
                                    " ",
                                    sort.key === f.key && React.createElement(Icon, { name: sort.direction === 'asc' ? 'up' : 'down', size: 12 })))),
                            React.createElement("th", { className: "last-th" }))),
                    React.createElement("tbody", null, current.map((r, i) => React.createElement("tr", { key: get(r, columns[0].name) || i, onClick: () => dispatchRow(module, r) },
                        pick.map(f => React.createElement("td", { key: f.key }, (/stage|status|tier|priority/i.test(f.name)) ? React.createElement(Badge, null, formatValue(data, module, r, f)) : f === pick[0] ? React.createElement("span", { className: "mono id-link" }, formatValue(data, module, r, f)) : (/Full name|Listing title|Next action|Community/i.test(f.name)) ? React.createElement("span", { className: "cell-strong" }, formatValue(data, module, r, f)) : formatValue(data, module, r, f))),
                        React.createElement("td", null,
                            React.createElement("button", { className: "row-link", title: "Open record" },
                                React.createElement(Icon, { name: "arrow", size: 17 })))))))),
            !arr.length && React.createElement(Empty, { title: "No matching records", detail: query ? 'Try another search or clear filters.' : 'Use Add record to start building your workspace.', action: React.createElement(Button, { icon: "plus", onClick: () => add(module) }, "Add record") }),
            React.createElement("div", { className: "table-footer" },
                React.createElement("span", null,
                    "Showing ",
                    arr.length ? start + 1 : 0,
                    "\u2013",
                    Math.min(start + perPage, arr.length),
                    " of ",
                    arr.length,
                    " records"),
                React.createElement("div", { className: "pager" },
                    React.createElement("button", { disabled: page === 0, onClick: () => setPage(x => Math.max(0, x - 1)) }, "Previous"),
                    React.createElement("span", null,
                        page + 1,
                        " / ",
                        Math.max(1, Math.ceil(arr.length / perPage))),
                    React.createElement("button", { disabled: (page + 1) * perPage >= arr.length, onClick: () => setPage(x => x + 1) }, "Next"))));
    }
    function Overview() {
        const completed = data.Deals.filter(d => /completed/i.test(String(get(d, 'Deal stage'))));
        const active = summary.activeDeals;
        const monthLeads = data.Clients.filter(c => monthOf(get(c, 'Date added')) === reportMonth).length;
        const monthlyIncome = SUM(data.Payments.filter(p => monthOf(get(p, 'Receipt date')) === reportMonth), p => amountOf(p, 'Your fee received AED ex VAT'));
        const monthlyExpense = SUM(data.Expenses.filter(p => monthOf(get(p, 'Date paid')) === reportMonth), p => amountOf(p, 'Amount paid AED'));
        const nameOfTask = t => clName(data, get(t, 'Client ID'));
        const sources = ['Instagram', 'Referral', 'Property Finder', 'Bayut', 'Website', 'TikTok', 'Other'].map(source => ({ name: source, count: data.Clients.filter(c => get(c, 'Lead source') === source).length })).filter(x => x.count > 0);
        const maxSource = Math.max(1, ...sources.map(x => x.count));
        const chartMonths = Array.from({ length: 6 }, (_, i) => { const d = new Date(); d.setMonth(d.getMonth() - 5 + i); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; });
        const monthly = chartMonths.map(m => ({ month: m, amount: SUM(data.Payments.filter(p => monthOf(get(p, 'Receipt date')) === m), p => amountOf(p, 'Your fee received AED ex VAT')) }));
        const maxBar = Math.max(1, ...monthly.map(x => x.amount));
        return React.createElement("div", { className: "page-stack" },
            React.createElement("div", { className: "welcome" },
                React.createElement("div", { className: "welcome-copy" },
                    React.createElement("div", { className: "welcome-eyebrow" },
                        React.createElement("span", { className: "small-gold-line" }),
                        " YOUR REAL ESTATE COMMAND CENTRE"),
                    React.createElement("h1", null,
                        "Make every connection ",
                        React.createElement("em", null, "count.")),
                    React.createElement("p", null, "Relationships, opportunities, and everything in between \u2014 thoughtfully organized in one place."),
                    React.createElement("div", { className: "welcome-actions" },
                        React.createElement(Button, { icon: "plus", onClick: () => add('Clients') }, "Add new lead"),
                        React.createElement(Button, { icon: "arrow", variant: "outline-light", onClick: () => navigate('Client desk') }, "Explore workspace"))),
                React.createElement("div", { className: "welcome-art", "aria-hidden": "true" },
                    React.createElement("div", { className: "art-ring ring-one" }),
                    React.createElement("div", { className: "art-ring ring-two" }),
                    React.createElement("div", { className: "tower tower-a" }),
                    React.createElement("div", { className: "tower tower-b" }),
                    React.createElement("div", { className: "tower tower-c" }),
                    React.createElement("div", { className: "tower tower-d" }),
                    React.createElement("div", { className: "art-baseline" }),
                    React.createElement("div", { className: "art-stamp" }, "K / S"))),
            React.createElement("div", { className: "subhead-row" },
                React.createElement("div", null,
                    React.createElement("h2", null, "Your business, at a glance"),
                    React.createElement("p", null, "Real-time figures from your CRM records")),
                React.createElement("label", { className: "date-select" },
                    React.createElement(Icon, { name: "calendar", size: 16 }),
                    React.createElement("input", { "aria-label": "Reporting month", type: "month", value: reportMonth, onChange: e => setReportMonth(e.target.value) }))),
            React.createElement("div", { className: "metrics-grid" },
                React.createElement(Metric, { name: "ACTIVE LEADS", icon: "users", value: N(summary.openLeads.length), sub: `${summary.hot.length} high-priority lead${summary.hot.length === 1 ? '' : 's'}`, accent: "mint" }),
                React.createElement(Metric, { name: "OPEN DEALS", icon: "briefcase", value: N(active.length), sub: `${completed.length} completed transactions`, accent: "sky" }),
                React.createElement(Metric, { name: "FOLLOW-UPS DUE", icon: "bell", value: N(summary.dueTasks.length), sub: "Today & overdue", accent: "rose" }),
                React.createElement(Metric, { name: "FEES RECEIVED", icon: "wallet", value: AED(monthlyIncome), sub: "Selected reporting month", accent: "sand" })),
            React.createElement("div", { className: "split-main" },
                React.createElement("section", { className: "panel revenue-panel" },
                    React.createElement(TitleSection, { heading: "Commission performance", caption: "Fee receipts across the last six months", action: React.createElement("button", { className: "text-action", onClick: () => navigate('Performance') },
                            "View reports ",
                            React.createElement(Icon, { name: "arrow", size: 15 })) }),
                    React.createElement("div", { className: "chart-total" },
                        React.createElement("strong", null, AED(SUM(monthly, x => x.amount))),
                        React.createElement("span", null, "Last 6 months \u00B7 Excluding VAT")),
                    React.createElement("div", { className: "column-chart" }, monthly.map((x, i) => React.createElement("div", { className: "column-group", key: x.month },
                        React.createElement("div", { className: "column-space" },
                            React.createElement("div", { className: 'column-bar ' + (i === monthly.length - 1 ? 'last' : ''), style: { height: Math.max(5, (x.amount / maxBar) * 100) + '%' }, title: `${x.month}: ${AED(x.amount)}` })),
                        React.createElement("small", null, new Date(x.month + '-01').toLocaleDateString('en-AE', { month: 'short' }))))),
                    React.createElement("div", { className: "mini-insights" },
                        React.createElement("div", null,
                            React.createElement("span", null, "Earned fees to date"),
                            React.createElement("strong", null, AED(summary.earned))),
                        React.createElement("div", null,
                            React.createElement("span", null, "Outstanding commission"),
                            React.createElement("strong", null, AED(summary.outstanding))),
                        React.createElement("div", null,
                            React.createElement("span", null, "Operating costs"),
                            React.createElement("strong", null, AED(summary.expenses))))),
                React.createElement("section", { className: "panel activity-panel" },
                    React.createElement(TitleSection, { heading: "Your priorities", caption: "The next conversations worth having", action: React.createElement("button", { className: "text-action", onClick: () => navigate('Follow-ups') },
                            "All tasks ",
                            React.createElement(Icon, { name: "arrow", size: 15 })) }),
                    React.createElement("div", { className: "todo-list" },
                        [...summary.dueTasks, ...summary.tasks.filter(r => !isDue(r))].slice(0, 5).map((t, i) => React.createElement("button", { className: "todo-row", key: i, onClick: () => dispatchRow('Follow-ups', t) },
                            React.createElement("span", { className: 'todo-indicator ' + (isDue(t) ? 'overdue' : '') },
                                React.createElement(Icon, { name: isDue(t) ? 'bell' : 'check', size: 16 })),
                            React.createElement("div", null,
                                React.createElement("strong", null, get(t, 'Next action') || 'Contact client'),
                                React.createElement("span", null,
                                    nameOfTask(t),
                                    " \u00B7 ",
                                    compactDate(get(t, 'Due date')))),
                            React.createElement(Icon, { name: "chevron", size: 16 }))),
                        !summary.tasks.length && React.createElement(Empty, { title: "You're all caught up", detail: "No pending follow-ups. Add one to keep momentum going.", icon: "check" })),
                    React.createElement("button", { className: "add-inline", onClick: () => add('Follow-ups') },
                        React.createElement(Icon, { name: "plus", size: 16 }),
                        " Create follow-up"))),
            React.createElement("div", { className: "triple-grid" },
                React.createElement("section", { className: "panel" },
                    React.createElement(TitleSection, { heading: "Deal pipeline", caption: "Where your active opportunities stand" }),
                    React.createElement("div", { className: "pipeline-list" }, ['New', 'Negotiation', 'Documentation', 'Offer', 'Completed'].map((stage, i) => { const n = data.Deals.filter(d => String(get(d, 'Deal stage') || '').toLowerCase() === stage.toLowerCase()).length; return React.createElement("div", { key: stage, className: "bar-row" },
                        React.createElement("div", { className: "bar-label" },
                            React.createElement("span", null, stage),
                            React.createElement("strong", null, n)),
                        React.createElement("div", { className: "bar-track" },
                            React.createElement("div", { style: { width: (n / Math.max(1, data.Deals.length) * 100) + '%', background: COLORS[i % COLORS.length] } }))); })),
                    React.createElement("button", { className: "panel-link", onClick: () => navigate('Deals') },
                        "Manage deals ",
                        React.createElement(Icon, { name: "arrow", size: 16 }))),
                React.createElement("section", { className: "panel" },
                    React.createElement(TitleSection, { heading: "Where leads come from", caption: "Top channels bringing clients in" }),
                    React.createElement("div", { className: "pipeline-list" },
                        sources.slice(0, 5).map((src, i) => React.createElement("div", { className: "bar-row", key: src.name },
                            React.createElement("div", { className: "bar-label" },
                                React.createElement("span", null, src.name),
                                React.createElement("strong", null, src.count)),
                            React.createElement("div", { className: "bar-track" },
                                React.createElement("div", { style: { width: (src.count / maxSource * 100) + '%', background: COLORS[(i + 1) % COLORS.length] } })))),
                        !sources.length && React.createElement("span", { className: "muted" }, "No lead sources recorded.")),
                    React.createElement("button", { className: "panel-link", onClick: () => navigate('CRM insights') },
                        "Explore insights ",
                        React.createElement(Icon, { name: "arrow", size: 16 }))),
                React.createElement("section", { className: "panel next-viewings" },
                    React.createElement(TitleSection, { heading: "Upcoming viewings", caption: "Your next scheduled appointments" }),
                    React.createElement("div", { className: "viewing-list" },
                        summary.upcoming.slice(0, 3).map((v, i) => React.createElement("button", { key: i, onClick: () => dispatchRow('Viewings', v), className: "viewing-mini" },
                            React.createElement("span", { className: "date-chip" },
                                React.createElement("b", null, new Date(get(v, 'Appointment date & time')).getDate()),
                                React.createElement("small", null, new Date(get(v, 'Appointment date & time')).toLocaleDateString('en-AE', { month: 'short' }))),
                            React.createElement("div", null,
                                React.createElement("strong", null, prName(data, get(v, 'Property ID'))),
                                React.createElement("span", null, clName(data, get(v, 'Client ID')))),
                            React.createElement(Icon, { name: "chevron", size: 16 }))),
                        !summary.upcoming.length && React.createElement("div", { className: "mini-quiet" }, "No upcoming viewings yet.")),
                    React.createElement("button", { className: "panel-link", onClick: () => navigate('Viewings') },
                        "Open calendar ",
                        React.createElement(Icon, { name: "arrow", size: 16 })))));
    }
    function Insights() {
        const tiers = ['Hot', 'Warm', 'Nurture', 'Converted', 'Lost'];
        const counts = tiers.map(t => ({ title: t, value: data.Clients.filter(x => leadTier(x) === t).length }));
        const total = Math.max(1, data.Clients.length);
        const pipelineTypes = OPTIONS['Pipeline type'].map(name => ({ name, value: data.Deals.filter(d => get(d, 'Pipeline type') === name).length }));
        const lostReasons = OPTIONS['Lost reason'].map(name => ({ name, value: data.Clients.filter(c => get(c, 'Lost reason') === name).length + data.Deals.filter(d => get(d, 'Lost / cancelled reason') === name).length })).filter(x => x.value > 0);
        return React.createElement("div", { className: "page-stack" },
            React.createElement("div", { className: "metrics-grid" },
                React.createElement(Metric, { name: "HOT LEADS", value: summary.hot.length, sub: "High qualification score", icon: "sparkle", accent: "mint" }),
                React.createElement(Metric, { name: "WARM LEADS", value: summary.warm.length, sub: "Require further nurturing", icon: "users", accent: "sand" }),
                React.createElement(Metric, { name: "FOLLOW-UPS OVERDUE", value: summary.dueTasks.length, sub: "Requires your attention", icon: "bell", accent: "rose" }),
                React.createElement(Metric, { name: "CLIENT CARE DUE", value: summary.clientCare.length, sub: "Relationship touchpoints", icon: "heart", accent: "sky" })),
            React.createElement("div", { className: "two-grid" },
                React.createElement("section", { className: "panel" },
                    React.createElement(TitleSection, { heading: "Lead quality distribution", caption: "Automatic tiers based on qualification criteria" }),
                    React.createElement("div", { className: "tier-list" }, counts.map((c, i) => React.createElement("div", { key: c.title, className: "tier-item" },
                        React.createElement("div", { className: "tier-icon", style: { background: COLORS[i] + '24', color: COLORS[i] } },
                            React.createElement(Icon, { name: i === 0 ? 'sparkle' : i === 4 ? 'close' : 'users', size: 17 })),
                        React.createElement("span", null, c.title),
                        React.createElement("div", { className: "tier-track" },
                            React.createElement("div", { style: { background: COLORS[i], width: (c.value / total * 100) + '%' } })),
                        React.createElement("strong", null, c.value))))),
                React.createElement("section", { className: "panel" },
                    React.createElement(TitleSection, { heading: "Active pipelines", caption: "Opportunity mix across all real estate specializations" }),
                    React.createElement("div", { className: "pipeline-list" }, pipelineTypes.map((x, i) => React.createElement("div", { className: "bar-row", key: x.name },
                        React.createElement("div", { className: "bar-label" },
                            React.createElement("span", null, x.name),
                            React.createElement("strong", null, x.value)),
                        React.createElement("div", { className: "bar-track" },
                            React.createElement("div", { style: { width: (x.value / Math.max(1, data.Deals.length) * 100) + '%', background: COLORS[i % COLORS.length] } }))))))),
            React.createElement("div", { className: "two-grid" },
                React.createElement("section", { className: "panel" },
                    React.createElement(TitleSection, { heading: "Lost lead intelligence", caption: "Learn why opportunities did not convert" }),
                    lostReasons.length ? lostReasons.map((r, i) => React.createElement("div", { className: "lost-reason", key: r.name },
                        React.createElement("span", null, r.name),
                        React.createElement(Badge, { tone: "amber" },
                            r.value,
                            " records"))) : React.createElement(Empty, { title: "No lost reasons yet", detail: "Record a reason whenever a deal doesn't progress.", icon: "target" })),
                React.createElement("section", { className: "panel" },
                    React.createElement(TitleSection, { heading: "Needs qualification", caption: "New contacts with incomplete buyer profiles" }),
                    data.Clients.filter(c => !get(c, 'Funds confirmed') || !get(c, 'Decision maker')).slice(0, 4).map(c => React.createElement("button", { key: get(c, 'Client ID'), className: "client-mini", onClick: () => dispatchRow('Clients', c) },
                        React.createElement("span", { className: "avatar" }, initials(get(c, 'Full name'))),
                        React.createElement("div", null,
                            React.createElement("strong", null, get(c, 'Full name')),
                            React.createElement("small", null, get(c, 'Preferred communities') || 'Area not specified')),
                        React.createElement(Badge, null, leadTier(c)))),
                    data.Clients.length === 0 && React.createElement(Empty, { detail: "Lead quality insights appear when you add clients." }))));
    }
    function PropertyDirectory() {
        const all = data.Properties || [];
        const queryText = query.trim().toLowerCase();
        const countByPurpose = key => all.filter(p => propertyMatchesPurpose(p, key)).length;
        const fieldValues = (label) => [...new Set(all.map(p => String(get(p, label) || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
        const updateFilter = (name, value) => { setPropertyFilters(previous => ({ ...previous, [name]: value })); setPage(0); };
        const resetFilters = () => { setPropertyFilters({ purpose: 'All', type: 'All', emirate: 'All', status: 'All', completion: 'All', bedrooms: 'All', maxPrice: '' }); setQuery(''); setPage(0); };
        const f = propertyFilters;
        const result = all.filter(p => {
            if (!propertyMatchesPurpose(p, f.purpose))
                return false;
            if (f.type !== 'All' && get(p, 'Property type') !== f.type)
                return false;
            if (f.emirate !== 'All' && get(p, 'Emirate') !== f.emirate)
                return false;
            if (f.status !== 'All' && get(p, 'Listing status') !== f.status)
                return false;
            if (f.completion !== 'All' && get(p, 'Ready / off-plan') !== f.completion)
                return false;
            if (f.bedrooms !== 'All' && Number(get(p, 'Bedrooms')) !== Number(f.bedrooms))
                return false;
            if (f.maxPrice && Number(get(p, 'Price / annual rent AED')) > Number(f.maxPrice))
                return false;
            return !queryText || recordText('Properties', p).includes(queryText);
        });
        if (sort.key)
            result.sort((a, b) => { const diff = String(a[sort.key] ?? '').localeCompare(String(b[sort.key] ?? ''), undefined, { numeric: true, sensitivity: 'base' }); return sort.direction === 'asc' ? diff : -diff; });
        const activeCount = Object.entries(f).filter(([k, v]) => k !== 'purpose' && v !== '' && v !== 'All').length + (queryText ? 1 : 0);
        const filterSelect = (label, key, options) => React.createElement("label", { className: "inventory-field" },
            React.createElement("span", null, label),
            React.createElement("select", { "aria-label": label, value: f[key], onChange: e => updateFilter(key, e.target.value) },
                React.createElement("option", { value: "All" },
                    "All ",
                    label.toLowerCase()),
                options.map(o => React.createElement("option", { key: o, value: o }, o))));
        return React.createElement("div", { className: "page-stack inventory-page" },
            React.createElement("div", { className: "inventory-hero" },
                React.createElement("div", null,
                    React.createElement("span", { className: "inventory-overline" },
                        React.createElement(Icon, { name: "building", size: 14 }),
                        " PROPERTY COLLECTION"),
                    React.createElement("h2", null,
                        "The right space. ",
                        React.createElement("em", null, "Every detail.")),
                    React.createElement("p", null, "Curate a standout portfolio with photos, floor plans, amenities and accurate listing details.")),
                React.createElement("div", { className: "inventory-hero-right" },
                    React.createElement("span", null, "PORTFOLIO INVENTORY"),
                    React.createElement("strong", null, String(all.length).padStart(2, '0')),
                    React.createElement("small", null, "properties in your workspace"),
                    React.createElement(Button, { icon: "plus", onClick: () => add('Properties') }, "Add property"))),
            React.createElement("div", { className: "property-purpose-bar", role: "group", "aria-label": "Filter by listing purpose" }, propertyListingTags.map(item => React.createElement("button", { key: item.key, className: 'purpose-pill ' + (f.purpose === item.key ? 'selected' : ''), "aria-pressed": f.purpose === item.key, onClick: () => updateFilter('purpose', item.key) },
                React.createElement(Icon, { name: item.icon, size: 17 }),
                React.createElement("span", null, item.label),
                React.createElement("b", null, countByPurpose(item.key))))),
            React.createElement("div", { className: "inventory-filters" },
                React.createElement("div", { className: "inventory-filter-heading" },
                    React.createElement("div", null,
                        React.createElement(Icon, { name: "filter", size: 18 }),
                        React.createElement("strong", null, "Refine your properties"),
                        React.createElement("span", null, "Find exactly what your client needs")),
                    React.createElement("button", { className: "inventory-reset", onClick: resetFilters, disabled: !activeCount && f.purpose === 'All' }, "Clear all filters")),
                React.createElement("div", { className: "inventory-filter-grid" },
                    filterSelect('Property type', 'type', fieldValues('Property type')),
                    filterSelect('Emirate', 'emirate', fieldValues('Emirate')),
                    filterSelect('Listing status', 'status', fieldValues('Listing status')),
                    filterSelect('Completion', 'completion', fieldValues('Ready / off-plan')),
                    filterSelect('Bedrooms', 'bedrooms', fieldValues('Bedrooms')),
                    React.createElement("label", { className: "inventory-field" },
                        React.createElement("span", null, "Maximum asking price / rate (AED)"),
                        React.createElement("input", { "aria-label": "Maximum price", type: "number", min: "0", value: f.maxPrice, placeholder: "No maximum", onChange: e => updateFilter('maxPrice', e.target.value) })))),
            React.createElement("div", { className: "inventory-results-bar" },
                React.createElement("div", null,
                    React.createElement("strong", null,
                        N(result.length),
                        " ",
                        result.length === 1 ? 'property' : 'properties'),
                    React.createElement("span", null,
                        f.purpose === 'All' ? 'across your collection' : propertyListingTags.find(t => t.key === f.purpose)?.label || f.purpose,
                        activeCount ? ' · refined results' : '')),
                React.createElement("div", { className: "inventory-tools" },
                    React.createElement("div", { className: "search-small inventory-search" },
                        React.createElement(Icon, { name: "search", size: 16 }),
                        React.createElement("input", { "aria-label": "Search properties", placeholder: "Search address, project, ID...", value: query, onChange: e => { setQuery(e.target.value); setPage(0); } })),
                    React.createElement("div", { className: "view-switch", role: "group", "aria-label": "Property view mode" },
                        React.createElement("button", { "aria-label": "Table view", "aria-pressed": viewMode === 'table', className: viewMode === 'table' ? 'on' : '', onClick: () => setViewMode('table'), title: "Table view" },
                            React.createElement(Icon, { name: "menu", size: 17 })),
                        React.createElement("button", { "aria-label": "Card view", "aria-pressed": viewMode === 'cards', className: viewMode === 'cards' ? 'on' : '', onClick: () => setViewMode('cards'), title: "Card view" },
                            React.createElement(Icon, { name: "grid", size: 17 }))))),
            viewMode === 'table' ? React.createElement(TableView, { module: "Properties", arr: result }) : React.createElement("div", { className: "property-grid property-grid-refined" },
                result.map((p, i) => React.createElement("button", { className: "property-card modern-property-card", key: get(p, 'Property ID') || i, onClick: () => dispatchRow('Properties', p) },
                    React.createElement("div", { className: 'property-photo variant-' + (i % 4) },
                        React.createElement(React.Fragment, null, mediaPhotos(p).length ? React.createElement("img", { className: "property-cover-img", src: mediaPhotos(p)[0].src, alt: `${get(p, 'Listing title') || 'Property'} cover` }) : React.createElement("div", { className: "building-graphic" },
                            React.createElement("span", null),
                            React.createElement("span", null),
                            React.createElement("span", null))),
                        React.createElement("span", { className: "property-intent-tag" }, listingIntent(p) === 'Holiday home' ? 'HOLIDAY HOME' : listingIntent(p) === 'Sale' ? 'FOR SALE' : 'FOR RENT'),
                        React.createElement("span", { className: "property-photo-status" },
                            React.createElement(Badge, null, get(p, 'Listing status') || 'Unspecified'))),
                    React.createElement("div", { className: "property-content" },
                        React.createElement("div", { className: "property-card-meta" },
                            React.createElement("span", null, get(p, 'Property type') || 'Property'),
                            React.createElement("span", null, get(p, 'Ready / off-plan') || 'Ready'),
                            mediaPhotos(p).length > 0 && React.createElement("span", { className: "photo-count" },
                                React.createElement(Icon, { name: "image", size: 12 }),
                                " ",
                                mediaPhotos(p).length)),
                        React.createElement("h3", null, get(p, 'Listing title') || 'Untitled listing'),
                        React.createElement("p", null,
                            React.createElement(Icon, { name: "pin", size: 14 }),
                            get(p, 'Community') || 'Community not set',
                            " \u00B7 ",
                            get(p, 'Emirate') || 'UAE'),
                        React.createElement("div", { className: "property-card-facts" },
                            React.createElement("span", null,
                                React.createElement(Icon, { name: "bed", size: 14 }),
                                isCommercialProperty(p) && Number(get(p, 'Bedrooms')) === 0 ? 'Commercial' : `${get(p, 'Bedrooms') ?? '—'} beds`),
                            get(p, 'Bathrooms') && React.createElement("span", null,
                                React.createElement(Icon, { name: "bath", size: 14 }),
                                get(p, 'Bathrooms'),
                                " baths"),
                            React.createElement("span", null,
                                React.createElement(Icon, { name: "grid", size: 14 }),
                                get(p, 'Area sq ft') ? N(get(p, 'Area sq ft')) + ' sqft' : 'Area TBD'),
                            listingIntent(p) === 'Holiday home' && get(p, 'Maximum guests') && React.createElement("span", null,
                                React.createElement(Icon, { name: "users", size: 14 }),
                                get(p, 'Maximum guests'),
                                " guests")),
                        React.createElement("div", { className: "property-bottom" },
                            React.createElement("div", null,
                                React.createElement("small", null, "ASKING PRICE"),
                                React.createElement("strong", null, propertyPrice(p))),
                            React.createElement(Icon, { name: "arrow", size: 18 }))))),
                result.length === 0 && React.createElement("div", { className: "inventory-empty" },
                    React.createElement(Empty, { title: "No properties match those filters", detail: "Try another property type or clear your filters to see the full portfolio.", icon: "search", action: React.createElement(Button, { variant: "light", onClick: resetFilters }, "Clear filters") }))));
    }
    function Generic({ module }) {
        const arr = filtered(module, r => {
            if (tab === 'All')
                return true;
            if (module === 'Clients') {
                return tab === 'Hot leads' ? leadTier(r) === 'Hot' : tab === 'Closed' ? /closed/i.test(String(get(r, 'Lead stage') || '')) : tab === 'Lost' ? leadTier(r) === 'Lost' : true;
            }
            if (module === 'Deals') {
                return tab === 'Open' ? !isDone(get(r, 'Deal stage')) : tab === 'Completed' ? /completed/i.test(String(get(r, 'Deal stage'))) : isLost(get(r, 'Deal stage'));
            }
            if (module === 'Properties')
                return true;
            if (module === 'Follow-ups')
                return tab === 'Overdue' ? isDue(r) : tab === 'Open' ? !isDone(get(r, 'Task status')) : isDone(get(r, 'Task status'));
            if (module === 'Viewings')
                return tab === 'Upcoming' ? dateNum(get(r, 'Appointment date & time')) >= dateNum(today()) : tab === 'Completed' ? get(r, 'Viewing status') === 'Completed' : true;
            return true;
        });
        const tabs = { Clients: ['All', 'Hot leads', 'Closed', 'Lost'], Deals: ['All', 'Open', 'Completed', 'Lost'], Properties: ['All'], 'Follow-ups': ['All', 'Overdue', 'Open', 'Completed'], Viewings: ['All', 'Upcoming', 'Completed'] }[module] || ['All'];
        const actualColumns = preferredCols[module] || [];
        const isPropertyCards = module === 'Properties' && viewMode === 'cards';
        if (module === 'Properties')
            return React.createElement(PropertyDirectory, null);
        return React.createElement("div", { className: "page-stack" },
            React.createElement("div", { className: "directory-top" },
                React.createElement("div", { className: "directory-count" },
                    React.createElement("div", { className: "large-count" }, N(data[module].length)),
                    React.createElement("div", null,
                        React.createElement("strong", null,
                            "Total ",
                            module.toLowerCase()),
                        React.createElement("p", null, descriptions[module]))),
                React.createElement(Button, { icon: "plus", onClick: () => add(module) },
                    "Add ",
                    ({ Clients: 'client', Contacts: 'contact', Properties: 'property', Deals: 'deal', 'Follow-ups': 'follow-up', Viewings: 'viewing', 'Client care': 'touchpoint', 'Interaction log': 'conversation', Payments: 'payment', Expenses: 'expense', Shortlist: 'match' }[module] || 'record'))),
            React.createElement("div", { className: "filters-toolbar" },
                React.createElement("div", { className: "tabs", role: "tablist" }, tabs.map(t => React.createElement("button", { key: t, role: "tab", "aria-selected": t === tab, className: t === tab ? 'active' : '', onClick: () => { setTab(t); setPage(0); } }, t))),
                React.createElement("div", { className: "filter-right" },
                    React.createElement("div", { className: "search-small" },
                        React.createElement(Icon, { name: "search", size: 16 }),
                        React.createElement("input", { "aria-label": 'Search ' + module, placeholder: "Search records...", value: query, onChange: e => { setQuery(e.target.value); setPage(0); } })),
                    module === 'Properties' && React.createElement("div", { className: "view-switch" },
                        React.createElement("button", { className: viewMode === 'table' ? 'on' : '', onClick: () => setViewMode('table'), title: "List view" },
                            React.createElement(Icon, { name: "menu", size: 16 })),
                        React.createElement("button", { className: viewMode === 'cards' ? 'on' : '', onClick: () => setViewMode('cards'), title: "Card view" },
                            React.createElement(Icon, { name: "grid", size: 16 }))))),
            isPropertyCards ? React.createElement("div", { className: "property-grid" },
                arr.map((p, i) => React.createElement("button", { className: "property-card", key: i, onClick: () => dispatchRow('Properties', p) },
                    React.createElement("div", { className: 'property-photo variant-' + i % 4 },
                        React.createElement("div", { className: "building-graphic" },
                            React.createElement("span", null),
                            React.createElement("span", null),
                            React.createElement("span", null)),
                        React.createElement(Badge, null, get(p, 'Listing status'))),
                    React.createElement("div", { className: "property-content" },
                        React.createElement("div", { className: "property-category" },
                            get(p, 'Sale / rental'),
                            " \u00B7 ",
                            get(p, 'Ready / off-plan')),
                        React.createElement("h3", null, get(p, 'Listing title') || 'Untitled listing'),
                        React.createElement("p", null,
                            React.createElement(Icon, { name: "pin", size: 14 }),
                            get(p, 'Community'),
                            " \u00B7 ",
                            get(p, 'Emirate')),
                        React.createElement("div", { className: "property-bottom" },
                            React.createElement("strong", null,
                                AED(get(p, 'Price / annual rent AED')),
                                get(p, 'Sale / rental') === 'Rental' && React.createElement("small", null, " /yr")),
                            React.createElement("span", null,
                                get(p, 'Bedrooms') || '—',
                                " beds"))))),
                !arr.length && React.createElement(Empty, { title: "No properties found" })) : React.createElement(TableView, { module: module, arr: arr }));
    }
    function ClientDesk() {
        const clients = data.Clients.filter(c => !query || recordText('Clients', c).includes(query.toLowerCase()));
        const client = data.Clients.find(c => get(c, 'Client ID') === selectedClient) || clients[0];
        const target = client ? String(get(client, 'Buy / rent') || '').toLowerCase() : '';
        const matches = client ? data.Properties.filter(p => { let mode = String(get(p, 'Sale / rental') || '').toLowerCase(); let budget = Number(get(client, 'Maximum budget AED')) || Infinity; let price = Number(get(p, 'Price / annual rent AED')) || 0; let c = String(get(client, 'Preferred communities') || '').toLowerCase(); let community = String(get(p, 'Community') || '').toLowerCase(); let area = !c || c.split(',').some(x => x.trim() && community.includes(x.trim())); return (!target || target === 'buy' && mode === 'sale' || target === 'rent' && mode === 'rental') && price <= budget * 1.08 && area; }).sort((a, b) => Number(get(a, 'Price / annual rent AED')) - Number(get(b, 'Price / annual rent AED'))) : [];
        return React.createElement("div", { className: "desk-layout" },
            React.createElement("section", { className: "panel desk-list" },
                React.createElement("div", { className: "desk-list-title" },
                    React.createElement("h3", null, "Find a client"),
                    React.createElement("span", null,
                        clients.length,
                        " contacts")),
                React.createElement("div", { className: "search-small desk-search" },
                    React.createElement(Icon, { name: "search", size: 17 }),
                    React.createElement("input", { placeholder: "Name, phone or ID...", value: query, onChange: e => setQuery(e.target.value) })),
                React.createElement("div", { className: "desk-clients" },
                    clients.map(c => React.createElement("button", { key: get(c, 'Client ID'), className: 'desk-client ' + (client && get(c, 'Client ID') === get(client, 'Client ID') ? 'selected' : ''), onClick: () => setSelectedClient(get(c, 'Client ID')) },
                        React.createElement("span", { className: "avatar" }, initials(get(c, 'Full name'))),
                        React.createElement("div", null,
                            React.createElement("strong", null, get(c, 'Full name')),
                            React.createElement("small", null, get(c, 'Preferred communities') || 'Location not selected')),
                        React.createElement(Icon, { name: "chevron", size: 16 }))),
                    !clients.length && React.createElement(Empty, { title: "No clients found" })),
                React.createElement(Button, { variant: "light", icon: "plus", className: "full-width", onClick: () => add('Clients') }, "Add client")),
            React.createElement("div", { className: "desk-body" }, client ? React.createElement(React.Fragment, null,
                React.createElement("section", { className: "panel profile-hero" },
                    React.createElement("div", { className: "profile-head" },
                        React.createElement("span", { className: "big-avatar" }, initials(get(client, 'Full name'))),
                        React.createElement("div", null,
                            React.createElement("span", { className: "eyebrow" },
                                "CLIENT PROFILE \u00B7 ",
                                get(client, 'Client ID')),
                            React.createElement("h2", null, get(client, 'Full name')),
                            React.createElement("div", { className: "profile-meta" },
                                React.createElement(Badge, null, get(client, 'Lead stage')),
                                React.createElement("span", null,
                                    React.createElement(Icon, { name: "pin", size: 15 }),
                                    get(client, 'Emirate') || 'UAE'))),
                        React.createElement("button", { className: "btn btn-light", onClick: () => edit('Clients', client) },
                            React.createElement(Icon, { name: "edit", size: 16 }),
                            " Edit profile")),
                    React.createElement("div", { className: "profile-stats" },
                        React.createElement(LabelValue, { label: "Interested in", value: get(client, 'Buy / rent') }),
                        React.createElement(LabelValue, { label: "Budget up to", value: AED(get(client, 'Maximum budget AED')) }),
                        React.createElement(LabelValue, { label: "Preferred area", value: get(client, 'Preferred communities') }),
                        React.createElement(LabelValue, { label: "Lead quality", value: `${deriveLeadScore(client)}/100 · ${leadTier(client)}` }))),
                React.createElement("section", { className: "panel" },
                    React.createElement(TitleSection, { heading: "Curated property matches", caption: "Filtered by location, purpose and maximum budget", action: React.createElement("span", { className: "mini-count" },
                            matches.length,
                            " matches") }),
                    matches.length ? React.createElement("div", { className: "match-grid" }, matches.map(p => React.createElement("div", { key: get(p, 'Property ID'), className: "match-card" },
                        React.createElement("div", { className: "match-top" },
                            React.createElement("span", { className: "match-icon" },
                                React.createElement(Icon, { name: "building", size: 18 })),
                            React.createElement(Badge, null, get(p, 'Listing status'))),
                        React.createElement("h4", null, get(p, 'Listing title')),
                        React.createElement("div", { className: "match-where" },
                            React.createElement(Icon, { name: "pin", size: 14 }),
                            get(p, 'Community')),
                        React.createElement("div", { className: "match-foot" },
                            React.createElement("strong", null, AED(get(p, 'Price / annual rent AED'))),
                            React.createElement("button", { onClick: () => add('Shortlist', { client_id: get(client, 'Client ID'), property_id: get(p, 'Property ID'), date_sent: today(), client_response: 'Pending' }) },
                                "Shortlist ",
                                React.createElement(Icon, { name: "plus", size: 14 })))))) : React.createElement(Empty, { title: "No exact matches found", detail: "Adjust the client's budget or locations, or add more properties to your portfolio.", icon: "home" })),
                React.createElement("section", { className: "panel" },
                    React.createElement(TitleSection, { heading: "Relationship timeline", caption: "Recent calls, tasks and scheduled viewings" }),
                    React.createElement("div", { className: "timeline" },
                        [...data['Follow-ups'].filter(x => get(x, 'Client ID') === get(client, 'Client ID')).map(x => ({ date: get(x, 'Contact date'), title: get(x, 'Next action'), detail: get(x, 'Outcome / notes'), icon: 'chat' })), ...data.Viewings.filter(x => get(x, 'Client ID') === get(client, 'Client ID')).map(x => ({ date: get(x, 'Appointment date & time'), title: 'Property viewing', detail: prName(data, get(x, 'Property ID')), icon: 'calendar' }))].sort((a, b) => dateNum(b.date) - dateNum(a.date)).slice(0, 5).map((item, i) => React.createElement("div", { className: "timeline-item", key: i },
                            React.createElement("span", { className: "timeline-dot" },
                                React.createElement(Icon, { name: item.icon, size: 15 })),
                            React.createElement("div", null,
                                React.createElement("strong", null, item.title),
                                React.createElement("p", null, item.detail || '—')),
                            React.createElement("time", null, compactDate(item.date)))),
                        !data['Follow-ups'].filter(x => get(x, 'Client ID') === get(client, 'Client ID')).length && React.createElement("div", { className: "mini-quiet" }, "No activity yet.")))) : React.createElement(Empty, { title: "Select a client", detail: "Choose a client on the left to see profile details and property matches.", icon: "users" })));
    }
    function DateSearch() {
        const types = [{ title: 'New enquiries', module: 'Clients', field: 'Date added' }, { title: 'Follow-ups', module: 'Follow-ups', field: 'Due date' }, { title: 'Viewings', module: 'Viewings', field: 'Appointment date & time' }, { title: 'Deals opened', module: 'Deals', field: 'Opened date' }, { title: 'Deals closed', module: 'Deals', field: 'Closed date' }, { title: 'Fee receipts', module: 'Payments', field: 'Receipt date' }, { title: 'Expenses paid', module: 'Expenses', field: 'Date paid' }, { title: 'Care appointments', module: 'Client care', field: 'Next contact' }];
        const type = types.find(t => t.title === dateFilter.type) || types[0];
        const arr = data[type.module].filter(r => { const v = String(get(r, type.field) || '').slice(0, 10); return v && (!dateFilter.start || v >= dateFilter.start) && (!dateFilter.end || v <= dateFilter.end); }).sort((a, b) => String(get(a, type.field)).localeCompare(String(get(b, type.field))));
        return React.createElement("div", { className: "page-stack" },
            React.createElement("div", { className: "panel date-controls" },
                React.createElement("div", { className: "field" },
                    React.createElement("label", null, "RECORD TYPE"),
                    React.createElement("select", { value: dateFilter.type, onChange: e => setDateFilter(f => ({ ...f, type: e.target.value })) }, types.map(t => React.createElement("option", { key: t.title }, t.title)))),
                React.createElement("div", { className: "field" },
                    React.createElement("label", null, "FROM DATE"),
                    React.createElement("input", { type: "date", value: dateFilter.start, onChange: e => setDateFilter(f => ({ ...f, start: e.target.value })) })),
                React.createElement("div", { className: "field" },
                    React.createElement("label", null, "TO DATE"),
                    React.createElement("input", { type: "date", value: dateFilter.end, onChange: e => setDateFilter(f => ({ ...f, end: e.target.value })) })),
                React.createElement("div", { className: "date-result" },
                    React.createElement("strong", null, arr.length),
                    React.createElement("span", null, "matching records"))),
            React.createElement("div", { className: "panel" },
                React.createElement(TitleSection, { heading: "Matching records", caption: `${dateFilter.type} · ${readableDate(dateFilter.start)} to ${readableDate(dateFilter.end)}` }),
                React.createElement("div", { className: "date-result-list" },
                    arr.map((r, i) => React.createElement("button", { key: i, className: "result-row", onClick: () => dispatchRow(type.module, r) },
                        React.createElement("span", { className: "result-icon" },
                            React.createElement(Icon, { name: "calendar", size: 18 })),
                        React.createElement("div", null,
                            React.createElement("strong", null, get(r, schema(type.module)[0].name)),
                            React.createElement("small", null, clName(data, get(r, 'Client ID')) !== '—' ? clName(data, get(r, 'Client ID')) : prName(data, get(r, 'Property ID')))),
                        React.createElement("div", { className: "result-date" }, readableDate(get(r, type.field))),
                        React.createElement(Icon, { name: "arrow", size: 17 }))),
                    !arr.length && React.createElement(Empty, { title: "No records in this range", detail: "Change the record type or expand the dates to explore more results.", icon: "calendar" }))));
    }
    function Performance() {
        const monthRows = Array.from({ length: 12 }, (_, i) => { const d = new Date(); d.setMonth(d.getMonth() - 11 + i); const m = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; const newLeads = data.Clients.filter(c => monthOf(get(c, 'Date added')) === m).length; const viewings = data.Viewings.filter(c => monthOf(get(c, 'Appointment date & time')) === m && get(c, 'Viewing status') === 'Completed').length; const deals = data.Deals.filter(c => monthOf(get(c, 'Closed date')) === m && /completed/i.test(String(get(c, 'Deal stage')))).length; const fees = SUM(data.Deals.filter(c => monthOf(get(c, 'Earned date')) === m), yourFee); return { month: m, newLeads, viewings, deals, fees }; });
        const curr = monthRows.find(x => x.month === reportMonth) || monthRows.at(-1);
        const fields = [{ label: 'New enquiries', key: 'newLeads' }, { label: 'Completed viewings', key: 'viewings' }, { label: 'Completed deals', key: 'deals' }, { label: 'Earned fees', key: 'fees', money: true }];
        const targets = settings.targets?.[reportMonth] || {};
        const max = Math.max(1, ...monthRows.map(x => x.fees));
        return React.createElement("div", { className: "page-stack" },
            React.createElement("div", { className: "panel report-head" },
                React.createElement("div", null,
                    React.createElement("span", { className: "eyebrow" }, "BUSINESS INTELLIGENCE"),
                    React.createElement("h2", null, "Measure what moves your business."),
                    React.createElement("p", null, "Set monthly targets and track how client conversations convert into deals.")),
                React.createElement("label", { className: "date-select" },
                    React.createElement(Icon, { name: "calendar", size: 16 }),
                    React.createElement("input", { type: "month", value: reportMonth, onChange: e => setReportMonth(e.target.value) }))),
            React.createElement("div", { className: "performance-grid" },
                React.createElement("section", { className: "panel" },
                    React.createElement(TitleSection, { heading: "Monthly goals", caption: "Editable targets \u00B7 automatic actuals" }),
                    React.createElement("div", { className: "goals" }, fields.map(f => { const val = curr?.[f.key] || 0; const target = Number(targets[f.key]) || 0; const pct = target ? Math.min(100, val / target * 100) : 0; return React.createElement("div", { className: "goal", key: f.key },
                        React.createElement("div", { className: "goal-top" },
                            React.createElement("strong", null, f.label),
                            React.createElement("span", null,
                                f.money ? AED(val) : val,
                                " / ",
                                React.createElement("input", { "aria-label": `Target for ${f.label}`, type: "number", min: "0", placeholder: "Set target", value: targets[f.key] ?? '', onChange: e => setSettings(s => ({ ...s, targets: { ...s.targets, [reportMonth]: { ...(s.targets?.[reportMonth] || {}), [f.key]: e.target.value } } })) }))),
                        React.createElement("div", { className: "goal-track" },
                            React.createElement("div", { style: { width: pct + '%' } })),
                        React.createElement("small", null, target ? Math.round(val / target * 100) + '% of target achieved' : 'Add a target to track progress')); }))),
                React.createElement("section", { className: "panel" },
                    React.createElement(TitleSection, { heading: "Fee earnings by month", caption: "Your share on recorded deals" }),
                    React.createElement("div", { className: "perf-chart" }, monthRows.map((x, i) => React.createElement("div", { className: "perf-bar-wrap", key: x.month },
                        React.createElement("div", { className: "perf-bar", style: { height: (Math.max(1, x.fees / max * 100)) + '%' }, title: `${x.month}: ${AED(x.fees)}` }),
                        React.createElement("small", null, new Date(x.month + '-01').toLocaleDateString('en-AE', { month: 'short' }))))))),
            React.createElement("section", { className: "panel" },
                React.createElement(TitleSection, { heading: "Monthly performance history", caption: "12-month rolling overview" }),
                React.createElement("div", { className: "table-scroll" },
                    React.createElement("table", { className: "data-table" },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", null, "Month"),
                                React.createElement("th", null, "New enquiries"),
                                React.createElement("th", null, "Completed viewings"),
                                React.createElement("th", null, "Completed deals"),
                                React.createElement("th", null, "Earned fees"))),
                        React.createElement("tbody", null, [...monthRows].reverse().map(r => React.createElement("tr", { key: r.month },
                            React.createElement("td", { className: "cell-strong" }, new Date(r.month + '-01').toLocaleDateString('en-AE', { month: 'long', year: 'numeric' })),
                            React.createElement("td", null, r.newLeads),
                            React.createElement("td", null, r.viewings),
                            React.createElement("td", null, r.deals),
                            React.createElement("td", null, AED(r.fees)))))))));
    }
    function Guide() {
        return React.createElement("div", { className: "page-stack" },
            React.createElement("div", { className: "guide-hero" },
                React.createElement("div", { className: "eyebrow" }, "GETTING STARTED"),
                React.createElement("h1", null,
                    "Build your business,",
                    React.createElement("br", null),
                    React.createElement("em", null, "one relationship at a time.")),
                React.createElement("p", null, "A complete workflow for Keys with Simoni, from the first introduction to repeat referrals."),
                React.createElement(Button, { icon: "plus", onClick: () => add('Clients') }, "Add your first client")),
            React.createElement("div", { className: "guide-grid" }, [
                ['01', 'Build your network', 'Add owners, developers and partner brokers in Contacts.', 'Contacts', 'person'],
                ['02', 'Manage your listings', 'Record property details, terms, documents, and permit status.', 'Properties', 'building'],
                ['03', 'Qualify every lead', 'Capture budgets, finances, property requirements and urgency.', 'Clients', 'users'],
                ['04', 'Plan the next step', 'Create follow-ups and log important client conversations.', 'Follow-ups', 'calendar'],
                ['05', 'Create perfect matches', 'Match listings with a client and save shortlisted properties.', 'Client desk', 'target'],
                ['06', 'Arrange property viewings', 'Log appointments, collect feedback, and identify objections.', 'Viewings', 'home'],
                ['07', 'Manage negotiations', 'Progress each deal through documentation and closing.', 'Deals', 'briefcase'],
                ['08', 'Track the money', 'Record commission receipts and expenses for accurate results.', 'Payments', 'wallet'],
                ['09', 'Nurture long-term clients', 'Schedule renewal reminders, referrals and investor check-ins.', 'Client care', 'heart']
            ].map(([n, t, desc, dest, icon]) => React.createElement("button", { className: "guide-card", key: n, onClick: () => navigate(dest) },
                React.createElement("div", { className: "guide-top" },
                    React.createElement("span", null, n),
                    React.createElement(Icon, { name: icon, size: 22 })),
                React.createElement("h3", null, t),
                React.createElement("p", null, desc),
                React.createElement("div", null,
                    "Open ",
                    dest,
                    " ",
                    React.createElement(Icon, { name: "arrow", size: 15 }))))),
            React.createElement("div", { className: "panel guide-import" },
                React.createElement("div", null,
                    React.createElement("h2", null, "Bring your Excel workbook across."),
                    React.createElement("p", null, "Use Import Excel to load your existing rows from the 17-sheet workbook. Export Excel for your spreadsheet data, or use Full backup (JSON) to include property photos and floor plans. Everything stays in this browser until you export or clear browser storage.")),
                React.createElement("div", { className: "guide-actions" },
                    React.createElement(Button, { icon: "upload", variant: "light", onClick: () => uploadRef.current?.click() }, "Import Excel"),
                    React.createElement(Button, { icon: "download", onClick: () => exportExcel(data, notify) }, "Export Excel"))));
    }
    function Header() { return React.createElement("header", { className: "topbar" },
        React.createElement("div", { className: "top-left" },
            React.createElement("button", { className: "hamburger", onClick: () => setMobileNav(!mobileNav), "aria-label": "Toggle navigation" },
                React.createElement(Icon, { name: "menu", size: 22 })),
            React.createElement("div", { className: "breadcrumbs" },
                React.createElement("span", null, "Workspace"),
                React.createElement(Icon, { name: "chevron", size: 15 }),
                React.createElement("strong", null, labels[route] || route))),
        React.createElement("div", { className: "top-center" },
            React.createElement(Icon, { name: "search", size: 17 }),
            React.createElement("input", { id: "global-search", "aria-label": "Search CRM records", placeholder: "Search your workspace  \u2318 K", value: query, onChange: e => setQuery(e.target.value), onKeyDown: e => { if (e.key === 'Enter' && query) {
                    navigate('Client desk');
                    setQuery(e.currentTarget.value);
                } } })),
        React.createElement("div", { className: "top-actions" },
            React.createElement("button", { className: "theme-switch", type: "button", "aria-label": settings.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode', "aria-pressed": settings.theme === 'dark', title: settings.theme === 'dark' ? 'Light mode' : 'Dark mode', onClick: () => setSettings(s => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' })) },
                React.createElement(Icon, { name: settings.theme === 'dark' ? 'sun' : 'moon', size: 18 }),
                React.createElement("span", null, settings.theme === 'dark' ? 'Light' : 'Dark')),
            React.createElement("span", { className: "local-tag" },
                React.createElement("span", null),
                " LOCAL WORKSPACE"),
            React.createElement("button", { "aria-label": "View due tasks", className: "icon-btn notif", onClick: () => navigate('Follow-ups') },
                React.createElement(Icon, { name: "bell", size: 20 }),
                summary.dueTasks.length > 0 && React.createElement("b", null)),
            React.createElement("div", { className: "user-button", title: "Keys with Simoni" },
                React.createElement("span", null, "SC")))); }
    function Sidebar() { return React.createElement(React.Fragment, null,
        React.createElement("div", { className: 'mobile-dim ' + (mobileNav ? 'visible' : ''), onClick: () => setMobileNav(false) }),
        React.createElement("aside", { className: 'sidebar ' + (mobileNav ? 'sidebar-open' : '') },
            React.createElement("div", { className: "brand" },
                React.createElement(BrandMark, null),
                React.createElement("div", null,
                    React.createElement("strong", null,
                        "KEYS ",
                        React.createElement("i", null, "WITH"),
                        " SIMONI"),
                    React.createElement("span", null, "REAL ESTATE STUDIO"))),
            React.createElement("div", { className: "sidebar-hairline" }),
            React.createElement("nav", { className: "nav-groups" }, nav.map(g => React.createElement("div", { key: g.header, className: "nav-group" },
                React.createElement("div", { className: "nav-label" }, g.header),
                g.items.map(([name, ico]) => React.createElement("button", { key: name, className: 'nav-item ' + (route === name ? 'active' : ''), onClick: () => navigate(name) },
                    React.createElement(Icon, { name: ico, size: 18 }),
                    React.createElement("span", null, name),
                    route === name && React.createElement("span", { className: "nav-active-dot" })))))),
            React.createElement("div", { className: "sidebar-bottom" },
                React.createElement("div", { className: "upgrade-card" },
                    React.createElement("div", { className: "upgrade-icon" },
                        React.createElement(Icon, { name: "sparkle", size: 18 })),
                    React.createElement("h4", null, "Your CRM, your momentum."),
                    React.createElement("p", null, "Every record tells part of your success story."),
                    React.createElement("button", { onClick: () => navigate('Guide') },
                        "Explore your guide ",
                        React.createElement(Icon, { name: "arrow", size: 14 }))),
                React.createElement("div", { className: "side-footer" },
                    React.createElement("span", { className: "footer-avatar" }, "SC"),
                    React.createElement("div", null,
                        React.createElement("strong", null, "Keys with Simoni"),
                        React.createElement("small", null, "Independent workspace")),
                    React.createElement(Icon, { name: "shield", size: 17 }))))); }
    function PageHeading() { const datestr = new Date().toLocaleDateString('en-AE', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }); return React.createElement("div", { className: "page-heading" },
        React.createElement("div", { className: "heading-left" },
            React.createElement("div", { className: "eyebrow" }, route === 'Dashboard' ? 'WELCOME BACK' : route === 'Guide' ? 'WORKSPACE HANDBOOK' : 'YOUR BUSINESS, CONNECTED'),
            React.createElement("h1", null, labels[route]),
            React.createElement("p", null, route === 'Dashboard' ? datestr : descriptions[route] || ({ 'CRM insights': 'Understand your pipeline and make smarter decisions.', Performance: 'Know your numbers and set meaningful business targets.', 'Client desk': 'A complete relationship profile and matching workspace.', 'Date search': 'Find activity and transactions by any date range.', Guide: 'Master every tool in your real estate workspace.' }[route]))),
        React.createElement("div", { className: "heading-actions" },
            db.demo && React.createElement("span", { className: "demo-pill" },
                React.createElement("span", null),
                " DEMO DATA"),
            React.createElement("div", { className: "menu-anchor" },
                React.createElement(Button, { variant: "light", icon: "download", onClick: () => setShowMenu(!showMenu) },
                    "Data & export ",
                    React.createElement(Icon, { name: "down", size: 14 })),
                showMenu && React.createElement("div", { className: "dropdown" },
                    React.createElement("button", { onClick: () => { exportExcel(data, notify); setShowMenu(false); } },
                        React.createElement(Icon, { name: "download", size: 16 }),
                        " Export 17-sheet Excel"),
                    React.createElement("button", { onClick: () => { uploadRef.current?.click(); setShowMenu(false); } },
                        React.createElement(Icon, { name: "upload", size: 16 }),
                        " Import Excel workbook"),
                    React.createElement("button", { onClick: () => { downloadFullBackup(); setShowMenu(false); } },
                        React.createElement(Icon, { name: "download", size: 16 }),
                        " Full backup with photos (JSON)"),
                    React.createElement("button", { onClick: () => { restoreRef.current?.click(); setShowMenu(false); } },
                        React.createElement(Icon, { name: "upload", size: 16 }),
                        " Restore full backup (JSON)"),
                    React.createElement("button", { onClick: () => { downloadRaw(); setShowMenu(false); } },
                        React.createElement(Icon, { name: "note", size: 16 }),
                        " Original Excel template"),
                    React.createElement("div", { className: "dropdown-divider" }),
                    React.createElement("button", { onClick: () => { clearDemo(); setShowMenu(false); } },
                        React.createElement(Icon, { name: "plus", size: 16 }),
                        " Start with blank CRM"),
                    React.createElement("button", { onClick: () => { restoreDemo(); setShowMenu(false); } },
                        React.createElement(Icon, { name: "sparkle", size: 16 }),
                        " Restore sample records"))))); }
    async function onUpload(ev) { const inputEl = ev.currentTarget; const file = inputEl.files?.[0]; if (!file)
        return; try {
        const imp = await importExcel(file);
        const counts = Object.values(imp).reduce((s, a) => s + a.length, 0);
        if (!confirm(`Import ${counts} records from ${file.name}? This will REPLACE your existing local records. Export a backup first if needed.`))
            return;
        setDb({ data: imp, demo: false });
        notify(`Imported ${counts} records from Excel.`);
        setRoute('Dashboard');
    }
    catch (e) {
        console.error(e);
        alert('Could not read workbook. Make sure it is a valid .xlsx file with matching sheet names and headers.');
    }
    finally {
        inputEl.value = '';
    } }
    return React.createElement("div", { className: "app-shell" },
        Sidebar(),
        React.createElement("div", { className: "main-area" },
            Header(),
            React.createElement("main", { className: "main-content" },
                PageHeading(),
                route === 'Dashboard' ? Overview() : route === 'CRM insights' ? Insights() : route === 'Client desk' ? ClientDesk() : route === 'Date search' ? DateSearch() : route === 'Performance' ? Performance() : route === 'Guide' ? Guide() : MODS[route] ? Generic({ module: route }) : React.createElement(ErrorBoundaryFallback, null),
                React.createElement("footer", { className: "main-footer" },
                    React.createElement("span", null,
                        "\u00A9 ",
                        new Date().getFullYear(),
                        " Keys with Simoni \u00B7 Real Estate Studio"),
                    React.createElement("span", null, "Built for focus, relationships & opportunity.")))),
        React.createElement("input", { ref: restoreRef, className: "sr-only", type: "file", accept: ".json,application/json", onChange: restoreFullBackup }),
        React.createElement("input", { ref: uploadRef, className: "sr-only", type: "file", accept: ".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", onChange: onUpload }),
        toast && React.createElement("div", { className: "toast", role: "status" },
            React.createElement(Icon, { name: "check", size: 17 }),
            toast,
            React.createElement("button", { onClick: () => setToast('') },
                React.createElement(Icon, { name: "close", size: 14 }))),
        detail && React.createElement(DetailPanel, { detail: detail, data: data, edit: edit, remove: deleteRecord, close: () => setDetail(null) }),
        " ",
        drawer && React.createElement(HookedEditorDrawer, { drawer: drawer, data: data, onClose: () => setDrawer(null), onSave: saveRecord }));
}
function DetailPanel({ detail, data, edit, remove, close }) { const { module, record: r } = detail; const fields = schema(module); const id = get(r, fields[0].name); return React.createElement("div", { className: "modal-root", onMouseDown: e => { if (e.target === e.currentTarget)
        close(); } },
    React.createElement("div", { className: "drawer detail-drawer" },
        React.createElement("div", { className: "drawer-top" },
            React.createElement("div", null,
                React.createElement("div", { className: "eyebrow" },
                    module.toUpperCase(),
                    " \u00B7 RECORD DETAILS"),
                React.createElement("h2", null, get(r, 'Full name') || get(r, 'Listing title') || get(r, 'Next action') || id),
                React.createElement("p", null,
                    id,
                    " \u00B7 ",
                    fields.length,
                    " available fields")),
            React.createElement("button", { className: "icon-btn", onClick: close },
                React.createElement(Icon, { name: "close", size: 21 }))),
        React.createElement("div", { className: "drawer-body" },
            module === 'Properties' && React.createElement("div", { className: "property-detail-studio" },
                React.createElement(GalleryStrip, { record: r, onEdit: () => { close(); edit(module, r); } }),
                React.createElement("div", { className: "media-detail-block" },
                    React.createElement("div", { className: "detail-section-heading" },
                        React.createElement(Icon, { name: "layers", size: 18 }),
                        React.createElement("h3", null, "Floor plans & virtual tours")),
                    React.createElement("div", { className: "floorplan-list" },
                        mediaPlans(r).map((plan, i) => React.createElement("a", { key: i, href: plan.src, target: "_blank", rel: "noopener noreferrer", download: plan.name },
                            React.createElement(Icon, { name: plan.type === 'application/pdf' ? 'note' : 'image', size: 17 }),
                            React.createElement("span", null, plan.name),
                            React.createElement(Icon, { name: "external", size: 15 }))),
                        get(r, 'Floor plan URL') && React.createElement("a", { href: get(r, 'Floor plan URL'), target: "_blank", rel: "noopener noreferrer" },
                            "Open linked floor plan ",
                            React.createElement(Icon, { name: "external", size: 15 })),
                        get(r, 'Virtual tour URL') && React.createElement("a", { href: get(r, 'Virtual tour URL'), target: "_blank", rel: "noopener noreferrer" },
                            "View virtual tour ",
                            React.createElement(Icon, { name: "external", size: 15 })),
                        !mediaPlans(r).length && !get(r, 'Floor plan URL') && !get(r, 'Virtual tour URL') && React.createElement("p", { className: "property-muted" }, "No floor plans or tours added yet."))),
                React.createElement("div", { className: "media-detail-block" },
                    React.createElement("div", { className: "detail-section-heading" },
                        React.createElement(Icon, { name: "check", size: 18 }),
                        React.createElement("h3", null, "Amenities & highlights")),
                    React.createElement("div", { className: "amenity-tags" }, amenityList(r).length ? amenityList(r).map(a => React.createElement("span", { key: a },
                        React.createElement(Icon, { name: "check", size: 13 }),
                        a)) : React.createElement("p", { className: "property-muted" }, "Amenities have not been added.")),
                    get(r, 'Key selling points') && React.createElement("p", { className: "property-highlights" }, get(r, 'Key selling points')),
                    get(r, 'Property description') && React.createElement("p", { className: "property-description" }, get(r, 'Property description')))),
            React.createElement("div", { className: "detail-highlight" },
                React.createElement("span", { className: "detail-watermark" },
                    React.createElement(Icon, { name: "briefcase", size: 30 })),
                React.createElement("div", null,
                    React.createElement("small", null, "RECORD ID"),
                    React.createElement("strong", null, id)),
                React.createElement(Badge, null, get(r, 'Lead stage') || get(r, 'Deal stage') || get(r, 'Listing status') || get(r, 'Task status') || 'Active')),
            React.createElement("div", { className: "details-grid" }, fields.map(f => React.createElement("div", { className: 'detail-field ' + (f.type === 'textarea' ? 'wide' : ''), key: f.key },
                React.createElement("span", null, f.name),
                React.createElement("strong", null, module === 'Properties' && f.name === 'Price / annual rent AED' ? propertyPrice(r) : formatValue(data, module, r, f)))))),
        React.createElement("div", { className: "drawer-footer" },
            React.createElement(Button, { variant: "danger-light", icon: "trash", onClick: () => remove(module, r) }, "Delete"),
            React.createElement(Button, { icon: "edit", onClick: () => { close(); edit(module, r); } }, "Edit record")))); }
function EditorDrawer({ drawer, data, onClose, onSave }) {
    const { module, original } = drawer;
    const [form, setForm] = useState({ ...drawer.record });
    const [uploading, setUploading] = useState(false);
    const [mediaError, setMediaError] = useState('');
    const fields = schema(module).filter(f => !f.calculated);
    const change = (key, v) => setForm(p => ({ ...p, [key]: v, ...(module === 'Properties' && key === 'sale_rental' ? { price_basis: v === 'Holiday home' ? 'Nightly' : v === 'Rental' ? 'Annual' : 'Total price' } : {}) }));
    async function addMedia(e, kind) { const input = e.currentTarget; const selected = Array.from(input.files || []); if (!selected.length)
        return; const field = kind === 'photo' ? 'media_photos' : 'media_floorplans'; const max = kind === 'photo' ? 8 : 3; const current = Array.isArray(form[field]) ? form[field] : []; if (current.length + selected.length > max) {
        setMediaError(`Maximum ${max} ${kind === 'photo' ? 'photos' : 'floor plans'} per property.`);
        input.value = '';
        return;
    } setUploading(true); setMediaError(''); try {
        const assets = [];
        for (const file of selected)
            assets.push(await makeMediaAsset(file, kind));
        const updated = [...current, ...assets];
        if (JSON.stringify({ ...form, [field]: updated }).length > MAX_MEDIA_TOTAL / 1.6)
            throw Error('Media exceeds the browser limit. Try fewer or smaller files.');
        setForm(p => ({ ...p, [field]: updated }));
    }
    catch (err) {
        setMediaError(err.message);
    }
    finally {
        setUploading(false);
        input.value = '';
    } }
    function removeMedia(key, index) { setForm(p => ({ ...p, [key]: (p[key] || []).filter((_, i) => i !== index) })); }
    const idField = fields[0];
    const mainRequired = [idField.key];
    const grouped = [];
    let current = [];
    fields.forEach((f, i) => { current.push(f); if (current.length === 10 || i === fields.length - 1) {
        grouped.push(current);
        current = [];
    } });
    const relation = (f) => { if (f.key === idField.key)
        return null; if (f.name === 'Client ID' || f.name === 'Referred by Client ID' || f.name === 'Referred client ID')
        return { data: data.Clients, id: 'Client ID', name: 'Full name' }; if (f.name === 'Property ID' || f.name === 'Property ID optional')
        return { data: data.Properties, id: 'Property ID', name: 'Listing title' }; if (f.name === 'Contact ID')
        return { data: data.Contacts, id: 'Contact ID', name: 'Full name' }; if (f.name === 'Deal ID' || f.name === 'Deal ID optional')
        return { data: data.Deals, id: 'Deal ID', name: 'Deal ID' }; return null; };
    function renderField(f) {
        const v = form[f.key] ?? '';
        const rel = relation(f);
        return React.createElement("div", { className: 'field ' + (f.type === 'textarea' ? 'span-all' : ''), key: f.key },
            React.createElement("label", { htmlFor: f.key },
                module === 'Properties' && f.name === 'Price / annual rent AED' ? 'Asking price / rent AED' : f.name,
                mainRequired.includes(f.key) && React.createElement("span", { className: "required" }, " *")),
            rel ? React.createElement("select", { id: f.key, value: v, onChange: e => change(f.key, e.target.value) },
                React.createElement("option", { value: "" },
                    "Select ",
                    f.name.toLowerCase()),
                rel.data.map(r => React.createElement("option", { key: get(r, rel.id), value: get(r, rel.id) },
                    get(r, rel.id),
                    " \u00B7 ",
                    get(r, rel.name)))) : f.options ? React.createElement("select", { id: f.key, value: v, onChange: e => change(f.key, e.target.value) },
                React.createElement("option", { value: "" }, "Select..."),
                f.options.map(o => React.createElement("option", { key: o }, o))) : f.type === 'textarea' ? React.createElement("textarea", { id: f.key, rows: "3", value: v, onChange: e => change(f.key, e.target.value), placeholder: `Enter ${f.name.toLowerCase()}...` }) : React.createElement("input", { id: f.key, type: f.type, min: f.type === 'number' ? '0' : undefined, step: f.type === 'number' ? 'any' : undefined, value: v, onChange: e => change(f.key, e.target.value), placeholder: f.type === 'number' ? '0' : `Enter ${f.name.toLowerCase()}...` }));
    }
    return React.createElement("div", { className: "modal-root", onMouseDown: e => { if (e.target === e.currentTarget)
            onClose(); } },
        React.createElement("div", { className: "drawer editor-drawer" },
            React.createElement("div", { className: "drawer-top" },
                React.createElement("div", null,
                    React.createElement("div", { className: "eyebrow" },
                        module.toUpperCase(),
                        " \u00B7 ",
                        original ? 'EDIT RECORD' : 'NEW ENTRY'),
                    React.createElement("h2", null, original ? 'Edit ' + get(original, idField.name) : 'New ' + module.toLowerCase().replace(/s$/, '')),
                    React.createElement("p", null, "All original workbook fields are available. Calculated fields update automatically.")),
                React.createElement("button", { className: "icon-btn", onClick: onClose },
                    React.createElement(Icon, { name: "close", size: 21 }))),
            React.createElement("form", { onSubmit: e => { e.preventDefault(); onSave(module, form, original); }, className: "drawer-form" },
                React.createElement("div", { className: "drawer-body" },
                    React.createElement("div", { className: "form-intro" },
                        React.createElement(Icon, { name: "info", size: 17 }),
                        React.createElement("span", null, "Fields marked * are required. Related records should be created first for correct linking.")),
                    module === 'Properties' && React.createElement("section", { className: "editor-media" },
                        React.createElement("div", { className: "editor-media-heading" },
                            React.createElement("div", null,
                                React.createElement("span", { className: "eyebrow" }, "LISTING PRESENTATION"),
                                React.createElement("h3", null, "Photos & floor plans"),
                                React.createElement("p", null, "Make your property attractive, complete and easy to share.")),
                            React.createElement(Badge, { tone: "slate" }, "Browser storage")),
                        React.createElement("div", { className: "editor-photo-grid" },
                            mediaPhotos(form).map((file, i) => React.createElement("div", { className: "editor-photo", key: i },
                                React.createElement("img", { src: file.src, alt: file.name }),
                                i === 0 && React.createElement("span", { className: "cover-marker" }, "Cover photo"),
                                React.createElement("button", { type: "button", "aria-label": `Remove photo ${i + 1}`, onClick: () => removeMedia('media_photos', i) },
                                    React.createElement(Icon, { name: "close", size: 14 })),
                                i > 0 && React.createElement("button", { type: "button", className: "make-cover", onClick: () => setForm(p => ({ ...p, media_photos: [p.media_photos[i], ...p.media_photos.filter((_, j) => j !== i)] })) }, "Set cover"))),
                            React.createElement("label", { className: "media-upload-tile" },
                                React.createElement(Icon, { name: "image", size: 22 }),
                                React.createElement("strong", null, uploading ? 'Processing...' : 'Add photos'),
                                React.createElement("small", null, "JPG, PNG, WebP \u00B7 up to 8"),
                                React.createElement("input", { "aria-label": "Upload property photos", type: "file", accept: "image/jpeg,image/png,image/webp", multiple: true, disabled: uploading, onChange: e => addMedia(e, 'photo') }))),
                        React.createElement("div", { className: "editor-floorplans" },
                            React.createElement("div", { className: "editor-subheading" },
                                React.createElement(Icon, { name: "layers", size: 17 }),
                                " Floor plans ",
                                React.createElement("span", null, "Up to 3 files")),
                            mediaPlans(form).map((file, i) => React.createElement("div", { className: "editor-plan", key: i },
                                React.createElement(Icon, { name: file.type === 'application/pdf' ? 'note' : 'image', size: 16 }),
                                React.createElement("span", null, file.name),
                                React.createElement("button", { type: "button", "aria-label": `Remove floor plan ${i + 1}`, onClick: () => removeMedia('media_floorplans', i) },
                                    React.createElement(Icon, { name: "close", size: 16 })))),
                            React.createElement("label", { className: "media-attach-button" },
                                React.createElement(Icon, { name: "plus", size: 16 }),
                                " Add floor plan (image or PDF)",
                                React.createElement("input", { "aria-label": "Upload floor plans", type: "file", accept: "image/jpeg,image/png,image/webp,application/pdf", multiple: true, disabled: uploading, onChange: e => addMedia(e, 'plan') }))),
                        mediaError && React.createElement("p", { className: "media-warning", role: "alert" }, mediaError),
                        React.createElement("p", { className: "media-note" }, "Files are optimized for local storage. Use \u201CFull backup with photos\u201D in Data & export; standard Excel export includes listing text only."),
                        React.createElement("div", { className: "amenity-picker" },
                            React.createElement("strong", null, "Quick-add amenities"),
                            React.createElement("div", { className: "amenity-chip-list" }, AMENITIES.map(name => React.createElement("button", { type: "button", key: name, className: amenityList(form).includes(name) ? 'checked' : '', "aria-pressed": amenityList(form).includes(name), onClick: () => setForm(p => { const a = amenityList(p); return { ...p, amenities: (a.includes(name) ? a.filter(x => x !== name) : [...a, name]).join(', ') }; }) },
                                amenityList(form).includes(name) && React.createElement(Icon, { name: "check", size: 12 }),
                                " ",
                                name))))),
                    grouped.map((chunk, i) => React.createElement("div", { key: i, className: "form-section" },
                        React.createElement("div", { className: "form-heading" },
                            React.createElement("span", null, pad(i + 1)),
                            i === 0 ? 'Record information' : i === 1 ? 'Additional details' : i === 2 ? 'Qualification & progress' : 'More details'),
                        React.createElement("div", { className: "form-grid" }, chunk.map(renderField))))),
                React.createElement("div", { className: "drawer-footer" },
                    React.createElement(Button, { variant: "light", onClick: onClose }, "Cancel"),
                    React.createElement(Button, { icon: "check", type: "submit" }, original ? 'Save changes' : 'Create record')))));
}
async function importExcel(file) {
    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    const parser = new DOMParser();
    const read = async (path) => parser.parseFromString(await zip.file(path).async('string'), 'application/xml');
    const book = await read('xl/workbook.xml');
    const relationships = await read('xl/_rels/workbook.xml.rels');
    const rels = {};
    for (const v of Array.from(relationships.getElementsByTagName('Relationship')))
        rels[v.getAttribute('Id')] = v.getAttribute('Target');
    const shared = [];
    const stringFile = zip.file('xl/sharedStrings.xml');
    if (stringFile) {
        const doc = parser.parseFromString(await stringFile.async('string'), 'application/xml');
        for (const si of Array.from(doc.getElementsByTagName('si')))
            shared.push(Array.from(si.getElementsByTagName('t')).map(t => t.textContent).join(''));
    }
    ;
    const output = blank();
    for (const sh of Array.from(book.getElementsByTagName('sheet'))) {
        const name = sh.getAttribute('name');
        if (!MODS[name])
            continue;
        const rid = sh.getAttribute('r:id') || sh.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id');
        let path = rels[rid];
        if (!path)
            continue;
        path = path.startsWith('/') ? path.slice(1) : 'xl/' + path.replace(/^\.\.\//, '');
        const raw = zip.file(path);
        if (!raw)
            continue;
        const doc = parser.parseFromString(await raw.async('string'), 'application/xml');
        const fields = schema(name);
        for (const row of Array.from(doc.getElementsByTagName('row'))) {
            if (Number(row.getAttribute('r')) < 6)
                continue;
            const entry = {};
            for (const cell of Array.from(row.getElementsByTagName('c'))) {
                const ref = cell.getAttribute('r');
                const col = ref?.match(/^[A-Z]+/)?.[0];
                const f = fields.find(x => x.col === col);
                if (!f || f.calculated)
                    continue;
                const vNode = Array.from(cell.childNodes).find(n => n.localName === 'v' || n.localName === 'is');
                if (!vNode)
                    continue;
                let v = vNode.textContent || '';
                if (cell.getAttribute('t') === 's')
                    v = shared[Number(v)] || '';
                if (!v)
                    continue;
                if (f.type === 'date' || f.type === 'datetime-local') {
                    if (/^\d+(\.\d+)?$/.test(String(v))) {
                        const dt = new Date(Date.UTC(1899, 11, 30) + Math.round(Number(v) * 86400000));
                        v = dt.toISOString().slice(0, f.type === 'date' ? 10 : 16);
                    }
                    else if (f.type === 'date')
                        v = String(v).slice(0, 10);
                }
                else if (f.type === 'number')
                    v = Number(v);
                entry[f.key] = v;
            }
            if (entry[fields[0]?.key])
                output[name].push(entry);
        }
    }
    return output;
}
async function exportExcel(data, notify) {
    try {
        const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        const names = ['Dashboard', 'Deals', 'Clients', 'Contacts', 'Properties', 'Follow-ups', 'Viewings', 'Payments', 'Expenses', 'Guide', 'Shortlist', 'Client desk', 'Date search', 'Performance', 'Interaction log', 'Client care', 'CRM insights'];
        const cell = (v, col, row) => { if (v === undefined || v === null || v === '')
            return ''; const n = typeof v === 'number' && !Number.isNaN(v); return `<c r="${col}${row}"${n ? '' : ' t="inlineStr"'}>${n ? `<v>${v}</v>` : `<is><t>${esc(v)}</t></is>`}</c>`; };
        const colLetter = n => { let s = ''; for (n++; n; n = Math.floor((n - 1) / 26))
            s = String.fromCharCode(65 + (n - 1) % 26) + s; return s; };
        const worksheet = rows => { const content = rows.map((cells, i) => `<row r="${i + 1}">${cells.map((v, j) => cell(v, colLetter(j), i + 1)).join('')}</row>`).join(''); return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${content}</sheetData></worksheet>`; };
        const zip = new JSZip();
        zip.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
        zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${names.map((n, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`);
        zip.file('xl/workbook.xml', `<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${names.map((name, i) => `<sheet name="${esc(name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets></workbook>`);
        zip.file('xl/_rels/workbook.xml.rels', `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${names.map((n, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}</Relationships>`);
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            let rows = [];
            if (MODS[name]) {
                const fields = schema(name);
                rows = [[`KEYS WITH SIMONI · ${name.toUpperCase()}`], ['Exported from React CRM — field names mirror the original workbook'], [], [], fields.map(f => f.name), ...(data[name] || []).map(r => fields.map(f => valueOf(data, name, r, f) || ''))];
            }
            else if (name === 'Dashboard')
                rows = [['KEYS WITH SIMONI — Dashboard'], ['Report generated', new Date().toISOString()], ['Active leads', data.Clients.filter(c => !isDone(get(c, 'Lead stage'))).length], ['Active deals', data.Deals.filter(d => !isDone(get(d, 'Deal stage'))).length], ['Commission receipts AED', SUM(data.Payments, p => amountOf(p, 'Your fee received AED ex VAT'))], ['Expenses AED', SUM(data.Expenses, p => amountOf(p, 'Amount paid AED'))]];
            else if (name === 'CRM insights')
                rows = [['KEYS WITH SIMONI — CRM insights'], ['Lead tier', 'Count'], ...['Hot', 'Warm', 'Nurture', 'Converted', 'Lost'].map(t => [t, data.Clients.filter(c => leadTier(c) === t).length])];
            else if (name === 'Performance')
                rows = [['KEYS WITH SIMONI — Performance'], ['Month', 'New enquiries', 'Closed deals', 'Earned fees AED'], ...Array.from({ length: 12 }, (_, j) => { const d = new Date(); d.setMonth(d.getMonth() - j); const m = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; return [m, data.Clients.filter(c => monthOf(get(c, 'Date added')) === m).length, data.Deals.filter(c => monthOf(get(c, 'Closed date')) === m).length, SUM(data.Deals.filter(c => monthOf(get(c, 'Earned date')) === m), yourFee)]; })];
            else if (name === 'Client desk')
                rows = [['KEYS WITH SIMONI — Client search'], ['Client ID', 'Full name', 'Phone', 'Lead stage', 'Budget'], ...data.Clients.map(c => [get(c, 'Client ID'), get(c, 'Full name'), get(c, 'Phone'), get(c, 'Lead stage'), get(c, 'Maximum budget AED')])];
            else if (name === 'Date search')
                rows = [['KEYS WITH SIMONI — Date search'], ['Record type', 'Record ID', 'Date'], ...data.Clients.map(c => ['New enquiries', get(c, 'Client ID'), get(c, 'Date added')]), ...data.Viewings.map(c => ['Viewings', get(c, 'Viewing ID'), get(c, 'Appointment date & time')])];
            else if (name === 'Guide')
                rows = [['KEYS WITH SIMONI — Quick guide'], ['1. Create contacts and property listings'], ['2. Record your clients and qualification details'], ['3. Schedule follow-ups and viewings'], ['4. Manage deal pipelines and commissions'], ['5. Record receipts and expenses'], ['6. Maintain your client-care program'], ['For photos and floor plans, use the full JSON backup because Excel only exports listing text.']];
            zip.file(`xl/worksheets/sheet${i + 1}.xml`, worksheet(rows));
        }
        const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
        const href = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = href;
        a.download = `Keys_with_Simoni_CRM_${today()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(href), 1000);
        notify('Excel workbook exported successfully');
    }
    catch (e) {
        console.error(e);
        alert('Excel export failed. Please try again.');
    }
}
const HookedApp = withHooks(App);
const HookedEditorDrawer = withHooks(EditorDrawer);
ReactDOM.render(React.createElement(HookedApp, null), document.getElementById('root'));
