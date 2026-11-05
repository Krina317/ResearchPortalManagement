import ExcelJS from "exceljs/dist/exceljs.min.js";

const COLORS = ["#047857", "#10b981", "#6ee7b7", "#f59e0b", "#6366f1", "#ec4899"];
const ROW_PX = 20; // default Excel row height in pixels

/* ---------- chart drawing (canvas -> PNG) ---------- */

function newCanvas(width, height, scale = 2) {
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    return { canvas, ctx };
}

function drawPie(data) {
    const width = 640, height = 320;
    const { canvas, ctx } = newCanvas(width, height);
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const cx = 150, cy = 160, r = 120;

    if (total === 0) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.fillStyle = "#e5e7eb";
        ctx.fill();
    } else {
        let start = -Math.PI / 2;
        data.forEach((d, i) => {
            if (d.value <= 0) return;
            const angle = (d.value / total) * 2 * Math.PI;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, start, start + angle);
            ctx.closePath();
            ctx.fillStyle = COLORS[i % COLORS.length];
            ctx.fill();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.5;
            ctx.stroke();
            start += angle;
        });
    }

    ctx.font = "14px Arial";
    ctx.textBaseline = "middle";
    data.forEach((d, i) => {
        const y = 60 + i * 28;
        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.fillRect(320, y - 7, 14, 14);
        ctx.fillStyle = "#374151";
        const pct = total > 0 ? ` (${Math.round((d.value / total) * 100)}%)` : "";
        ctx.fillText(`${d.label}: ${d.value}${pct}`, 345, y);
    });

    return { dataUrl: canvas.toDataURL("image/png"), width, height };
}

function drawBar(data) {
    const height = 320;
    const width = Math.max(640, data.length * 56 + 80);
    const { canvas, ctx } = newCanvas(width, height);

    const max = Math.max(1, ...data.map(d => d.value));
    const chartH = height - 90;
    const baseY = height - 60;
    const step = (width - 60) / Math.max(1, data.length);
    const barW = 28;

    ctx.strokeStyle = "#9ca3af";
    ctx.beginPath();
    ctx.moveTo(40, baseY);
    ctx.lineTo(width - 10, baseY);
    ctx.stroke();

    ctx.textAlign = "center";
    data.forEach((d, i) => {
        const x = 50 + i * step + (step - barW) / 2;
        const h = (d.value / max) * chartH;

        ctx.fillStyle = "#10b981";
        ctx.fillRect(x, baseY - h, barW, h);

        ctx.fillStyle = "#374151";
        ctx.font = "bold 12px Arial";
        ctx.fillText(String(d.value), x + barW / 2, baseY - h - 10);

        ctx.fillStyle = "#6b7280";
        ctx.font = "12px Arial";
        ctx.fillText(d.label, x + barW / 2, baseY + 18);
    });

    return { dataUrl: canvas.toDataURL("image/png"), width, height };
}

/* ---------- workbook helpers ---------- */

function safeSheetName(name) {
    return String(name).replace(/[\\/?*[\]:]/g, " ").slice(0, 31);
}

/*
 * sheets: [
 *   {
 *     name: "Faculty Scores",
 *     blocks: [
 *       {
 *         title: "Faculty scores",
 *         columns: ["Sr. No.", "Faculty Name", "Score"],
 *         rows: [[1, "Dr. A", 2.5], ...],
 *         totalRow: ["", "Total (12 faculty)", 20.5],   // optional, bold row under the table
 *         chart: "pie" | "bar"                           // optional, uses first two columns
 *       }
 *     ]
 *   }
 * ]
 */
export async function exportReportToExcel({ fileName, sheets }) {
    const workbook = new ExcelJS.Workbook();
    let tableCounter = 0;

    for (const sheet of sheets) {
        const ws = workbook.addWorksheet(safeSheetName(sheet.name));
        const widths = [];
        let row = 1;

        for (const block of sheet.blocks) {
            const columns = block.columns.map(String);
            const rows = block.rows.length > 0
                ? block.rows
                : [columns.map((_, i) => (i === 0 ? "No data" : ""))];

            // block title
            const titleCell = ws.getCell(row, 1);
            titleCell.value = block.title;
            titleCell.font = { bold: true, size: 13 };
            row += 1;

            // real Excel table (filter buttons, banded rows)
            tableCounter += 1;
            ws.addTable({
                name: `ReportTable${tableCounter}`,
                ref: `A${row}`,
                headerRow: true,
                totalsRow: false,
                style: { theme: "TableStyleMedium2", showRowStripes: true },
                columns: columns.map(name => ({ name, filterButton: true })),
                rows
            });

            // column widths
            columns.forEach((c, i) => {
                widths[i] = Math.max(widths[i] ?? 0, c.length);
            });
            rows.forEach(r => r.forEach((v, i) => {
                widths[i] = Math.max(widths[i] ?? 0, String(v ?? "").length);
            }));

            row += rows.length + 1; // header + data rows

            if (block.totalRow) {
                block.totalRow.forEach((v, i) => {
                    const cell = ws.getCell(row, i + 1);
                    cell.value = v;
                    cell.font = { bold: true };
                    widths[i] = Math.max(widths[i] ?? 0, String(v ?? "").length);
                });
                row += 1;
            }

            // chart image under the table
            if (block.chart && block.rows.length > 0) {
                const chartData = block.rows.map(r => ({
                    label: String(r[0]),
                    value: Number(r[1]) || 0
                }));
                const img = block.chart === "pie" ? drawPie(chartData) : drawBar(chartData);
                const imageId = workbook.addImage({
                    base64: img.dataUrl.split(",")[1],
                    extension: "png"
                });
                ws.addImage(imageId, {
                    tl: { col: 0, row },        // 0-based, so this is the row after the table
                    ext: { width: img.width, height: img.height }
                });
                row += Math.ceil(img.height / ROW_PX) + 1;
            }

            row += 2; // gap before the next block
        }

        widths.forEach((w, i) => {
            ws.getColumn(i + 1).width = Math.min(Math.max(w + 4, 10), 60);
        });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}