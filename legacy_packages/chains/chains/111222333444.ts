import type { Chain } from "../src/types";
export default {
  "chain": "Alphabet Network",
  "chainId": 111222333444,
  "explorers": [
    {
      "name": "Alphabet Explorer",
      "url": "https://scan.alphabetnetwork.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://alphabetnetwork.org",
  "name": "Alphabet Mainnet",
  "nativeCurrency": {
    "name": "ALT",
    "symbol": "ALT",
    "decimals": 18
  },
  "networkId": 111222333444,
  "rpc": [
    "https://111222333444.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://londonpublic.alphabetnetwork.org",
    "wss://londonpublic.alphabetnetwork.org/ws/",
    "https://main-rpc.com",
    "wss://main-rpc.com/ws/"
  ],
  "shortName": "alphabet",
  "slug": "alphabet",
  "testnet": false
} as const satisfies Chain;