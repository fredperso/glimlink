import { useId, useLayoutEffect, useRef, useState, type ComponentProps } from 'react';
import { Icon } from './ui.tsx';

type Option = { value: string; label: string; disabled: boolean; index: number };

// Le select conserve les valeurs de formulaire et la validation ; le menu visible
// utilise la couche popover pour rester lisible même dans une fenêtre modale.
export default function Select(props: ComponentProps<'select'>) {
  const native = useRef<HTMLSelectElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLSpanElement>(null);
  const id = useId();
  const [options, setOptions] = useState<Option[]>([]);
  const [caption, setCaption] = useState('');
  const [label, setLabel] = useState('une option');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [active, setActive] = useState(0);
  const search = useRef({ text: '', time: 0 });
  const selected = native.current?.selectedIndex ?? 0;
  const sync = () => {
    const select = native.current;
    if (!select) return;
    const next = Array.from(select.options, (option, index) => ({
      value: option.value,
      label: option.text,
      disabled:
        option.disabled ||
        (option.parentElement instanceof HTMLOptGroupElement && option.parentElement.disabled),
      index,
    }));
    setOptions((previous) => (JSON.stringify(previous) === JSON.stringify(next) ? previous : next));
    setCaption(select.selectedOptions[0]?.text ?? 'Choisir…');
    const associated = select.labels?.[0]?.cloneNode(true) as HTMLElement | undefined;
    associated
      ?.querySelectorAll('.select-field, .choice-control, input, select, button')
      .forEach((element) => element.remove());
    setLabel(props['aria-label'] ?? associated?.textContent?.trim() ?? 'une option');
  };
  useLayoutEffect(sync);
  useLayoutEffect(() => {
    const form = native.current?.form;
    const reset = () => {
      setError('');
      requestAnimationFrame(sync);
    };
    form?.addEventListener('reset', reset);
    return () => form?.removeEventListener('reset', reset);
  }, []);
  function close() {
    setOpen(false);
  }
  function show(index = selected) {
    if (props.disabled) return;
    const enabled =
      options.find((option) => option.index === index && !option.disabled) ??
      options.find((option) => !option.disabled);
    if (!enabled) return;
    setActive(enabled.index);
    setOpen(true);
  }
  function choose(index: number) {
    const option = options[index];
    if (!option || option.disabled || !native.current) return;
    native.current.selectedIndex = index;
    native.current.dispatchEvent(new Event('change', { bubbles: true }));
    setCaption(option.label);
    close();
    trigger.current?.focus();
  }
  useLayoutEffect(() => {
    if (!open || !menu.current) return;
    const list = menu.current;
    list.showPopover();
    const place = () => {
      const bounds = trigger.current!.getBoundingClientRect();
      const width = Math.min(Math.max(bounds.width, 280), window.innerWidth - 24);
      list.style.width = `${width}px`;
      list.style.maxHeight = `${Math.max(48, Math.min(360, window.innerHeight - 24))}px`;
      const height = list.getBoundingClientRect().height;
      list.style.left = `${Math.max(12, Math.min(bounds.left, window.innerWidth - width - 12))}px`;
      const top =
        bounds.bottom + 8 + height <= window.innerHeight - 12
          ? bounds.bottom + 8
          : bounds.top - height - 8;
      list.style.top = `${Math.max(12, Math.min(top, window.innerHeight - height - 12))}px`;
    };
    place();
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) close();
    };
    window.addEventListener('pointerdown', outside);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      list.hidePopover();
      window.removeEventListener('pointerdown', outside);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);
  useLayoutEffect(() => {
    if (open) document.getElementById(`${id}-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active, id]);
  return (
    <span className="select-field" ref={root}>
      <select
        {...props}
        ref={native}
        tabIndex={-1}
        aria-hidden="true"
        onFocus={() => trigger.current?.focus()}
        onInvalid={(event) => {
          props.onInvalid?.(event);
          event.preventDefault();
          setError(event.currentTarget.validationMessage);
          trigger.current?.focus();
        }}
        onChange={(event) => {
          setCaption(event.currentTarget.selectedOptions[0]?.text ?? 'Choisir…');
          setError('');
          props.onChange?.(event);
        }}
      />
      <button
        type="button"
        className="select-trigger"
        ref={trigger}
        role="combobox"
        disabled={props.disabled}
        aria-label={`Choisir : ${label}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-required={props.required}
        aria-invalid={error ? true : props['aria-invalid']}
        aria-describedby={[
          `${id}-value`,
          props['aria-describedby'],
          error ? `${id}-error` : undefined,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        onClick={() => (open ? close() : show())}
        onBlur={() => close()}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && open) {
            event.preventDefault();
            event.stopPropagation();
            close();
          } else if (event.key === 'Tab') close();
          else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
            const enabled = options.filter((option) => !option.disabled);
            const current = enabled.findIndex((option) => option.index === active);
            const next =
              event.key === 'Home'
                ? enabled[0]
                : event.key === 'End'
                  ? enabled.at(-1)
                  : enabled[
                      (current + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) %
                        enabled.length
                    ];
            if (!open)
              show(
                event.key === 'Home'
                  ? enabled[0]?.index
                  : event.key === 'End'
                    ? enabled.at(-1)?.index
                    : selected,
              );
            else if (next) setActive(next.index);
          } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (open) choose(active);
            else show();
          } else if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
            event.preventDefault();
            const now = Date.now();
            search.current.text =
              (now - search.current.time < 700 ? search.current.text : '') +
              event.key.toLocaleLowerCase();
            search.current.time = now;
            const match = options.find(
              (option) =>
                !option.disabled &&
                option.label.toLocaleLowerCase().startsWith(search.current.text),
            );
            if (match) {
              if (!open) show(match.index);
              else setActive(match.index);
            }
          }
        }}
      >
        <span className="select-caption" id={`${id}-value`}>
          {caption || '\u00a0'}
        </span>
        <span className="select-chevron" aria-hidden="true" />
      </button>
      {error && (
        <span className="select-error" id={`${id}-error`} role="alert">
          {error}
        </span>
      )}
      {open && (
        <div
          className="select-menu"
          ref={menu}
          id={id}
          popover="manual"
          role="listbox"
          aria-label={label}
          onPointerDown={(event) => event.preventDefault()}
        >
          {options.map((option) => (
            <div
              key={option.index}
              id={`${id}-${option.index}`}
              role="option"
              aria-selected={selected === option.index}
              aria-disabled={option.disabled || undefined}
              className={active === option.index ? 'select-option active' : 'select-option'}
              onPointerMove={() => {
                if (!option.disabled) setActive(option.index);
              }}
              onClick={() => choose(option.index)}
            >
              <span>{option.label}</span>
              {selected === option.index && <Icon name="check" size={18} />}
            </div>
          ))}
        </div>
      )}
    </span>
  );
}
