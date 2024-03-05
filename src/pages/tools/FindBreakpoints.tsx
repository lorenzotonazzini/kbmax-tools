import React from "react"
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Center,
    VStack
} from '@chakra-ui/react'
import CustomButton from "../../components/CustomButton";
import { useFetch } from "../../hooks/useFetch";

interface ReferencedProduct {
    id: number,
    type: string
}
interface Product {
    references: ReferencedProduct[]
}

export default function FindBreakpoints() {

    const [configId, setConfigId] = React.useState(0);

    const { multipleFetchGet, multipleFetchData, error, loading } = useFetch();

    const [analysedIds, setAnalysedIds] = React.useState([] as number[]);

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
        }
    }, [multipleFetchGet]);

    return (
        <VStack spacing={5} w={500}>
            <Center>
                <FormControl padding={10}>
                    <FormLabel>Parent configurator Id</FormLabel>
                    <Input type='number' value={configId} onChange={(e) => setConfigId(+e.target.value)} />
                </FormControl>
            </Center>
            <Center>
                <CustomButton w={"100%"} margin={3} onClick={handleFindBreakpoints} isLoading={loading}>Find Breakpoints</CustomButton>
            </Center>
        </VStack>


    )
}