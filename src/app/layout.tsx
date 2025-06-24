import './globals.css';
import Sidebar from './Sidebar';
import LayoutContent from './LayoutContent';

export const metadata = {
  title: 'BandC App',
  description: 'RH, planning, gestion',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
