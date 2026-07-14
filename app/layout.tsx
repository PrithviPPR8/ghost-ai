import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { EditorWorkspaceLayout } from "@/components/editor/editor-workspace-layout";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ghost AI",
  description: "A collaborative system design workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <EditorWorkspaceLayout>{children}</EditorWorkspaceLayout>
      </body>
    </html>
  );
}
