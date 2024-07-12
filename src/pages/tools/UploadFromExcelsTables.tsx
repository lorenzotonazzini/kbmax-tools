import React from 'react';
import {
    Card, Input, CardBody,
    VStack, Button, Center, FormControl,
    FormLabel,
    FormErrorMessage,
    useToast,
    Alert,
    AlertIcon,
    AlertDescription
} from '@chakra-ui/react'

import readXlsxFile, { Row } from 'read-excel-file'

import CustomTable from '../../components/CustomTable';

import { useFetch } from '../../hooks/useFetch';
import ExcelTablesActionBar from '../../components/tablesfromExcel/ExcelTablesActionBar';
import { TableFound } from '../../interfaces/Table';


export interface CustomTableData {
    types: Array<string>,
    columnNames: Array<string>,
    data: Array<any>[]
}

const isNumeric = (str: string) => {
    const regExTest = /^-?[0-9]\d*(\.\d+)?$/;

    if (typeof str === 'number') {
        return true;
    }

    str = str.replace(",", ".");

    return regExTest.test(str);

}
const getColumnType = (rows: Row[], columnIndex: number): string => {
    var isNumber = true;
    var isBoolean = true;

    rows.map((row) => {
        const cellContent: string = (row[columnIndex]) ? row[columnIndex] as string : "";
        if (!isNumeric(cellContent)) isNumber = false;
        if (cellContent != 'true' && cellContent != 'false' && Number(cellContent) != 0 && Number(cellContent) != 1) isBoolean = false;
    })

    if (isBoolean) return 'boolean'
    if (isNumber) return 'number'
    return 'text'
}

const toTitleCase =(str: string) : string => str.replace(
      /\w\S*/g,
      text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );

export default function UploadFromExcelsTables() {

    const { fetchData, error, loading, doFetchPost, doFetchPut } = useFetch();

    const [tablesNames, setTablesNames] = React.useState([] as string[]);
    const [data, setData] = React.useState([] as CustomTableData[]);
    const [index, setIndex] = React.useState(0);

    const toast = useToast();

    const [tablesCreated, setTablesCreated] = React.useState([] as number[])

    const inputExcels = (e: React.FormEvent<HTMLInputElement>) => {
        if (e.currentTarget.files) {
            var tablesData = [] as CustomTableData[];
            //files names
            const filesNames = [] as string[];

            const promises = [] as Promise<Row[]>[];
            Array.from(e.currentTarget.files).map((file, index) => {
                filesNames.push(file.name.split(".")[0].split(" ").join(""));
                promises.push(readXlsxFile(file))
            });

            Promise.all(promises).then((table) => {
                table.map((rows) => {
                    // new file
                    const tableData: CustomTableData = { types: [], columnNames: [], data: [] };
                    const headers: Row = rows[0];
                    rows.shift();

                    //names
                    headers.map((header, index) => {
                        tableData.columnNames.push(toTitleCase(header as string).split(" ").join(""));
                        console.log(toTitleCase(header as string));

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
                });

            }).then(() => {
                setData(tablesData);
                setTablesNames(filesNames);
                setIndex(0);

            });

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

    const findTableByName = async () => {
        await doFetchPost("/api/tables/search", {
            query: tablesNames[index],
            fields: [
                "id",
                "name"
            ],
            sortField: "name",
            skip: 0,
            take: 1000
        });
        toast.closeAll();
    }

    React.useEffect(() => {
        if (fetchData) {

            if (Array.isArray(fetchData)) {
                //find existing table id
                const tableInfo = (fetchData as TableFound[]).find(data => data.name == tablesNames[index]);

                if (tableInfo) {
                    const tableId = tableInfo.id;

                    // create columns
                    var columns = [] as any[];
                    data[index].columnNames.map((columnName, columnIndex) => {
                        columns.push({
                            name: columnName,
                            type: data[index].types[columnIndex]
                        })
                    });

                    doFetchPut("/api/tables/" + tableId, {
                        id: tableId,
                        name: tablesNames[index],
                        columns: columns,
                        data: data[index].data
                    })
                }

            }
            else if (isNaN(parseInt(fetchData))) {
                //table created
                toast({
                    title: 'Success',
                    description: "Action performed",
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                })
            }
        }

    }, [fetchData]);

    React.useEffect(() => {
        if (fetchData == 400) {
            toast({
                title: 'Error',
                description: "Name already in use, do you want to overwrite the table?",
                status: 'error',
                duration: 5000,
                isClosable: true,
                render: () => (
                    <Alert status='info' variant='solid'>
                        <AlertIcon />
                        <AlertDescription> Name already in use, do you want to overwrite the table?</AlertDescription>
                        <Button onClick={findTableByName}>Yes</Button>
                        <Button onClick={() => toast.closeAll()}>No</Button>
                    </Alert>
                )
            })
        }
        else if (error) {
            toast({
                title: 'Error',
                description: "Error",
                status: 'error',
                duration: 1000,
                isClosable: true,
            })
        }

    }, [error])

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
            <ExcelTablesActionBar data={data} isLoading={loading} isDisabled={tablesCreated.includes(index)} handleTableCreation={handleTableCreation} tableIndex={index} setTableIndex={setIndex} />
        </VStack>
    );
}
