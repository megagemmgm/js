import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "verify" function.
 */
export type VerifyParams = {
  req: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "req";
    components: [
      { type: "address"; name: "to" },
      { type: "address"; name: "royaltyRecipient" },
      { type: "uint256"; name: "royaltyBps" },
      { type: "address"; name: "primarySaleRecipient" },
      { type: "string"; name: "uri" },
      { type: "uint256"; name: "price" },
      { type: "address"; name: "currency" },
      { type: "uint128"; name: "validityStartTimestamp" },
      { type: "uint128"; name: "validityEndTimestamp" },
      { type: "bytes32"; name: "uid" },
    ];
  }>;
  signature: AbiParameterToPrimitiveType<{ type: "bytes"; name: "signature" }>;
};

/**
 * Calls the "verify" function on the contract.
 * @param options - The options for the verify function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { verify } from "thirdweb/extensions/erc721";
 *
 * const result = await verify({
 *  req: ...,
 *  signature: ...,
 * });
 *
 * ```
 */
export async function verify(options: BaseTransactionOptions<VerifyParams>) {
  return readContract({
    contract: options.contract,
    method: [
      "0xde903774",
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
              type: "string",
              name: "uri",
            },
            {
              type: "uint256",
              name: "price",
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
      [
        {
          type: "bool",
          name: "success",
        },
        {
          type: "address",
          name: "signer",
        },
      ],
    ],
    params: [options.req, options.signature],
  });
}
