import type { AbiFunction } from "abitype";
import { toFunctionSelector } from "viem";
import type { ThirdwebContract } from "../../contract/contract.js";
import type { PreparedMethod } from "../abi/prepare-method.js";
import { resolveFunctionSelectors } from "./selectors.js";

type DetectExtensionOptions = {
  contract: ThirdwebContract;
  method: string | AbiFunction | PreparedMethod<AbiFunction>;
};

/**
 * Detects if the specified method is present in the contract bytecode.
 * @param options - The options for detecting the extension.
 * @returns A promise that resolves to a boolean indicating if the extension is detected.
 * @example
 * ```ts
 * import { detectMethod } from "thirdweb/utils/extensions/detect.js";
 * const hasDecimals = await detectMethod({
 *  contract,
 *  method: "function decimals() view returns (uint8)",
 * });
 * ```
 * @contract
 */
export async function detectMethod(
  options: DetectExtensionOptions,
): Promise<boolean> {
  const selectors = await resolveFunctionSelectors(options.contract);

  const fnSelector = Array.isArray(options.method)
    ? options.method[0]
    : toFunctionSelector(options.method);

  return selectors.includes(fnSelector);
}
