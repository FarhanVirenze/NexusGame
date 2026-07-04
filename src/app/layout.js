import "./globals.css";

export const metadata = {
  title: "Nexus Game",
  description: "Radiant Gaming Hub",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&family=Sora:wght@600;700;800&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-background min-h-screen flex flex-col antialiased relative">
        {children}
      </body>
    </html>
  );
}
