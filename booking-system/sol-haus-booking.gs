/**
 * SOL HAUS — BOOKING SYSTEM (Google Forms → Google Sheet → your phone calendar)
 * -----------------------------------------------------------------------------
 * What it does
 *   1. Creates 3 booking forms: Spray Tan, Group Tan, Competition Tan.
 *   2. Sends every answer into ONE Google Sheet ("Sol Haus Bookings"), one tab per form.
 *   3. Every new request appears in your Google Calendar as   🟡 REQUEST · Spray Tan · Name
 *      on the date and time the client asked for, with all their answers in the notes.
 *   4. When you tick the "Confirmed" box in the sheet, the event changes to
 *      ✅ CONFIRMED · Spray Tan · Name, and the client gets a confirmation email.
 *   5. You get an instant email alert for every new request.
 *      Reply YES to confirm or NO to decline, right from your phone.
 *   6. Confirmed clients automatically get a prep reminder about a day before,
 *      and an aftercare + Google review email the morning after.
 *   Google Calendar syncs to your iPhone Calendar (Settings → Calendar → Accounts → Gmail → Calendars ON).
 *
 * How to install (one time, ~5 minutes)
 *   1. Go to https://script.google.com while signed in to the Google account you use for Sol Haus.
 *   2. New project → delete the sample code → paste this whole file → Save (name it "Sol Haus Booking").
 *   3. In the toolbar, choose the function  setup  and press ▶ Run.
 *   4. Google will ask for permission (Forms, Sheets, Calendar). Click Allow.
 *      (If you see "Google hasn't verified this app": Advanced → Go to Sol Haus Booking. It's your own script.)
 *   5. Open "Execution log" — it prints the 3 new form links. Send them to Claude to put on the website.
 *
 * Reply-to-confirm (one time, if you installed an earlier version)
 *   Choose the function  installReplyChecker  in the toolbar and press ▶ Run, then Allow.
 *   (New installs: setup does this for you.) If you made a web app deployment for the
 *   old buttons, you can remove it: Deploy → Manage deployments → Archive.
 *
 * Day to day
 *   - Requests land in your calendar automatically (colour-coded: pink = spray tan,
 *     purple = group, green = competition).
 *   - To confirm: open the "Sol Haus Bookings" sheet (Google Sheets app works on your phone)
 *     and tick "Confirmed". To move an appointment, just drag the event in your calendar.
 */

// ---------- settings you can edit ----------
// Prices used for the estimate in your booking alerts (edit any time).
const PRICES = {
  spray: 50,          // regular solution
  sprayDark: 55,      // darker solutions
  contour: 6,         // body contouring add-on
  coconut: 3,         // coconut drop scent add-on
  dha: 4,             // DHA booster add-on
  shimmer: 3,         // body shimmer add-on
  competition: { 'Champ Dark': 55, 'Custom Color': 50, 'Trad Set Light': 45 }, // per dancer, by solution
  competitionDefault: 50,
  bridalSolo: 60,     // solo bride, starting price
  groupPerPerson: 50, // reference price per person, before any group deal
};
const BUSINESS_NAME = 'Sol Haus Spray Tans';
const ALERT_EMAIL = '';   // where new-request alerts go. Leave '' to use the Google account running this script.
const REVIEW_URL = 'https://g.page/r/CfN1ICi5wqvrEAE/review';
const INSTAGRAM_URL = 'https://www.instagram.com/_solhaus/';
const PREP_TIPS = [
  'Exfoliate 24 hours before with an oil-free scrub (knees, elbows, ankles, hands).',
  'Shave at least 24 hours before; wax at least 24–48 hours before.',
  'Shower before your appointment and skip lotion, oils, deodorant, perfume and makeup.',
  'Book facials, nails and waxing before your tan.',
  'Wear loose, dark clothing and slip-on shoes, and tie your hair up.',
];
const AFTERCARE_TIPS = [
  'Rinse at the time we discussed — lukewarm water only, no soap, then pat dry.',
  'Avoid sweating, water and tight clothing until your first rinse.',
  'Moisturize daily with a gentle, oil-free moisturizer so your glow fades evenly.',
  'Go easy on exfoliating, long hot showers, saunas and chlorine.',
  'Your tan is not sun protection — keep wearing SPF.',
];
const AGREEMENT_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfsMyGn_XaRYroTlcnLCLgGzzrOvj0APBELCBOCPXGSOd1JvA/viewform';
const TIMES = { 'Morning (9am–12pm)': 9, 'Afternoon (12pm–4pm)': 13, 'Evening (4pm–8pm)': 17 };
const THANK_YOU = 'Thank you! Katie will text you to confirm your date, time and shade. ' +
  'Please complete the client agreement before your appointment: ' + AGREEMENT_URL;

