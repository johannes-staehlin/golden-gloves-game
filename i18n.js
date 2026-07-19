const _forcedLang = new URLSearchParams(location.search).get('lang');
const lang = _forcedLang ?? (navigator.language.startsWith('de') ? 'de' : 'en');

const _translations = {};

async function loadTranslations() {
  const res = await fetch(`translations/${lang}.txt`);
  const text = await res.text();
  for (const line of text.split('\n')) {
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    _translations[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
}

function t(key, vars) {
  let s = _translations[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{${k}}`, v);
    }
  }
  return s;
}
