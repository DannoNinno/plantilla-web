import type {LayoutProps} from '@/domain/types/ui';

export default function Template({children}: LayoutProps) {
  return <div className="animate-pagina">{children}</div>;
}
