import type { ThirdwebContract } from "../../contract/contract.js";
import { getClientFetch } from "../../utils/fetch.js";
import type { NFT } from "../../utils/nft/parseNft.js";
import type { Prettify } from "../../utils/type-utils.js";
import { formatIndexerNFTs } from "../formatter.js";
import { addRequestPagination } from "../paging.js";
import type {
  IndexerInternalNFT,
  IndexerPagingParams,
  IndexerResponse,
} from "../types.js";
import { getNftsByCollectionEndpoint } from "../urls.js";

export type GetNFTsByCollectionParams = Prettify<
  {
    /**
     * NFT collection contract
     */
    contract: ThirdwebContract;
  } & IndexerPagingParams
>;

export type GetNFTsByCollectionResult = {
  nfts: NFT[];
};

/**
 * @beta
 *
 * Get NFTs for a collection
 *
 * @param {GetNFTsByCollectionParams} params
 * @returns {Promise<GetNFTsByCollectionResult>}
 *
 * @example
 * ```ts
 * import { createThirdwebClient, defineChain, getNFTsByCollection, getContract } from "thirdweb";
 *
 * const contract = getContract({
 *  address: "0x...",
 *  chain: defineChain(1)
 * });
 * const nfts = await getNFTsByCollection({
 *  contract,
 * });
 * ```
 */
export async function getNFTsByCollection(
  params: GetNFTsByCollectionParams,
): Promise<GetNFTsByCollectionResult> {
  try {
    const url = getEndpointUrl(params);
    const response = await getClientFetch(params.contract.client)(
      url.toString(),
    );
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`Failed to get NFTs: ${response.status}`);
    }

    const data: IndexerResponse<IndexerInternalNFT[]> = await response.json();
    if (data.error || !data.data) {
      throw new Error(data.error || "Failed to get NFTs");
    }
    return {
      nfts: formatIndexerNFTs(data.data),
    };
  } catch (error) {
    throw new Error("Failed to get NFTs.", { cause: error });
  }
}

function getEndpointUrl(params: GetNFTsByCollectionParams): URL {
  const url = getNftsByCollectionEndpoint();
  url.searchParams.append("contractAddresses", params.contract.address);
  url.searchParams.append("chainIds", params.contract.chain.id.toString());
  return addRequestPagination(url, params);
}
