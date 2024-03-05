import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "revokeRole" function.
 */
export type RevokeRoleParams = {
  role: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "role" }>;
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

/**
 * Calls the "revokeRole" function on the contract.
 * @param options - The options for the "revokeRole" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```
 * import { revokeRole } from "thirdweb/extensions/common";
 *
 * const transaction = revokeRole({
 *  role: ...,
 *  account: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function revokeRole(options: BaseTransactionOptions<RevokeRoleParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xd547741f",
      [
        {
          type: "bytes32",
          name: "role",
        },
        {
          type: "address",
          name: "account",
        },
      ],
      [],
    ],
    params: [options.role, options.account],
  });
}
