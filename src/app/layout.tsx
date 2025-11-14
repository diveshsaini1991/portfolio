import "./globals.css";

export const metadata = {
  title: "Divesh Saini | Portfolio",
  description: "Full Stack Developer Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-neutral-950 text-white transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
