import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { Check } from 'lucide-react';

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep: number;
  onStepClick?: (step: number) => void;
  children: React.ReactNode;
}

export const Stepper = ({
  activeStep,
  onStepClick,
  children,
  className,
  ...props
}: StepperProps) => {
  const steps = React.Children.toArray(children);

  return (
    <div className={cn('flex items-center w-full', className)} {...props}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex-1 shrink-0">{step}</div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'mx-4 h-[2px] w-full max-w-[40px] bg-muted transition-colors',
                activeStep > index + 1 && 'bg-blue-600'
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
  title: string;
  description?: string;
  active?: boolean;
  completed?: boolean;
}

export const StepperItem = ({
  step,
  title,
  description,
  active,
  completed,
  className,
  ...props
}: StepperItemProps) => {
  return (
    <div
      className={cn(
        'flex items-center gap-3 transition-colors',
        active ? 'text-foreground' : 'text-muted-foreground',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-300',
          active
            ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
            : completed
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-muted bg-muted/50'
        )}
      >
        {completed ? (
          <Check className="h-5 w-5" />
        ) : (
          <span className="text-sm font-semibold">{step}</span>
        )}
      </div>
      <div className="flex flex-col text-left">
        <span className={cn('text-sm font-bold leading-none', active && 'text-blue-600 dark:text-blue-400')}>
          {title}
        </span>
        {description && (
          <span className="mt-1 text-xs text-muted-foreground line-clamp-1 hidden sm:block">
            {description}
          </span>
        )}
      </div>
    </div>
  );
};
