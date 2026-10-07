import { useLayoutEffect, useRef, useState, type ComponentProps } from 'react';

// Le contrôle natif conserve les options, la validation et la navigation clavier.
// Son libellé visible peut s’étendre sur plusieurs lignes, contrairement au select natif fermé.
export default function Select(props: ComponentProps<'select'>) {
  const ref = useRef<HTMLSelectElement>(null);
  const [caption, setCaption] = useState('');
  useLayoutEffect(() => {
    setCaption(ref.current?.selectedOptions[0]?.text ?? 'Choisir…');
  });
  return (
    <span className="select-field">
      <span className="select-caption" aria-hidden="true">
        {caption || '\u00a0'}
      </span>
      <span className="select-chevron" aria-hidden="true" />
      <select
        {...props}
        ref={ref}
        onChange={(event) => {
          setCaption(event.currentTarget.selectedOptions[0]?.text ?? 'Choisir…');
          props.onChange?.(event);
        }}
      />
    </span>
  );
}
