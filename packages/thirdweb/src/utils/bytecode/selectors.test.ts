import { describe, expect, it } from "vitest";
import { DOODLES_CONTRACT } from "~test/test-contracts.js";
import { resolveFunctionSelectors } from "./selectors.js";

describe("resolveFunctionSelectors", () => {
  it("should resolve selectors from contract", async () => {
    // we do this so we don't hit any PRIOR cache
    const DOODLES_CONTRACT_CLONE = { ...DOODLES_CONTRACT };
    const selectors = await resolveFunctionSelectors(DOODLES_CONTRACT_CLONE);
    expect(selectors).toMatchInlineSnapshot(`
      [
        "0xddff5b1c",
        "0xe985e9c5",
        "0xeb8d2444",
        "0xf2fde38b",
        "0xffe630b5",
        "0xb88d4fde",
        "0xc04a2836",
        "0xc4e37095",
        "0xc87b56dd",
        "0x833b9499",
        "0x8da5cb5b",
        "0x95d89b41",
        "0xa0712d68",
        "0xa22cb465",
        "0x715018a6",
        "0x718bc4af",
        "0x819b25ba",
        "0x8295784d",
        "0x55f804b3",
        "0x6352211e",
        "0x6373a6b1",
        "0x65f13097",
        "0x70a08231",
        "0x32cb6b0c",
        "0x3ccfd60b",
        "0x42842e0e",
        "0x4f6ccce7",
        "0x18160ddd",
        "0x23b872dd",
        "0x29fc6bae",
        "0x2f745c59",
        "0x01ffc9a7",
        "0x06fdde03",
        "0x081812fc",
        "0x095ea7b3",
      ]
    `);
  });

  it("should not throw for invalid contract", async () => {
    // we do this so we don't hit any PRIOR cache
    const DOODLES_CONTRACT_CLONE = {
      ...DOODLES_CONTRACT,
      // invalid address on purpose to test the error handling
      address: `${DOODLES_CONTRACT.address.slice(0, -1)}0`,
    };
    const selectors = await resolveFunctionSelectors(DOODLES_CONTRACT_CLONE);
    expect(selectors).toEqual([]);
  });
});
