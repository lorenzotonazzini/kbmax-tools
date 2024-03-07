import {
    Accordion,
    Center,
} from '@chakra-ui/react'

import { useNavigate } from "react-router-dom";

import ExpanderTool from "../components/ExpanderTool";
import { ResouceType, ResourceSearchAPI } from '../interfaces/Resources';

const ToolsList = [
    {
        name: "Upload tables from Excels",
        description:
            "Uploads in the internal tables one or more excel tables, the name is the same as the file, the column names are the values of the first row (without spaces) and the types are guessed (text, number or boolean)",
        route: "/tools/loadFromExcel"
    },
    {
        name: "Table References",
        description:
            "If a table is used a lot you can easily forget where it is used, this tool helps you discover all the references to it (configurators, scenes, safe functions and quote headers!)",
        route: "/tools/findReferences",
        param: {
            type: ResouceType.Table,
            searchIn: [ResourceSearchAPI.Products, ResourceSearchAPI.Scenes, ResourceSearchAPI.SafeFunctions, ResourceSearchAPI.QuoteHeader, ResourceSearchAPI.QuoteOutput]
        }
    },
    {
        name: "Configurator References",
        description:
            "Find out where a configurator is being used (as nested in another configurator)",
        route: "/tools/findReferences",
        param: {
            type: ResouceType.Product,
            searchIn: [ResourceSearchAPI.Products]
        }
    },
    {
        name: "Scene References",
        description:
            "Find out where a scene is referenced",
        route: "/tools/findReferences",
        param: {
            type: ResouceType.Scene,
            searchIn: [ResourceSearchAPI.Products]
        }
    },
    {
        name: "Safe Function References",
        description:
            "Find out where a safe function is used",
        route: "/tools/findReferences",
        param: {
            type: ResouceType.SafeFunction,
            searchIn: [ResourceSearchAPI.Products, ResourceSearchAPI.Scenes, ResourceSearchAPI.SafeFunctions, ResourceSearchAPI.QuoteHeader, , ResourceSearchAPI.QuoteOutput, ResourceSearchAPI.WorkFlow, ResourceSearchAPI.CustomAction]
        }
    },
    {
        name: "Find breakpoints",
        description:
            "When you have very complex projects it can happen that you lose breakpoints around, making debugging a difficult task, this tool helps you find them",
        route: "/tools/findBreakpoints",
        param: ["debugger"]
    },
    {
        name: "Find write-logs",
        description:
            "Often finding all the 'write logs' in a project is complicated when there start to be several configurators, this tool helps you find them all",
        route: "/tools/findWriteLog",
        param: ["console.log", "e.logs.push"]
    }
];
export default function ToolsPage() {
    const navigate = useNavigate();
    return (
        <Center w={"500px"}>
            <Accordion allowToggle w={"500px"}>
                {ToolsList.map((tool) => (
                    <ExpanderTool
                        name={tool.name}
                        description={tool.description}
                        onClick={() => navigate(tool.route, {
                            state: {
                                params: tool.param
                            }
                        })}
                    />
                ))}
            </Accordion>
        </Center>

    );
}
