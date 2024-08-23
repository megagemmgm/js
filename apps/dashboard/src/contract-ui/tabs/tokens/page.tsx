import { Box, ButtonGroup, Flex } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import type { ThirdwebContract } from "thirdweb";
import {
  isClaimToSupported,
  isMintToSupported,
} from "thirdweb/extensions/erc20";
import { Card, Heading, LinkButton, Text } from "tw-components";
import { TokenAirdropButton } from "./components/airdrop-button";
import { TokenBurnButton } from "./components/burn-button";
import { TokenClaimButton } from "./components/claim-button";
import { TokenMintButton } from "./components/mint-button";
import { TokenSupply } from "./components/supply";
import { TokenTransferButton } from "./components/transfer-button";

interface ContractTokenPageProps {
  contract: ThirdwebContract;
  isERC20: boolean;
}

export const ContractTokensPage: React.FC<ContractTokenPageProps> = ({
  contract,
  isERC20,
}) => {
  const isERC20MintableQuery = useQuery({
    queryKey: [
      contract.chain.id,
      contract.address,
      "erc20",
      "isMintToSupported",
    ],
    queryFn: () => isMintToSupported(contract),
  });
  const isERC20Claimable = useQuery({
    queryKey: [
      contract.chain.id,
      contract.address,
      "erc20",
      "isClaimToSupported",
    ],
    queryFn: () => isClaimToSupported(contract),
  });

  if (!isERC20) {
    return (
      <Card as={Flex} flexDir="column" gap={3}>
        {/* TODO  extract this out into it's own component and make it better */}
        <Heading size="subtitle.md">No Token extension enabled</Heading>
        <Text>
          To enable Token features you will have to extend an ERC20 interface in
          your contract.
        </Text>
        <Box>
          <LinkButton
            isExternal
            href="https://portal.thirdweb.com/contracts/build/extensions/erc-20/ERC20"
            colorScheme="purple"
          >
            Learn more
          </LinkButton>
        </Box>
      </Card>
    );
  }

  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Contract Tokens</Heading>
        <ButtonGroup
          flexDirection={{ base: "column", md: "row" }}
          gap={2}
          w="inherit"
        >
          {isERC20Claimable.data && <TokenClaimButton contract={contract} />}
          <TokenBurnButton contract={contract} />

          <TokenAirdropButton contract={contract} />

          <TokenTransferButton contract={contract} />
          {/* TODO: show skeleton or disabled while loading? */}
          {isERC20MintableQuery.data && <TokenMintButton contract={contract} />}
        </ButtonGroup>
      </Flex>

      <TokenSupply contract={contract} />
    </Flex>
  );
};
