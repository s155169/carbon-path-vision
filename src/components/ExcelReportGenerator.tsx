
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';

interface ReportData {
  carbonEmissions: {
    electricity: number;
    gasoline: number;
    naturalGas: number;
    total: number;
  };
  carbonFee: number;
  reductionPath?: string;
  reductionTarget?: number;
  uploadedFileName?: string;
  calculationDate: Date;
}

interface ExcelReportGeneratorProps {
  data: ReportData;
}

const ExcelReportGenerator = ({ data }: ExcelReportGeneratorProps) => {
  const generateExcelReport = () => {
    // 創建工作簿
    const workbook = XLSX.utils.book_new();

    // 主要數據表
    const mainData = [
      ['碳管理智慧平台 - 綜合報告'],
      [''],
      ['計算日期', data.calculationDate.toLocaleDateString('zh-TW')],
      ['上傳檔案', data.uploadedFileName || '手動輸入'],
      [''],
      ['碳排放量分析 (公噸 CO2e)'],
      ['項目', '排放量'],
      ['電力使用', data.carbonEmissions.electricity.toFixed(3)],
      ['汽油使用', data.carbonEmissions.gasoline.toFixed(3)],
      ['天然氣使用', data.carbonEmissions.naturalGas.toFixed(3)],
      ['總排放量', data.carbonEmissions.total.toFixed(3)],
      [''],
      ['碳費計算'],
      ['碳費費率 (NT$/公噸)', '300'],
      ['預估碳費 (NT$)', data.carbonFee.toLocaleString()],
      [''],
      ['減碳規劃'],
      ['選擇路徑', data.reductionPath || '未設定'],
      ['減碳目標', data.reductionTarget ? `${data.reductionTarget}%` : '未設定'],
    ];

    const worksheet1 = XLSX.utils.aoa_to_sheet(mainData);

    // 詳細碳排放數據表
    const emissionDetails = [
      ['詳細碳排放分析'],
      [''],
      ['能源類型', '使用量', '單位', '排放係數', '碳排放量 (kg)', '碳排放量 (公噸)'],
      ['電力', '', 'kWh', '0.509 kg CO2/kWh', (data.carbonEmissions.electricity * 1000).toFixed(2), data.carbonEmissions.electricity.toFixed(3)],
      ['汽油', '', 'L', '2.263 kg CO2/L', (data.carbonEmissions.gasoline * 1000).toFixed(2), data.carbonEmissions.gasoline.toFixed(3)],
      ['天然氣', '', 'm³', '1.877 kg CO2/m³', (data.carbonEmissions.naturalGas * 1000).toFixed(2), data.carbonEmissions.naturalGas.toFixed(3)],
      [''],
      ['月度預測 (基於當前使用量)'],
      ['月份', '預估碳排放量 (公噸)', '預估碳費 (NT$)'],
      ['1月', (data.carbonEmissions.total * 0.9).toFixed(3), (data.carbonFee * 0.9).toLocaleString()],
      ['2月', (data.carbonEmissions.total * 0.8).toFixed(3), (data.carbonFee * 0.8).toLocaleString()],
      ['3月', (data.carbonEmissions.total * 1.1).toFixed(3), (data.carbonFee * 1.1).toLocaleString()],
      ['4月', data.carbonEmissions.total.toFixed(3), data.carbonFee.toLocaleString()],
      ['5月', (data.carbonEmissions.total * 1.05).toFixed(3), (data.carbonFee * 1.05).toLocaleString()],
      ['6月', (data.carbonEmissions.total * 0.95).toFixed(3), (data.carbonFee * 0.95).toLocaleString()],
    ];

    const worksheet2 = XLSX.utils.aoa_to_sheet(emissionDetails);

    // 減碳建議表
    const reductionSuggestions = [
      ['減碳建議與行動方案'],
      [''],
      ['類別', '建議措施', '預期減碳效果', '實施難度', '預估成本'],
      ['電力節約', 'LED燈具、節能電器', '20-30%', '低', '低'],
      ['', '太陽能板安裝', '40-60%', '中', '中'],
      ['', '智慧電錶監控', '15-25%', '低', '低'],
      ['交通減碳', '使用大眾運輸', '50-70%', '低', '低'],
      ['', '電動車轉換', '80-100%', '中', '高'],
      ['', '共乘計畫', '30-50%', '低', '低'],
      ['建築節能', '隔熱材料改善', '20-40%', '中', '中'],
      ['', '智慧空調系統', '25-35%', '中', '中'],
      ['', '綠建築認證', '30-50%', '高', '高'],
      [''],
      ['實施優先順序建議'],
      ['短期 (3個月內)', 'LED燈具更換、智慧電錶安裝'],
      ['中期 (6個月內)', '太陽能評估、大眾運輸推廣'],
      ['長期 (1年內)', '電動車評估、建築節能改造'],
    ];

    const worksheet3 = XLSX.utils.aoa_to_sheet(reductionSuggestions);

    // 將工作表添加到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet1, '綜合報告');
    XLSX.utils.book_append_sheet(workbook, worksheet2, '詳細分析');
    XLSX.utils.book_append_sheet(workbook, worksheet3, '減碳建議');

    // 設置列寬
    const wscols = [
      { wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
    ];
    worksheet1['!cols'] = wscols;
    worksheet2['!cols'] = wscols;
    worksheet3['!cols'] = wscols;

    // 生成文件名
    const fileName = `碳管理報告_${data.calculationDate.toISOString().split('T')[0]}.xlsx`;

    // 下載文件
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
          生成綜合報告
        </CardTitle>
        <CardDescription>
          匯出包含所有碳排放分析、費用計算和減碳建議的完整Excel報告
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-emerald-50 p-4 rounded-lg">
            <h4 className="font-medium text-emerald-800 mb-2">報告內容包含：</h4>
            <ul className="text-sm text-emerald-700 space-y-1">
              <li>• 碳排放量詳細分析</li>
              <li>• 碳費計算結果</li>
              <li>• 月度預測數據</li>
              <li>• 減碳路徑建議</li>
              <li>• 具體行動方案</li>
              <li>• 實施優先順序</li>
            </ul>
          </div>
          
          <Button 
            onClick={generateExcelReport}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <Download className="w-4 h-4 mr-2" />
            下載Excel綜合報告
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExcelReportGenerator;
