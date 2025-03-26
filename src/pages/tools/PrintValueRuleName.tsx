import React from "react"
import {
    FormControl,
    FormLabel,
    Input,
    Center,
    VStack,
    useToast
} from '@chakra-ui/react'

import CustomButton from "../../components/CustomButton";
import { useFetch } from "../../hooks/useFetch";

const valueRuleWriteConsole = {
    $type: "Rule",
    type: "value",
    blocks: "{\"name\":\"%NAME%\",\"blocks\":[{\"$type\":\"StartBlock\",\"x\":25,\"y\":35,\"parts\":{\"next\":{\"$type\":\"WriteLogBlock\",\"parts\":{\"logType\":{\"value\":\"debug\"},\"value\":{\"$type\":\"LiteralStringBlock\",\"parts\":{\"text\":{\"value\":\"%ToPrint%\"}}}}}}}]}",
    id: "%ID%",
    name: "Write log: %NAME%"
}

export default function PrintValueRuleName() {

    const toast = useToast();
    const { fetchData, doFetchGet, doFetchPut, error } = useFetch();

    const [isLoading, setIsloading] = React.useState(false);

    const [configId, setConfigId] = React.useState(0);
    const [configName, setConfigName] = React.useState('');

    const [infoConfig, setInfoConfig] = React.useState(false);

    const [cleanOnly, setCleanOnly] = React.useState(false);

    const getConfigInfo = (cleanOnly: boolean = false) => {
        setIsloading(true);
        setCleanOnly(cleanOnly)
        doFetchGet("/api/admin/products/" + configId);
    }

    React.useEffect(() => {

        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            const url = tabs[0].url

            if (url && url.includes(".kbmax.com/admin/configurators/")) {
                //get page url
                const numbersInUrl = url.match(/\d+/);
                if (numbersInUrl) setConfigId(+numbersInUrl[0])

            }
        })
    }, []);

    React.useEffect(() => {
        if (!error && fetchData !== 500) {
            if (fetchData && !infoConfig) {

                setInfoConfig(true);

                //
                var configName: string = (fetchData as any).name;
                //get value rules
                var valueRulesObj: any = ((fetchData as any).configurator.ruleContainers as any[]).find((value, index) => value.ruleType == 'value');

                if (valueRulesObj) {
                    var valueRules: any[] = valueRulesObj.rules;
                    var newValueRules: any[] = [];

                    //clean
                    valueRules = valueRules.filter(item => !(item.id as string).startsWith("Test"));

                    valueRules.forEach((element, index) => {

                        if (!cleanOnly) {
                            //add console log before each value rule
                            var valueName: string = " Write log: " + element.name;
                            var debugValue = { ...valueRuleWriteConsole, name: valueName, id: "Test" + index }
                            debugValue.blocks = debugValue.blocks.replace("%NAME%", valueName);
                            debugValue.blocks = debugValue.blocks.replace("%ToPrint%", configName + " - value rule: " + element.name);

                            newValueRules.push(debugValue);
                        }

                        // add value rule
                        newValueRules.push(element);

                        if (index == (valueRules.length - 1) && !cleanOnly) {
                            var endDebug = { ...valueRuleWriteConsole, name: "End  Write log: " + configName, id: "Test" + (index + 1) }
                            endDebug.blocks = endDebug.blocks.replace("%NAME%", "Write log: " + configName);
                            endDebug.blocks = endDebug.blocks.replace("%ToPrint%", "End value rules " + configName);

                            newValueRules.push(endDebug);
                        }
                    });


                    //
                    valueRulesObj.rules = newValueRules;
                }

                doFetchPut("/api/admin/products/" + configId, fetchData);
                toast({
                    title: 'Configurator saved',
                    description: "Configurator saved, please refresh the page",
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
                    <FormLabel>Config Id</FormLabel>
                    <Input type='number' value={configId} onChange={(e) => setConfigId(+e.target.value)} />
                </FormControl>
            </Center>

            <Center>
                <CustomButton w={"100%"} margin={3} onClick={() => getConfigInfo(false)} isLoading={isLoading}>Add "Write log debug" blocks</CustomButton>
                <CustomButton w={"100%"} margin={3} onClick={() => getConfigInfo(true)} isLoading={isLoading}>Remove "Write log debug" blocks</CustomButton>
            </Center>
        </VStack>


    )
}