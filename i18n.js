const _langs = {
  en: {
    ONE_PLAYER:    '1 PLAYER',
    TWO_PLAYERS:   '2 PLAYERS',
    VISIT_WEBSITE: 'VISIT WEBSITE',
    ROUND:         'ROUND',
    FIGHT:         'FIGHT!',
    ROUND_GOES_TO: 'ROUND {round} GOES TO {winner}',
    WINS:          '{winner} WINS!',
    BY_KNOCKOUT:   'BY KNOCKOUT',
    BY_DECISION:   'BY DECISION',
    PRESS_ENTER:   'PRESS ENTER',
    MOVE:          'MOVE',
    DUCK:          'DUCK',
    BLOCK:         'BLOCK',
    PUNCH:         'PUNCH',
    RED:           'RED',
    BLUE:          'BLUE',
    MOBILE_HINT:   'Open on a computer to play',
  },
  de: {
    ONE_PLAYER:    '1 SPIELER',
    TWO_PLAYERS:   '2 SPIELER',
    VISIT_WEBSITE: 'WEBSITE BESUCHEN',
    ROUND:         'RUNDE',
    FIGHT:         'FIGHT!',
    ROUND_GOES_TO: 'RUNDE {round} GEHT AN {winner}',
    WINS:          '{winner} GEWINNT!',
    BY_KNOCKOUT:   'DURCH KO',
    BY_DECISION:   'NACH PUNKTEN',
    PRESS_ENTER:   'ENTER DRÜCKEN',
    MOVE:          'BEWEGEN',
    DUCK:          'DUCKEN',
    BLOCK:         'BLOCKEN',
    PUNCH:         'SCHLAGEN',
    RED:           'ROT',
    BLUE:          'BLAU',
    MOBILE_HINT:   'Bitte am Computer öffnen',
  },
};

const _forcedLang = new URLSearchParams(location.search).get('lang');
const lang = _forcedLang ?? (navigator.language.startsWith('de') ? 'de' : 'en');
const _translations = _langs[lang] ?? _langs.en;

function loadTranslations() { return Promise.resolve(); }

function t(key, vars) {
  let s = _translations[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{${k}}`, v);
    }
  }
  return s;
}
