import { MemoryRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import UploadFromExcelsTables from "./pages/tools/UploadFromExcelsTables";
import FindInSnap from "./pages/tools/FindInSnap";
import FindInResources from "./pages/tools/FindInResources";
import DeleteQuote from "./pages/tools/DeleteQuote";
import UnsubmitQuote from "./pages/tools/UnsubmitQuote";
import DeleteLogs from "./pages/tools/DeleteLogs";
import AddTableDescription from "./pages/tools/AddTableDescription";
import TimeElapsed from "./pages/tools/timeElapsed";
import PrintValueRuleName from "./pages/tools/PrintValueRuleName";

export default function App() {
  return (
    <MemoryRouter >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/loadFromExcel" element={<UploadFromExcelsTables />} />
        <Route path="/tools/findBreakpoints" element={<FindInSnap />} />
        <Route path="/tools/findWriteLog" element={<FindInSnap />} />
        <Route path="/tools/findReferences" element={<FindInResources />} />
        <Route path="/tools/deleteQuote" element={<DeleteQuote />} />
        <Route path="/tools/unsubmitQuote" element={<UnsubmitQuote />} />
        <Route path="/tools/deleteLogs" element={<DeleteLogs />} />
        <Route path="/tools/addTableDescription" element={<AddTableDescription />} />
        <Route path="/tools/timeElapsed" element={<TimeElapsed />} />
        <Route path="/tools/printValueRuleName" element={<PrintValueRuleName />} />
      </Routes>
    </MemoryRouter >
  );
}