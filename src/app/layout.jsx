import './globals.css';

export const metadata = {
  title: 'THE CAFE VINCERO | POS',
  description: 'A thoughtful cafe experience, managed beautifully.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
