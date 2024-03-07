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
    Link
} from '@chakra-ui/react'
import { CheckCircleIcon, ExternalLinkIcon } from '@chakra-ui/icons'

import { useLocation } from "react-router-dom";

import CustomButton from "../../components/CustomButton";
import { useFetch } from "../../hooks/useFetch";
import { ResouceType, Resource, ResourceAPI } from "../../interfaces/Resources";

interface FoundResource {
    type: ResouceType,
    resource: string,
    resourcePath: string,
    analysedNumber: number,
    finished: boolean,
    found: Resource[]
}

export default function FindInResources() {

    const { state } = useLocation();
    const { fetchData, doFetchPost, error, loading } = useFetch();

    const [resourceToFindId, setResourceToFindId] = React.useState(0);
    const [resourceTypeToFind, setResourceTypeToFind] = React.useState(null as unknown as ResouceType)

    const [resourcesFound, setResourcesFound] = React.useState([] as FoundResource[]);

    //start search
    const [search, setSearch] = React.useState(false);


    React.useEffect(() => {

        //get page url
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            const url = tabs[0].url
            if (url && url.includes(".kbmax.com/")) {
                const numbersInUrl = url.match(/\d+/);
                if (numbersInUrl) setResourceToFindId(+numbersInUrl[0])
            }
        });

    }, []);

    const findCurrentResource = () => resourcesFound.find(resource => !resource.finished);

    React.useEffect(() => {

        //Set resources where search
        (state.params.searchIn as ResourceAPI[]).map((searchIn) => {
            resourcesFound.push({
                type: searchIn.type,
                resource: searchIn.api,
                resourcePath: searchIn.resourceLoationPath,
                analysedNumber: 0,
                finished: false,
                found: [] as Resource[]
            })
        })

        //resource type to search
        setResourceTypeToFind(state.params.type as ResouceType);

    }, []);

    const handleFindTableReference = () => {
        setSearch(true);
        const currentResource = findCurrentResource();

        if (currentResource) {
            doFetchPost(currentResource.resource, {
                fields: ["id", "references"],
                sortField: "id",
                descending: true,
                skip: currentResource.analysedNumber,
                take: 1000
            });
        }
    }
    React.useEffect(() => {
        if (search) handleFindTableReference();
    }, [resourcesFound]);

    React.useEffect(() => {
        //
        if (fetchData && (fetchData as any[]).length > 0) {
            const currentResource = findCurrentResource();
            if (currentResource) {
                const receivedResources = (fetchData as Resource[]);
                receivedResources.map(resource => {
                    //analyse references
                    if (resource.references) {
                        resource.references.map(ref => {
                            if (ref.type == resourceTypeToFind && ref.id == resourceToFindId && !currentResource.found.find(res => res.id == resource.id)) {
                                currentResource.found.push(resource);
                            }
                        })
                    }
                })

                currentResource.analysedNumber += receivedResources.length;
                setResourcesFound([...resourcesFound]);
            }
        }
        else if (fetchData && (fetchData as any[]).length == 0) {

            const currentResource = findCurrentResource();

            if (currentResource) {
                currentResource.finished = true;
                setResourcesFound([...resourcesFound]);
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
                    <FormLabel>{resourceTypeToFind} Id</FormLabel>
                    <Input type='number' value={resourceToFindId} onChange={(e) => setResourceToFindId(+e.target.value)} />
                </FormControl>
            </Center>

            {
                resourcesFound.map((resource) =>
                    <Card padding={5} w={"90%"}>
                        <FormControl >
                            <FormLabel>{resource.type + "s :"}</FormLabel>
                            <List spacing={3}>
                                {
                                    resource.found.map(resourceFound =>
                                        <ListItem>
                                            <ListIcon as={CheckCircleIcon} color='green.500' />
                                            {resourceFound.id + " ====> "} <Link onClick={() => openBackgroundTabResource(resourceFound.id, resource.resourcePath)} isExternal>Open <ExternalLinkIcon mx='2px' /></Link>
                                        </ListItem>
                                    )
                                }
                                {
                                    resource.found.length == 0 ? <>No resources found</> : <></>
                                }
                            </List>
                        </FormControl>
                    </Card>
                )
            }

            <Center>
                <CustomButton w={"100%"} margin={3} onClick={handleFindTableReference} isLoading={loading}>Find</CustomButton>
            </Center>
        </VStack>


    )
}