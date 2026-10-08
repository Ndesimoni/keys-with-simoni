const pad = (n) => String(n).padStart(2, '0');

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const dateShift = (delta) => {
  const d = new Date();
  d.setDate(d.getDate() + delta);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const readableDate = (d) => {
  if (!d) return '—';
  const dat = new Date(String(d).length === 10 ? String(d) + 'T12:00:00' : d);
  return Number.isNaN(dat.valueOf())
    ? String(d)
    : dat.toLocaleDateString('en-AE', { day: '2-digit', month: 'short', year: 'numeric' });
};

const compactDate = (d) => {
  if (!d) return '—';
  const dat = new Date(String(d).length === 10 ? String(d) + 'T12:00:00' : d);
  return Number.isNaN(dat.valueOf())
    ? String(d)
    : dat.toLocaleDateString('en-AE', { day: 'numeric', month: 'short' });
};

const monthOf = (d) => String(d || '').slice(0, 7);

function dateNum(v) {
  const n = Date.parse(String(v || ''));
  return Number.isNaN(n) ? 0 : n;
}

export { pad, today, dateShift, readableDate, compactDate, monthOf, dateNum };
