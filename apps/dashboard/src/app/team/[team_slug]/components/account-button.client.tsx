"use client";

import { Button } from "@/components/ui/button";
import type { ThirdwebClient } from "thirdweb";
import type { WalletId } from "thirdweb/wallets";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LogOutIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { cn } from "../../../../@/lib/utils";

export function AccountButton(props: {
  client: ThirdwebClient;
  address: string | undefined;
  walletId: WalletId | undefined;
  email: string | undefined;
  logout: () => void;
  connectButton: React.ReactNode;
}) {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="rounded-full !p-0 !h-auto size-10"
          variant="ghost"
        >
          {/* TODO - replace with account image */}
          <div className="size-10 rounded-full bg-link-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0 w-[300px] rounded-xl" align="end">
        <div className="p-4 pb-5 border-b">
          <p className="text-sm text-muted-foreground">{props.email}</p>
          <div className="h-2" />
          <div className="[&>button]:!w-full">{props.connectButton}</div>
        </div>

        <div className="flex flex-col gap-4 px-4 py-5">
          <Link
            href="/account"
            className="text-muted-foreground text-sm hover:text-foreground"
          >
            Account Settings
          </Link>

          <div className="flex justify-between gap-2 items-center">
            <p className="text-muted-foreground text-sm">Theme</p>

            <div className="ml-auto flex items-center border px-2 py-0.5 rounded-lg gap-1">
              <Button
                size="icon"
                onClick={() => setTheme("light")}
                variant="ghost"
                className={cn(
                  "!p-1 !h-auto !w-auto",
                  theme === "light" ? "opacity-100" : "opacity-30",
                )}
              >
                <Sun className="size-4" />
              </Button>
              <Button
                size="icon"
                onClick={() => setTheme("dark")}
                variant="ghost"
                className={cn(
                  "!p-1 !h-auto !w-auto",
                  theme === "dark" ? "opacity-100" : "opacity-30",
                )}
              >
                <Moon className="size-4" />
              </Button>
            </div>
          </div>

          <Link
            href="/team"
            className="text-muted-foreground text-sm hover:text-foreground"
          >
            Home Page
          </Link>

          <Button
            variant="link"
            className="gap-2 py-1 text-start justify-start text-muted-foreground px-0 !h-auto hover:!no-underline hover:text-foreground"
            onClick={props.logout}
          >
            <LogOutIcon className="size-4" />
            Log Out
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
