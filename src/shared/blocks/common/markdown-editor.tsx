'use client';

import { useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';
import { mdMirrorExtension } from '@/config/codemirror-theme';
import MarkdownIt from 'markdown-it';
// @ts-ignore
import markdownItKatex from 'markdown-it-katex';
import 'katex/dist/katex.min.css';
import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/github.css';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Monitor, Smartphone, Edit3, Eye } from 'lucide-react';
import { markdownItCjkRelax } from '@/shared/utils/markdown-it-cjk-relax';
import { useTranslations } from 'next-intl';
import hljs from 'highlight.js';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  typographer: true,
  highlight: function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre><code class="hljs">' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>';
      } catch (__) {}
    }

    try {
      const result = hljs.highlightAuto(str);
      return '<pre><code class="hljs">' +
             result.value +
             '</code></pre>';
    } catch (__) {}

    return '<pre><code class="hljs">' + (md ? md.utils.escapeHtml(str) : str) + '</code></pre>';
  },
})
  .use(markdownItKatex)
  .use(markdownItCjkRelax);

type PreviewMode = 'pc' | 'mobile';

// 图片压缩函数
async function compressImage(file: File, quality = 0.7): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        let width = img.width;
        let height = img.height;
        const maxDimension = 1920;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              resolve(file);
              return;
            }

            const newName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
            const compressedFile = new File([blob], newName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  minHeight = 400,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  showToolbar?: boolean;
}) {
  const t = useTranslations('common');
  const [previewHtml, setPreviewHtml] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('pc');
  const editorRef = useRef<any>(null);
  const isSyncingRef = useRef(false);

  // 处理图片粘贴上传
  const handlePaste = async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        event.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;

        const editor = editorRef.current?.view;
        const cursorPosition = editor?.state.selection.main.head || 0;

        const toastId = `upload-${Date.now()}`;
        const fileName = file.name || t('markdown_editor.default_image_name');
        
        toast.loading(t('markdown_editor.uploading', { fileName }), { id: toastId });

        try {
          const compressedFile = await compressImage(file);
          const formData = new FormData();
          formData.append('files', compressedFile);

          const response = await fetch('/api/storage/upload-image', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();
          if (result.code === 0 && result.data && result.data.urls && result.data.urls[0]) {
            toast.success(t('markdown_editor.upload_success'), { id: toastId });
            const imageMarkdown = `\n![${t('markdown_editor.default_image_name')}](${result.data.urls[0]})\n`;
            
            if (editor) {
              const currentCursor = editor.state.selection.main.head;
              editor.dispatch({
                changes: { from: currentCursor, insert: imageMarkdown },
                selection: { anchor: currentCursor + imageMarkdown.length },
                scrollIntoView: true
              });
              editor.focus();
            } else {
              const currentValue = value || '';
              const newValue = 
                currentValue.slice(0, cursorPosition) + 
                imageMarkdown + 
                currentValue.slice(cursorPosition);
              onChange(newValue);
            }
          } else {
            toast.error(t('markdown_editor.upload_failed'), { id: toastId });
          }
        } catch (error) {
          console.error('Upload error:', error);
          toast.error(t('markdown_editor.upload_failed'), { id: toastId });
        }
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    if (value) {
      setPreviewHtml(md.render(value));
    }
  }, []);

  useEffect(() => {
    if (value !== undefined) {
      setPreviewHtml(md.render(value || ''));
    }
  }, [value]);

  useEffect(() => {
    if (!mounted) return;
    
    const timer = setTimeout(() => {
      const editor = editorRef.current?.view?.dom;
      if (editor) {
        editor.addEventListener('paste', handlePaste);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      const editor = editorRef.current?.view?.dom;
      if (editor) {
        editor.removeEventListener('paste', handlePaste);
      }
    };
  }, [mounted]);

  // 同步滚动
  useEffect(() => {
    if (!mounted) return;
    
    const timer = setTimeout(() => {
      const editorScroll = editorRef.current?.view?.scrollDOM;
      const previewScroll = previewRef.current;

      if (!editorScroll || !previewScroll) return;

      const handleEditorScroll = () => {
        if (isSyncingRef.current) return;
        isSyncingRef.current = true;
        
        const scrollPercentage = editorScroll.scrollTop / (editorScroll.scrollHeight - editorScroll.clientHeight || 1);
        if (!isNaN(scrollPercentage)) {
          previewScroll.scrollTop = scrollPercentage * (previewScroll.scrollHeight - previewScroll.clientHeight);
        }
        requestAnimationFrame(() => { isSyncingRef.current = false; });
      };

      const handlePreviewScroll = () => {
        if (isSyncingRef.current) return;
        isSyncingRef.current = true;
        
        const scrollPercentage = previewScroll.scrollTop / (previewScroll.scrollHeight - previewScroll.clientHeight || 1);
        if (!isNaN(scrollPercentage)) {
          editorScroll.scrollTop = scrollPercentage * (editorScroll.scrollHeight - editorScroll.clientHeight);
        }
        requestAnimationFrame(() => { isSyncingRef.current = false; });
      };

      editorScroll.addEventListener('scroll', handleEditorScroll, { passive: true });
      previewScroll.addEventListener('scroll', handlePreviewScroll, { passive: true });

      return () => {
        editorScroll.removeEventListener('scroll', handleEditorScroll);
        previewScroll.removeEventListener('scroll', handlePreviewScroll);
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [mounted, previewHtml]);

  if (!mounted) {
    return <div className="w-full bg-muted animate-pulse rounded-lg" style={{ height: `${minHeight}px` }} />;
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-3 shadow-sm">
      <div className="flex flex-col gap-3 border-b pb-2 sm:flex-row sm:items-center sm:justify-between">
         <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
           <Edit3 className="h-4 w-4" />
           <span>{t('markdown_editor.title')}</span>
         </div>
         <div className="flex flex-wrap items-center gap-2 sm:justify-end">
           <div className="flex flex-wrap items-center gap-2">
             <span className="text-xs text-muted-foreground">{t('markdown_editor.preview_mode')}:</span>
             <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as PreviewMode)}>
               <TabsList className="h-8 w-full p-0.5 sm:w-auto">
                 <TabsTrigger value="pc" className="h-7 px-2 text-xs gap-1">
                   <Monitor className="h-3 w-3" />
                   {t('markdown_editor.pc')}
                 </TabsTrigger>
                 <TabsTrigger value="mobile" className="h-7 px-2 text-xs gap-1">
                   <Smartphone className="h-3 w-3" />
                   {t('markdown_editor.mobile')}
                 </TabsTrigger>
               </TabsList>
             </Tabs>
           </div>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Edit3 className="h-4 w-4" />
            {t('markdown_editor.editor')}
          </div>
          <div className="overflow-hidden rounded-lg border shadow-sm">
            <CodeMirror
              ref={editorRef}
              value={value}
              height="600px"
              extensions={[markdown(), mdMirrorExtension, EditorView.lineWrapping]}
              onChange={(val) => onChange(val)}
              placeholder={placeholder}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: false,
                highlightActiveLine: false,
                foldGutter: true,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Eye className="h-4 w-4" />
            {t('markdown_editor.preview')}
          </div>
          <div
            ref={previewRef}
            className={`markdown-body overflow-auto rounded-lg border bg-background shadow-sm transition-all duration-300 ${
              previewMode === 'mobile' ? 'max-w-[375px] min-w-[320px] mx-auto ring-4 ring-muted shadow-lg' : 'w-full'
            }`}
            style={{ height: '600px', padding: previewMode === 'mobile' ? '16px' : '24px' }}
          >
            {previewHtml ? (
              <div
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <div className="text-center">
                   <Eye className="mx-auto mb-3 h-12 w-12 opacity-20" />
                   <p className="text-sm">{t('markdown_editor.typing_hint')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
