import { useState } from "react";
import { useParams } from "react-router-dom";
import UploadHeader from "./UploadHeader";
import UploadBox from "./UploadBox";
import UploadPreviewTable from "./UploadPreviewTable";
import UploadSummaryCard from "./UploadSummaryCard";
import UploadPagination from "./UploadPagination";
import { uploadConferenceFile, uploadJournalFile } from "../../api/publicationApi";

const UPLOAD_HANDLERS = {
    conference: uploadConferenceFile,
    journal: uploadJournalFile
    // "book-chapters": not implemented on backend yet
};

function parseFileForPreview(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = (e) => {

            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(e.target.result, "text/html");
                const table = doc.querySelector("table");

                if (!table) {
                    resolve({ headers: [], rows: [] });
                    return;
                }

                const rowEls = Array.from(table.querySelectorAll("tr"));

                if (rowEls.length === 0) {
                    resolve({ headers: [], rows: [] });
                    return;
                }
                let headerCells = Array.from(rowEls[0].querySelectorAll("th"));
                if (headerCells.length === 0) {
                    headerCells = Array.from(rowEls[0].querySelectorAll("td"));
                }
                const headers = headerCells.map(c => c.textContent.trim());

                const rows = rowEls.slice(1)
                    .map(tr => Array.from(tr.querySelectorAll("td")).map(td => td.textContent.trim()))
                    .filter(cells => cells.some(cell => cell !== ""));

                resolve({ headers, rows });

            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(new Error("Could not read file."));

        reader.readAsText(file);

    });

}

export default function UploadPage() {

    const { publicationType } = useParams();

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [previewError, setPreviewError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const uploadHandler = UPLOAD_HANDLERS[publicationType];

    async function handleFileSelect(file) {

        setSelectedFile(file);
        setResult(null);
        setError("");
        setPreview(null);
        setPreviewError("");

        try {
            const parsed = await parseFileForPreview(file);
            if (parsed.rows.length === 0) {
                setPreviewError("Couldn't find a readable table in this file.");
            } else {
                setPreview(parsed);
            }
        } catch (err) {
            console.error(err);
            setPreviewError("Couldn't preview this file.");
        }

    }

    async function handleUpload() {

        if (!selectedFile) {
            setError("Please choose a file first.");
            return;
        }

        if (!uploadHandler) {
            setError(`Upload for "${publicationType}" isn't wired up on the backend yet.`);
            return;
        }

        setUploading(true);
        setError("");
        setResult(null);

        try {

            const data = await uploadHandler(selectedFile);
            setResult(data);

        } catch (err) {
            console.error(err);
            setError(err.message || "Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }

    }

    return (

        <div className="px-8 py-6 bg-gray-50 min-h-screen">

            <UploadHeader/>

            <UploadBox
                selectedFile={selectedFile}
                onFileSelect={handleFileSelect}
                onUpload={handleUpload}
                uploading={uploading}
                error={error}
            />

            {previewError && (
                <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-yellow-700">
                    {previewError}
                </div>
            )}

            {preview && <UploadPreviewTable headers={preview.headers} rows={preview.rows} />}

            {result && <UploadSummaryCard result={result} />}

        </div>

    );

}