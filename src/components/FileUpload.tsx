
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, FileSpreadsheet, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';

// 設定PDF.js worker - 使用本地worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

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
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);

    try {
      if (file.type.includes('excel') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        await processExcelFile(file);
        toast({
          title: "Excel文件處理成功",
          description: "已成功提取用量數據",
        });
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        await processPDFFile(file);
        toast({
          title: "PDF文件處理成功",
          description: "已成功提取用量數據",
        });
      } else {
        throw new Error('不支援的檔案格式');
      }
    } catch (error) {
      console.error('檔案處理錯誤:', error);
      toast({
        title: "檔案處理失敗",
        description: error instanceof Error ? error.message : "請確認檔案格式正確或檢查網路連線",
        variant: "destructive",
      });
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
    let electricity = 0;
    let gasoline = 0;
    let naturalGas = 0;
    let month = new Date().getMonth() + 1 + '月';

    console.log('Excel數據:', jsonData);

    // 數據提取邏輯
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
    try {
      console.log('開始解析PDF文件:', file.name);
      
      // 將文件轉換為ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // 載入PDF文檔
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true
      });
      
      const pdf = await loadingTask.promise;
      console.log('PDF頁數:', pdf.numPages);
      
      let fullText = '';
      
      // 提取所有頁面的文字
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n';
        console.log(`第${pageNum}頁文字:`, pageText);
      }
      
      console.log('完整PDF文字內容:', fullText);
      
      // 解析提取的文字內容
      const extractedData = parseUtilityBillText(fullText);
      
      onDataExtracted(extractedData);
    } catch (error) {
      console.error('PDF解析錯誤:', error);
      if (error instanceof Error && error.message.includes('worker')) {
        throw new Error('PDF解析服務暫時無法使用，請稍後再試或使用Excel格式');
      }
      throw new Error('PDF文件解析失敗，請確認文件未損壞');
    }
  };

  const parseUtilityBillText = (text: string): UtilityData => {
    console.log('開始解析文字內容...');
    
    let electricity = 0;
    let gasoline = 0;
    let naturalGas = 0;
    let month = new Date().getMonth() + 1 + '月';
    
    // 月份提取
    const monthMatches = text.match(/(\d{1,2})月|(\d{4})年(\d{1,2})月/);
    if (monthMatches) {
      month = monthMatches[1] ? monthMatches[1] + '月' : monthMatches[3] + '月';
    }
    
    // 電力使用量提取
    const electricityPatterns = [
      /用電量[：:]\s*(\d+(?:\.\d+)?)/,
      /本期用電[：:]\s*(\d+(?:\.\d+)?)/,
      /電力消費[：:]\s*(\d+(?:\.\d+)?)/,
      /(\d+(?:\.\d+)?)\s*度/,
      /(\d+(?:\.\d+)?)\s*kwh/i,
      /電費.*?(\d+(?:\.\d+)?)/,
      /用電.*?(\d+(?:\.\d+)?)/
    ];
    
    for (const pattern of electricityPatterns) {
      const match = text.match(pattern);
      if (match) {
        const value = parseFloat(match[1]);
        if (value > electricity && value < 10000) {
          electricity = value;
          console.log('找到電力使用量:', value);
        }
      }
    }
    
    // 汽油使用量提取
    const gasolinePatterns = [
      /汽油[：:]\s*(\d+(?:\.\d+)?)/,
      /油料[：:]\s*(\d+(?:\.\d+)?)/,
      /加油[：:]\s*(\d+(?:\.\d+)?)/,
      /(\d+(?:\.\d+)?)\s*公升/,
      /(\d+(?:\.\d+)?)\s*升/,
      /(\d+(?:\.\d+)?)\s*l\b/i,
      /gasoline.*?(\d+(?:\.\d+)?)/i
    ];
    
    for (const pattern of gasolinePatterns) {
      const match = text.match(pattern);
      if (match) {
        const value = parseFloat(match[1]);
        if (value > gasoline && value < 1000) {
          gasoline = value;
          console.log('找到汽油使用量:', value);
        }
      }
    }
    
    // 天然氣使用量提取
    const naturalGasPatterns = [
      /天然氣[：:]\s*(\d+(?:\.\d+)?)/,
      /瓦斯[：:]\s*(\d+(?:\.\d+)?)/,
      /氣體[：:]\s*(\d+(?:\.\d+)?)/,
      /(\d+(?:\.\d+)?)\s*立方公尺/,
      /(\d+(?:\.\d+)?)\s*m³/,
      /(\d+(?:\.\d+)?)\s*m3/,
      /gas.*?(\d+(?:\.\d+)?)/i,
      /natural gas.*?(\d+(?:\.\d+)?)/i
    ];
    
    for (const pattern of naturalGasPatterns) {
      const match = text.match(pattern);
      if (match) {
        const value = parseFloat(match[1]);
        if (value > naturalGas && value < 1000) {
          naturalGas = value;
          console.log('找到天然氣使用量:', value);
        }
      }
    }
    
    // 如果沒有找到數據，嘗試更寬鬆的數字匹配
    if (electricity === 0 && gasoline === 0 && naturalGas === 0) {
      console.log('使用寬鬆匹配模式...');
      
      const numbers = text.match(/\d+(?:\.\d+)?/g);
      if (numbers) {
        const numValues = numbers.map(n => parseFloat(n)).filter(n => n > 0 && n < 10000);
        numValues.sort((a, b) => b - a);
        
        if (numValues.length >= 1) electricity = numValues[0];
        if (numValues.length >= 2) gasoline = numValues[1];
        if (numValues.length >= 3) naturalGas = numValues[2];
        
        console.log('啟發式分類結果:', { electricity, gasoline, naturalGas });
      }
    }
    
    const result = { electricity, gasoline, naturalGas, month };
    console.log('最終解析結果:', result);
    
    return result;
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
