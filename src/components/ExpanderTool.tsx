
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
import CustomButton from './CustomButton';

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
          <CustomButton onClick={params.onClick}>
            Use
          </CustomButton>
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