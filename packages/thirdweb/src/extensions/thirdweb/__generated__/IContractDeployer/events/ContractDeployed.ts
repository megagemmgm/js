import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "ContractDeployed" event.
 */
export type ContractDeployedEventFilters = Partial<{
  deployer: AbiParameterToPrimitiveType<{
    type: "address";
    name: "deployer";
    indexed: true;
  }>;
  publisher: AbiParameterToPrimitiveType<{
    type: "address";
    name: "publisher";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the ContractDeployed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension THIRDWEB
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { contractDeployedEvent } from "thirdweb/extensions/thirdweb";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  contractDeployedEvent({
 *  deployer: ...,
 *  publisher: ...,
 * })
 * ],
 * });
 * ```
 */
export function contractDeployedEvent(
  filters: ContractDeployedEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event ContractDeployed(address indexed deployer, address indexed publisher, address deployedContract)",
    filters,
  });
}
