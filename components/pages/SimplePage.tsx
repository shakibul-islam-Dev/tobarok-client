import type { ReactNode } from "react";
import Breadcrumb, { type Crumb } from "@/components/ui/Breadcrumb";

interface SimplePageProps {
  title: string;
  crumbs?: Crumb[];
  children: ReactNode;
}

export default function SimplePage({ title, crumbs = [], children }: SimplePageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb items={crumbs} />
      <h1 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
        {title}
      </h1>
      <div className="mt-6 space-y-6 text-neutral-600 sm:text-[15px]">
        {children}
      </div>
    </div>
  );
}
