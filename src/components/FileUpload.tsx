import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, FileSpreadsheet, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import { getAllEmissionFactors, findEmissionFactor } from "@/data/emissionFactors";

// 設定PDF.js worker - 使用本地worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

interface UtilityData {
  electricity: number;
  gasoline: number;
  naturalGas: number;
  water?: number;
  diesel?: number;
  heavyOil?: number;
  coal?: number;
  lpg?: number;
  refrigerants?: { [key: string]: number };
  detectedFuels?: string[];
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

    // 初始化數據
    let extractedData: UtilityData = {
      electricity: 0,
      gasoline: 0,
      naturalGas: 0,
      water: 0,
      diesel: 0,
      heavyOil: 0,
      coal: 0,
      lpg: 0,
      refrigerants: {},
      detectedFuels: [],
      month: new Date().getMonth() + 1 + '月'
    };

    console.log('Excel數據:', jsonData);

    // 燃料類型關鍵字映射
    const fuelKeywords = {
      electricity: ['電', '用電', 'electric', 'kwh', '度'],
      gasoline: ['汽油', '油料', 'gasoline', '92', '95', '98'],
      naturalGas: ['天然氣', '瓦斯', 'gas', 'ng', '立方', 'm3', 'm³'],
      water: ['用水', '自來水', 'water', '立方米'],
      diesel: ['柴油', 'diesel', '柴油車'],
      heavyOil: ['重油', 'heavy oil', '燃料油'],
      coal: ['煤', 'coal', '煤炭'],
      lpg: ['液化石油氣', 'lpg', '桶裝瓦斯'],
      'R-134a': ['r134a', 'r-134a', 'hfc134a'],
      'R-410A': ['r410a', 'r-410a', 'hfc410a'],
      'R-22': ['r22', 'r-22', 'hcfc22'],
      'R-404A': ['r404a', 'r-404a'],
      'R-407C': ['r407c', 'r-407c']
    };

    // 數據提取邏輯
    jsonData.forEach((row: any) => {
      Object.keys(row).forEach(key => {
        const keyLower = key.toLowerCase();
        const value = parseFloat(row[key]);
        
        if (!isNaN(value) && value > 0) {
          // 檢查各種燃料類型
          Object.entries(fuelKeywords).forEach(([fuelType, keywords]) => {
            if (keywords.some(keyword => keyLower.includes(keyword.toLowerCase()))) {
              if (fuelType === 'electricity') {
                extractedData.electricity = Math.max(extractedData.electricity, value);
                if (!extractedData.detectedFuels?.includes('電力')) {
                  extractedData.detectedFuels?.push('電力');
                }
              } else if (fuelType === 'gasoline') {
                extractedData.gasoline = Math.max(extractedData.gasoline, value);
                if (!extractedData.detectedFuels?.includes('汽油')) {
                  extractedData.detectedFuels?.push('汽油');
                }
              } else if (fuelType === 'naturalGas') {
                extractedData.naturalGas = Math.max(extractedData.naturalGas, value);
                if (!extractedData.detectedFuels?.includes('天然氣')) {
                  extractedData.detectedFuels?.push('天然氣');
                }
              } else if (fuelType === 'water') {
                extractedData.water = Math.max(extractedData.water || 0, value);
                if (!extractedData.detectedFuels?.includes('用水')) {
                  extractedData.detectedFuels?.push('用水');
                }
              } else if (fuelType === 'diesel') {
                extractedData.diesel = Math.max(extractedData.diesel || 0, value);
                if (!extractedData.detectedFuels?.includes('柴油')) {
                  extractedData.detectedFuels?.push('柴油');
                }
              } else if (fuelType === 'heavyOil') {
                extractedData.heavyOil = Math.max(extractedData.heavyOil || 0, value);
                if (!extractedData.detectedFuels?.includes('重油')) {
                  extractedData.detectedFuels?.push('重油');
                }
              } else if (fuelType === 'coal') {
                extractedData.coal = Math.max(extractedData.coal || 0, value);
                if (!extractedData.detectedFuels?.includes('煤')) {
                  extractedData.detectedFuels?.push('煤');
                }
              } else if (fuelType === 'lpg') {
                extractedData.lpg = Math.max(extractedData.lpg || 0, value);
                if (!extractedData.detectedFuels?.includes('液化石油氣')) {
                  extractedData.detectedFuels?.push('液化石油氣');
                }
              } else if (fuelType.startsWith('R-')) {
                // 冷媒處理
                if (!extractedData.refrigerants) extractedData.refrigerants = {};
                extractedData.refrigerants[fuelType] = Math.max(extractedData.refrigerants[fuelType] || 0, value);
                if (!extractedData.detectedFuels?.includes(`冷媒${fuelType}`)) {
                  extractedData.detectedFuels?.push(`冷媒${fuelType}`);
                }
              }
            }
          });
        }
      });
    });

