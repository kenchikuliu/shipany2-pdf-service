export function localizeText<T extends Record<string, unknown>>(
  record: T,
  locale: string,
  zhKey: keyof T,
  enKey: keyof T
) {
  return String(locale === 'zh' ? record[zhKey] : record[enKey]);
}