const TYPES = {
  'Spray Tan':       { nameQ: 'Your name',   minutes: () => 60,  color: CalendarApp.EventColor.PALE_RED },
  'Group Tan':       { nameQ: 'Your name',   minutes: (n) => Math.max(90, (parseInt(n, 10) || 4) * 20), color: CalendarApp.EventColor.MAUVE },
  'Competition Tan': { nameQ: 'Dancer name', minutes: (n) => Math.max(45, (parseInt(n, 10) || 1) * 20), color: CalendarApp.EventColor.GREEN },
};
const ADD_ONS = [
  'Custom body contouring (+$6)',
  'Coconut drop scent (+$3)',
  'DHA booster — deepens your tan by 12% after your rinse, for a more even fade (+$4)',
  'Body shimmer — golden bronze touch-up, best for events (+$3)',
];
const EXTRA_COLS = ['Confirmed', 'Calendar Event ID', 'Status', 'Reminder Sent', 'Aftercare Sent'];
const REF_CODES = { 'Spray Tan': 'S', 'Group Tan': 'G', 'Competition Tan': 'C' };
const HANDLED_LABEL = 'Sol Haus/Handled';

// ---------- one-time setup ----------
function setup() {
  const ss = SpreadsheetApp.create('Sol Haus Bookings');
  const forms = [
    { label: 'Spray Tan', form: buildSprayForm_() },
    { label: 'Group Tan', form: buildGroupForm_() },
    { label: 'Competition Tan', form: buildCompetitionForm_() },
  ];
  forms.forEach((f) => f.form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId()));
  SpreadsheetApp.flush();
  Utilities.sleep(4000);

  const book = SpreadsheetApp.openById(ss.getId());
  book.getSheets().forEach((sh) => {
    const url = sh.getFormUrl() || '';
    const match = forms.find((f) => url.indexOf(f.form.getId()) > -1);
    if (!match) return;
    sh.setName(match.label);
    sh.getRange(1, sh.getLastColumn() + 1, 1, EXTRA_COLS.length).setValues([EXTRA_COLS]).setFontWeight('bold');
    sh.setFrozenRows(1);
  });
  const blank = book.getSheetByName('Sheet1');
  if (blank && book.getSheets().length > 1) book.deleteSheet(blank);

  PropertiesService.getScriptProperties().setProperty('SS_ID', book.getId());
  ScriptApp.getProjectTriggers().forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('onBookingSubmit').forSpreadsheet(book).onFormSubmit().create();
  ScriptApp.newTrigger('onBookingEdit').forSpreadsheet(book).onEdit().create();
  ScriptApp.newTrigger('sendScheduledEmails').timeBased().everyHours(1).create();
  ScriptApp.newTrigger('checkReplies').timeBased().everyMinutes(1).create();

  Logger.log('✅ Done! Send these three links to Claude for the website:');
  forms.forEach((f) => Logger.log(f.label + ': ' + f.form.getPublishedUrl()));
  Logger.log('Bookings sheet: ' + book.getUrl());
}

