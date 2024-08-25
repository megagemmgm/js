"use client";

import { type TabLink, TabLinks } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";

export default function TeamTabs(props: {
  links: Omit<TabLink, "isActive">[];
}) {
  const pathname = usePathname();
  return (
    <TabLinks
      tabContainerClassName="px-4 lg:px-6"
      links={props.links.map((l, i) => ({
        ...l,
        isActive: pathname ? l.href === pathname : i === 0,
      }))}
    />
  );
}
