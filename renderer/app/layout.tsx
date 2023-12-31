"use client";

import { Toaster } from "react-hot-toast";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/fiy5ksm.css" />
      </head>
      <body>
        <main>{children}</main>
        <div className="absolute left-0">
          <Toaster
            toastOptions={{
              style: {
                backgroundColor: "#212121",
                color: "var(--primary)",
              },
            }}
          />
        </div>
      </body>
    </html>
  );
}