// rough earnings estimate shown in your alert (before any travel fee)
function estimate_(typeName, get) {
  const money = (n) => '$' + n;
  const addOns = String(get('Add-ons') || '').toLowerCase();
  const extras = (addOns.indexOf('contour') > -1 ? PRICES.contour : 0) + (addOns.indexOf('coconut') > -1 ? PRICES.coconut : 0) +
    (addOns.indexOf('dha') > -1 ? PRICES.dha : 0) + (addOns.indexOf('shimmer') > -1 ? PRICES.shimmer : 0);
  const plus = extras ? ' + add-ons ' + money(extras) : '';
  if (typeName === 'Spray Tan') {
    const dark = /dark/i.test(String(get('Desired shade') || ''));
    const base = dark ? PRICES.sprayDark : PRICES.spray;
    return money(base + extras) + ' (' + (dark ? 'darker solution ' : 'regular ') + money(base) + (extras ? ' + add-ons ' + money(extras) : '') + ')';
  }
  if (typeName === 'Group Tan') {
    const n = parseInt(get('How many people are getting tanned?'), 10) || 0;
    if (n === 1 && /wedding|bridal/i.test(String(get('Type of event') || ''))) return 'from ' + money(PRICES.bridalSolo + extras) + ' (solo bride' + plus + ')';
    return n ? 'about ' + money(n * PRICES.groupPerPerson) + ' (' + n + ' × ' + money(PRICES.groupPerPerson) + ', before any group deal)' + plus : 'quote by phone' + plus;
  }
  if (typeName === 'Competition Tan') {
    const n = parseInt(get('Number of dancers'), 10) || 1;
    const sol = String(get('Solution') || '');
    const each = PRICES.competition[sol] || PRICES.competitionDefault;
    return money(n * each + extras) + ' (' + n + ' × ' + money(each) + (PRICES.competition[sol] ? ' ' + sol : ' est.') + plus + ')';
  }
  return '';
}

function ensureCols_(sh) {
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const missing = EXTRA_COLS.filter((h) => headers.indexOf(h) === -1);
  if (missing.length) sh.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]).setFontWeight('bold');
}

// ---------- new request → calendar ----------
function onBookingSubmit(e) {
  const sh = e.range.getSheet();
  const type = TYPES[sh.getName()];
  if (!type) return;
  ensureCols_(sh);
  const row = e.range.getRow();
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const vals = sh.getRange(row, 1, 1, headers.length).getValues()[0];
  const get = (h) => { const i = headers.indexOf(h); return i > -1 ? vals[i] : ''; };

  let date = get('Preferred tan date');
  date = date instanceof Date ? new Date(date) : new Date(Date.now() + 86400000);
  date.setHours(TIMES[get('Preferred time')] || 10, 0, 0, 0);
  const count = get('How many people are getting tanned?') || get('Number of dancers');
  const end = new Date(date.getTime() + type.minutes(count) * 60000);

  const name = get(type.nameQ) || 'New client';
  const notes = headers.map((h, i) => {
    if (!h || EXTRA_COLS.indexOf(h) > -1 || vals[i] === '') return null;
    const v = vals[i] instanceof Date ? Utilities.formatDate(vals[i], Session.getScriptTimeZone(), h === 'Timestamp' ? 'MMM d, h:mm a' : 'EEE MMM d, yyyy') : vals[i];
    return h + ': ' + v;
  }).filter(Boolean).join('\n');

  const est = estimate_(sh.getName(), get);
  const ev = CalendarApp.getDefaultCalendar().createEvent(
    '🟡 REQUEST · ' + sh.getName() + ' · ' + name, date, end,
    { description: '💰 Estimate: ' + est + ' + travel fee if any\n\n' + notes + '\n\nTick "Confirmed" in the Sol Haus Bookings sheet to confirm.', location: String(get('Address, hotel or town') || '') }
  );
  ev.setColor(type.color);

  const c = (h) => headers.indexOf(h) + 1;
  sh.getRange(row, c('Confirmed')).insertCheckboxes();
  sh.getRange(row, c('Calendar Event ID')).setValue(ev.getId());
  sh.getRange(row, c('Status')).setValue('Requested');
  const ref = REF_CODES[sh.getName()] + row;

  // instant alert to Katie — reply YES or NO to it
  try {
    const to = ALERT_EMAIL || Session.getEffectiveUser().getEmail();
    const when = Utilities.formatDate(date, Session.getScriptTimeZone(), 'EEE MMM d, h:mm a');
    const rows = notes.split('\n').map((l) => { const i = l.indexOf(': '); return '<tr><td style="padding:4px 10px 4px 0;color:#174C3A;font-weight:bold;vertical-align:top">' + l.slice(0, i) + '</td><td style="padding:4px 0">' + l.slice(i + 2) + '</td></tr>'; }).join('');
    MailApp.sendEmail({
      to: to,
      subject: 'New ' + sh.getName() + ' request · ' + name + ' · ' + when + ' · ' + est.split(' (')[0] + ' · Sol Haus ref ' + ref,
      body: 'Estimate: ' + est + ' + travel fee if any\n\nReply YES to confirm or NO to decline.\n\n' + notes + '\n\nBookings sheet: ' + sh.getParent().getUrl(),
      htmlBody: '<div style="font-family:Arial,sans-serif;font-size:14px;color:#1f2a25;max-width:560px">' +
        '<h2 style="font-family:Georgia,serif;font-weight:normal;color:#174C3A;margin:0 0 4px">New ' + sh.getName().toLowerCase() + ' request</h2>' +
        '<p style="margin:0 0 10px"><b>' + name + '</b> · ' + when + '</p>' +
        '<p style="margin:0 0 14px;font-size:18px;color:#174C3A">💰 <b>' + est + '</b> <span style="font-size:13px;color:#642E3C">+ travel fee if any</span></p>' +
        '<div style="background:#f9d6e1;border-left:4px solid #174C3A;padding:12px 14px;margin:0 0 16px">Reply <b>YES</b> to confirm &nbsp;·&nbsp; Reply <b>NO</b> to decline</div>' +
        '<table style="border-collapse:collapse;font-size:14px">' + rows + '</table>' +
        '<p style="margin-top:18px"><a href="' + sh.getParent().getUrl() + '" style="color:#642E3C">Open the bookings sheet</a></p></div>',
      name: BUSINESS_NAME,
    });
  } catch (err) { console.log('Alert email failed: ' + err); }
}

