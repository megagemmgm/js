import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "mintWithSignature" function.
 */
export type MintWithSignatureParams = {
  req: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "req";
    components: [
      { type: "address"; name: "to" },
      { type: "address"; name: "royaltyRecipient" },
      { type: "uint256"; name: "royaltyBps" },
      { type: "address"; name: "primarySaleRecipient" },
      { type: "uint256"; name: "tokenId" },
      { type: "string"; name: "uri" },
      { type: "uint256"; name: "quantity" },
      { type: "uint256"; name: "pricePerToken" },
      { type: "address"; name: "currency" },
      { type: "uint128"; name: "validityStartTimestamp" },
      { type: "uint128"; name: "validityEndTimestamp" },
      { type: "bytes32"; name: "uid" },
    ];
  }>;
  signature: AbiParameterToPrimitiveType<{ type: "bytes"; name: "signature" }>;
};

/**
 * Calls the "mintWithSignature" function on the contract.
 * @param options - The options for the "mintWithSignature" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { mintWithSignature } from "thirdweb/extensions/erc1155";
 *
 * const transaction = mintWithSignature({
 *  req: ...,
 *  signature: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function mintWithSignature(
  options: BaseTransactionOptions<MintWithSignatureParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x98a6e993",
      [
        {
          type: "tuple",
          name: "req",
          components: [
            {
              type: "address",
              name: "to",
            },
            {
              type: "address",
              name: "royaltyRecipient",
            },
            {
              type: "uint256",
              name: "royaltyBps",
            },
            {
              type: "address",
              name: "primarySaleRecipient",
            },
            {
              type: "uint256",
              name: "tokenId",
            },
            {
              type: "string",
              name: "uri",
            },
            {
              type: "uint256",
              name: "quantity",
            },
            {
              type: "uint256",
              name: "pricePerToken",
            },
            {
              type: "address",
              name: "currency",
            },
            {
              type: "uint128",
              name: "validityStartTimestamp",
            },
            {
              type: "uint128",
              name: "validityEndTimestamp",
            },
            {
              type: "bytes32",
              name: "uid",
            },
          ],
        },
        {
          type: "bytes",
          name: "signature",
        },
      ],
      [],
    ],
    params: [options.req, options.signature],
  });
}
