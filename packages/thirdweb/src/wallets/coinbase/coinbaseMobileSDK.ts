import type { ProviderInterface } from "@coinbase/wallet-sdk";
import type { COINBASE } from "../constants.js";
import type { CreateWalletArgs } from "../wallet-types.js";

let _provider: ProviderInterface | undefined;

/**
 * @internal
 */
export async function getCoinbaseMobileProvider(
  options?: CreateWalletArgs<typeof COINBASE>[1],
): Promise<ProviderInterface> {
  if (!_provider) {
    const mobileProvider: ProviderInterface = (await initMobileProvider(
      options,
    )) as unknown as ProviderInterface;
    _provider = mobileProvider;
    const ExpoLinking = await import("expo-linking");
    const { handleResponse } = await import("@mobile-wallet-protocol/client");
    ExpoLinking.addEventListener("url", ({ url }) => {
      handleResponse(url);
    });
    return mobileProvider;
  }
  return _provider;
}

async function initMobileProvider(
  options?: CreateWalletArgs<typeof COINBASE>[1],
) {
  const { EIP1193Provider, Wallets } = await import(
    "@mobile-wallet-protocol/client"
  );
  const appDeeplinkUrl = options?.mobileConfig?.callbackURL;
  if (!appDeeplinkUrl) {
    throw new Error(
      "callbackURL is required. Set it when creating the coinbase wallet. Ex: createWallet('com.coinbase.wallet', { mobileConfig: { callbackUrl: 'https://example.com' }}",
    );
  }
  const sdk = new EIP1193Provider({
    metadata: {
      appName: options?.appMetadata?.name || "thirdweb powered app",
      appChainIds: options?.chains?.map((c) => c.id),
      appDeeplinkUrl,
      appLogoUrl: options?.appMetadata?.logoUrl,
    },
    wallet: Wallets.CoinbaseSmartWallet, // TODO support both smart and EOA once the SDK supports it
  });
  return sdk;
}
