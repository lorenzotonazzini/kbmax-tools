import { MemoryRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import UploadFromExcelsTables from "./pages/tools/UploadFromExcelsTables";
import FindInSnap from "./pages/tools/FindInSnap";
import FindInResources from "./pages/tools/FindInResources";
import DeleteQuote from "./pages/tools/DeleteQuote";
import UnsubmitQuote from "./pages/tools/UnsubmitQuote";

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
      </Routes>
    </MemoryRouter >
  );
}