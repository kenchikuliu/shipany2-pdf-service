import dynamic from 'next/dynamic';
import { ControllerRenderProps } from 'react-hook-form';

import { FormField } from '@/shared/types/blocks/form';

const MarkdownEditor = dynamic(
  () => import('../common/markdown-editor').then((mod) => mod.MarkdownEditor),
  {
    ssr: false,
  }
);

export function Markdown({
  field,
  formField,
  data,
}: {
  field: FormField;
  formField: ControllerRenderProps<Record<string, unknown>, string>;
  data?: any;
}) {
  return (
    <MarkdownEditor
      value={formField.value as string}
      onChange={formField.onChange}
      placeholder={field.placeholder || ''}
      {...field.attributes}
    />
  );
}
