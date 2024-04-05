import React from "react"
import {
    FormControl,
    FormLabel,
    Input,
    Center,
    VStack,
    List,
    ListItem,
    ListIcon,
    Card,
    UnorderedList,
    Link,
    Text,
    FormHelperText,
    FormErrorMessage,
    useToast
} from '@chakra-ui/react'

import CustomButton from "../../components/CustomButton";
import { useFetch } from "../../hooks/useFetch";
import { ReferencedResource, ResouceType } from "../../interfaces/Resources";
import { Quote } from "../../interfaces/Quote";


export default function UnsubmitQuote() {

    const toast = useToast();
    const { fetchData, doFetchGet, doFetchPost, doFetchDelete, error } = useFetch();

    const [isLoading, setIsloading] = React.useState(false);

    const [quoteId, setQuoteId] = React.useState(0);
    const [env, setEnv] = React.useState("");

    const [infoQuote, setInfoQuote] = React.useState(false);

    const getQuoteInfo = () => {
        setIsloading(true);
        doFetchGet("/api/quotes/" + quoteId);
    }


    React.useEffect(() => {

        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            const url = tabs[0].url

            if (url && url.includes(".kbmax.com/quotes/")) {
                //get page url
                const numbersInUrl = url.match(/\d+/);
                if (numbersInUrl) setQuoteId(+numbersInUrl[0])
                //Get env
                const env = url.split(".")[0].split("-").at(-1);
                setEnv(env ? env : "");

            }
        })
    }, []);

    React.useEffect(() => {
        if (!error && fetchData!== 500) {
            if (fetchData && !infoQuote) {

                setInfoQuote(true);
                delete (fetchData as Quote).idWorkflow;
                delete (fetchData as Quote).state;

                doFetchPost("/api/quotes/save", fetchData);
                toast({
                    title: 'Quote unsubmitted',
                    description: "Quote unsubmitted, try going to the Quotes list page",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                })

                setIsloading(false);
            }
        }

    }, [fetchData])


    React.useEffect(() => {

        if (error && fetchData) {
            toast({
                title: 'Error',
                description: `Error ${fetchData}, check the quote ID!`,
                status: 'error',
                duration: 2000,
                isClosable: true,
            });

            setIsloading(false);
        }

    }, [error]);


    return (
        <VStack spacing={5} w={500}>
            <Center>
                <FormControl padding={10} paddingBottom={3}>
                    <FormLabel>Quote Id</FormLabel>
                    <Input type='number' value={quoteId} onChange={(e) => setQuoteId(+e.target.value)} />
                </FormControl>
            </Center>

            <Center>
                <CustomButton w={"100%"} margin={3} onClick={getQuoteInfo} isLoading={isLoading}>Un-Submit</CustomButton>
            </Center>
        </VStack>


    )
}