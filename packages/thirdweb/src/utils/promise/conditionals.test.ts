import { describe, expect, it } from "vitest";

import { allOf, oneOf } from "./conditionals.js";

describe("conditionals", () => {
  describe("allOf", () => {
    it("should return true if all promises resolve to true", async () => {
      const result = await allOf(Promise.resolve(true), Promise.resolve(true));
      expect(result).toBe(true);
    });

    it("should return false if at least one promise resolves to false", async () => {
      const result = await allOf(Promise.resolve(true), Promise.resolve(false));
      expect(result).toBe(false);
    });

    it("should return false if all promises resolve to false", async () => {
      const result = await allOf(
        Promise.resolve(false),
        Promise.resolve(false),
      );
      expect(result).toBe(false);
    });

    it("should return false if all promises reject", async () => {
      const result = await allOf(Promise.reject(), Promise.reject());
      expect(result).toBe(false);
    });

    it("should return false if at least one promise rejects", async () => {
      const result = await allOf(Promise.resolve(true), Promise.reject());
      expect(result).toBe(false);
    });

    it("should return false if at least one promise rejects and one resolves to false", async () => {
      const result = await allOf(Promise.resolve(false), Promise.reject());
      expect(result).toBe(false);
    });

    it("should return false if at least one promise rejects and one resolves to true", async () => {
      const result = await allOf(Promise.resolve(true), Promise.reject());
      expect(result).toBe(false);
    });

    it("should return false if at least one promise rejects and one resolves to true", async () => {
      const result = await allOf(Promise.resolve(true), Promise.reject());
      expect(result).toBe(false);
    });
  });

  describe("oneOf", () => {
    it("should return true if at least one promise resolves to true", async () => {
      const result = await oneOf(Promise.resolve(true), Promise.resolve(false));
      expect(result).toBe(true);
    });
    it("should return true if all promises resolve to true", async () => {
      const result = await oneOf(Promise.resolve(true), Promise.resolve(true));
      expect(result).toBe(true);
    });
    it("should return false if all promises resolve to false", async () => {
      const result = await oneOf(
        Promise.resolve(false),
        Promise.resolve(false),
      );
      expect(result).toBe(false);
    });

    it("should return false if all promises reject", async () => {
      const result = await oneOf(Promise.reject(), Promise.reject());
      expect(result).toBe(false);
    });

    it("should return true if at least one promise resolves and one rejects", async () => {
      const result = await oneOf(Promise.resolve(true), Promise.reject());
      expect(result).toBe(true);
    });
  });
});
