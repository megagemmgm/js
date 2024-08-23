import { selectorsFromBytecode } from "@shazow/whatsabi";
import type { ThirdwebContract } from "../../contract/contract.js";
import { resolveImplementation } from "../../utils/bytecode/resolveImplementation.js";
import { LruMap } from "../../utils/caching/lru.js";

const SelectorCache = new LruMap<string[]>(8192);

/**
 * Retrieves the function selectors for a given contract.
 *
 * @param contract - The ThirdwebContract instance.
 * @returns A promise that resolves to an array of function selectors.
 */
export async function resolveFunctionSelectors(
  contract: ThirdwebContract,
): Promise<string[]> {
  const cacheKey = `${contract.chain.id}:${contract.address}`;
  // Check cache first
  if (SelectorCache.has(cacheKey)) {
    return SelectorCache.get(cacheKey) || [];
  }
  // immediately return a promise so subsequent calls can await it
  return (async () => {
    // Fetch bytecode for the implementation
    const { bytecode } = await resolveImplementation(contract);

    // Parse selectors
    const selectors = selectorsFromBytecode(bytecode);
    // Cache and return
    SelectorCache.set(cacheKey, selectors);
    return selectors;
  })();
}
