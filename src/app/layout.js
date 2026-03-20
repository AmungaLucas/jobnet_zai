import { AuthProvider } from '@/contexts/AuthContext';
import { SyncProvider } from '@/contexts/SyncContext';
import { AuditProvider } from '@/contexts/AuditContext';
import ConnectionStatus from '@/components/sync/ConnectionStatus';
import './globals.css';

export const metadata = {
  title: 'Dashboard Auth System',
  description: 'Next.js authentication with multi-device support',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        <AuthProvider>
          <SyncProvider>
            <AuditProvider>
              {children}
              <ConnectionStatus />
            </AuditProvider>
          </SyncProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
