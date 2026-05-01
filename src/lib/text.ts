const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export function renderEmphasis(input: string): string {
  const escaped = escapeHtml(input);
  return escaped.replace(/\*(.+?)\*/g, '<em>$1</em>');
}

export function renderInline(input: string): string {
  const escaped = escapeHtml(input);
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

export function formatIssueDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }).toUpperCase();
}

export function formatIssueNumber(n: number): string {
  return `— ${String(n).padStart(2, '0')}`;
}

export function formatSectionLabel(index: number, title?: string): string {
  const num = `— ${String(index + 1).padStart(2, '0')}`;
  return title ? `${num} — ${title}` : num;
}
