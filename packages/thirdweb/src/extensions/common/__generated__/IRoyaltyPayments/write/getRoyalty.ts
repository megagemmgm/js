import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getRoyalty" function.
 */
export type GetRoyaltyParams = {
  tokenAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "tokenAddress";
  }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "value" }>;
};

/**
 * Calls the "getRoyalty" function on the contract.
 * @param options - The options for the "getRoyalty" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```
 * import { getRoyalty } from "thirdweb/extensions/common";
 *
 * const transaction = getRoyalty({
 *  tokenAddress: ...,
 *  tokenId: ...,
 *  value: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function getRoyalty(options: BaseTransactionOptions<GetRoyaltyParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xf533b802",
      [
        {
          type: "address",
          name: "tokenAddress",
        },
        {
          type: "uint256",
          name: "tokenId",
        },
        {
          type: "uint256",
          name: "value",
        },
      ],
      [
        {
          type: "address[]",
          name: "recipients",
        },
        {
          type: "uint256[]",
          name: "amounts",
        },
      ],
    ],
    params: [options.tokenAddress, options.tokenId, options.value],
  });
}
