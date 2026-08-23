'use client';;
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const morphyButtonVariants = cva(
  'group relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 overflow-hidden [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rounded-full',
  {
    variants: {
      size: {
        default: 'h-9 px-6 py-2',
        sm: 'h-8 px-5 text-xs',
        lg: 'h-10 px-10',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const MorphyButton = React.forwardRef((
  {
    className,
    size,
    asChild = false,
    children,
    dotClassName,
    animate = 'normal',
    morphDir = 'left',
    randomDir = false,
    morphStyle = 'dot',
    activeIcon = null,
    blueprint = false,
    decor = null,
    disableMorph = false,
    ...props
  },
  ref,
) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [dir, setDir] = React.useState(morphDir);
  const timeoutRef = React.useRef(null);
  const Comp = asChild ? Slot : 'button';
  const buttonSize = size || 'default';

  const DIR_MAP = {
    left: '-translate-x-full',
    right: 'translate-x-full',
    up: '-translate-y-full',
    down: 'translate-y-full',
    'up-left': '-translate-x-full -translate-y-full',
    'up-right': 'translate-x-full -translate-y-full',
    'down-left': '-translate-x-full translate-y-full',
    'down-right': 'translate-x-full translate-y-full',
  };
  const DIRS = Object.keys(DIR_MAP);

  const pickDir = () => {
    if (randomDir) setDir(DIRS[Math.floor(Math.random() * DIRS.length)]);
  };

  const handleTouchStart = () => {
    pickDir();
    setIsHovered(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsHovered(false), 1500);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const active = disableMorph ? false : (animate === 'reverse' ? !isHovered : isHovered);

  const userHasTextColor = className?.includes('text-');

  const dotActiveClass =
    dir === 'right'
      ? buttonSize === 'sm' ? 'w-2 h-2 right-3 left-auto' : buttonSize === 'lg' ? 'w-3 h-3 right-4 left-auto' : 'w-2.5 h-2.5 right-3 left-auto'
      : buttonSize === 'sm' ? 'w-2 h-2 left-3' : buttonSize === 'lg' ? 'w-3 h-3 left-4' : 'w-2.5 h-2.5 left-3';

  const baseBg =
    morphStyle === 'dot'
      ? active ? 'bg-zinc-200 dark:bg-zinc-800' : 'bg-black dark:bg-white'
      : 'bg-zinc-200 dark:bg-zinc-800';

  return (
    <Comp
      ref={ref}
      onMouseEnter={disableMorph ? undefined : () => { pickDir(); setIsHovered(true); }}
      onMouseLeave={disableMorph ? undefined : () => setIsHovered(false)}
      onTouchStart={disableMorph ? undefined : handleTouchStart}
      className={cn(
        morphyButtonVariants({ size }),
        disableMorph
          ? ''
          : blueprint
            ? 'border-2 border-white bg-[#0a3aa8] backdrop-blur-md'
            : 'transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] border backdrop-blur-md',
        !disableMorph && !blueprint &&
          (active
            ? 'border-black dark:border-white'
            : 'border-white/30 shadow-[0_10px_24px_-4px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.35)]'),
        className
      )}
      {...props}>
      {!disableMorph && (
        <div
          className={cn(
            'absolute inset-0 transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-[inherit]',
            blueprint ? 'bg-[#0a3aa8]' : baseBg
          )} />
      )}
      {!disableMorph && decor && (
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
          {decor}
        </div>
      )}
      {!disableMorph && (morphStyle === 'dot' ? (
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-700 ease-in-out bg-black dark:bg-white',
            'w-[200%] h-[200%] -left-full',
            active && dotActiveClass,
            dotClassName
          )} />
      ) : (
        <div
          className={cn(
            'absolute inset-0 rounded-[inherit] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
            blueprint
              ? 'opacity-0'
              : active
                ? cn('opacity-0 scale-50', DIR_MAP[dir])
                : 'bg-black dark:bg-white opacity-100 translate-x-0 translate-y-0 scale-100'
          )} />
      ))}
      <span
        className={cn(
          'relative z-10 flex items-center justify-center font-bold',
          !disableMorph && !blueprint && morphStyle === 'dot' && (active ? (dir === 'right' ? '-translate-x-1.5' : 'translate-x-1.5') : 'translate-x-0'),
          disableMorph
            ? ''
            : !userHasTextColor &&
              (blueprint
                ? 'text-white'
                : active
                  ? 'text-black dark:text-white'
                  : 'text-white dark:text-black')
        )}>
        {morphStyle === 'icon' && !disableMorph ? (
          <>
            <span>{children}</span>
            <span className={cn('inline-flex items-center justify-center shrink-0 overflow-hidden transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]', active ? 'ml-1.5 w-auto opacity-100 translate-x-0' : 'ml-0 w-0 opacity-0 -translate-x-2')}>
              <span className={cn('inline-flex', active && 'animate-[iconNudge_1s_ease-in-out_infinite]')}>{activeIcon}</span>
            </span>
          </>
        ) : children}
      </span>
    </Comp>
  );
});

MorphyButton.displayName = 'MorphyButton';

export { MorphyButton, morphyButtonVariants };
