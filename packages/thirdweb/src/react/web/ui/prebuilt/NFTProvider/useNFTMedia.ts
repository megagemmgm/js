import { useQuery } from "@tanstack/react-query";
import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { getContract } from "../../../../../contract/contract.js";
import { punkImageSvg } from "../../../../../extensions/cryptopunks/__generated__/CryptoPunks/read/punkImageSvg.js";
import { tokenURI } from "../../../../../extensions/erc721/__generated__/IERC721A/read/tokenURI.js";
import { uri } from "../../../../../extensions/erc1155/__generated__/IERC1155/read/uri.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

export function useNFTMedia(props: {
  contractAddress?: string;
  chain?: Chain;
  client?: ThirdwebClient;
  tokenId?: bigint;
  disabled?: boolean;
  overrideMediaField?: string;
}) {
  const {
    contractAddress,
    chain,
    client,
    tokenId,
    disabled,
    overrideMediaField,
  } = props;
  return useQuery({
    queryKey: ["nft-media", chain?.id, contractAddress, tokenId?.toString()],
    queryFn: async (): Promise<string | undefined> => {
      if (!contractAddress) {
        throw new Error("Error from useNFTMedia: Missing contract address");
      }
      if (!chain) {
        throw new Error("Error from useNFTMedia: Missing chain");
      }
      if (!tokenId) {
        throw new Error("Error from useNFTMedia: Missing tokenId");
      }
      if (!client) {
        throw new Error("Error from useNFTMedia: Missing tokenId");
      }
      const contract = getContract({
        address: contractAddress,
        chain,
        client,
      });
      return getNFTMedia({ contract, tokenId, client, overrideMediaField });
    },
    enabled: !disabled && !!contractAddress && !!chain && !!client && !!tokenId,
  });
}

/**
 * @internal
 */
export async function getNFTMedia(
  options: BaseTransactionOptions<{
    tokenId: bigint;
    client: ThirdwebClient;
    overrideMediaField?: string;
  }>,
): Promise<string> {
  const { contract, tokenId, client, overrideMediaField } = options;
  /**
   * No need to check whether a token is ERC721 or 1155. Because there are
   * other standards of NFT beside 721 and 1155 (404, onchain CryptoPunks etc.).
   * So we run all possible uri-fetching methods at once and use the one that's available
   */
  const [_tokenURI, _uri, imageBase64, { fetchTokenMetadata }] =
    await Promise.all([
      tokenURI({ contract, tokenId }).catch(() => ""),
      uri({ contract, tokenId }).catch(() => ""),
      punkImageSvg({ contract, index: Number(tokenId) }).catch(() => ""),
      import("../../../../../utils/nft/fetchTokenMetadata.js"),
    ]);

  // Support for onchain CryptoPunks contract (or similar ones)
  if (imageBase64?.startsWith("data:image/")) {
    const dataStart = imageBase64.indexOf(",") + 1;
    return (
      imageBase64.slice(0, dataStart) +
        encodeURIComponent(imageBase64.slice(dataStart)) ?? ""
    );
  }
  const url = _tokenURI || _uri;
  if (!url) {
    throw new Error(
      `Could not get the URI for tokenId: ${tokenId}. Make sure the contract has the proper method to fetch it.`,
    );
  }
  const metadata = await fetchTokenMetadata({ client, tokenId, tokenUri: url });
  if (overrideMediaField) {
    if (typeof metadata[overrideMediaField] !== "string") {
      throw new Error(
        `Invalid value for ${overrideMediaField} - expected a string`,
      );
    }
    return metadata[overrideMediaField] ?? "";
  }
  return metadata.animation_url || metadata.image || "";
}
