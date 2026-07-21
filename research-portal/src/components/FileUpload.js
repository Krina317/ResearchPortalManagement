// import { useState } from "react";
// import * as XLSX from "xlsx";
import { readExcelFile } from "../utils/excelUtils";

const FileUpload = ({setData, setColumns, setSelectedColumns}) => {
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if(!file) return;
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
        <div style={{ marginBottom : "20px" }}>
            <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
        </div>
    )
};

export default FileUpload;