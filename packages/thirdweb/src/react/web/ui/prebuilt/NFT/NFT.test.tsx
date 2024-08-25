import { describe, expect, it } from "vitest";
import { getNFTMedia } from "./NFT.js";
import { DOODLES_CONTRACT } from "~test/test-contracts.js";

describe.runIf(process.env.TW_SECRET_KEY)("NFT prebuilt component", () => {
  it("should fetch the NFT metadata", async () => {
    const metadata = await getNFTMedia({
      contract: DOODLES_CONTRACT,
      tokenId: 1n,
    });
    expect(metadata).toStrictEqual({
      attributes: [
        {
          trait_type: "face",
          value: "holographic beard",
        },
        {
          trait_type: "hair",
          value: "white bucket cap",
        },
        {
          trait_type: "body",
          value: "purple sweater with satchel",
        },
        {
          trait_type: "background",
          value: "grey",
        },
        {
          trait_type: "head",
          value: "gradient 2",
        },
      ],
      description:
        "A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.",
      image: "ipfs://QmTDxnzcvj2p3xBrKcGv1wxoyhAn2yzCQnZZ9LmFjReuH9",
      name: "Doodle #1",
    });
  });
});
