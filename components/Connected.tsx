
import { Text, Button, Container, Heading, VStack, HStack, Image } from '@chakra-ui/react'
import { FC, MouseEventHandler, useCallback } from 'react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'

const Connected: FC = () => {

    
    return (
        <VStack spacing={20}>
            <Container>
                <VStack spacing={8}>
                    <Heading color="white" as="h1" size="2xl" noOfLines={1} textAlign='center'>
                        Welcome Buildoor.
                    </Heading>

                    <Text color="bodyText" fontSize="xl" textAlign="center">
                        Each buildoor is randomly generated and can be staked to receive
                        <Text as='b'>$BLD</Text>. Uwe your <Text as='b'> $BLD</Text> to upgrade your buildoor and recieve perks within the community!
                    </Text>
                    
                </VStack>
            </Container>

            <HStack spacing={10}>
                <Image src="avatar1.png" alt="" />
                <Image src="avatar2.png" alt="" />
                <Image src="avatar3.png" alt="" />
                <Image src="avatar4.png" alt="" />
                <Image src="avatar5.png" alt="" />
            </HStack>

            <Button bgColor="accent" color="white" maxW="380px">
                <Text>mint buildoor</Text>
            </Button>
        </VStack>
    )
}

export default Connected