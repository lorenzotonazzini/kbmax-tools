import { MemoryRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import UploadFromExcelsTables from "./pages/tools/UploadFromExcelsTables";
import FindInResources from "./pages/tools/FindInResources";
import TableReference from "./pages/tools/TableReference";

export default function App() {
  return (
    <MemoryRouter >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/loadFromExcel" element={<UploadFromExcelsTables />} />
        <Route path="/tools/findBreakpoints" element={<FindInResources />} />
        <Route path="/tools/findWriteLog" element={<FindInResources />} />
        <Route path="/tools/tableReference" element={<TableReference />} />
      </Routes>
    </MemoryRouter >
  );
}