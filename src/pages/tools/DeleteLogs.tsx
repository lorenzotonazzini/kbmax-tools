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
import Product from "../../interfaces/Product";

const deleteLogsNumEachTime = 50;
export default function DeleteLogs() {

    const toast = useToast();
    const { fetchData, doFetchGet, multipleDelete, multipleDeleteResult, error } = useFetch();

    const [isLoading, setIsloading] = React.useState(false);

    const [quoteId, setQuoteId] = React.useState(0);
    const [logIds, setLogsIds] = React.useState([] as number[]);
    const [deletedLogs, setDeletedLogs] = React.useState(0);
    const [env, setEnv] = React.useState("");

    const [textToDelete, setTextToDelete] = React.useState("");

    const getQuoteInfo = () => {
        setIsloading(true);
        doFetchGet("/api/quotes/" + quoteId);
    }

    const deleteIds = () => {
        multipleDelete(logIds.slice(deletedLogs, deletedLogs + deleteLogsNumEachTime).map(id => "/api/logs/" + id));
        setDeletedLogs(deletedLogs + deleteLogsNumEachTime);
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

        if (!error && fetchData !== 500 && fetchData) {
            //get logs list 
            if (logIds.length == 0) {
                setLogsIds([...(fetchData as Quote).logs.map(log => log.id)]);
            }
        }

    }, [fetchData])

    React.useEffect(() => {
        if (multipleDeleteResult.length > 0) {
            if (logIds.length > deletedLogs) {
                deleteIds();
            }
            else if (deletedLogs >= logIds.length) {
                toast({
                    title: 'Logs deleted',
                    description: "Logs Deleted",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                })
                setIsloading(false);
            }
        }
    }, [multipleDeleteResult])

    React.useEffect(() => {
        if (logIds.length > 0) {
            deleteIds();
        }
    }, [logIds])

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
                <CustomButton w={"100%"} margin={3} onClick={getQuoteInfo} isLoading={isLoading}>Delete logs</CustomButton>
            </Center>
        </VStack>


    )
}