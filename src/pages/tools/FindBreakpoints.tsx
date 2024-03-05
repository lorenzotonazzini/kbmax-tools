import React from "react"
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Center
} from '@chakra-ui/react'

export default function FindBreakpoints() {

    const [configId, setConfigId] = React.useState(0);

    //get page url
    React.useEffect(() => {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            const url = tabs[0].url
            if (url && url.includes(".kbmax.com/admin/configurators/")) {
                const numbersInUrl = url.match(/\d+/);
                if (numbersInUrl) setConfigId(+numbersInUrl[0])
            }
        })
    }, [])

    return (
        <Center w={500}>
            <FormControl padding={10}>
            <FormLabel>Parent configurator Id</FormLabel>
            <Input type='number' value={configId} onChange={(e) => setConfigId(+e.target.value)} />
        </FormControl>
        </Center>
        
    )
}