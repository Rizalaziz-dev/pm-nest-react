import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // 👈 The new library
import { toast } from 'react-hot-toast';

interface Props {
  onBulkSubmit: (projects: any[]) => void;
  isLoading: boolean;
}

export default function BulkUploadForm({ onBulkSubmit, isLoading }: Props) {
  const [previewCount, setPreviewCount] = useState<number>(0);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>("");

  // 1. GENERATE & DOWNLOAD TEMPLATE
  const handleDownloadTemplate = () => {
    // Define the headers exactly as your system needs them
    const headers = [
      { 
        assyNumber: "821-EXAMPLE", 
        customer: "Toyota", 
        totalPo: 500, 
        orderDate: "2023-10-01", 
        etd: "2023-10-15",
        scope: "NEW_ASSY",
        plotting: "REGULAR"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(headers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    
    // Trigger download
    XLSX.writeFile(wb, "Project_Upload_Template.xlsx");
  };

  // 2. HANDLE EXCEL FILE UPLOAD
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });

      // Grab the first sheet
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      // Convert to JSON
      const data = XLSX.utils.sheet_to_json(ws);
      
      setPreviewCount(data.length);
      
      // Clean/Format Data
      const formattedData = data.map((row: any) => ({
          assyNumber: row.assyNumber,
          customer: row.customer,
          totalPo: Number(row.totalPo),
          plotting: row.plotting || "REGULAR",
          scope: row.scope || "NEW_ASSY",
          orderDate: row.orderDate ? new Date(row.orderDate).toISOString() : new Date().toISOString(),
          etd: row.etd ? new Date(row.etd).toISOString() : new Date().toISOString(),
      }));

      setParsedData(formattedData);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER WITH DOWNLOAD BUTTON */}
      <div className="flex justify-between items-center bg-base-200 p-4 rounded-lg">
        <div>
            <h4 className="font-bold">Step 1: Get the Format</h4>
            <p className="text-xs opacity-70">Download the Excel template to see required columns.</p>
        </div>
        <button 
            onClick={handleDownloadTemplate}
            className="btn btn-sm btn-outline"
        >
            📥 Download Template
        </button>
      </div>

      {/* FILE DROP ZONE */}
      <div className="border-2 border-dashed border-base-300 rounded-lg p-10 text-center hover:bg-base-100 transition-colors">
        <label className="cursor-pointer">
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">📂</span>
            <span className="btn btn-primary">Select Excel File</span>
            <span className="text-xs opacity-50">Supports .xlsx or .csv</span>
          </div>
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            className="hidden" 
            onChange={handleFileUpload} 
          />
        </label>
        {fileName && <p className="mt-4 font-bold text-success">Selected: {fileName}</p>}
      </div>

      {/* PREVIEW & SUBMIT */}
      {previewCount > 0 && (
        <div className="alert alert-info">
          <span>✅ Found <strong>{previewCount}</strong> projects in file.</span>
        </div>
      )}

      <button 
        className="btn btn-success w-full" 
        disabled={isLoading || previewCount === 0}
        onClick={() => onBulkSubmit(parsedData)}
      >
        {isLoading ? (
            <span className="loading loading-spinner"></span> 
        ) : (
            `🚀 Launch ${previewCount} Projects`
        )}
      </button>
    </div>
  );
}