// ---------- one-time: put the add-ons on your existing forms ----------
function updateAddOns() {
  const book = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SS_ID'));
  const after = { 'Spray Tan': 'Service', 'Group Tan': 'Type of event', 'Competition Tan': 'Solution' };
  Object.keys(after).forEach((name) => {
    const sh = book.getSheetByName(name);
    if (!sh || !sh.getFormUrl()) return;
    const f = FormApp.openByUrl(sh.getFormUrl());
    const items = f.getItems();
    let item = items.find((it) => it.getTitle() === 'Add-ons');
    if (item) item.asCheckboxItem().setChoiceValues(ADD_ONS);
    else {
      const cb = f.addCheckboxItem().setTitle('Add-ons').setHelpText(name === 'Spray Tan' ? 'Optional extras for your tan.' : 'Optional extras, per person.').setChoiceValues(ADD_ONS);
      const anchor = items.find((it) => it.getTitle() === after[name]);
      if (anchor) f.moveItem(cb.getIndex(), anchor.getIndex() + 1);
    }
    Logger.log('✅ Add-ons updated on ' + name + ' form');
  });
}

// ---------- reply YES / NO to an alert ----------
function installReplyChecker() {
  ScriptApp.getProjectTriggers().filter((t) => t.getHandlerFunction() === 'checkReplies').forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('checkReplies').timeBased().everyMinutes(1).create();
  GmailApp.getUserLabelByName(HANDLED_LABEL) || GmailApp.createLabel(HANDLED_LABEL);
  Logger.log('✅ Reply checker is on. Reply YES or NO to new booking alerts.');
}

// Run this by hand to test: it checks for YES/NO replies right now and logs what it finds.
function checkRepliesNow() { checkReplies(); }

