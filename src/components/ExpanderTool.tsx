
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Stack,
  Button
} from '@chakra-ui/react'

interface ToolCard {
  name: string,
  description: string,
  onClick: any
}
export default function ExpanderTool(params: ToolCard) {
  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box as="span" flex='1' textAlign='left'>
            {params.name}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>

      <AccordionPanel pb={4}>
        {params.description}
        <Stack mt={8} direction={"row"} spacing={4}>
          <Button
            flex={1}
            fontSize={"sm"}
            rounded={"full"}
            bg={"blue.400"}
            color={"white"}
            boxShadow={
              "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
            }
            _hover={{
              bg: "blue.500",
            }}
            _focus={{
              bg: "blue.500",
            }}
            onClick={params.onClick}
          >
            Use
          </Button>
        </Stack>
      </AccordionPanel>


    </AccordionItem>

  );
}

/*

<Center py={2} maxW={"200px"}>
      <Box
        maxW={"320px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"lg"}
        p={2}
        textAlign={"center"}
      >
        <VStack spacing={5}>
          <Center>
            <Image src={params.imageSrc} />
          </Center>
 
          <Heading fontSize={"2xl"} fontFamily={"body"}>
            {params.name}
          </Heading>
 
          <Text
            textAlign={"center"}
            color={useColorModeValue("gray.700", "gray.400")}
            px={3}
          >
            
          </Text>
        </VStack>
 
        
      </Box>
    </Center>

*/