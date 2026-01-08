import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export function Input({ label, hint, className, ...props }: InputProps) {
  const classes = ['input', className].filter(Boolean).join(' ');
  return (
    <label className="field">
      {label && <span className="field__label">{label}</span>}
      <input className={classes} {...props} />
      {hint && <span className="muted">{hint}</span>}
    </label>
  );
}

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
};

export function Textarea({ label, hint, className, ...props }: TextareaProps) {
  const classes = ['textarea', className].filter(Boolean).join(' ');
  return (
    <label className="field">
      {label && <span className="field__label">{label}</span>}
      <textarea className={classes} {...props} />
      {hint && <span className="muted">{hint}</span>}
    </label>
  );
}
