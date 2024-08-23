"use client";

import type { Chain } from "../../../../../chains/types.js";
import { MediaRenderer } from "../../MediaRenderer/MediaRenderer.js";
import type { MediaRendererProps } from "../../MediaRenderer/types.js";
import { useNFTProviderContext } from "../NFTProvider/index.js";
import { useNFTMedia } from "../NFTProvider/useNFTMedia.js";

export type NFTMediaProps = MediaRendererProps & {
  // The NFT contract address
  contractAddress?: string;
  // The chain which the NFT contract was deployed on
  chain?: Chain;
  // The tokenId whose media you want to load
  tokenId?: bigint;

  /**
   * By standard format we look for the `image` field from the metadata (e.g: `const image = metadata.image`)
   * However, some contracts do not follow the standard. In that case users can use this field to override the default
   */
  overrideMediaField?: string;
};

/**
 * This component returns an [`MediaRenderer`](https://portal.thirdweb.com/references/typescript/v5/MediaRenderer) component
 * representing the media of an NFT (based on the tokenId & contract address that you give it)
 *
 * @param props NFTMediaProps
 * @returns a <MediaRenderer /> that shows the content of the NFT media
 *
 * @example
 *
 * ### Standalone usage
 * ```tsx
 * import { NFTMedia } from "thirdweb/react";
 *
 * <NFTMedia
 *   contractAddress="0x" // the NFT contract address
 *   tokenId={0n} // Get the image of the tokenId #0
 *   chain={ethereum}
 *   client={...}
 * />
 * ```
 *
 * ### Usage with NFTProvider
 * ```tsx
 * <NFTProvider
 *   contractAddress="0x..."
 *   chain={...}
 *   client={...}
 * >
 *   // NFTMedia will inherit the media src from NFTProvider
 *   <NFTMedia />
 * </NFTProvider>
 * ```
 *
 * ### Advanced use case
 * ```tsx
 * // Let's say the NFT has the following data:
 * const metadata = {
 *   name: "Name #1",
 *   image_data: "https://cat-image.png",
 * }
 *
 * // It will NOT work out-of-the-box with the <NFTMedia />  because
 * // by default, the component is looking for `image` and not `image_data`
 * // In that case, you can override the default like this:
 *
 * <NFTMedia
 *   contractAddress="0x"
 *   tokenId={0n}
 *   chain={ethereum}
 *   client={...}
 *   overrideMediaField="image_data" // <---
 * />
 * ```
 *
 * @component
 */
export function NFTMedia(props: NFTMediaProps) {
  const {
    contractAddress,
    chain,
    client,
    tokenId,
    overrideMediaField,
    style,
    ...rest
  } = props;
  const context = useNFTProviderContext();

  const nftMediaQuery = useNFTMedia({
    contractAddress,
    chain,
    client,
    tokenId,
    overrideMediaField,
  });

  const isLoading = nftMediaQuery.isLoading || context?.isLoading;

  // If media is loading, return a skeleton div with the same size
  // as the size that the MediaRenderer's supposed to be
  if (isLoading) {
    return (
      // TODO Maybe add some CSS here to make is looks like it's loading?
      <div
        style={{
          // "300px" because that is the default size of MediaRenderer
          width: style?.width || "300px",
          height: style?.height || "300px",
        }}
      />
    );
  }

  /**
   * If the props are passed into NFTMedia, we prioritize using it over the NFTProvider context
   */
  const mediaSrc = nftMediaQuery.data || context?.media;
  return <MediaRenderer client={client} src={mediaSrc} {...rest} />;
}
