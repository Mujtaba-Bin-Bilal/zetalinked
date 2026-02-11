import "./globals.css";

export const metadata = {
  title: "zetaLinked",
  description: "Strategic Archive"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <nav>
            <a href="/">Home</a>
            <a href="/projects">Portfolio</a>
            <a href="/logbook">Logbook</a>
            <a href="/admin">Admin</a>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
