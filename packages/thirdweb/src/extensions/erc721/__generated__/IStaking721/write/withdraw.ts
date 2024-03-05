import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "withdraw" function.
 */
export type WithdrawParams = {
  tokenIds: AbiParameterToPrimitiveType<{
    type: "uint256[]";
    name: "tokenIds";
  }>;
};

/**
 * Calls the "withdraw" function on the contract.
 * @param options - The options for the "withdraw" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { withdraw } from "thirdweb/extensions/erc721";
 *
 * const transaction = withdraw({
 *  tokenIds: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function withdraw(options: BaseTransactionOptions<WithdrawParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x983d95ce",
      [
        {
          type: "uint256[]",
          name: "tokenIds",
        },
      ],
      [],
    ],
    params: [options.tokenIds],
  });
}
