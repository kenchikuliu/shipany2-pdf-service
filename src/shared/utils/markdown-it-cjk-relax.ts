export function markdownItCjkRelax(md: any) {
  const originalScanDelims = md.inline.State.prototype.scanDelims;
  md.inline.State.prototype.scanDelims = function (start: number, canSplitWord: boolean) {
    const result = originalScanDelims.call(this, start, canSplitWord);
    
    const max = this.posMax;
    const marker = this.src.charCodeAt(start);
    let pos = start;
    while (pos < max && this.src.charCodeAt(pos) === marker) { pos++; }
    
    const count = pos - start;
    
    // Only apply to emphasis markers * (0x2A) and _ (0x5F)
    if (marker !== 0x2a && marker !== 0x5f) {
      return result;
    }
    
    const lastChar = start > 0 ? this.src.charCodeAt(start - 1) : 0x20;
    const nextChar = pos < max ? this.src.charCodeAt(pos) : 0x20;
    
    const isCJK = (char: number) => 
      (char >= 0x4E00 && char <= 0x9FFF) || // CJK Unified Ideographs
      (char >= 0x3400 && char <= 0x4DBF) || // CJK Extension A
      (char >= 0x3000 && char <= 0x303F) || // CJK Symbols and Punctuation
      (char >= 0xFF00 && char <= 0xFFEF);   // Halfwidth and Fullwidth Forms
    
    if (isCJK(nextChar) || isCJK(lastChar)) {
       if (lastChar !== 0x20 && lastChar !== 0x0A && lastChar !== 0x09) {
         result.can_close = true;
       }
       if (nextChar !== 0x20 && nextChar !== 0x0A && nextChar !== 0x09) {
         result.can_open = true;
       }
    }
    
    return result;
  };
}
