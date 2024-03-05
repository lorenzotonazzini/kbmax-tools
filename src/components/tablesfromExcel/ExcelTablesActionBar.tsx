import React from 'react';
import {
    Card, Input, CardBody, Text,
    VStack, HStack, Button, Center, FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
} from '@chakra-ui/react'
import CustomButton from '../CustomButton';


export default function ExcelTablesActionBar({ data, isLoading, isDisabled, handleTableCreation, tableIndex, setTableIndex }: any) {

    return (
        <>
            {data.length > 0 ?
                <HStack position={"fixed"} bottom={0} left={0} right={0} height={50} background={"#FFFFFF"} spacing={3} >
                        <CustomButton onClick={handleTableCreation} isLoading={isLoading} isDisabled={isDisabled} w={(tableIndex < data.length - 1) ? "75%" : "100%"}> Create</CustomButton>
                        {
                            (tableIndex < data.length - 1) ?
                                <>
                                    <CustomButton onClick={() => setTableIndex(tableIndex + 1)}> Next</CustomButton>
                                    <Text> {tableIndex + 1} of {data.length}</Text>
                                </> : <></>
                        }
                </HStack>
                :
                <></>
            }
        </>
    );
}
