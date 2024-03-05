import React from 'react';
import {
    Card, Input, CardBody, Text,
    VStack, HStack, Button, Center, FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
} from '@chakra-ui/react'

import { useNavigate } from "react-router-dom";
import readXlsxFile, { Row } from 'read-excel-file'

import CustomTable from '../../components/CustomTable';

import { useFetch } from '../../hooks/useFetch';


export interface CustomTableData {
    types: Array<string>,
    columnNames: Array<string>,
    data: Array<any>[]
}

const isNumeric = (str: string) => {
    if (!isNaN(Number(str))) return true
    if (!isNaN(parseFloat(str))) return true
    return false

}
const getColumnType = (rows: Row[], columnIndex: number): string => {
    var isNumber = true;
    var isBoolean = true;

    rows.map((row) => {
        const cellContent : string = (row[columnIndex]) ? row[columnIndex] as string : ""; 
        if (!isNumeric(cellContent)) isNumber = false;
        if (cellContent != 'true' && cellContent != 'false' && Number(cellContent) != 0 && Number(cellContent) != 1) isBoolean = false;
    })

    if (isBoolean) return 'boolean'
    if (isNumber) return 'number'
    return 'text'
}

export default function UploadFromExcelsTables() {
    const navigate = useNavigate();

    const { fetchData, error, loading, doFetchPost } = useFetch();

    const [tablesNames, setTablesNames] = React.useState([] as string[]);
    const [data, setData] = React.useState([] as CustomTableData[]);
    const [index, setIndex] = React.useState(0);

    const [tablesCreated, setTablesCreated] = React.useState([] as number[])

    const inputExcels = (e: React.FormEvent<HTMLInputElement>) => {
        if (e.currentTarget.files) {
            var tablesData = [] as CustomTableData[];
            //files names
            const filesNames = [] as string[];

            Array.from(e.currentTarget.files).map((file, index) => {

                filesNames.push(file.name.split(".")[0].split(" ").join(""));

                readXlsxFile(file).then((rows) => {
                    // new file
                    const tableData: CustomTableData = { types: [], columnNames: [], data: [] };
                    const headers: Row = rows[0];
                    rows.shift();
                    //names
                    headers.map((header, index) => {
                        tableData.columnNames.push((header as string).split(" ").join(""));
                        tableData.types.push(getColumnType(rows, index));
                    })

                    //data
                    rows.map((data) => {
                        //for each cell
                        const rowData = [] as String[];
                        data.map((cell) => {
                            rowData.push(cell as string);
                        })
                        tableData.data.push(rowData);
                    })

                    //
                    tablesData.push(tableData);

                }).then(() => {
                    setData([...tablesData]);
                    setTablesNames([...filesNames]);
                    setIndex(0);
                });

            })
        }
    }

    const handleTableCreation = async () => {
        // create columns
        var columns = [] as any[];
        data[index].columnNames.map((columnName, columnIndex) => {
            columns.push({
                name: columnName,
                type: data[index].types[columnIndex]
            })
        });

        await doFetchPost("/api/tables?waitForRefresh=false", {
            name: tablesNames[index],
            columns: columns,
            data: data[index].data
        }).then(() => (!error) ? setTablesCreated([...tablesCreated, index]) : null);

    }

    return (
        <VStack w={"500px"} spacing={4} maxH={600} overflowY={"auto"}>
            <Card>
                <CardBody>
                    <Input type='file' multiple accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={inputExcels} />
                </CardBody>
            </Card>

            <>
                {
                    data.length > 0 ?
                        <VStack spacing={2}>
                            <FormControl isInvalid={error}>
                                <FormLabel>Table Name</FormLabel>
                                <Input value={tablesNames[index]} onChange={(e) => {
                                    tablesNames[index] = e.target.value;
                                    setTablesNames([...tablesNames]);
                                    //enable create button
                                    const indexInArr = tablesCreated.indexOf(index);
                                    if (indexInArr !== -1) {
                                        tablesCreated.splice(index, 1);
                                    }
                                    setTablesCreated([...tablesCreated]);

                                }} />
                                {error ? (
                                    <FormErrorMessage>Error: {fetchData == "400" ? "Table name probably already in use" : fetchData} </FormErrorMessage>
                                ) : (
                                    <></>
                                )}
                            </FormControl>

                            <CustomTable types={data[index].types} columnNames={data[index].columnNames} data={data[index].data} />
                        </VStack>
                        :
                        <></>
                }
            </>
            <Center paddingTop={50}></Center>
            <HStack position={"fixed"} bottom={0} left={0} right={0} height={50} background={"gray"} spacing={3}>

                {
                    data.length > 0 ?
                        <>
                            <Button onClick={handleTableCreation} isLoading={loading} isDisabled={tablesCreated.includes(index)}> Create</Button>
                            {
                                (index < data.length - 1) ?
                                    <>
                                        <Button onClick={() => setIndex(index + 1)} bg={"blue.400"}
                                            color={"white"}> Next</Button>
                                        <Text> {index + 1} of {data.length}</Text>
                                    </> : <></>
                            }
                        </>
                        :
                        <></>
                }

            </HStack>

        </VStack>

    );
}
