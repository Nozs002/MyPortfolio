import './globals.css';
import { NotificationProvider } from '../lib/context/NotificationContext';

export const metadata = {
  title: 'Project Template - Premium',
  description: 'Built with Next.js, Vanilla CSS, and React Three Fiber',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>{children}</NotificationProvider>
      </body>
    </html>
  );
}
