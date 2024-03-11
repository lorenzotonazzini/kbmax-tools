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
    FormErrorMessage
} from '@chakra-ui/react'
import { CheckCircleIcon, ExternalLinkIcon } from '@chakra-ui/icons'

import { useLocation } from "react-router-dom";


import CustomButton from "../../components/CustomButton";
import { useFetch } from "../../hooks/useFetch";
import { ReferencedResource, ResouceType } from "../../interfaces/Resources";
import { Quote } from "../../interfaces/Quote";


export default function DeleteQuote() {

    const { fetchData, doFetchGet, doFetchPost, doFetchDelete, error } = useFetch();

    const [isLoading, setIsloading] = React.useState(false);

    const [quoteId, setQuoteId] = React.useState(0);
    const [env, setEnv] = React.useState("");

    const [textToDelete, setTextToDelete] = React.useState("");
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
    const openBackgroundTabProduct = async (product: ReferencedResource) => {
        chrome.tabs.query({ currentWindow: true, active: true }).
            then(tabs => {
                if (tabs[0].url) {
                    const companyUrl = tabs[0].url.split(".com")[0] + ".com";
                    if (product.type == ResouceType.Scene) chrome.tabs.create({ url: companyUrl + "/admin/scenes/" + product.id, active: false });
                    else chrome.tabs.create({ url: companyUrl + "/admin/configurators/" + product.id, active: false });
                }
            })
    }

    React.useEffect(() => {
        if (fetchData && !infoQuote) {

            setInfoQuote(true);
            delete (fetchData as Quote).idWorkflow;
            delete (fetchData as Quote).state;

            doFetchPost("/api/quotes/save", fetchData);

        }
        else if (fetchData) {
            //delete quote
            doFetchDelete("/api/quotes/" + quoteId);

            //
            setIsloading(false);
        }
    }, [fetchData])

    return (
        <VStack spacing={5} w={500}>
            <Center>
                <FormControl padding={10} paddingBottom={3}>
                    <FormLabel>Quote Id</FormLabel>
                    <Input type='number' value={quoteId} onChange={(e) => setQuoteId(+e.target.value)} />
                </FormControl>
            </Center>
            <Center>
                <FormControl isInvalid={true}>
                    <FormErrorMessage>Type 'delete {env} {quoteId}' to enable the button</FormErrorMessage>
                    <Input value={textToDelete} onChange={(e) => setTextToDelete(e.target.value)} />
                </FormControl>
            </Center>

            <Center>
                <CustomButton w={"100%"} margin={3} onClick={getQuoteInfo} isLoading={isLoading} isDisabled={textToDelete != ("delete " + env + " " + quoteId)}>Delete</CustomButton>
            </Center>
        </VStack>


    )
}