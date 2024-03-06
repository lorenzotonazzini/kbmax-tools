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

import CustomButton from "../../components/CustomButton";
import { useFetch } from "../../hooks/useFetch";
import Product from "../../interfaces/Product";

export default function FindBreakpoints() {

    const [configId, setConfigId] = React.useState(0);

    const { multipleFetchGet, multipleFetchData, error, loading } = useFetch();

    const [analysedIds, setAnalysedIds] = React.useState([] as number[]);

    const [productsIdsWithBreakpoints, setProductsIdsWithBreakpoints] = React.useState([] as number[]);

    //get page url
    React.useEffect(() => {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            const url = tabs[0].url
            if (url && url.includes(".kbmax.com/admin/configurators/")) {
                const numbersInUrl = url.match(/\d+/);
                if (numbersInUrl) setConfigId(+numbersInUrl[0])
            }
        })
    }, []);

    const handleFindBreakpoints = async () => {
        getConfigs([configId]);
    }

    const getConfigs = (ids: number[]) => {
        multipleFetchGet(ids.map(id => "/api/admin/products/" + id))
    }

    React.useEffect(() => {
        if (multipleFetchData.length > 0) {

            const referencedIds = [] as number[];
            //get referenced configurators
            (multipleFetchData as Product[]).map(product => {
                product.references.map((reference) => {
                    if (reference.type == "Product" && !analysedIds.includes(reference.id)) {
                        referencedIds.push(reference.id);
                    }
                })
            })

            //to anlyse
            const toAnalyse = [] as number[];
            referencedIds.map((id) => {
                if (!analysedIds.includes(id)) toAnalyse.push(id)
            })

            //analyse
            getConfigs(toAnalyse);

            //analysed 
            setAnalysedIds([...analysedIds, ...referencedIds])


            const productWithBreakpoints = [] as number[];
            //check if they contains breakpoints
            multipleFetchData.map(((product: Product) => {
                if (JSON.stringify(product).includes("debugger") && !productsIdsWithBreakpoints.includes(product.id)) {
                    productWithBreakpoints.push(product.id);
                }
            }));

            setProductsIdsWithBreakpoints([...productsIdsWithBreakpoints, ...productWithBreakpoints]);

        }
    }, [multipleFetchGet]);


    const openBackgroundTabProduct = async (id: number) => {
        chrome.tabs.query({ currentWindow: true, active: true }).
            then(tabs => {
                if (tabs[0].url) {
                    const companyUrl = tabs[0].url.split(".com")[0] + ".com";
                    chrome.tabs.create({ url: companyUrl + "/admin/configurators/" + id, active: false });
                }
            })
    }

    return (
        <VStack spacing={5} w={500}>
            <Center>
                <FormControl padding={10} paddingBottom={3}>
                    <FormLabel>Parent configurator Id</FormLabel>
                    <Input type='number' value={configId} onChange={(e) => setConfigId(+e.target.value)} />
                </FormControl>
            </Center>
            {
                (productsIdsWithBreakpoints.length > 0) ?
                    <Card padding={5}>
                        <FormControl >
                            <FormLabel>Configurators with breakpoints:</FormLabel>
                            <List spacing={3}>
                                {
                                    productsIdsWithBreakpoints.map((prodId) =>
                                        <ListItem>
                                            <ListIcon as={CheckCircleIcon} color='green.500' />
                                            {prodId + "====> "} <Link onClick={() => openBackgroundTabProduct(prodId)} isExternal>Open <ExternalLinkIcon mx='2px' /></Link>
                                        </ListItem>
                                    )
                                }
                            </List>
                        </FormControl>
                    </Card>
                    :
                    <></>
            }
            <Center>
                <CustomButton w={"100%"} margin={3} onClick={handleFindBreakpoints} isLoading={loading}>Find Breakpoints</CustomButton>
            </Center>
        </VStack>


    )
}