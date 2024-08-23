import { Flex, GridItem, SimpleGrid } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import type { ThirdwebContract } from "thirdweb";
import {
  isGetContractMetadataSupported,
  isGetDefaultRoyaltyInfoSupported,
  isGetPlatformFeeInfoSupported,
  isPrimarySaleRecipientSupported,
  isSetContractMetadataSupported,
  isSetDefaultRoyaltyInfoSupported,
  isSetPlatformFeeInfoSupported,
  isSetPrimarySaleRecipientSupported,
} from "thirdweb/extensions/common";
import { allOf } from "thirdweb/utils";
import { SettingsMetadata } from "./components/metadata";
import { SettingsPlatformFees } from "./components/platform-fees";
import { SettingsPrimarySale } from "./components/primary-sale";
import { SettingsRoyalties } from "./components/royalties";

interface ContractSettingsPageProps {
  contract: ThirdwebContract;
}

export const ContractSettingsPage: React.FC<ContractSettingsPageProps> = ({
  contract,
}) => {
  const isContractMetadataSupported = useQuery({
    queryKey: [
      contract.chain.id,
      contract.address,
      "supported",
      "isContractMetadataSupported",
    ],
    queryFn: () =>
      allOf(
        isGetContractMetadataSupported(contract),
        isSetContractMetadataSupported(contract),
      ),
  });

  const isPrimarySaleSupported = useQuery({
    queryKey: [
      contract.chain.id,
      contract.address,
      "supported",
      "isPrimarySaleSupported",
    ],
    queryFn: () =>
      allOf(
        isPrimarySaleRecipientSupported(contract),
        isSetPrimarySaleRecipientSupported(contract),
      ),
  });

  const isRoyaltiesSupported = useQuery({
    queryKey: [
      contract.chain.id,
      contract.address,
      "supported",
      "isRoyaltiesSupported",
    ],
    queryFn: () =>
      allOf(
        isGetDefaultRoyaltyInfoSupported(contract),
        isSetDefaultRoyaltyInfoSupported(contract),
      ),
  });

  const isPlatformFeesSupported = useQuery({
    queryKey: [
      contract.chain.id,
      contract.address,
      "supported",
      "isPlatformFeesSupported",
    ],
    queryFn: () =>
      allOf(
        isGetPlatformFeeInfoSupported(contract),
        isSetPlatformFeeInfoSupported(contract),
      ),
  });

  return (
    <Flex direction="column" gap={4}>
      <Flex gap={8} w="100%">
        <SimpleGrid columns={1} w="100%" gap={8}>
          {contract && (
            <GridItem order={isContractMetadataSupported.data ? 0 : 100}>
              <SettingsMetadata
                contract={contract}
                detectedState={
                  isContractMetadataSupported.isLoading
                    ? "loading"
                    : isContractMetadataSupported.data
                      ? "enabled"
                      : "disabled"
                }
              />
            </GridItem>
          )}
          {contract && (
            <GridItem order={isPrimarySaleSupported ? 2 : 101}>
              <SettingsPrimarySale
                contract={contract}
                detectedState={
                  isPrimarySaleSupported.isLoading
                    ? "loading"
                    : isPrimarySaleSupported.data
                      ? "enabled"
                      : "disabled"
                }
              />
            </GridItem>
          )}

          {contract && (
            <GridItem order={isRoyaltiesSupported.data ? 3 : 102}>
              <SettingsRoyalties
                contract={contract}
                detectedState={
                  isRoyaltiesSupported.isLoading
                    ? "loading"
                    : isRoyaltiesSupported.data
                      ? "enabled"
                      : "disabled"
                }
              />
            </GridItem>
          )}

          {contract && (
            <GridItem order={isPlatformFeesSupported.data ? 4 : 103}>
              <SettingsPlatformFees
                contract={contract}
                detectedState={
                  isPlatformFeesSupported.isLoading
                    ? "loading"
                    : isPlatformFeesSupported.data
                      ? "enabled"
                      : "disabled"
                }
              />
            </GridItem>
          )}
        </SimpleGrid>
      </Flex>
    </Flex>
  );
};
