'use client';

import { useEffect, useRef, useState } from 'react';

interface EditableTextProps {
  value: string;
  className?: string;
  disabled?: boolean;
}

export default function EditableText({ value, className, disabled }: EditableTextProps) {
  const [text, setText] = useState<string>(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  return (
    <div
      ref={ref}
      contentEditable={!disabled}
      suppressContentEditableWarning
      className={className}
      onInput={(e) => setText((e.target as HTMLDivElement).innerText)}
      onBlur={(e) => setText((e.target as HTMLDivElement).innerText)}
    >
      {text}
    </div>
  );
}


