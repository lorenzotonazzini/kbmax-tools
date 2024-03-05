import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableContainer,
    Box
} from '@chakra-ui/react'
import { CustomTableData } from '../pages/tools/UploadFromExcelsTables';

export default function CustomTable(params: CustomTableData) {

    return (
        <Box maxW={450} overflowX={"auto"}>
            <TableContainer >
                <Table variant='striped' colorScheme='teal'>
                    <Thead>
                        <Tr>
                            {
                                params.columnNames.map((columnName, index) =>
                                    <Td isNumeric={params.types[index] == "number"}>{columnName}</Td>
                                )
                            }
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            params.data.map(dataRow =>
                                <Tr>
                                    {dataRow.map((data, index) => <Td isNumeric={params.types[index] == "number" || params.types[index] == "boolean"}>{data + ""}</Td>)}
                                </Tr>
                            )
                        }
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            {
                                params.types.map((columnType) =>
                                    <Th>{columnType}</Th>
                                )
                            }
                        </Tr>
                    </Tfoot>
                </Table>
            </TableContainer>
        </Box>
    );

}