import type {Metadata} from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Administración de solicitudes',
  robots: {index: false, follow: false},
};

export default function AdminLayout({children}: {children: React.ReactNode}) {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-6 py-12">
      <Link href="/" className="text-sm underline">
        Volver al sitio
      </Link>
      {children}
    </main>
  );
}
