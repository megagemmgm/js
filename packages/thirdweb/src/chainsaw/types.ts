import type { Hex } from "../utils/encoding/hex.js";
import type { Prettify } from "../utils/type-utils.js";

export type ChainsawResponse<T = unknown> = {
  data?: T;
  error?: string;
  page?: number;
};

export type ChainsawPagingParams = {
  /**
   * Number of items per page
   */
  pageSize?: number;
  /**
   * Page number
   */
  page?: number;
};

export type ChainsawInternalBlock = {
  hash: Hex;
  blockNumber: number;
  time: string;
  parentHash: Hex;
  miner: Hex;
  nonce: Hex;
  baseFeePerGas?: string;
  difficulty: string;
  gasLimit: string;
  gasUsed: string;
  chainId: number;
  version: number;
};

export type Event = {
  name: string;
  count: string;
  time?: string;
  chainId?: number;
  contractAddress?: Hex;
  args?: string;
};

export type Events = Event[];

export type ChainsawEvent = Prettify<
  Omit<Event, "count"> & {
    count: bigint;
  }
>;

export type ChainsawEvents = ChainsawEvent[];

export type DecodedTransaction = {
  functionName: string;
  args?: string;
};

export type ChainsawInternalTransaction = {
  chainId: number;
  time: string;
  to: Hex;
  from: Hex;
  hash: Hex;
  index: number;
  blockNumber: number;
  blockHash: Hex;
  data?: Hex;
  value: string;
  gasLimit: string;
  gasPrice: string;
  gasUsed?: string;
  maxPriorityFeePerGas?: string;
  success: boolean;
  type: number;
  decoded?: DecodedTransaction;
  nonce: string;
};

export type ChainsawInternalTransactions = ChainsawInternalTransaction[];

export type ChainsawInternalNFT = {
  chainId: number;
  contractAddress: Hex;
  tokenId: string;
  latestTransferTime: string;
  collectionName: string;
  uri: string;
  ownerAddress?: Hex;
  balance?: string;
  type: string;
  image?: string;
  imageData?: string;
  name?: string;
  description?: string;
};

export type ChainsawInternalNFTs = ChainsawInternalNFT[];
