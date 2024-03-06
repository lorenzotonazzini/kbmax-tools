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
import Product, { ProductReferencedResource, ProductResouceType } from "../../interfaces/Product";
import { Scene } from "../../interfaces/Scene";

interface ElemTypesToCheck {
    products: boolean,
    scenes: boolean,
    safeFunctions: boolean,
    quoteHeader: boolean
}
export default function TableReference() {

    const { fetchData, doFetchPost, multipleFetchGet, multipleFetchData, error, loading } = useFetch();
    const [tableId, setTableId] = React.useState(0);

    const [configsAnalysedNumber, setConfigsAnalysedNumber] = React.useState(0);
    const [configs, setConfigs] = React.useState([] as Product[]);

    const [scenesAnalysedNumber, setScenesAnalysedNumber] = React.useState(0);
    const [scenes, setScenes] = React.useState([] as Scene[]);

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

        }
        //quote header
        else if (!checkedTypes.quoteHeader) {

        }
    }
    React.useEffect(() => {
        if(search) handleFindTableReference();
    }, [configsAnalysedNumber, scenesAnalysedNumber, checkedTypes]);

    React.useEffect(() => {
        //
        console.log("fetchData updated", fetchData)
        if (fetchData && (fetchData as any[]).length > 0) {
            //Products
            if (!checkedTypes.products) {
                console.log("Product fetched, skipped", configsAnalysedNumber);
                //console.log("Product fetched, returned: ", fetchData);
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
                console.log("Scene fetched");
                //console.log("Scene fetched, returned: ", fetchData);
                const scenesToAnalyse = (fetchData as Scene[]);
                scenesToAnalyse.map(sceneToAnalyse => {
                    //analyse references
                    if (sceneToAnalyse.references) {
                        sceneToAnalyse.references.map(ref => {
                            if (ref.type == ProductResouceType.Table && ref.id == tableId && !scenes.find(config => config.id == sceneToAnalyse.id)) {
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

            }
            //quote header
            else if (!checkedTypes.quoteHeader) {

            }
        }
        else if (fetchData && (fetchData as any[]).length == 0) {

            console.log("finished")
            const elemTypeToDo = checkedTypes;

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

    const openBackgroundTabProduct = async (product: Product) => {
        chrome.tabs.query({ currentWindow: true, active: true }).
            then(tabs => {
                if (tabs[0].url) {
                    const companyUrl = tabs[0].url.split(".com")[0] + ".com";
                    chrome.tabs.create({ url: companyUrl + "/admin/configurators/" + product.id, active: false });
                }
            })
    }

    const openBackgroundTabScene = async (scene: Scene) => {
        chrome.tabs.query({ currentWindow: true, active: true }).
            then(tabs => {
                if (tabs[0].url) {
                    const companyUrl = tabs[0].url.split(".com")[0] + ".com";
                    chrome.tabs.create({ url: companyUrl + "/admin/scenes/" + scene.id, active: false });
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

            <Card padding={5} minW={90}>
                <FormControl >
                    <FormLabel>Configurators:</FormLabel>
                    <List spacing={3}>
                        {
                            configs.map((config) =>
                                <ListItem>
                                    <ListIcon as={CheckCircleIcon} color='green.500' />
                                    {config.id + " ====> "} <Link onClick={() => openBackgroundTabProduct(config)} isExternal>Open <ExternalLinkIcon mx='2px' /></Link>
                                </ListItem>
                            )
                        }
                    </List>
                </FormControl>
            </Card>

            <Card padding={5} minW={90}>
                <FormControl >
                    <FormLabel>Scenes:</FormLabel>
                    <List spacing={3}>
                        {
                            scenes.map((scene) =>
                                <ListItem>
                                    <ListIcon as={CheckCircleIcon} color='green.500' />
                                    {scene.id + " ====> "} <Link onClick={() => openBackgroundTabScene(scene)} isExternal>Open <ExternalLinkIcon mx='2px' /></Link>
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