import { beforeEach, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { delegate } from "../../../extensions/erc20/__generated__/IVotes/write/delegate.js";
import { mintTo } from "../../../extensions/erc20/write/mintTo.js";
import { deployERC20Contract } from "../../../extensions/prebuilts/deploy-erc20.js";
import { deployVoteContract } from "../../../extensions/prebuilts/deploy-vote.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { propose } from "../__generated__/Vote/write/propose.js";
import { getAll } from "./getAll.js";
import { proposalExists } from "./proposalExists.js";

let contract: ThirdwebContract;
let tokenContract: ThirdwebContract;
const account = TEST_ACCOUNT_A;
const client = TEST_CLIENT;
const chain = ANVIL_CHAIN;

describe("proposal exists", () => {
  beforeEach(async () => {
    const token = await deployERC20Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      type: "TokenERC20",
      params: {
        name: "Token",
        contractURI: TEST_CONTRACT_URI,
      },
    });
    const address = await deployVoteContract({
      account,
      client,
      chain,
      params: {
        name: "",
        contractURI: TEST_CONTRACT_URI,
        token,
        initialVotingDelay: 0n,
        initialVotingPeriod: 10n,
        initialProposalThreshold: 50n,
        initialVoteQuorumFraction: 25n,
      },
    });

    contract = getContract({
      address,
      chain,
      client,
    });

    tokenContract = getContract({
      address: token,
      chain,
      client,
    });
  });

  it("should return false if Vote doesn't have any proposal", async () => {
    const result = await proposalExists({ contract, proposalId: 0n });
    expect(result).toBe(false);
  });

  it("should return true if Vote has the proposal (id)", async () => {
    // first step: mint enough tokens so it passes the voting threshold
    const mintTransaction = mintTo({
      contract: tokenContract,
      to: account.address,
      amount: "1000",
    });
    await sendAndConfirmTransaction({ transaction: mintTransaction, account });
    // 2nd step: to delegate the token
    const delegation = delegate({
      contract: tokenContract,
      delegatee: account.address,
    });
    await sendAndConfirmTransaction({ transaction: delegation, account });

    // step 3: create a proposal
    const transaction = propose({
      contract,
      description: "first proposal",
      targets: [contract.address],
      values: [0n],
      calldatas: ["0x"],
    });
    await sendAndConfirmTransaction({ transaction, account });
    const allProposals = await getAll({ contract });
    expect(allProposals.length).toBe(1);
    const result = await proposalExists({
      contract,
      proposalId: allProposals[0]?.proposalId || -1n,
    });
    expect(result).toBe(true);
  });
});
