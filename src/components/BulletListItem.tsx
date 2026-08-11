import type {ReactNode} from 'react';

export function BulletListItem({children}: {children: ReactNode}) {
  return (
    <li>
      <span className="copyable-list-bullet">{'•\u00a0'}</span>
      <span>{children}</span>
    </li>
  );
}
