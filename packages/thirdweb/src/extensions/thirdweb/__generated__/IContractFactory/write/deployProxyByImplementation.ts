import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "deployProxyByImplementation" function.
 */
export type DeployProxyByImplementationParams = {
  implementation: AbiParameterToPrimitiveType<{
    type: "address";
    name: "implementation";
  }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
  salt: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "salt" }>;
};

/**
 * Calls the "deployProxyByImplementation" function on the contract.
 * @param options - The options for the "deployProxyByImplementation" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```
 * import { deployProxyByImplementation } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = deployProxyByImplementation({
 *  implementation: ...,
 *  data: ...,
 *  salt: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function deployProxyByImplementation(
  options: BaseTransactionOptions<DeployProxyByImplementationParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x11b804ab",
      [
        {
          type: "address",
          name: "implementation",
        },
        {
          type: "bytes",
          name: "data",
        },
        {
          type: "bytes32",
          name: "salt",
        },
      ],
      [
        {
          type: "address",
        },
      ],
    ],
    params: [options.implementation, options.data, options.salt],
  });
}
