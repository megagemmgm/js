"use client";

import { createContext, useContext } from "react";
import { useReadContract } from "src/exports/react.native.js";
import { isERC721 } from "src/extensions/erc721/read/isERC721.js";
import { totalSupply } from "src/extensions/erc1155/__generated__/IERC1155/read/totalSupply.js";
import { isERC1155 } from "src/extensions/erc1155/read/isERC1155.js";
import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../../../contract/contract.js";
import { useNFTMedia } from "./useNFTMedia.js";

export type NFTProviderSetup = {
  contract: ThirdwebContract;
  isLoading: boolean;
  /**
   * The media URI of the NFT
   */
  media?: string;
  contractType?: "ERC721" | "ERC1155";
  /**
   * The total supply of the token. Only aplpicable to ERC1155
   * Defaults to 1n for ERC721
   */
  supply?: bigint;
};

type NFTProviderProps = {
  contractAddress: string;
  chain: Chain;
  client: ThirdwebClient;
  tokenId: bigint;
  overrideMediaField?: string;
};

export const NFTProviderContext = /* @__PURE__ */ createContext<
  NFTProviderSetup | undefined
>(undefined);

export function NFTProvider(props: React.PropsWithChildren<NFTProviderProps>) {
  const { contractAddress, chain, client, tokenId, overrideMediaField } = props;
  const contract = getContract({
    address: contractAddress,
    chain,
    client,
  });
  const _isERC721 = useReadContract(isERC721, { contract });
  const _isERC1155 = useReadContract(isERC1155, { contract });
  const supply = useReadContract(totalSupply, {
    contract,
    id: tokenId,
    queryOptions: { enabled: _isERC1155.data },
  });
  const nftMediaQuery = useNFTMedia({
    contractAddress,
    chain,
    client,
    tokenId,
    overrideMediaField,
  });

  const isLoading = _isERC1155.isLoading || _isERC721.isLoading;
  const values: NFTProviderSetup = {
    contract,
    contractType: _isERC721 ? "ERC721" : _isERC1155 ? "ERC1155" : undefined,
    isLoading,
    supply: _isERC721.data ? 1n : _isERC1155.data ? supply.data : undefined,
    media: nftMediaQuery.data,
  };
  return (
    <NFTProviderContext.Provider value={values}>
      {props.children}
    </NFTProviderContext.Provider>
  );
}

/**
 * @internal
 */
export function useNFTProviderContext() {
  const ctx = useContext(NFTProviderContext);

  // this context is optional - we don't wanna throw here?

  // if (!ctx) {
  //   throw new Error(
  //     "useNFTProviderContext must be used within a <NFTProvider />",
  //   );
  // }
  return ctx;
}
