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


export default function TableReference() {

    const { fetchData, doFetchPost, multipleFetchGet, multipleFetchData, error, loading } = useFetch();
    const [tableId, setTableId] = React.useState(0);

    const [configsAnalysedNumber, setConfigsAnalysedNumber] = React.useState(0);

    const [configs, setConfigs] = React.useState([] as Product[]);


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


    const getResource = (resources: ProductReferencedResource[]) => {
        multipleFetchGet(resources.map(resource => (resource.type == ProductResouceType.Product) ? "/api/admin/products/" + resource.id : "/api/scenes/" + resource.id))
    }

    React.useEffect(() => {
    }, [multipleFetchGet]);

    const handleFindTableReference = () => {
        //Configurator list
        doFetchPost("/api/admin/products/search", {
            fields: ["id", "references"],
            sortField: "id",
            descending: true,
            skip: configsAnalysedNumber,
            take: 1000
        });
    }

    React.useEffect(() => {
        //
        if (fetchData && (fetchData as any[]).length > 0) {
            const products = (fetchData as Product[]);

            products.map(product => {
                //analyse references
                product.references.map(ref => {
                    if (ref.type == ProductResouceType.Table && ref.id == tableId && !configs.find(config => config.id == product.id)) {
                        configs.push(product);
                    }
                })
            })
            setConfigsAnalysedNumber(configsAnalysedNumber + products.length);
            setConfigs([...configs]);
            handleFindTableReference();

            console.log(configs);
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

    return (
        <VStack spacing={5} w={500}>
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

            <Center>
                <CustomButton w={"100%"} margin={3} onClick={handleFindTableReference} isLoading={loading}>Find</CustomButton>
            </Center>
        </VStack>


    )
}