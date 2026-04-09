export function lsGet(key, fallback) {
  try {
    const v = localStorage.getItem(key);

    if (v === null || v === undefined) return fallback;

    const parsed = JSON.parse(v);
    return parsed ?? fallback;

  } catch (e) {
    console.warn("lsGet error:", key, e);
    return fallback;
  }
}

export function lsSet(key, val) {
  try {
    const safeVal = val === undefined ? null : val;
    localStorage.setItem(key, JSON.stringify(safeVal));
  } catch (e) {
    console.warn("lsSet error:", key, e);
  }
}

export function monthNoteKey(y, m) {
  return `wcal-month-${y}-${String(m + 1).padStart(2, "0")}`;
}

export function rangeNotesKey(y, m) {
  return `wcal-range-${y}-${String(m + 1).padStart(2, "0")}`;
}