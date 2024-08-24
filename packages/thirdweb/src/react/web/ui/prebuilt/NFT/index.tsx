"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { getNFT as getNFT721 } from "../../../../../extensions/erc721/read/getNFT.js";
import { getNFT as getNFT1155 } from "../../../../../extensions/erc1155/read/getNFT.js";
import type { NFTMetadata } from "../../../../../utils/nft/parseNft.js";
import { MediaRenderer } from "../../MediaRenderer/MediaRenderer.js";
import type { MediaRendererProps } from "../../MediaRenderer/types.js";

export type NFTProviderProps = {
  contract: ThirdwebContract;
  tokenId: bigint;
};

export const NFTProviderContext = /* @__PURE__ */ createContext<
  NFTProviderProps | undefined
>(undefined);

export function NFTContext(props: React.PropsWithChildren<NFTProviderProps>) {
  return (
    <NFTProviderContext.Provider value={props}>
      {props.children}
    </NFTProviderContext.Provider>
  );
}

/**
 * @internal
 */
function useNFTContext() {
  const ctx = useContext(NFTProviderContext);
  return ctx;
}

export type NFTMediaProps = NFTProviderProps &
  Omit<MediaRendererProps, "src" | "poster" | "client">;

export const Media = (props: NFTProviderProps) => {
  const context = useNFTContext();
  const contract = props.contract || context;
  const mediaQuery = useSuspenseQuery({
    queryKey: [
      "nft-media",
      contract.chain.id,
      contract.address,
      props.tokenId.toString(),
    ],
    queryFn: () => getNFTMedia(props),
  });
  const animation_url = mediaQuery.data?.animation_url;
  const image = mediaQuery.data?.image;
  const image_url = mediaQuery.data?.image_url;
  return (
    <MediaRenderer
      client={contract.client}
      src={animation_url || image || image_url}
      poster={image}
      {...props}
    />
  );
};

async function getNFTMedia(options: NFTProviderProps): Promise<NFTMetadata> {
  const nft = await Promise.allSettled([
    getNFT721(options),
    getNFT1155(options),
  ]).then(([possibleNFT721, possibleNFT1155]) => {
    if (possibleNFT721.status === "fulfilled") {
      return possibleNFT721.value;
    }
    if (possibleNFT1155.status === "fulfilled") {
      return possibleNFT1155.value;
    }
    throw new Error("Failed to load NFT metadata");
  });
  return nft.metadata;
}