function checkReplies() {
  const me = (ALERT_EMAIL || Session.getEffectiveUser().getEmail()).toLowerCase();
  const label = GmailApp.getUserLabelByName(HANDLED_LABEL) || GmailApp.createLabel(HANDLED_LABEL);
  const threads = GmailApp.search('subject:"Sol Haus ref" newer_than:14d', 0, 50)
    .filter((th) => !th.getLabels().some((l) => l.getName() === HANDLED_LABEL));
  console.log('Booking alert threads waiting: ' + threads.length);
  if (!threads.length) return;
  const book = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SS_ID'));
  threads.forEach((th) => {
    const msgs = th.getMessages();
    if (msgs.length < 2) return;
    const m = th.getFirstMessageSubject().match(/Sol Haus ref ([SGC])(\d+)/);
    if (!m) return;
    console.log('Checking ' + m[1] + m[2] + ' (' + msgs.length + ' messages)');
    let answer = null;
    for (let i = msgs.length - 1; i >= 1 && !answer; i--) {
      if (msgs[i].getFrom().toLowerCase().indexOf(me) === -1) continue;
      const first = msgs[i].getPlainBody().split('\n').map((l) => l.trim()).find((l) => l && l.charAt(0) !== '>') || '';
      if (/^(yes|y|yep|yeah|confirm|confirmed|ok|okay|👍|✅)\b/i.test(first) || /^(👍|✅)/.test(first)) answer = 'yes';
      else if (/^(no|n|nope|decline|declined|cancel)\b/i.test(first) || /^(👎|❌)/.test(first)) answer = 'no';
    }
    if (!answer) { console.log('  no YES/NO reply found yet'); return; }
    console.log('  reply: ' + answer);
    const sheetName = Object.keys(REF_CODES).find((k) => REF_CODES[k] === m[1]);
    const sh = book.getSheetByName(sheetName);
    const row = parseInt(m[2], 10);
    if (!sh || row < 2) return;
    const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    const status = sh.getRange(row, headers.indexOf('Status') + 1).getValue();
    let note;
    if (answer === 'yes') {
      if (status === 'Declined') note = '⚠️ This request was already declined, so nothing changed.';
      else { setConfirmed_(sh, row, headers, true); note = '✅ Confirmed. Your calendar is updated and the client has been emailed.'; }
    } else {
      if (status === 'Declined') note = 'Already declined.';
      else { declineRow_(sh, row, headers); note = '✕ Declined. Removed from your calendar and the client has been emailed to pick another time.'; }
    }
    th.reply(note, { name: BUSINESS_NAME });
    th.addLabel(label);
  });
}

function declineRow_(sh, row, headers) {
  const col = (h) => headers.indexOf(h);
  const vals = sh.getRange(row, 1, 1, headers.length).getValues()[0];
  const id = vals[col('Calendar Event ID')];
  const ev = id && CalendarApp.getEventById(id);
  if (ev) { try { ev.deleteEvent(); } catch (err) {} }
  sh.getRange(row, col('Status') + 1).setValue('Declined');
  const box = sh.getRange(row, col('Confirmed') + 1);
  if (box.getValue() === true) box.setValue(false);
  let rebook = '';
  try { rebook = FormApp.openByUrl(sh.getFormUrl()).getPublishedUrl(); } catch (err) {}
  sendClientEmail_('decline', sh.getName(), headers, vals, null, rebook);
}

// confirm/unconfirm a row: calendar title, sheet, client email
function setConfirmed_(sh, row, headers, on) {
  const id = sh.getRange(row, headers.indexOf('Calendar Event ID') + 1).getValue();
  const ev = id && CalendarApp.getEventById(id);
  if (!ev) return;
  const statusCell = sh.getRange(row, headers.indexOf('Status') + 1);
  const wasConfirmed = statusCell.getValue() === 'Confirmed';
  const base = ev.getTitle().replace(/^(🟡 REQUEST|✅ CONFIRMED) · /, '');
  ev.setTitle((on ? '✅ CONFIRMED · ' : '🟡 REQUEST · ') + base);
  statusCell.setValue(on ? 'Confirmed' : 'Requested');
  const box = sh.getRange(row, headers.indexOf('Confirmed') + 1);
  if (box.getValue() !== on) { box.insertCheckboxes(); box.setValue(on); }
  if (on && !wasConfirmed) {
    const vals = sh.getRange(row, 1, 1, headers.length).getValues()[0];
    sendClientEmail_('confirm', sh.getName(), headers, vals, ev);
  }
}

// ---------- tick "Confirmed" → update calendar ----------
function onBookingEdit(e) {
  const sh = e.range.getSheet();
  if (!TYPES[sh.getName()] || e.range.getRow() < 2) return;
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  if (headers[e.range.getColumn() - 1] !== 'Confirmed') return;
  setConfirmed_(sh, e.range.getRow(), headers, e.range.getValue() === true);
}

