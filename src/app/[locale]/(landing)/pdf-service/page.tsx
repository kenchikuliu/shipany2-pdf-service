'use client';

import { useState } from 'react';

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{children}</label>;
}

export default function PdfServicePage() {
  const [url, setUrl] = useState('');
  const [html, setHtml] = useState('');
  const [waitMs, setWaitMs] = useState(2000);
  const [format, setFormat] = useState('A4');
  const [landscape, setLandscape] = useState(false);
  const [printBackground, setPrintBackground] = useState(true);

  const [headerText, setHeaderText] = useState('');
  const [headerAlign, setHeaderAlign] = useState<'left' | 'center' | 'right'>('center');
  const [footerText, setFooterText] = useState('');
  const [footerAlign, setFooterAlign] = useState<'left' | 'center' | 'right'>('center');

  const [logoDataUrl, setLogoDataUrl] = useState('');
  const [logoPos, setLogoPos] = useState('header-left');
  const [logoHeight, setLogoHeight] = useState(10);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function onFile(file?: File | null) {
    if (!file) {
      setLogoDataUrl('');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(String(reader.result || ''));
    reader.readAsDataURL(file);
  }

  async function generate() {
    if (!url.trim() && !html.trim()) {
      setMessage('请填写 URL 或 HTML 其中一个');
      return;
    }
    setLoading(true);
    setMessage('生成中...');

    try {
      const payload = {
        url: url.trim() || undefined,
        html: html.trim() || undefined,
        waitMs,
        format,
        landscape,
        printBackground,
        header: {
          enabled: Boolean(headerText.trim()),
          text: headerText,
          align: headerAlign,
          fontSize: 11,
          color: '#111827'
        },
        footer: {
          enabled: Boolean(footerText.trim()),
          text: footerText,
          align: footerAlign,
          fontSize: 11,
          color: '#111827'
        },
        logo: {
          enabled: Boolean(logoDataUrl),
          dataUrl: logoDataUrl || undefined,
          position: logoPos,
          maxHeightMm: logoHeight
        }
      };

      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: '生成失败' }));
        throw new Error(err.error || '生成失败');
      }

      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = 'export.pdf';
      a.click();
      URL.revokeObjectURL(href);
      setMessage('已生成并开始下载');
    } catch (e: any) {
      setMessage(`失败：${e.message || '未知错误'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6 md:py-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-2xl font-semibold">PDF Service (ShipAny2)</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          支持 URL/HTML 转 PDF，Logo 放页眉页脚，页眉页脚文字左中右对齐。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 md:col-span-2">
          <FieldLabel>URL（与 HTML 二选一）</FieldLabel>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 md:col-span-2">
          <FieldLabel>HTML（可选）</FieldLabel>
          <textarea
            className="min-h-40 w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="<html>...</html>"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <FieldLabel>等待时间(ms)</FieldLabel>
          <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" type="number" value={waitMs} onChange={(e) => setWaitMs(Number(e.target.value || 0))} />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <FieldLabel>纸张</FieldLabel>
          <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={format} onChange={(e) => setFormat(e.target.value)}>
            <option>A4</option>
            <option>A3</option>
            <option>Letter</option>
            <option>Legal</option>
          </select>
          <div className="mt-3 flex items-center gap-4 text-sm">
            <label><input type="checkbox" checked={landscape} onChange={(e) => setLandscape(e.target.checked)} /> 横向</label>
            <label><input type="checkbox" checked={printBackground} onChange={(e) => setPrintBackground(e.target.checked)} /> 打印背景</label>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 md:col-span-2">
          <h2 className="mb-3 text-base font-semibold">Logo</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <FieldLabel>上传 Logo</FieldLabel>
              <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
            </div>
            <div>
              <FieldLabel>位置</FieldLabel>
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={logoPos} onChange={(e) => setLogoPos(e.target.value)}>
                <option value="header-left">页眉左</option>
                <option value="header-center">页眉中</option>
                <option value="header-right">页眉右</option>
                <option value="footer-left">页脚左</option>
                <option value="footer-center">页脚中</option>
                <option value="footer-right">页脚右</option>
              </select>
            </div>
            <div>
              <FieldLabel>高度(mm)</FieldLabel>
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" type="number" value={logoHeight} onChange={(e) => setLogoHeight(Number(e.target.value || 10))} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <h2 className="mb-3 text-base font-semibold">页眉文字</h2>
          <FieldLabel>文字</FieldLabel>
          <input className="mb-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={headerText} onChange={(e) => setHeaderText(e.target.value)} />
          <FieldLabel>对齐</FieldLabel>
          <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={headerAlign} onChange={(e) => setHeaderAlign(e.target.value as any)}>
            <option value="left">左</option><option value="center">中</option><option value="right">右</option>
          </select>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <h2 className="mb-3 text-base font-semibold">页脚文字</h2>
          <FieldLabel>文字</FieldLabel>
          <input className="mb-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={footerText} onChange={(e) => setFooterText(e.target.value)} />
          <FieldLabel>对齐</FieldLabel>
          <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={footerAlign} onChange={(e) => setFooterAlign(e.target.value as any)}>
            <option value="left">左</option><option value="center">中</option><option value="right">右</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
        <button
          onClick={generate}
          disabled={loading}
          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? '生成中...' : '生成 PDF'}
        </button>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{message}</p>
      </div>
    </div>
  );
}
