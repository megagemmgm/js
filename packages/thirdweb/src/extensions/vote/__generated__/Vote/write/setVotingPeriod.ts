import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "setVotingPeriod" function.
 */
export type SetVotingPeriodParams = WithOverrides<{
  newVotingPeriod: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "newVotingPeriod";
  }>;
}>;

export const FN_SELECTOR = "0xea0217cf" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "newVotingPeriod",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setVotingPeriod` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `setVotingPeriod` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isSetVotingPeriodSupported } from "thirdweb/extensions/vote";
 *
 * const supported = await isSetVotingPeriodSupported(contract);
 * ```
 */
export async function isSetVotingPeriodSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setVotingPeriod" function.
 * @param options - The options for the setVotingPeriod function.
 * @returns The encoded ABI parameters.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeSetVotingPeriodParams } "thirdweb/extensions/vote";
 * const result = encodeSetVotingPeriodParams({
 *  newVotingPeriod: ...,
 * });
 * ```
 */
export function encodeSetVotingPeriodParams(options: SetVotingPeriodParams) {
  return encodeAbiParameters(FN_INPUTS, [options.newVotingPeriod]);
}

/**
 * Encodes the "setVotingPeriod" function into a Hex string with its parameters.
 * @param options - The options for the setVotingPeriod function.
 * @returns The encoded hexadecimal string.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeSetVotingPeriod } "thirdweb/extensions/vote";
 * const result = encodeSetVotingPeriod({
 *  newVotingPeriod: ...,
 * });
 * ```
 */
export function encodeSetVotingPeriod(options: SetVotingPeriodParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetVotingPeriodParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setVotingPeriod" function on the contract.
 * @param options - The options for the "setVotingPeriod" function.
 * @returns A prepared transaction object.
 * @extension VOTE
 * @example
 * ```ts
 * import { setVotingPeriod } from "thirdweb/extensions/vote";
 *
 * const transaction = setVotingPeriod({
 *  contract,
 *  newVotingPeriod: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setVotingPeriod(
  options: BaseTransactionOptions<
    | SetVotingPeriodParams
    | {
        asyncParams: () => Promise<SetVotingPeriodParams>;
      }
  >,
) {
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [resolvedOptions.newVotingPeriod] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
    accessList: async () => (await asyncOptions()).overrides?.accessList,
    gas: async () => (await asyncOptions()).overrides?.gas,
    gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
    maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
    maxPriorityFeePerGas: async () =>
      (await asyncOptions()).overrides?.maxPriorityFeePerGas,
    nonce: async () => (await asyncOptions()).overrides?.nonce,
    extraGas: async () => (await asyncOptions()).overrides?.extraGas,
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
  });
}
