import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TokensClaimed" event.
 */
export type TokensClaimedEventFilters = Partial<{
  claimConditionIndex: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "claimConditionIndex";
    indexed: true;
  }>;
  tokenId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "tokenId";
    indexed: true;
  }>;
  claimer: AbiParameterToPrimitiveType<{
    type: "address";
    name: "claimer";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the TokensClaimed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { tokensClaimedEvent } from "thirdweb/extensions/erc1155";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensClaimedEvent({
 *  claimConditionIndex: ...,
 *  tokenId: ...,
 *  claimer: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensClaimedEvent(filters: TokensClaimedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event TokensClaimed(uint256 indexed claimConditionIndex, uint256 indexed tokenId, address indexed claimer, address receiver, uint256 quantityClaimed)",
    filters,
  });
}
