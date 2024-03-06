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


export default function FindInResources() {

    const { state } = useLocation();

    const [configId, setConfigId] = React.useState(0);

    const { multipleFetchGet, multipleFetchData, error, loading } = useFetch();

    const [analysedIds, setAnalysedIds] = React.useState([] as ProductReferencedResource[]);

    const [resourcesIdsWithBreakpoints, setResourcesIdsWithBreakpoints] = React.useState([] as ProductReferencedResource[]);

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
        getResource([{
            type: ProductResouceType.Product,
            id: configId
        }]);
    }

    const getResource = (resources: ProductReferencedResource[]) => {
        multipleFetchGet(resources.map(resource => (resource.type == ProductResouceType.Product) ? "/api/admin/products/" + resource.id : "/api/scenes/" + resource.id))
    }

    const isStringContains = (mainString: string, texts: string[]) => {
        var isIncluded = false;
        texts.map(text => {
            if (mainString.includes(text)) isIncluded = true
        })

        return isIncluded;
    }

    React.useEffect(() => {
        if (multipleFetchData.length > 0) {
            const referencedIds = [] as ProductReferencedResource[];

            //get referenced configurators
            (multipleFetchData as Product[]).map(product => {
                product.references.map((reference) => {
                    if (reference.type == ProductResouceType.Product && !analysedIds.find(elem => elem.type == ProductResouceType.Product && elem.id == reference.id)) {
                        referencedIds.push(reference);
                    }
                    else if (reference.type == ProductResouceType.Scene && !analysedIds.find(elem => elem.type == ProductResouceType.Scene && elem.id == reference.id)) {
                        referencedIds.push(reference)
                    }
                })
            })

            //to anlyse
            const toAnalyse = [] as ProductReferencedResource[];
            referencedIds.map((id) => {
                if (!analysedIds.includes(id)) toAnalyse.push(id)
            })

            //analyse
            getResource(toAnalyse);

            //analysed 
            setAnalysedIds([...analysedIds, ...referencedIds])


            const isAScene = (obj: any): obj is Scene => {
                return 'id' in obj && 'graph' in obj;
            }

            const resourceWithBreakpoints = [] as ProductReferencedResource[];
            //check if they contains breakpoints
            multipleFetchData.map(((resource: Product | Scene) => {

                if (isAScene(resource) && isStringContains(JSON.stringify(resource), state.params) && !resourcesIdsWithBreakpoints.find(elem => elem.type == ProductResouceType.Scene && elem.id == resource.id)) {
                    //scene
                    resourceWithBreakpoints.push({
                        type: ProductResouceType.Scene,
                        id: resource.id
                    });
                }
                else if (!isAScene(resource) && isStringContains(JSON.stringify(resource), state.params) && !resourcesIdsWithBreakpoints.find(elem => elem.type == ProductResouceType.Product && elem.id == resource.id)) {
                    //product
                    resourceWithBreakpoints.push({
                        type: ProductResouceType.Product,
                        id: resource.id
                    });
                }

            }));

            setResourcesIdsWithBreakpoints([...resourcesIdsWithBreakpoints, ...resourceWithBreakpoints]);

        }
    }, [multipleFetchGet]);


    const openBackgroundTabProduct = async (product: ProductReferencedResource) => {
        chrome.tabs.query({ currentWindow: true, active: true }).
            then(tabs => {
                if (tabs[0].url) {
                    const companyUrl = tabs[0].url.split(".com")[0] + ".com";
                    if (product.type == ProductResouceType.Scene) chrome.tabs.create({ url: companyUrl + "/admin/scenes/" + product.id, active: false });
                    else chrome.tabs.create({ url: companyUrl + "/admin/configurators/" + product.id, active: false });
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

            <Card padding={5} minW={90}>
                <FormControl >
                    <FormLabel>Resources:</FormLabel>
                    <List spacing={3}>
                        {
                            resourcesIdsWithBreakpoints.map((resource) =>
                                <ListItem>
                                    <ListIcon as={CheckCircleIcon} color='green.500' />
                                    {resource.type + ": " + resource.id + " ====> "} <Link onClick={() => openBackgroundTabProduct(resource)} isExternal>Open <ExternalLinkIcon mx='2px' /></Link>
                                </ListItem>
                            )
                        }
                    </List>
                </FormControl>
            </Card>

            <Center>
                <CustomButton w={"100%"} margin={3} onClick={handleFindBreakpoints} isLoading={loading}>Find</CustomButton>
            </Center>
        </VStack>


    )
}