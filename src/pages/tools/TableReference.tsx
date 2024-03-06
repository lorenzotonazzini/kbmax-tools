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
    Link
} from '@chakra-ui/react'
import { CheckCircleIcon, ExternalLinkIcon } from '@chakra-ui/icons'

import { useLocation } from "react-router-dom";


import CustomButton from "../../components/CustomButton";
import { useFetch } from "../../hooks/useFetch";
import Product, { ProductResouceType } from "../../interfaces/Product";
import { Scene } from "../../interfaces/Scene";
import { SafeFunction } from "../../interfaces/SafeFunctions";
import QuoteHeader from "../../interfaces/QuoteHeader";

interface ElemTypesToCheck {
    products: boolean,
    scenes: boolean,
    safeFunctions: boolean,
    quoteHeader: boolean
}
export default function TableReference() {

    const { fetchData, doFetchPost, multipleFetchGet, multipleFetchData, error, loading } = useFetch();
    const [tableId, setTableId] = React.useState(0);

    //configs
    const [configsAnalysedNumber, setConfigsAnalysedNumber] = React.useState(0);
    const [configs, setConfigs] = React.useState([] as Product[]);

    //scenes
    const [scenesAnalysedNumber, setScenesAnalysedNumber] = React.useState(0);
    const [scenes, setScenes] = React.useState([] as Scene[]);

    //safe functions
    const [safeFunctionsAnalysedNumber, setSafeFunctionsAnalysedNumber] = React.useState(0);
    const [safeFunctions, setSafeFunctions] = React.useState([] as SafeFunction[]);

    //quote headers
    const [quoteHeadersAnalysedNumber, setQuoteHeadersAnalysedNumber] = React.useState(0);
    const [quoteHeaders, setQuoteHeaders] = React.useState([] as QuoteHeader[]);
    //
    const [checkedTypes, setCheckedTypes] = React.useState({
        products: false,
        scenes: false,
        safeFunctions: false,
        quoteHeader: false
    } as ElemTypesToCheck)

    const [search, setSearch] = React.useState(false);


    //get page url
    React.useEffect(() => {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            const url = tabs[0].url
            if (url && url.includes(".kbmax.com/admin/tables/")) {
                const numbersInUrl = url.match(/\d+/);
                if (numbersInUrl) setTableId(+numbersInUrl[0])
            }
        })
    }, []);

    React.useEffect(() => {
    }, [multipleFetchGet]);

    const handleFindTableReference = () => {
        setSearch(true);
        //Products
        if (!checkedTypes.products) {
            doFetchPost("/api/admin/products/search", {
                fields: ["id", "references"],
                sortField: "id",
                descending: true,
                skip: configsAnalysedNumber,
                take: 1000
            });
        }
        // Scenes
        else if (!checkedTypes.scenes) {
            doFetchPost("/api/scenes/search", {
                fields: ["id", "references"],
                sortField: "id",
                descending: true,
                skip: scenesAnalysedNumber,
                take: 1000
            });
        }
        //safe functions
        else if (!checkedTypes.safeFunctions) {
            doFetchPost("/api/functions/search", {
                fields: ["id", "references"],
                sortField: "id",
                descending: true,
                skip: safeFunctionsAnalysedNumber,
                take: 1000
            });
        }
        //quote header
        else if (!checkedTypes.quoteHeader) {
            doFetchPost("/api/quoteheaders/search", {
                fields: ["id", "references"],
                sortField: "id",
                descending: true,
                skip: quoteHeadersAnalysedNumber,
                take: 1000
            });
        }
    }
    React.useEffect(() => {
        if (search) handleFindTableReference();
    }, [configsAnalysedNumber, scenesAnalysedNumber, safeFunctionsAnalysedNumber, quoteHeadersAnalysedNumber, checkedTypes]);

    React.useEffect(() => {
        //
        if (fetchData && (fetchData as any[]).length > 0) {
            //Products
            if (!checkedTypes.products) {
                const products = (fetchData as Product[]);
                products.map(product => {
                    //analyse references
                    if (product.references) {
                        product.references.map(ref => {
                            if (ref.type == ProductResouceType.Table && ref.id == tableId && !configs.find(config => config.id == product.id)) {
                                configs.push(product);
                            }
                        })
                    }
                })

                setConfigsAnalysedNumber(configsAnalysedNumber + products.length);
                setConfigs([...configs]);
            }
            // Scenes
            else if (!checkedTypes.scenes) {
                const scenesToAnalyse = (fetchData as Scene[]);
                scenesToAnalyse.map(sceneToAnalyse => {
                    //analyse references
                    if (sceneToAnalyse.references) {
                        sceneToAnalyse.references.map(ref => {
                            if (ref.type == ProductResouceType.Table && ref.id == tableId && !scenes.find(scene => scene.id == sceneToAnalyse.id)) {
                                scenes.push(sceneToAnalyse);
                            }
                        })
                    }
                })
                setScenesAnalysedNumber(scenesAnalysedNumber + scenesToAnalyse.length);
                setScenes([...scenes]);
            }
            //safe functions
            else if (!checkedTypes.safeFunctions) {
                const safeFunctionsToAnalyse = (fetchData as SafeFunction[]);
                safeFunctionsToAnalyse.map(safeFunctionToAnalyse => {
                    //analyse references
                    if (safeFunctionToAnalyse.references) {
                        safeFunctionToAnalyse.references.map(ref => {
                            if (ref.type == ProductResouceType.Table && ref.id == tableId && !safeFunctions.find(safeFunction => safeFunction.id == safeFunctionToAnalyse.id)) {
                                safeFunctions.push(safeFunctionToAnalyse);
                            }
                        })
                    }
                })
                setSafeFunctionsAnalysedNumber(safeFunctionsAnalysedNumber + safeFunctionsToAnalyse.length);
                setSafeFunctions([...safeFunctions]);
            }
            //quote header
            else if (!checkedTypes.quoteHeader) {
                const quoteHeadersToAnalyse = (fetchData as QuoteHeader[]);
                quoteHeadersToAnalyse.map(quoteHeaderToAnalyse => {
                    //analyse references
                    if (quoteHeaderToAnalyse.references) {
                        quoteHeaderToAnalyse.references.map(ref => {
                            if (ref.type == ProductResouceType.Table && ref.id == tableId && !quoteHeaders.find(quoteHeader => quoteHeader.id == quoteHeaderToAnalyse.id)) {
                                quoteHeaders.push(quoteHeaderToAnalyse);
                            }
                        })
                    }
                })
                setQuoteHeadersAnalysedNumber(quoteHeadersAnalysedNumber + quoteHeadersToAnalyse.length);
                setQuoteHeaders([...quoteHeaders]);
            }
        }
        else if (fetchData && (fetchData as any[]).length == 0) {

            //Products
            if (!checkedTypes.products) {
                checkedTypes.products = true;
                setCheckedTypes({ ...checkedTypes });
            }
            // Scenes
            else if (!checkedTypes.scenes) {
                checkedTypes.scenes = true;
                setCheckedTypes({ ...checkedTypes });
            }
            //safe functions
            else if (!checkedTypes.safeFunctions) {
                checkedTypes.safeFunctions = true;
                setCheckedTypes({ ...checkedTypes });
            }
            //quote header
            else if (!checkedTypes.quoteHeader) {
                checkedTypes.quoteHeader = true;
                setCheckedTypes({ ...checkedTypes });
            }
        }
    }, [fetchData]);

    const openBackgroundTabResource = async (id: number, resourcePath: string) => {
        chrome.tabs.query({ currentWindow: true, active: true }).
            then(tabs => {
                if (tabs[0].url) {
                    const companyUrl = tabs[0].url.split(".com")[0] + ".com";
                    chrome.tabs.create({ url: companyUrl + resourcePath + id, active: false });
                }
            })
    }

    return (
        <VStack spacing={5} w={500} overflowY={"auto"}>
            <Center>
                <FormControl padding={10} paddingBottom={3}>
                    <FormLabel>Table Id</FormLabel>
                    <Input type='number' value={tableId} onChange={(e) => setTableId(+e.target.value)} />
                </FormControl>
            </Center>

            <Card padding={5} w={"90%"}>
                <FormControl >
                    <FormLabel>Configurators:</FormLabel>
                    <List spacing={3}>
                        {
                            configs.map((config) =>
                                <ListItem>
                                    <ListIcon as={CheckCircleIcon} color='green.500' />
                                    {config.id + " ====> "} <Link onClick={() => openBackgroundTabResource(config.id, "/admin/configurators/")} isExternal>Open <ExternalLinkIcon mx='2px' /></Link>
                                </ListItem>
                            )
                        }
                        {
                            configs.length == 0 ? <>Empty</> : <></>
                        }
                    </List>
                </FormControl>
            </Card>

            <Card padding={5} w={"90%"}>
                <FormControl >
                    <FormLabel>Scenes:</FormLabel>
                    <List spacing={3}>
                        {
                            scenes.map((scene) =>
                                <ListItem>
                                    <ListIcon as={CheckCircleIcon} color='green.500' />
                                    {scene.id + " ====> "} <Link onClick={() => openBackgroundTabResource(scene.id, "/admin/scenes/")} isExternal>Open <ExternalLinkIcon mx='2px' /></Link>
                                </ListItem>
                            )
                        }
                    </List>
                </FormControl>
            </Card>

            <Card padding={5} w={"90%"}>
                <FormControl >
                    <FormLabel>Safe Functions:</FormLabel>
                    <List spacing={3}>
                        {
                            safeFunctions.map((safeFunction) =>
                                <ListItem>
                                    <ListIcon as={CheckCircleIcon} color='green.500' />
                                    {safeFunction.id + " ====> "} <Link onClick={() => openBackgroundTabResource(safeFunction.id, "/admin/safe-functions/")} isExternal>Open <ExternalLinkIcon mx='2px' /></Link>
                                </ListItem>
                            )
                        }
                    </List>
                </FormControl>
            </Card>

            <Card padding={5} w={"90%"}>
                <FormControl >
                    <FormLabel>Quote Headers:</FormLabel>
                    <List spacing={3}>
                        {
                            quoteHeaders.map((quoteHeader) =>
                                <ListItem>
                                    <ListIcon as={CheckCircleIcon} color='green.500' />
                                    {quoteHeader.id + " ====> "} <Link onClick={() => openBackgroundTabResource(quoteHeader.id, "/admin/quote-headers/")} isExternal>Open <ExternalLinkIcon mx='2px' /></Link>
                                </ListItem>
                            )
                        }
                    </List>
                </FormControl>
            </Card>

            <Center>
                <CustomButton w={"100%"} margin={3} onClick={handleFindTableReference} isLoading={loading}>Find</CustomButton>
            </Center>
        </VStack>


    )
}