
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, FileSpreadsheet, X } from "lucide-react";
import * as XLSX from 'xlsx';

interface UtilityData {
  electricity: number;
  gasoline: number;
  naturalGas: number;
  month: string;
}

interface FileUploadProps {
  onDataExtracted: (data: UtilityData) => void;
}

const FileUpload = ({ onDataExtracted }: FileUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);

    try {
      if (file.type.includes('excel') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        await processExcelFile(file);
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        await processPDFFile(file);
      } else {
        throw new Error('不支援的檔案格式');
      }
    } catch (error) {
      console.error('檔案處理錯誤:', error);
      alert('檔案處理失敗，請確認檔案格式正確');
    } finally {
      setIsProcessing(false);
    }
  };

  const processExcelFile = async (file: File) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // 嘗試從Excel中提取用電量、汽油使用量和天然氣使用量
    // 這裡假設Excel文件有特定的格式
    let electricity = 0;
    let gasoline = 0;
    let naturalGas = 0;
    let month = new Date().getMonth() + 1 + '月';

    console.log('Excel數據:', jsonData);

    // 簡單的數據提取邏輯 - 可以根據實際表格格式調整
    jsonData.forEach((row: any) => {
      Object.keys(row).forEach(key => {
        const value = parseFloat(row[key]);
        if (!isNaN(value)) {
          if (key.includes('電') || key.includes('用電') || key.toLowerCase().includes('electric')) {
            electricity = Math.max(electricity, value);
          } else if (key.includes('汽油') || key.includes('油料') || key.toLowerCase().includes('gasoline')) {
            gasoline = Math.max(gasoline, value);
          } else if (key.includes('天然氣') || key.includes('瓦斯') || key.toLowerCase().includes('gas')) {
            naturalGas = Math.max(naturalGas, value);
          }
        }
      });
    });

    onDataExtracted({ electricity, gasoline, naturalGas, month });
  };

  const processPDFFile = async (file: File) => {
    // 簡化的PDF處理 - 實際應用中需要使用PDF.js或其他PDF解析庫
    // 這裡我們模擬從PDF中提取數據
    
    // 模擬PDF解析延遲
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 模擬提取的數據 - 實際應用中需要實現真正的PDF文字識別
    const mockData = {
      electricity: 350,
      gasoline: 45,
      naturalGas: 25,
      month: new Date().getMonth() + 1 + '月'
    };

    console.log('PDF數據提取完成 (模擬):', mockData);
    onDataExtracted(mockData);
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('excel') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      return <FileSpreadsheet className="w-6 h-6 text-green-600" />;
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      return <FileText className="w-6 h-6 text-red-600" />;
    }
    return <FileText className="w-6 h-6 text-gray-600" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-emerald-600" />
          上傳水電費單
        </CardTitle>
        <CardDescription>
          支援PDF或Excel格式的水電費帳單，系統將自動提取用量數據
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!uploadedFile ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-gray-600">點擊上傳或拖拽檔案到此處</p>
              <p className="text-sm text-gray-500">支援 PDF、Excel (.xlsx/.xls) 格式</p>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.xlsx,.xls,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              onChange={handleFileUpload}
              className="mt-4 cursor-pointer"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getFileIcon(uploadedFile)}
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {isProcessing && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">正在處理檔案...</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
