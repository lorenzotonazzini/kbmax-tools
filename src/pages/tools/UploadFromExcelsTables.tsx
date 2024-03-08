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
import ExcelTablesActionBar from '../../components/tablesfromExcel/ExcelTablesActionBar';


export interface CustomTableData {
    types: Array<string>,
    columnNames: Array<string>,
    data: Array<any>[]
}

const isNumeric = (str: string) => {
    const regExTest = /^-?[0-9]\d*(\.\d+)?$/;
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

export default function UploadFromExcelsTables() {

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
                });

            }).then(() => {
                setData(tablesData);
                setTablesNames(filesNames);
                setIndex(0);

            });

        }
    }

    React.useEffect(() => {
        data.map((table, index) => console.log(index, tablesNames[index], table))
    }, [data]);

    const handleTableCreation = async () => {
        // create columns
        var columns = [] as any[];
        data[index].columnNames.map((columnName, columnIndex) => {
            columns.push({
                name: columnName,
                type: data[index].types[columnIndex]
            })
        });
        console.log("CALL ___________________________________")
        console.log(index, {
            name: tablesNames[index],
            columns: columns,
            data: data[index].data
        })
        /*await doFetchPost("/api/tables?waitForRefresh=false", { 
            name: tablesNames[index],
            columns: columns,
            data: data[index].data
        }).then(() => (!error) ? setTablesCreated([...tablesCreated, index]) : null);*/

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
            <ExcelTablesActionBar data={data} isLoading={loading} isDisabled={tablesCreated.includes(index)} handleTableCreation={handleTableCreation} tableIndex={index} setTableIndex={setIndex} />
        </VStack>
    );
}
