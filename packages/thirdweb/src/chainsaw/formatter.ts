import {
  type BlockTag,
  type GetBlockReturnType,
  type Transaction,
  formatBlock,
  formatTransaction,
} from "viem";
import { numberToHex } from "../utils/encoding/hex.js";
import {
  type NFT,
  type ParseNFTOptions,
  parseNFT,
} from "../utils/nft/parseNft.js";
import type {
  ChainsawEvents,
  ChainsawInternalBlock,
  ChainsawInternalNFTs,
  ChainsawInternalTransactions,
  Events,
} from "./types.js";

/**
 * @internal
 */
export function formatChainsawBlock<TBlockTag extends BlockTag = "latest">(
  block?: ChainsawInternalBlock,
): GetBlockReturnType<undefined, false, TBlockTag> | undefined {
  if (!block) return;
  return formatBlock({
    number: numberToHex(block.blockNumber),
    hash: block.hash,
    nonce: numberToHex(BigInt(block.nonce)),
    baseFeePerGas: block.baseFeePerGas
      ? numberToHex(BigInt(block.baseFeePerGas))
      : undefined,
    timestamp: numberToHex(new Date(block.time).valueOf()),
    difficulty: numberToHex(BigInt(block.difficulty)),
    gasLimit: numberToHex(BigInt(block.gasLimit)),
    gasUsed: numberToHex(BigInt(block.gasUsed)),
  }) as GetBlockReturnType<undefined, false, TBlockTag>;
}

/**
 * @internal
 */
export function formatChainsawNFTs(nfts?: ChainsawInternalNFTs): NFT[] {
  if (!nfts) return [];
  return nfts.map((nft) => {
    const common = {
      tokenId: BigInt(nft.tokenId),
      owner: nft.ownerAddress || null,
      tokenUri: nft.uri,
    };
    let options: ParseNFTOptions;
    switch (nft.type) {
      case "ERC1155": {
        options = {
          ...common,
          type: "ERC1155" as const,
          supply: BigInt(0),
        };
        break;
      }
      case "ERC721": {
        options = {
          ...common,
          type: "ERC721" as const,
        };
        break;
      }
      default: {
        throw Error(`Unsupported NFT type ${nft.type}`);
      }
    }
    return parseNFT(
      {
        id: BigInt(nft.tokenId),
        uri: nft.uri,
        image: nft.image,
        description: nft.description,
        name: nft.name,
        // custom extra data
        contractAddress: nft.contractAddress,
        collectionName: nft.collectionName,
        chainId: nft.chainId,
        balance: BigInt(nft.balance || 1),
        ...(nft.imageData && { imageData: nft.imageData }),
      },
      options,
    );
  });
}

/**
 * @internal
 */
export function formatChainsawTransactions(
  txs?: ChainsawInternalTransactions,
): Transaction[] {
  if (!txs) return [];
  return txs.map((tx) => {
    const common = {
      blockHash: tx.blockHash,
      blockNumber: numberToHex(BigInt(tx.blockNumber)),
      chainId: numberToHex(tx.chainId),
      gas: tx.gasUsed ? numberToHex(BigInt(tx.gasUsed)) : undefined,
      nonce: numberToHex(BigInt(tx.nonce)),
      hash: tx.hash,
      to: tx.to,
      from: tx.from,
      transactionIndex: numberToHex(BigInt(tx.index)),
      value: numberToHex(BigInt(tx.value)),
      input: tx.data,
      blockTime: new Date(tx.time),
      decoded: tx.decoded,
    };
    if (tx.type === 0) {
      return formatTransaction({
        ...common,
        gasPrice: numberToHex(BigInt(tx.gasPrice)),
        maxPriorityFeePerGas: undefined,
        type: "0x0",
      });
    }
    if (tx.type === 1) {
      return formatTransaction({
        ...common,
        gasPrice: numberToHex(BigInt(tx.gasPrice)),
        maxPriorityFeePerGas: undefined,
        type: "0x1",
      });
    }
    if (tx.type === 2) {
      return formatTransaction({
        ...common,
        gasPrice: undefined,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas
          ? numberToHex(BigInt(tx.maxPriorityFeePerGas))
          : undefined,
        type: "0x2",
      });
    }
    return formatTransaction({
      ...common,
      gasPrice: undefined,
      maxPriorityFeePerGas: tx.maxPriorityFeePerGas
        ? numberToHex(BigInt(tx.maxPriorityFeePerGas))
        : undefined,
      type: "0x3",
    });
  });
}

/**
 * @internal
 */
export function formatChainsawEvents(events?: Events): ChainsawEvents {
  if (!events?.length) return [];
  return events.map((event) => ({
    ...event,
    count: BigInt(event.count),
  }));
}
