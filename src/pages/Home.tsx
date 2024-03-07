import {
    Flex,
    Container,
    Heading,
    Stack,
    Text,
    Button,
    Icon,
    Center,
    Image,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

function HomePage() {

    const navigate = useNavigate();

    return (
        <Container maxW={"5xl"} w={"500px"}>
            <Stack
                textAlign={"center"}
                align={"center"}
                spacing={{ base: 8, md: 10 }}
                py={{ base: 20, md: 28 }}
            >
                <Center>
                    <Image src="data:image/png;base64,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"></Image>
                </Center>
                <Heading
                    fontWeight={600}
                    fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
                    lineHeight={"110%"}
                >
                    KBMax Tools{" "}
                    <Text as={"span"} color={"orange.400"}>
                        made easy
                    </Text>
                </Heading>
                <Text color={"gray.500"} maxW={"3xl"}>
                    Performing some actions on KBMax configurators is often complicated,
                    here you can find a set of tools that can make your life easier
                </Text>
                <Text color={"gray.500"} maxW={"3xl"}>
                    PS: If you want to keep the extension open, right click {">"} inspect
                </Text>
                <Stack spacing={6} direction={"row"}>
                    <Button
                        rounded={"full"}
                        px={6}
                        colorScheme={"orange"}
                        bg={"orange.400"}
                        _hover={{ bg: "orange.500" }}
                        onClick={() => navigate("/tools")}
                    >
                        Tools
                    </Button>
                    <Button rounded={"full"} px={6} onClick={() => window.open("https://github.com/lorenzotonazzini/kbmax-tools", '_blank')}>
                        Learn more
                    </Button>
                </Stack>
            </Stack>
        </Container>
    );
}

export default HomePage;