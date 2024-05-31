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
import { Table } from "../../interfaces/Table";


export default function AddTableDescription() {

    const toast = useToast();
    const { fetchData, doFetchGet, doFetchPut, error } = useFetch();

    const [isLoading, setIsloading] = React.useState(false);

    const [tableId, setTableId] = React.useState(0);
    const [tableDescription, setTableDescription] = React.useState("");


    const [tableInfo, setTableInfo] = React.useState(false);

    const [env, setEnv] = React.useState("");


    const getTableInfo = () => {
        setIsloading(true);
        doFetchGet("/api/tables/" + tableId);
    }


    React.useEffect(() => {

        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            const url = tabs[0].url

            if (url && url.includes(".kbmax.com/tables/")) {
                //get page url
                const numbersInUrl = url.match(/\d+/);
                if (numbersInUrl) setTableId(+numbersInUrl[0])
                //Get env
                const env = url.split(".")[0].split("-").at(-1);
                setEnv(env ? env : "");

            }
        })
    }, []);

    React.useEffect(() => {
        if (!error && fetchData !== 500) {
            if (fetchData && !tableInfo) {

                setTableInfo(true);
                (fetchData as Table).description = tableDescription;

                doFetchPut("/api/tables/" + tableId, fetchData);
                toast({
                    title: 'Description added',
                    description: "Description added",
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
                    <FormLabel>Table Id</FormLabel>
                    <Input type='number' value={tableId} onChange={(e) => setTableId(+e.target.value)} />
                    <FormLabel>Description</FormLabel>
                    <Input type='string' value={tableDescription} onChange={(e) => setTableDescription(e.target.value)} />
                </FormControl>
            </Center>

            <Center>
                <CustomButton w={"100%"} margin={3} onClick={getTableInfo} isLoading={isLoading}>Update Description</CustomButton>
            </Center>
        </VStack>


    )
}