// ---------- reminders & aftercare (runs every hour) ----------
function sendScheduledEmails() {
  const ssId = PropertiesService.getScriptProperties().getProperty('SS_ID');
  if (!ssId) return;
  const book = SpreadsheetApp.openById(ssId);
  const now = Date.now();
  book.getSheets().forEach((sh) => {
    if (!TYPES[sh.getName()] || sh.getLastRow() < 2) return;
    const data = sh.getDataRange().getValues();
    const headers = data[0];
    const col = (h) => headers.indexOf(h);
    for (let r = 1; r < data.length; r++) {
      const vals = data[r];
      if (vals[col('Status')] !== 'Confirmed') continue;
      const ev = vals[col('Calendar Event ID')] && CalendarApp.getEventById(vals[col('Calendar Event ID')]);
      if (!ev) continue;
      const hoursUntil = (ev.getStartTime().getTime() - now) / 3600000;
      if (!vals[col('Reminder Sent')] && hoursUntil > 0 && hoursUntil <= 36) {
        if (sendClientEmail_('reminder', sh.getName(), headers, vals, ev)) sh.getRange(r + 1, col('Reminder Sent') + 1).setValue(new Date());
      }
      const hoursSince = (now - ev.getEndTime().getTime()) / 3600000;
      const hourNow = new Date().getHours();
      if (!vals[col('Aftercare Sent')] && hoursSince >= 12 && hoursSince <= 72 && hourNow >= 9 && hourNow <= 19) {
        if (sendClientEmail_('aftercare', sh.getName(), headers, vals, ev)) sh.getRange(r + 1, col('Aftercare Sent') + 1).setValue(new Date());
      }
    }
  });
}

// ---------- branded client emails ----------
function sendClientEmail_(kind, typeName, headers, vals, ev, rebookUrl) {
  const get = (h) => { const i = headers.indexOf(h); return i > -1 ? vals[i] : ''; };
  const to = String(get('Email') || '').trim();
  if (!to) return false;
  const first = String(get('Your name') || get('Parent / guardian name') || get('Dancer name') || '').trim().split(' ')[0] || 'there';
  const tz = Session.getScriptTimeZone();
  const when = ev ? Utilities.formatDate(ev.getStartTime(), tz, "EEEE, MMMM d 'at' h:mm a") : '';
  const where = (ev && ev.getLocation()) || (String(get('Where should we tan?')).indexOf('I come') === 0 ? "Katie will text you the address" : 'Katie will confirm the address with you');
  const list = (items) => '<ul style="padding-left:18px;margin:8px 0 16px">' + items.map((t) => '<li style="margin:6px 0">' + t + '</li>').join('') + '</ul>';
  const btn = (href, label) => '<a href="' + href + '" style="display:inline-block;background:#174C3A;color:#FFF9EF;text-decoration:none;padding:12px 22px;border-radius:999px;font:600 12px Arial;letter-spacing:2px;text-transform:uppercase">' + label + '</a>';

  let subject, heading, body;
  if (kind === 'confirm') {
    subject = "You're booked! Your Sol Haus " + typeName.toLowerCase() + ' ✨';
    heading = "You're booked, " + first + '!';
    body = '<p>Your <b>' + typeName.toLowerCase() + '</b> is confirmed for <b>' + when + '</b>.</p>' +
      '<p><b>Where:</b> ' + where + '</p>' +
      '<p style="margin-top:18px"><b>How to prep:</b></p>' + list(PREP_TIPS) +
      '<p>Please complete the client agreement before your appointment if you haven\'t already:</p>' + btn(AGREEMENT_URL, 'Client agreement') +
      '<p style="margin-top:18px">Need to change anything? Just reply to this email.</p>';
  } else if (kind === 'reminder') {
    subject = 'See you soon! Your Sol Haus glow is ' + Utilities.formatDate(ev.getStartTime(), tz, 'EEEE');
    heading = 'Almost glow time, ' + first + '!';
    body = '<p>A quick reminder: your <b>' + typeName.toLowerCase() + '</b> is <b>' + when + '</b>.</p>' +
      '<p><b>Where:</b> ' + where + '</p>' +
      '<p style="margin-top:18px"><b>Your prep checklist:</b></p>' + list(PREP_TIPS) +
      '<p>Running late or need to reschedule? Reply to this email as soon as you can.</p>';
  } else if (kind === 'decline') {
    subject = 'About your Sol Haus request';
    heading = 'Thank you, ' + first + '!';
    body = '<p>Thank you so much for reaching out to Sol Haus. Unfortunately, the time you requested isn\'t available.</p>' +
      '<p>I\'d love to find another time that works — just reply to this email with a few days and times, or send a new request:</p>' +
      (rebookUrl ? btn(rebookUrl, 'Choose another time') : '') +
      '<p style="margin-top:18px">Hope to see you soon!</p>';
  } else {
    subject = 'Your glow aftercare + a little favor 💚';
    heading = 'Hope you love your glow, ' + first + '!';
    body = '<p>Here\'s how to keep it looking its best:</p>' + list(AFTERCARE_TIPS) +
      '<div style="background:#f9d6e1;text-align:center;padding:22px 18px;margin:22px 0;border-radius:6px">' +
        '<p style="font-family:Georgia,serif;font-size:22px;color:#174C3A;margin:0 0 6px">How did we do?</p>' +
        '<p style="margin:0 0 10px">Please rate us on Google — it takes 30 seconds and means the world to a small business.</p>' +
        '<a href="' + REVIEW_URL + '" style="font-size:34px;letter-spacing:6px;color:#174C3A;text-decoration:none">★★★★★</a><br><br>' +
        btn(REVIEW_URL, 'Rate us on Google') + '</div>' +
      '<p style="margin-top:18px">Tag us on Instagram <a href="' + INSTAGRAM_URL + '" style="color:#642E3C">@_solhaus</a> — we love seeing your glow!</p>';
  }

  const html = '<div style="background:#FFF9EF;padding:28px 16px;font-family:Georgia,serif;color:#1f2a25">' +
    '<div style="max-width:560px;margin:0 auto;background:#FFFFFF;border-top:6px solid #F3AFC4">' +
    '<div style="background:#174C3A;color:#FFF9EF;text-align:center;padding:22px"><div style="font-size:24px;letter-spacing:6px">SOL HAUS</div>' +
    '<div style="font-style:italic;color:#F3AFC4;font-size:15px;margin-top:4px">enhance your good genes</div></div>' +
    '<div style="padding:26px 28px;font-family:Arial,sans-serif;font-size:15px;line-height:1.6">' +
    '<h1 style="font-family:Georgia,serif;font-weight:normal;color:#174C3A;font-size:26px;margin:0 0 14px">' + heading + '</h1>' + body +
    '<p style="margin-top:22px">xo,<br>Katie · Sol Haus</p></div>' +
    '<div style="background:repeating-linear-gradient(90deg,#174C3A 0 14px,#F3AFC4 14px 28px);height:10px"></div></div></div>';

  try {
    MailApp.sendEmail({ to: to, subject: subject, htmlBody: html, name: BUSINESS_NAME });
    return true;
  } catch (err) { console.log(kind + ' email failed: ' + err); return false; }
}

