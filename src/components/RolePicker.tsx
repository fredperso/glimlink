import { useId, useLayoutEffect, useRef, useState } from 'react';
import { useApp } from '../context.tsx';
import type { Role } from '../domain/model.ts';
import { Icon } from './ui.tsx';

const OPTIONS = [
  { value: 'company' as Role, label: 'Espace entreprise', short: 'Entreprise' },
  { value: 'adviser' as Role, label: 'Espace conseiller', short: 'Conseiller' },
];
export default function RolePicker() {
  const { role, go } = useApp();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0, width: 240 });
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const focusIndex = useRef(0);
  const selected = OPTIONS.findIndex((option) => option.value === role);
  function show(index = selected) {
    focusIndex.current = index;
    setOpen(true);
  }
  function close(restore = false) {
    setOpen(false);
    if (restore) trigger.current?.focus();
  }
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const bounds = trigger.current!.getBoundingClientRect();
      const width = Math.min(260, window.innerWidth - 24);
      const height = menu.current?.offsetHeight ?? 120;
      setPosition({
        width,
        left: Math.max(12, Math.min(bounds.right - width, window.innerWidth - width - 12)),
        top: Math.max(12, Math.min(bounds.bottom + 8, window.innerHeight - height - 12)),
      });
    };
    place();
    items.current[focusIndex.current]?.focus();
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) close();
    };
    window.addEventListener('pointerdown', outside);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('pointerdown', outside);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);
  const current = OPTIONS[selected];
  return (
    <div className="role-picker" ref={root}>
      <button
        className="role-picker-trigger"
        type="button"
        ref={trigger}
        aria-label={`Choisir l’espace de démonstration : ${current.label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => (open ? close() : show())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            show(event.key === 'ArrowUp' ? OPTIONS.length - 1 : 0);
          }
        }}
      >
        <span className="role-picker-full">{current.label}</span>
        <span className="role-picker-short" aria-hidden="true">
          {current.short}
        </span>
        <Icon name="chevron" size={16} />
      </button>
      {open && (
        <div
          className="role-picker-menu"
          id={id}
          role="menu"
          aria-label="Espaces de démonstration"
          ref={menu}
          style={position}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              event.stopPropagation();
              close(true);
            } else if (event.key === 'Tab') {
              close(true);
            } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
              event.preventDefault();
              const index = items.current.indexOf(document.activeElement as HTMLButtonElement);
              const next =
                event.key === 'Home'
                  ? 0
                  : event.key === 'End'
                    ? OPTIONS.length - 1
                    : (index + (event.key === 'ArrowDown' ? 1 : -1) + OPTIONS.length) %
                      OPTIONS.length;
              items.current[next]?.focus();
            }
          }}
        >
          {OPTIONS.map((option, index) => (
            <button
              key={option.value}
              type="button"
              role="menuitemradio"
              aria-checked={role === option.value}
              ref={(element) => {
                items.current[index] = element;
              }}
              onClick={() => {
                close(true);
                if (role !== option.value) go('home', undefined, option.value);
              }}
            >
              <span>{option.label}</span>
              {role === option.value && <Icon name="check" size={18} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
