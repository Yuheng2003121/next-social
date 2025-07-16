// app/providers.tsx
"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { AntdRegistry } from "@ant-design/nextjs-registry";


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <AntdRegistry>
        {children}
      </AntdRegistry>
    </ClerkProvider>
  );
}
