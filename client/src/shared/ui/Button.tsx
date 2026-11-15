import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'mono';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  ...props
}) => {
  let variantStyles = 'bg-nasa-blue hover:bg-nasa-blue/90 text-white border border-nasa-blue shadow-glow-blue';

  if (variant === 'secondary') {
    variantStyles = 'bg-white dark:bg-space-800 hover:bg-slate-50 dark:hover:bg-space-700 text-slate-800 dark:text-white border border-slate-300 dark:border-white/20 hover:border-slate-400 dark:hover:border-white/40 shadow-sm';
  } else if (variant === 'ghost') {
    variantStyles = 'bg-transparent hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-transparent';
  } else if (variant === 'mono') {
    variantStyles = 'bg-slate-100 dark:bg-space-700 hover:bg-slate-200 dark:hover:bg-space-600 text-nasa-blue dark:text-signal-cyan border border-slate-300 dark:border-space-500 font-mono tracking-wider';
  }

  let sizeStyles = 'px-4 py-2 text-sm';
  if (size === 'sm') sizeStyles = 'px-3 py-1.5 text-xs';
  if (size === 'lg') sizeStyles = 'px-6 py-3 text-base';

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-xl transition duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