// ---------- the three forms ----------
function contact_(f) {
  const email = FormApp.createTextValidation().requireTextIsEmail().build();
  f.addTextItem().setTitle('Email').setRequired(true).setValidation(email);
  f.addTextItem().setTitle('Phone number').setHelpText('Katie will text you to confirm.').setRequired(true);
}
function when_(f) {
  f.addDateItem().setTitle('Preferred tan date').setRequired(true);
  f.addMultipleChoiceItem().setTitle('Preferred time').setChoiceValues(Object.keys(TIMES)).setRequired(true);
}
function skin_(f, who) {
  f.addParagraphTextItem().setTitle('Skin allergies or sensitivities')
    .setHelpText('Please list any allergies or sensitivities' + (who ? ' for ' + who : '') + '. Write "None" if none.').setRequired(true);
}
function where_(f, extra) {
  f.addMultipleChoiceItem().setTitle('Where should we tan?')
    .setChoiceValues(['Mobile: Katie comes to me' + (extra || ''), 'I come to Katie']).setRequired(true);
  f.addTextItem().setTitle('Address, hotel or town').setHelpText('For mobile appointments. Serving Long Island & all five boroughs.');
}
function finish_(f) {
  f.addParagraphTextItem().setTitle('Anything else we should know?');
  f.setConfirmationMessage(THANK_YOU);
}

