"use client";

import { createContext, useContext } from "react";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { tokenURI } from "../../../../../extensions/erc721/__generated__/IERC721A/read/tokenURI.js";
import { uri } from "../../../../../extensions/erc1155/__generated__/IERC1155/read/uri.js";
import { useReadContract } from "../../../../../react/core/hooks/contract/useReadContract.js";
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
  return ctx;
}

export type NFTMediaProps = MediaRendererProps & NFTProviderProps;

NFT.Media = (props: NFTProviderProps) => {
  const context = useNFTContext();
  const contract = props.contract || context;
  const mediaQuery = useReadContract(getNFTMedia, {
    contract,
    tokenId: props.tokenId,
  });
  const animation_url = mediaQuery.data?.animation_url;
  const image = mediaQuery.data?.image;
  return (
    <MediaRenderer
      client={contract.client}
      src={animation_url || image}
      poster={image}
      {...props}
    />
  );
};

async function getNFTMedia(options: NFTProviderProps): Promise<NFTMetadata> {
  const { contract, tokenId } = options;
  /**
   * No need to check whether a token is ERC721 or 1155 since it will take the
   * same number of RPC requests, and will be slower. Instead just call both
   * `tokenURI` and `uri`, then use the one that's available.
   */
  const [_tokenURI, _uri, { fetchTokenMetadata }] = await Promise.all([
    tokenURI({ contract, tokenId }).catch(() => ""),
    uri({ contract, tokenId }).catch(() => ""),
    import("../../../../../utils/nft/fetchTokenMetadata.js"),
  ]);
  const url = _tokenURI || _uri;
  if (!url) {
    throw new Error(
      `Could not get the URI for tokenId: ${tokenId}. Make sure the contract has the proper method to fetch it.`,
    );
  }
  const metadata = await fetchTokenMetadata({
    client: contract.client,
    tokenId,
    tokenUri: url,
  });

  return metadata;
}
