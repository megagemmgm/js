"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { ThirdwebClient } from "thirdweb";
import { resolveAvatar, resolveName } from "thirdweb/extensions/ens";
import type { WalletId } from "thirdweb/wallets";
import { ActiveWalletLogo } from "./active-wallet-logo";

export function AccountButton(props: {
  client: ThirdwebClient;
  address: string | undefined;
  walletId: WalletId | undefined;
}) {
  const ensAvatar = useQuery({
    queryKey: ["ens-avatar", props.address],
    queryFn: async () => {
      if (!props.address) {
        throw new Error("No wallet connected");
      }
      const ensName = await resolveName({
        client: props.client,
        address: props.address,
      });
      if (!ensName) {
        return null;
      }
      return resolveAvatar({
        client: props.client,
        name: ensName,
      });
    },
    enabled: !!props.address,
  });

  let content: React.ReactNode;
  if (ensAvatar.data) {
    content = (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ensAvatar.data}
          className="h-full w-full rounded-full"
          alt=""
        />
        <ActiveWalletLogo
          className="size-5 rounded-full absolute top-0 right-0 translate-x-2 -translate-y-2 border border-card"
          walletId={props.walletId}
        />
      </>
    );
  } else {
    content = (
      <ActiveWalletLogo
        className="h-full w-full rounded-full"
        walletId={props.walletId}
      />
    );
  }

  return (
    <Button
      size="icon"
      className="rounded-full relative hover:outline-primary hover:outline hover:outline-2 hover:outline-offset-2"
      variant="ghost"
    >
      {content}
    </Button>
  );
}