function buildSprayForm_() {
  const f = FormApp.create('Sol Haus · Spray Tan Booking');
  f.setDescription('Custom airbrush spray tans, matched to you. Fill this out and Katie will confirm your appointment by text.');
  f.addTextItem().setTitle('Your name').setRequired(true);
  contact_(f);
  f.addMultipleChoiceItem().setTitle('Service').setChoiceValues(['Traditional spray tan (develops overnight)', 'Express spray tan (rinse sooner)', 'Not sure, help me choose']).setRequired(true);
  f.addCheckboxItem().setTitle('Add-ons').setHelpText('Optional extras for your tan.').setChoiceValues(ADD_ONS);
  f.addMultipleChoiceItem().setTitle("What's the occasion?").setChoiceValues(['Vacation', 'Wedding guest', 'Prom / formal', 'Graduation', 'Photoshoot', 'Date night', 'Just because']).showOtherOption(true);
  f.addDateItem().setTitle('Event date (if you have one)').setHelpText('So we can time your tan to peak on the day.');
  when_(f);
  f.addMultipleChoiceItem().setTitle('Desired shade').setChoiceValues(['Light natural', 'Subtle bronze', 'Dark', 'Not sure, help me choose']).setRequired(true);
  f.addMultipleChoiceItem().setTitle('Finish').setChoiceValues(['Matte', 'Glowy', 'No preference']);
  f.addMultipleChoiceItem().setTitle('Have you had a Sol Haus tan before?').setChoiceValues(['Yes', 'No, this is my first']).setRequired(true);
  skin_(f);
  where_(f);
  finish_(f);
  return f;
}

function buildGroupForm_() {
  const f = FormApp.create('Sol Haus · Group Tan Booking');
  f.setDescription('Bridal parties, bachelorettes, sip & tans and more. Katie brings the glow to your whole group.');
  f.addTextItem().setTitle('Your name').setHelpText('The organizer / host.').setRequired(true);
  contact_(f);
  f.addMultipleChoiceItem().setTitle('Type of event').setChoiceValues(['Wedding (bridal party)', 'Bridal trial', 'Bachelorette', 'Sip & tan / girls night', 'Prom / formal group', 'Team or dance school']).showOtherOption(true).setRequired(true);
  f.addDateItem().setTitle('Event date').setRequired(true);
  when_(f);
  f.addTextItem().setTitle('How many people are getting tanned?').setRequired(true)
    .setValidation(FormApp.createTextValidation().requireNumberGreaterThan(0).build());
  f.addMultipleChoiceItem().setTitle('Shade for the group').setChoiceValues(['Everyone chooses their own', 'Similar shade for photos', 'Not sure, help us choose']);
  f.addMultipleChoiceItem().setTitle('Is there a private room with an outlet for the tent?').setChoiceValues(['Yes', 'No', 'Not sure']).setRequired(true);
  skin_(f, 'anyone in the group');
  where_(f);
  finish_(f);
  return f;
}

function buildCompetitionForm_() {
  const f = FormApp.create('Sol Haus · Competition Tan Booking');
  f.setDescription('Stage-ready Irish dance competition tans, timed around your competition. If the dancer is under 18, a parent or guardian should fill this out.');
  f.addTextItem().setTitle('Dancer name').setRequired(true);
  f.addMultipleChoiceItem().setTitle('Is the dancer 18 or older?').setChoiceValues(['Yes', 'No']).setRequired(true);
  f.addTextItem().setTitle('Parent / guardian name').setHelpText('Required if the dancer is under 18.');
  contact_(f);
  f.addTextItem().setTitle('Dance school');
  f.addTextItem().setTitle('Competition name').setHelpText('e.g. Mid-Atlantic Oireachtas').setRequired(true);
  f.addDateItem().setTitle('Competition date').setRequired(true);
  f.addMultipleChoiceItem().setTitle('Booking for').setChoiceValues(['Pre-competition trial', 'Competition tan']).setRequired(true);
  f.addMultipleChoiceItem().setTitle('Solution').setChoiceValues(['Champ Dark', 'Custom Color', 'Trad Set Light', 'Not sure, help me choose']).setRequired(true);
  f.addTextItem().setTitle('Number of dancers').setHelpText('If booking for more than one dancer.')
    .setValidation(FormApp.createTextValidation().requireNumberGreaterThan(0).build());
  when_(f);
  skin_(f, 'the dancer(s)');
  where_(f, ' (home or hotel)');
  finish_(f);
  return f;
}
