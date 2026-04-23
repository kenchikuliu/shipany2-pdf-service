import { ControllerRenderProps } from 'react-hook-form';

import { Checkbox as CheckboxComponent } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import { cn } from '@/shared/lib/utils';
import { FormField } from '@/shared/types/blocks/form';

export function Checkbox({
  field,
  formField,
  data,
}: {
  field: FormField;
  formField: ControllerRenderProps<Record<string, unknown>, string>;
  data?: any;
}) {
  const metadata = field.metadata || {};
  const columns = Number(metadata.columns) || 1;
  const compact = metadata.compact === true;
  const maxHeight =
    typeof metadata.maxHeight === 'number' ? `${metadata.maxHeight}px` : undefined;

  // initial value
  let value = (formField.value as string[]) || [];

  if (typeof value === 'string') {
    try {
      const jsonValue = JSON.parse(value);
      if (Array.isArray(jsonValue)) {
        value = jsonValue;
      }
    } catch (error) {
      console.error('checkbox initial value parse error', error);
    }
  }

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    let newValue: string[];

    if (checked) {
      // Add the value if it's not already in the array
      newValue = [...value, optionValue];
    } else {
      // Remove the value from the array
      newValue = value.filter((v) => v !== optionValue);
    }

    formField.onChange(newValue);
  };

  return (
    <div
      className={cn(
        'py-2',
        columns > 1 ? 'grid gap-x-6 gap-y-3' : 'flex flex-col gap-4',
        columns === 2 && 'sm:grid-cols-2',
        columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
        columns >= 4 && 'sm:grid-cols-2 lg:grid-cols-4',
        maxHeight && 'overflow-y-auto pr-2'
      )}
      style={maxHeight ? { maxHeight } : undefined}
    >
      {field.options?.map((option: any) => (
        <div key={option.value} className={cn('flex items-start gap-3', compact && 'gap-2')}>
          <CheckboxComponent
            onCheckedChange={(checked) =>
              handleCheckboxChange(option.value, checked as boolean)
            }
            name={field.name}
            value={option.value}
            checked={value.includes(option.value)}
          />
          <div className={cn('grid gap-1', compact && 'gap-0.5')}>
            <Label className={cn(compact && 'text-sm leading-5')}>{option.title}</Label>
            {option.description && (
              <p className="text-muted-foreground text-sm">
                {option.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
