export const convData = {
  sarah: {
    id: 'sarah',
    av: 'SR',
    name: 'Sarah Rodriguez',
    email: 'sarah@email.com',
    service: 'HVAC Emergency',
    channel: 'Email',
    source: '🌐 Website Form',
    mode: 'Closer',
    sub: 'HVAC Emergency · via Website Form',
    tag: 'Booking confirmed',
    tagCls: 'tag-green',
    status: 'Qualified',
    time: '2m ago',
    preview: 'Deposit paid $89.00 ✓',
    msgs: [
      { f: 'lead', t: "Hi, my AC stopped working. Do you do emergency repairs?", ts: '2:34 AM' },
      { f: 'agent', t: "Hi! I'm Alex from Mike's HVAC 👋 We absolutely do emergency repairs — 24/7. What type of unit do you have?", ts: '2:34 AM · 21s later' },
      { f: 'lead', t: "Central AC. 3 years old. Just stopped blowing cold air.", ts: '2:36 AM' },
      { f: 'agent', t: "Likely refrigerant or compressor — both things we handle daily. Emergency visits start at $89 diagnostic. Free today 2–5 PM?", ts: '2:36 AM' },
      { f: 'lead', t: "Yes! 2-5 works great.", ts: '2:37 AM' },
      { f: 'agent', t: "Booked! I've sent a secure link to your email to lock in the appointment with the $89 diagnostic fee.", ts: '2:37 AM' },
      { f: 'lead', t: "Paid. See you at 2:30", ts: '2:38 AM' },
      { f: 'agent', t: "Deposit received. Mike arrives 2–5 PM at 123 Maple St. Stay cool! 😊", ts: '2:38 AM' }
    ]
  },
  james: {
    id: 'james',
    av: 'JT',
    name: 'James Thompson',
    email: 'j.thompson@gmail.com',
    service: 'Real Estate Buy',
    channel: 'Messenger',
    source: '👥 Facebook Groups',
    mode: 'Hunter',
    sub: 'Real Estate Buyer · via Facebook Groups',
    tag: 'In progress',
    tagCls: 'tag-amber',
    status: 'In Progress',
    time: '18m ago',
    preview: 'What areas do you cover?',
    msgs: [
      { f: 'agent', t: "Hi James! Saw your post in the Brampton Homeowners group about looking for a new place. Still looking?", ts: '9:15 AM' },
      { f: 'lead', t: "Hi, yes looking to buy a 3-bedroom. What areas do you cover?", ts: '9:15 AM' },
      { f: 'agent', t: "We cover the GTA — Brampton, Mississauga, Oakville, Burlington. Staying within a specific city or flexible?", ts: '9:15 AM' },
      { f: 'lead', t: "Flexible. Budget $800k–$900k.", ts: '9:17 AM' },
      { f: 'agent', t: "Great budget for the GTA right now. Are you a first-time buyer or upsizing? And do you have a pre-approval?", ts: '9:17 AM' }
    ]
  },
  aisha: {
    id: 'aisha',
    av: 'AP',
    name: 'Aisha Patel',
    email: 'aisha.p@hotmail.com',
    service: 'Cleaning Weekly',
    channel: 'WhatsApp',
    source: '📢 Google Ads',
    mode: 'Qualifier',
    sub: 'Cleaning — Weekly · via Google Ads',
    tag: 'Qualified',
    tagCls: 'tag-green',
    status: 'Qualified',
    time: '1h ago',
    preview: 'Tuesday works perfectly for me',
    msgs: [
      { f: 'lead', t: "Hello, I'm looking for weekly house cleaning.", ts: '8:02 AM' },
      { f: 'agent', t: "Hi Aisha! 👋 Happy to help. How many bedrooms and bathrooms does your home have?", ts: '8:02 AM' },
      { f: 'lead', t: "3 bedrooms, 2 bathrooms. Semi-detached.", ts: '8:04 AM' },
      { f: 'agent', t: "Our weekly rate is $120/visit for that size — all rooms, kitchen and bathrooms. What day works best?", ts: '8:04 AM' },
      { f: 'lead', t: "Tuesday works perfectly for me.", ts: '8:05 AM' },
      { f: 'agent', t: "Pencilled in for Tuesdays recurring! Sarah from our team will confirm the first visit date today. Any product allergies we should know about?", ts: '8:05 AM' }
    ]
  },
  marcus: {
    id: 'marcus',
    av: 'MK',
    name: 'Marcus Kim',
    email: 'm.kim@yahoo.com',
    service: 'Plumbing Leak',
    channel: 'Email',
    source: '🌐 Website Form',
    mode: 'Nurturer',
    sub: 'Plumbing Leak · via Website Form',
    tag: 'No response',
    tagCls: 'tag-gray',
    status: 'No Response',
    time: '3h ago',
    preview: 'How much does it usually cost?',
    msgs: [
      { f: 'lead', t: "Hi, I have a leak under my kitchen sink. How much does it usually cost?", ts: '6:45 AM' },
      { f: 'agent', t: "Hi Marcus! Kitchen sink leaks are usually a quick fix 🔧 Most repairs are $80–$150. Is the leak from the drain, water supply lines, or the pipes?", ts: '6:45 AM' }
    ]
  }
};

export const leadsList = Object.values(convData).concat([
  {
    id: 'linda',
    av: 'LC',
    name: 'Linda Chen',
    email: 'linda.chen@work.ca',
    service: 'HVAC Annual',
    channel: 'Email',
    source: '🌐 Website Form',
    mode: 'Closer',
    status: 'Qualified',
    time: '5h ago',
    tagCls: 'tag-green',
    bgColor: '#0891b2'
  }
]);