    console.log('提取的燃料數據:', extractedData);
    onDataExtracted(extractedData);
  };

  const processPDFFile = async (file: File) => {
    try {
      console.log('開始解析PDF文件:', file.name);
      
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true
      });
      
      const pdf = await loadingTask.promise;
      console.log('PDF頁數:', pdf.numPages);
      
      let fullText = '';
      
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
    
    let extractedData: UtilityData = {
      electricity: 0,
      gasoline: 0,
      naturalGas: 0,
      water: 0,
      diesel: 0,
      detectedFuels: [],
      month: new Date().getMonth() + 1 + '月'
    };
    
    // 月份提取
    const monthMatches = text.match(/(\d{1,2})月|(\d{4})年(\d{1,2})月/);
    if (monthMatches) {
      extractedData.month = monthMatches[1] ? monthMatches[1] + '月' : monthMatches[3] + '月';
    }
    
    // 使用更廣泛的模式匹配
    const patterns = {
      electricity: [
        /用電量[：:]\s*(\d+(?:\.\d+)?)/,
        /本期用電[：:]\s*(\d+(?:\.\d+)?)/,
        /(\d+(?:\.\d+)?)\s*度/,
        /(\d+(?:\.\d+)?)\s*kwh/i
      ],
      gasoline: [
        /汽油[：:]\s*(\d+(?:\.\d+)?)/,
        /(\d+(?:\.\d+)?)\s*公升/,
        /(\d+(?:\.\d+)?)\s*升/,
        /(\d+(?:\.\d+)?)\s*l\b/i
      ],
      naturalGas: [
        /天然氣[：:]\s*(\d+(?:\.\d+)?)/,
        /瓦斯[：:]\s*(\d+(?:\.\d+)?)/,
        /(\d+(?:\.\d+)?)\s*立方公尺/,
        /(\d+(?:\.\d+)?)\s*m³/,
        /(\d+(?:\.\d+)?)\s*m3/
      ],
      water: [
        /用水[：:]\s*(\d+(?:\.\d+)?)/,
        /自來水[：:]\s*(\d+(?:\.\d+)?)/,
        /(\d+(?:\.\d+)?)\s*立方米/
      ]
    };
    
    Object.entries(patterns).forEach(([fuelType, patternList]) => {
      for (const pattern of patternList) {
        const match = text.match(pattern);
        if (match) {
          const value = parseFloat(match[1]);
          if (value > 0) {
            if (fuelType === 'electricity') {
              extractedData.electricity = Math.max(extractedData.electricity, value);
            } else if (fuelType === 'gasoline') {
              extractedData.gasoline = Math.max(extractedData.gasoline, value);
            } else if (fuelType === 'naturalGas') {
              extractedData.naturalGas = Math.max(extractedData.naturalGas, value);
            } else if (fuelType === 'water') {
              extractedData.water = Math.max(extractedData.water || 0, value);
            }
            
            if (!extractedData.detectedFuels?.includes(fuelType)) {
              extractedData.detectedFuels?.push(fuelType);
            }
            break;
          }
        }
      }
    });
    
    console.log('最終解析結果:', extractedData);
    return extractedData;
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
          支援PDF或Excel格式的水電費帳單，系統將自動提取用量數據（支援多種燃料類型）
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!uploadedFile ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-gray-600">點擊上傳或拖拽檔案到此處</p>
              <p className="text-sm text-gray-500">支援 PDF、Excel (.xlsx/.xls) 格式</p>
              <p className="text-xs text-gray-400">可識別：電力、汽油、天然氣、用水、柴油、重油、煤、液化石油氣、冷媒等</p>
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
