// import { useState } from "react";
// import * as XLSX from "xlsx";
import { useState } from "react";
import { readExcelFile } from "../utils/excelUtils";

const FileUpload = ({setData, setColumns, setSelectedColumns}) => {
    const [fileName, setFileName] = useState("");

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if(!file) return;
        setFileName(file.name);
        try{
            const result = await readExcelFile(file);
            setData(result.data);
            setColumns(result.columns);
            setSelectedColumns(result.columns);
        }
        catch (err) {

            console.error("Excel Error:", err);
        
            alert(err);
        
        }
    };
    return(
        <div className="upload-row">
            <div className="upload-btn">
                <span className="upload-btn-label">⇪ Choose file</span>
                <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
            </div>
            {fileName ? (
                <span className="upload-filename">{fileName}</span>
            ) : (
                <span className="upload-hint">Accepts .xls or .xlsx files</span>
            )}
        </div>
    )
};

export default FileUpload;