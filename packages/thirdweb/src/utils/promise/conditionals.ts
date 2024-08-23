/**
 * Checks if at least one of the promises resolves to true.
 *
 * @param promises - Promises that resolve to boolean values.
 * @returns A promise that resolves to true if at least one of the promises resolves to true, otherwise resolves to false.
 * * @internal
 */
export async function oneOf(...promises: Promise<boolean>[]): Promise<boolean> {
  try {
    await Promise.any(
      promises.map((p) =>
        p.then((result) => (result ? Promise.resolve() : Promise.reject())),
      ),
    );
    // if we reach here at least ONE promise resolved, meaning one of the conditions was met
    return true;
  } catch {
    // All promises rejected
    return false;
  }
}

/**
 * Checks if all promises in the given array resolve to a truthy value.
 *
 * @param promises - Promises to check.
 * @returns A promise that resolves to `true` if all promises resolve to a truthy value, otherwise resolves to `false`.
 * @internal
 */
export async function allOf(...promises: Promise<boolean>[]): Promise<boolean> {
  try {
    await Promise.all(
      promises.map((p) =>
        p.then((result) => (result ? Promise.resolve() : Promise.reject())),
      ),
    );
    // if we reach here all promises resolved, meaning all conditions were met
    return true;
  } catch {
    // At least one promise rejected
    return false;
  }
}
