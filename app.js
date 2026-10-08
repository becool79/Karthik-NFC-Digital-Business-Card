'use strict';
const vcard = ['BEGIN:VCARD','VERSION:3.0','N:Pradeep;Karthik;;;','FN:Karthik Pradeep','ORG:Enviro Metals Recyclers Pvt Ltd','TITLE:Managing Director','TEL;TYPE=CELL,VOICE:+919840486003','EMAIL;TYPE=INTERNET,WORK:karthik@ensenviro.com','ADR;TYPE=WORK:;;S.No. 104 & 106\\, Ezhichur Village;Kancheepuram;;603204;India','URL:https://www.ensenviro.com/','END:VCARD',''].join('\r\n');
const isHosted = /^https?:$/.test(location.protocol) && !/^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname);
const cardUrl = new URL(location.href);
cardUrl.hash = ''; cardUrl.search = '';
const payload = isHosted ? cardUrl.href : vcard;
if (!isHosted) document.getElementById('qr').classList.add('contact-qr');
const status = document.getElementById('status');
try {
  const code = qrcode(0, 'M');
  code.addData(payload); code.make();
  document.getElementById('qr').innerHTML = code.createSvgTag({cellSize:4,margin:16,scalable:true});
  if (isHosted) {
    document.getElementById('qr-caption').textContent = 'Scan to open my digital card.';
    document.getElementById('qr').setAttribute('aria-label', 'QR code to open Karthik’s digital card');
  }
} catch { document.getElementById('qr').hidden = true; status.textContent = 'QR unavailable. Use Save Contact above.'; }
document.getElementById('share').addEventListener('click', async () => {
  const shareData = isHosted
    ? {title:'Karthik Pradeep | ENS',text:'Connect with Karthik Pradeep, Managing Director, Enviro Metals Recyclers Pvt Ltd.',url:cardUrl.href}
    : {title:'Karthik Pradeep | ENS',text:'Karthik Pradeep — Managing Director\nEnviro Metals Recyclers Pvt Ltd\n+91 98404 86003\nkarthik@ensenviro.com\nS.No. 104 & 106, Ezhichur Village, Kancheepuram - 603204\nhttps://www.ensenviro.com/'};
  if (navigator.share) {
    try { await navigator.share(shareData); return; }
    catch (error) { if (error.name === 'AbortError') return; }
  }
  const text = isHosted ? cardUrl.href : shareData.text;
  try { await navigator.clipboard.writeText(text); status.textContent = isHosted ? 'Card link copied.' : 'Contact details copied.'; }
  catch { status.textContent = 'Copy to share: ' + text; }
});
