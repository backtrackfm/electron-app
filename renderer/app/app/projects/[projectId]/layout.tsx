"use client";

import Playbar from "@/components/playbar";
import { createContext, useState } from "react";

export type PlaybarContextValue = {
  playbarURL: string;
  setPlaybarURL(newURL: string): void;
};
export const PlaybarContext = createContext<PlaybarContextValue | null>(null);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [playbarURL, setPlaybarURL] = useState<string | null>(null);

  return (
    <PlaybarContext.Provider value={{ playbarURL, setPlaybarURL }}>
      <div className="min-h-screen">
        {children}
        <div className="relative">
          <Playbar audioURL={playbarURL} />
        </div>
      </div>
    </PlaybarContext.Provider>
  );
}
