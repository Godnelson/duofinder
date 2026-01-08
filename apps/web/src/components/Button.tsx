import type { ButtonHTMLAttributes } from 'react';

const variantClass = {
  primary: 'button--primary',
  secondary: 'button--secondary',
  ghost: 'button--ghost',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variantClass;
};

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const classes = ['button', variantClass[variant], className].filter(Boolean).join(' ');
  return <button className={classes} {...props} />;
}
