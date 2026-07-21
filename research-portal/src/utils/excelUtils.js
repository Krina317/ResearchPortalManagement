import * as XLSX from "xlsx";

/**
 * Reads an uploaded Excel file (.xls/.xlsx)
 * Returns:
 * {
 *    data: [],
 *    columns: []
 * }
 */

export const readExcelFile = (file) => {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = (event) => {

            try {

                const rawData = event.target.result;

                const workbook = XLSX.read(rawData, {
                    type: "array",
                    cellDates: true
                });

                const sheetName = workbook.SheetNames[0];

                const worksheet = workbook.Sheets[sheetName];

                const jsonData = XLSX.utils.sheet_to_json(
                    worksheet,
                    {
                        raw: false
                    }
                );

                if (jsonData.length === 0) {

                    resolve({
                        data: [],
                        columns: []
                    });

                    return;
                }

                const columns = Object.keys(jsonData[0])
                    .filter(col => col !== "Download File");

                resolve({

                    data: jsonData,

                    columns

                });

            }

            catch (error) {

                reject(error);

            }

        };

        reader.onerror = () => {

            reject("Unable to read file.");

        };

        reader.readAsArrayBuffer(file);

    });

};