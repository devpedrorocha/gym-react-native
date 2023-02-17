import { Heading, HStack, Text, VStack } from "native-base";

export function HistoryCard() {
    return (
        <HStack w="full" bg="gray.600" py={4} px={5} mb={3} rounded="md" alignItems="center" justifyContent="space-between" >
            <VStack mr={5} flex={1}>
                <Heading color="white" fontSize="md" textTransform="capitalize" fontFamily="heading">
                    Costas
                </Heading>
                <Text color="gray.100" fontSize="lg" numberOfLines={1}>
                    Puxada Frontal
                </Text>
            </VStack>

            <Text color="gray.300" fontSize="md" >
                17:10
            </Text>
        </HStack>
    )
}