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

const NFTProviderContext = /* @__PURE__ */ createContext<
  NFTProviderProps | undefined
>(undefined);

/**
 * A React context provider component that supplies NFT-related data to its child components.
 *
 * This component serves as a wrapper around the `NFTProviderContext.Provider` and passes
 * the provided NFT data down to all of its child components through the context API.
 *
 *
 * @component
 * @param {React.PropsWithChildren<NFTProviderProps>} props - The props for the NFT provider
 *
 * @example
 * ```tsx
 * import { getContract } from "thirdweb";
 * import { NFT } from "thirdweb/react";
 *
 * const contract = getContract({
 *   address: "0x...",
 *   chain: ethereum,
 *   client: yourThirdwebClient,
 * });
 *
 * <NFT contract={contract} tokenId={0n}>
 *   <Suspense fallback={"Loading media..."}>
 *     <NFT.Media />
 *   </Suspense>
 * </NFT>
 * ```
 */
export function NFT(props: React.PropsWithChildren<NFTProviderProps>) {
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
  if (!ctx) {
    throw new Error(
      "NFTProviderContext not found. Make sure you are using NFT.Media, NFT.Description, etc. inside a <NFT /> component",
    );
  }
  return ctx;
}

export type NFTMediaProps = Omit<
  MediaRendererProps,
  "src" | "poster" | "client"
>;

/**
 * This component fetches and displays an NFT's media. It uses thirdweb MediaRenderer under the hood
 * so you can style it just like how you would style a MediaRenderer.
 * @returns A MediaRenderer component
 *
 * Since this component has an internal loading state (for when the NFT media is being fetched),
 * you must wrapped it with React.Suspense to make it work.
 * 
 * @component
 * @example
 * ### Basic usage
 * ```tsx
 * import { getContract } from "thirdweb";
 * import { NFT } from "thirdweb/react";
 *
 * const nftContract = getContract({
 *   address: "0x...",
 *   chain: ethereum,
 *   client: yourThirdwebClient,
 * });
 *
 * <NFT contract={nftContract} tokenId={0n}>
 *   This will show the media for tokenId #0 from the `nftContract` collection
 *   <Suspense fallback={"Loading media..."}>
 *     <NFT.Media />
 *   </Suspense>
 * </NFT>
 * ```
 */
NFT.Media = (props: NFTMediaProps) => {
  const { contract, tokenId } = useNFTContext();
  const mediaQuery = useSuspenseQuery({
    queryKey: [
      "nft-media",
      contract.chain.id,
      contract.address,
      tokenId.toString(),
    ],
    queryFn: () => getNFTMedia({ contract, tokenId }),
  });
  const animation_url = mediaQuery.data?.animation_url;
  const image = mediaQuery.data?.image || mediaQuery.data?.image_url;

  return (
    <MediaRenderer
      client={contract.client}
      src={animation_url || image}
      poster={image}
      {...props}
    />
  );
};

/**
 * @internal
 */
export async function getNFTMedia(
  options: NFTProviderProps,
): Promise<NFTMetadata> {
  const nft = await Promise.allSettled([
    getNFT721(options),
    getNFT1155(options),
  ]).then(([possibleNFT721, possibleNFT1155]) => {
    // getNFT extension always return an NFT object
    // so we need to check if the tokenURI exists
    if (
      possibleNFT721.status === "fulfilled" &&
      possibleNFT721.value.tokenURI
    ) {
      return possibleNFT721.value;
    }
    if (
      possibleNFT1155.status === "fulfilled" &&
      possibleNFT1155.value.tokenURI
    ) {
      return possibleNFT1155.value;
    }
    throw new Error("Failed to load NFT metadata");
  });
  return nft.metadata;
}
