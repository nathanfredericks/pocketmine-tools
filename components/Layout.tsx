'use client';
import React, { PropsWithChildren } from 'react';
import Link from 'next/link';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import AppSidebar from './AppSidebar';
type LayoutProps = {
  title: string | null;
  showNav: boolean;
};
export default function Layout({
  title,
  children,
  showNav = true,
}: PropsWithChildren<LayoutProps>) {
  return (
    <>
      <title>
        {title ? `${title} - PocketMine Tools` : 'PocketMine Tools'}
      </title>
      {showNav ? (
        <SidebarProvider
          style={{ '--header-height': 'calc(var(--spacing) * 12)' } as React.CSSProperties}
        >
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
              <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
              </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 pt-4 lg:px-6">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      ) : (
        <main className="p-6">
          {children}
        </main>
      )}
    </>
  );
}
