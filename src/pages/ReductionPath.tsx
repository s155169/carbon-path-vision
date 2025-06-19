import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { 
  TrendingDown, 
  Calculator, 
  Target, 
  FileText, 
  ArrowLeft,
  CheckCircle,
  Download,
  Settings,
  BarChart3,
  LineChart as LineChartIcon,
  Globe,
  Upload,
  File,
  DollarSign,
  Book,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import * as XLSX from 'xlsx';

const ReductionPath = () => {
  const [formData, setFormData] = useState({
    scope1: "",
    scope2: "",
    baseYear: "2023",
    targetYear: "2050",
    netZeroYear: "2050",
    reductionModel: "",
    companyName: "",
    industry: "",
    finalResidualRatio: "0",
    renewableTarget: ""
  });
  
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [pathData, setPathData] = useState<any[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  // 碳費試算相關狀態
  const [carbonFeeData, setCarbonFeeData] = useState({
    emissions: "50000",
    industry: "",
    reductionPlan: "none"
  });
  const [carbonFeeResults, setCarbonFeeResults] = useState<any[]>([]);
  const [currentFeeRate, setCurrentFeeRate] = useState("default");

  const reductionModels = [
    { 
      value: "sbti", 
      label: "SBTi 科學基礎目標", 
      description: "符合巴黎協定1.5°C目標",
      annualReduction: 4.2 
    },
    { 
      value: "taiwan", 
      label: "台灣2050淨零目標", 
      description: "依循台灣國家淨零排放路徑",
      annualReduction: 3.8 
    },
    { 
      value: "aggressive", 
      label: "積極減碳目標", 
      description: "超越國際標準的積極減碳",
      annualReduction: 5.0 
    },
    { 
      value: "moderate", 
      label: "穩健減碳目標", 
      description: "平衡成本效益的穩健路徑",
      annualReduction: 3.0 
    }
  ];

  const industries = [
    { value: "manufacturing", label: "製造業" },
    { value: "electronics", label: "電子業" },
    { value: "chemical", label: "化工業" },
    { value: "steel", label: "鋼鐵業" },
    { value: "cement", label: "水泥業" },
    { value: "textile", label: "紡織業" },
    { value: "food", label: "食品業" },
    { value: "power", label: "電力業" }
  ];

  const renewableTargets = [
    { value: "re100", label: "RE100 (100% 再生能源)" },
    { value: "re50", label: "RE50 (50% 再生能源)" },
    { value: "re30", label: "RE30 (30% 再生能源)" },
    { value: "fit55", label: "Fit 55 (歐盟標準)" }
  ];

  const reductionPlans = [
    { value: "none", label: "無特定減量計畫", reduction: 0 },
    { value: "sbti", label: "SBTi 1.5°C 路徑 (年減4.2%)", reduction: 4.2 },
    { value: "taiwan", label: "台灣淨零路徑 (年減約2.8%)", reduction: 2.8 },
    { value: "steel", label: "鋼鐵業指定削減路徑 (年減約5.7%)", reduction: 5.7 },
    { value: "cement", label: "水泥業指定削減路徑 (年減約5.0%)", reduction: 5.0 }
  ];

  const feeRates = {
    default: { rate: 300, label: "預設費率", description: "300元/噸" },
    discount_a: { rate: 100, label: "優惠費率 A", description: "100元/噸" },
    discount_b: { rate: 50, label: "優惠費率 B", description: "50元/噸" }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(file => 
        file.type === 'application/pdf' || 
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel'
      );
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addHistoricalYear = () => {
    const newYear = {
      year: parseInt(formData.baseYear) - 1,
      scope1: "",
      scope2: ""
    };
    setHistoricalData(prev => [...prev, newYear]);
  };

  const updateHistoricalData = (index: number, field: string, value: string) => {
    setHistoricalData(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeHistoricalData = (index: number) => {
    setHistoricalData(prev => prev.filter((_, i) => i !== index));
  };

  const calculatePath = () => {
    const scope1 = parseFloat(formData.scope1) || 0;
    const scope2 = parseFloat(formData.scope2) || 0;
    const totalEmissions = scope1 + scope2;
    const baseYear = parseInt(formData.baseYear);
    const targetYear = parseInt(formData.targetYear);
    const netZeroYear = parseInt(formData.netZeroYear);
    const finalResidualRatio = parseFloat(formData.finalResidualRatio) / 100;
    
    const selectedModel = reductionModels.find(m => m.value === formData.reductionModel);
    if (!selectedModel) return;
    
    const annualReduction = selectedModel.annualReduction / 100;
    
    const data = [];
    
    // 加入歷史數據（如果有的話）
    const sortedHistorical = [...historicalData].sort((a, b) => a.year - b.year);
    sortedHistorical.forEach(hist => {
      data.push({
        year: hist.year,
        totalEmissions: parseFloat(hist.scope1 || "0") + parseFloat(hist.scope2 || "0"),
        scope1: parseFloat(hist.scope1 || "0"),
        scope2: parseFloat(hist.scope2 || "0"),
        reductionPercentage: 0,
        cumulativeReduction: 0,
        isHistorical: true
      });
    });
    
    // 計算未來路徑
    for (let year = baseYear; year <= targetYear; year++) {
      const yearsFromBase = year - baseYear;
      let remainingEmissions;
      
      if (year <= netZeroYear) {
        // 到淨零年的減排路徑
        const yearsToNetZero = netZeroYear - baseYear;
        const targetEmissions = totalEmissions * finalResidualRatio;
        const reductionNeeded = (totalEmissions - targetEmissions) / yearsToNetZero;
        remainingEmissions = Math.max(targetEmissions, totalEmissions - (reductionNeeded * yearsFromBase));
      } else {
        // 淨零年後維持最終殘留排放量
        remainingEmissions = totalEmissions * finalResidualRatio;
      }
      
      const reductionFromBase = totalEmissions - remainingEmissions;
      const reductionPercentage = (reductionFromBase / totalEmissions) * 100;
      
      data.push({
        year,
        totalEmissions: Math.max(0, remainingEmissions),
        scope1: Math.max(0, scope1 * (remainingEmissions / totalEmissions)),
        scope2: Math.max(0, scope2 * (remainingEmissions / totalEmissions)),
        reductionPercentage: Math.min(100, reductionPercentage),
        cumulativeReduction: reductionFromBase,
        isHistorical: false
      });
    }
    
    setPathData(data);
    setIsCalculated(true);
  };

  const calculateCarbonFee = () => {
    const emissions = parseFloat(carbonFeeData.emissions) || 0;
    const selectedPlan = reductionPlans.find(p => p.value === carbonFeeData.reductionPlan);
    const annualReduction = selectedPlan ? selectedPlan.reduction / 100 : 0;
    
    const results = [];
    for (let year = 2024; year <= 2050; year++) {
      const yearsFromStart = year - 2024;
      const remainingEmissions = emissions * Math.pow(1 - annualReduction, yearsFromStart);
      
      results.push({
        year,
        emissions: Math.max(0, remainingEmissions),
        defaultFee: remainingEmissions * feeRates.default.rate,
        discountA: remainingEmissions * feeRates.discount_a.rate,
        discountB: remainingEmissions * feeRates.discount_b.rate
      });
    }
    
    setCarbonFeeResults(results);
  };

  const exportToExcel = () => {
    const selectedModel = reductionModels.find(m => m.value === formData.reductionModel);
    
    // 建立工作簿
    const workbook = XLSX.utils.book_new();
    
    // 企業資訊工作表
    const companyInfo = [
      ['企業名稱', formData.companyName],
      ['產業類別', industries.find(i => i.value === formData.industry)?.label || ''],
      ['基準年', formData.baseYear],
      ['目標年', formData.targetYear],
      ['淨零目標年', formData.netZeroYear],
      ['減碳模型', selectedModel?.label || ''],
      ['最終殘留排放比例', formData.finalResidualRatio + '%'],
      ['可再生能源目標', renewableTargets.find(r => r.value === formData.renewableTarget)?.label || ''],
      ['', ''],
      ['範疇一排放量 (噸)', parseFloat(formData.scope1)],
      ['範疇二排放量 (噸)', parseFloat(formData.scope2)],
      ['總排放量 (噸)', parseFloat(formData.scope1) + parseFloat(formData.scope2)],
      ['', ''],
      ['最終減排比例 (%)', pathData[pathData.length - 1]?.reductionPercentage.toFixed(1)],
      ['累積減排量 (噸)', pathData[pathData.length - 1]?.cumulativeReduction.toFixed(0)],
      ['年均減排率 (%)', selectedModel?.annualReduction],
    ];
    
    const companyWS = XLSX.utils.aoa_to_sheet(companyInfo);
    XLSX.utils.book_append_sheet(workbook, companyWS, '企業資訊');
    
    // 減碳路徑資料工作表
    const pathHeaders = ['年份', '總排放量(噸)', '範疇一(噸)', '範疇二(噸)', '減排比例(%)', '累積減排量(噸)', '數據類型'];
    const pathRows = pathData.map(data => [
      data.year,
      data.totalEmissions.toFixed(1),
      data.scope1.toFixed(1),
      data.scope2.toFixed(1),
      data.reductionPercentage.toFixed(1),
      data.cumulativeReduction.toFixed(1),
      data.isHistorical ? '歷史數據' : '預測數據'
    ]);
    
    const pathWS = XLSX.utils.aoa_to_sheet([pathHeaders, ...pathRows]);
    XLSX.utils.book_append_sheet(workbook, pathWS, '減碳路徑');
    
    // 匯出檔案
    const fileName = `減碳路徑規劃報告_${formData.companyName || '企業'}_${new Date().toISOString().slice(0,10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const chartConfig = {
    totalEmissions: {
      label: "總排放量",
      color: "#2563eb"
    },
    scope1: {
      label: "範疇一",
      color: "#dc2626"
    },
    scope2: {
      label: "範疇二", 
      color: "#16a34a"
    }
  };

  const carbonFeeChartConfig = {
    emissions: {
      label: "排放量",
      color: "#2563eb"
    },
    defaultFee: {
      label: "預設費率",
      color: "#dc2626"
    },
    discountA: {
      label: "優惠費率 A",
      color: "#16a34a"
    },
    discountB: {
      label: "優惠費率 B",
      color: "#ea580c"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-6 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回首頁
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-6 h-6 text-green-600" />
                <h1 className="text-2xl font-bold text-gray-900">減碳路徑規劃</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 mx-auto max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">科學化減碳路徑規劃</h2>
          <p className="text-lg text-gray-600">
            運用科學方法規劃清晰可行的淨零排放路徑，符合國際標準與台灣政策目標
          </p>
        </div>

        <Tabs defaultValue="input" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="input">數據輸入</TabsTrigger>
            <TabsTrigger value="historical">歷史數據</TabsTrigger>
            <TabsTrigger value="upload">文件上傳</TabsTrigger>
            <TabsTrigger value="model">減碳模型</TabsTrigger>
            <TabsTrigger value="advanced">進階設定</TabsTrigger>
            <TabsTrigger value="result">路徑結果</TabsTrigger>
            <TabsTrigger value="carbon-fee">碳費試算</TabsTrigger>
          </TabsList>

          {/* Data Input Tab */}
          <TabsContent value="input" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5" />
                  <span>企業基本資料與排放數據</span>
                </CardTitle>
                <CardDescription>
                  請輸入您企業的基本資訊和範疇一、二的排放量數據
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>企業名稱</Label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      placeholder="請輸入企業名稱"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>產業類別</Label>
                    <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇產業類別" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry.value} value={industry.value}>
                            {industry.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>範疇一排放量 (噸 CO2e/年)</Label>
                    <Input
                      type="number"
                      value={formData.scope1}
                      onChange={(e) => setFormData({...formData, scope1: e.target.value})}
                      placeholder="直接排放量"
                    />
                    <p className="text-xs text-gray-500">
                      包含燃料燃燒、製程排放、逸散排放等
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>範疇二排放量 (噸 CO2e/年)</Label>
                    <Input
                      type="number"
                      value={formData.scope2}
                      onChange={(e) => setFormData({...formData, scope2: e.target.value})}
                      placeholder="間接排放量"
                    />
                    <p className="text-xs text-gray-500">
                      主要為外購電力的間接排放
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>基準年</Label>
                    <Select value={formData.baseYear} onValueChange={(value) => setFormData({...formData, baseYear: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 10}, (_, i) => 2024 - i).map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}年
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>目標年</Label>
                    <Select value={formData.targetYear} onValueChange={(value) => setFormData({...formData, targetYear: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2030">2030年</SelectItem>
                        <SelectItem value="2040">2040年</SelectItem>
                        <SelectItem value="2050">2050年</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>淨零目標年</Label>
                    <Select value={formData.netZeroYear} onValueChange={(value) => setFormData({...formData, netZeroYear: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2030">2030年</SelectItem>
                        <SelectItem value="2040">2040年</SelectItem>
                        <SelectItem value="2050">2050年</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.scope1 && formData.scope2 && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">排放量摘要</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-blue-600">範疇一</div>
                        <div className="font-medium">{parseFloat(formData.scope1).toLocaleString()} 噸</div>
                      </div>
                      <div>
                        <div className="text-blue-600">範疇二</div>
                        <div className="font-medium">{parseFloat(formData.scope2).toLocaleString()} 噸</div>
                      </div>
                      <div>
                        <div className="text-blue-600">總排放量</div>
                        <div className="font-medium">
                          {(parseFloat(formData.scope1) + parseFloat(formData.scope2)).toLocaleString()} 噸
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Historical Data Tab */}
          <TabsContent value="historical" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>歷史排放數據 (選填)</span>
                </CardTitle>
                <CardDescription>
                  加入基準年以前的排放數據，讓報告圖表更完整。此數據不影響減碳模型計算。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    新增基準年 ({formData.baseYear}) 以前的歷史排放數據
                  </p>
                  <Button onClick={addHistoricalYear} variant="outline" size="sm">
                    新增年份
                  </Button>
                </div>

                {historicalData.length > 0 && (
                  <div className="space-y-4">
                    {historicalData.map((data, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">{data.year} 年排放數據</h4>
                          <Button
                            onClick={() => removeHistoricalData(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            移除
                          </Button>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>年份</Label>
                            <Input
                              type="number"
                              value={data.year}
                              onChange={(e) => updateHistoricalData(index, 'year', e.target.value)}
                              max={parseInt(formData.baseYear) - 1}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>範疇一排放量 (噸)</Label>
                            <Input
                              type="number"
                              value={data.scope1}
                              onChange={(e) => updateHistoricalData(index, 'scope1', e.target.value)}
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>範疇二排放量 (噸)</Label>
                            <Input
                              type="number"
                              value={data.scope2}
                              onChange={(e) => updateHistoricalData(index, 'scope2', e.target.value)}
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {historicalData.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>尚未新增歷史排放數據</p>
                    <p className="text-sm">點擊「新增年份」開始添加歷史數據</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* File Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>文件上傳</span>
                </CardTitle>
                <CardDescription>
                  上傳相關文件如電費單、能源報告等（支援PDF、Excel格式）
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <Label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:text-blue-500">
                      點擊選擇文件或拖拽文件至此處
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".pdf,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-500">
                      支援PDF、Excel檔案，單檔不超過10MB
                    </p>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">已上傳的文件</h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <File className="w-5 h-5 text-blue-500" />
                          <div>
                            <div className="font-medium text-sm">{file.name}</div>
                            <div className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          移除
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Model Selection Tab */}
          <TabsContent value="model" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>選擇減碳模型</span>
                </CardTitle>
                <CardDescription>
                  依據國際標準或台灣目標選擇適合的減碳模型
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {reductionModels.map((model) => (
                    <div
                      key={model.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.reductionModel === model.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData({...formData, reductionModel: model.value})}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{model.label}</h3>
                        {formData.reductionModel === model.value && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">
                          年減排 {model.annualReduction}%
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {model.value === 'sbti' && <Globe className="w-4 h-4 inline mr-1" />}
                          {model.value === 'taiwan' && '🇹🇼'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {formData.reductionModel && (
                  <div className="mt-6">
                    <Button 
                      onClick={calculatePath}
                      disabled={!formData.scope1 || !formData.scope2 || !formData.reductionModel}
                      className="w-full"
                      size="lg"
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      生成減碳路徑
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Settings Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>進階設定</span>
                </CardTitle>
                <CardDescription>
                  設定最終殘留排放比例和可再生能源目標
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>最終殘留排放比例</Label>
                    <Select value={formData.finalResidualRatio} onValueChange={(value) => setFormData({...formData, finalResidualRatio: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇最終殘留排放比例" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0% - 完全淨零</SelectItem>
                        <SelectItem value="5">5% - 接近淨零</SelectItem>
                        <SelectItem value="10">10% - 大幅減排</SelectItem>
                        <SelectItem value="15">15% - 顯著減排</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      選擇企業最終可接受的殘留排放比例
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>可再生能源目標（可選）</Label>
                    <Select value={formData.renewableTarget} onValueChange={(value) => setFormData({...formData, renewableTarget: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇可再生能源目標" />
                      </SelectTrigger>
                      <SelectContent>
                        {renewableTargets.map((target) => (
                          <SelectItem key={target.value} value={target.value}>
                            {target.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      可設定RE100、RE50、RE30或Fit 55等可再生能源目標
                    </p>
                  </div>
                </div>

                {formData.finalResidualRatio !== "0" && (
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">
                      <Zap className="w-4 h-4 inline mr-1" />
                      殘留排放處理建議
                    </h4>
                    <p className="text-sm text-orange-800">
                      當選擇非零殘留排放時，建議透過碳抵銷、直接空氣捕獲(DAC)或其他負排放技術來實現真正的淨零目標。
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="result" className="space-y-6">
            {isCalculated && pathData.length > 0 ? (
              <>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <LineChartIcon className="w-5 h-5" />
                      <span>減碳路徑圖</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-80">
                      <LineChart data={pathData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                        <XAxis 
                          dataKey="year" 
                          tick={{ fontSize: 12 }}
                          stroke="#6b7280"
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          stroke="#6b7280"
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="totalEmissions" 
                          stroke="#2563eb" 
                          strokeWidth={4}
                          name="總排放量 (噸)"
                          dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="scope1" 
                          stroke="#dc2626" 
                          strokeWidth={3}
                          name="範疇一 (噸)"
                          dot={{ fill: '#dc2626', strokeWidth: 2, r: 3 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="scope2" 
                          stroke="#16a34a" 
                          strokeWidth={3}
                          name="範疇二 (噸)"
                          dot={{ fill: '#16a34a', strokeWidth: 2, r: 3 }}
                        />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5" />
                      <span>減碳進度表</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {pathData.filter(data => !data.isHistorical).map((data, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="font-medium w-16">{data.year}年</div>
                            <div className="text-sm text-gray-600">
                              排放量：{data.totalEmissions.toFixed(1)} 噸
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-sm font-medium text-green-600">
                              減排 {data.reductionPercentage.toFixed(1)}%
                            </div>
                            <Progress value={data.reductionPercentage} className="w-20" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="shadow-lg">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calculator className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">尚未生成路徑</h3>
                  <p className="text-gray-600 text-center">
                    請先完成數據輸入和模型選擇，然後點擊「生成減碳路徑」按鈕
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Carbon Fee Tab */}
          <TabsContent value="carbon-fee" className="space-y-6">
            {/* 碳費制度簡介 */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Book className="w-5 h-5" />
                  <span>碳費制度簡介與法規說明</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  台灣碳費制度依據《氣候變遷因應法》設立，旨在透過經濟誘因鼓勵企業減碳，並促進國家達成2050淨零轉型目標。
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">徵收對象</h4>
                    <p className="text-sm text-gray-600">
                      初期主要針對年排放量超過 25,000 噸 CO₂e 的電力業及大型製造業。
                    </p>
                    
                    <h4 className="font-semibold text-gray-900">基本費率</h4>
                    <p className="text-sm text-gray-600">
                      預設費率為每噸 300 元新台幣，未來將視國內外情況滾動式調整。
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">優惠機制</h4>
                    <p className="text-sm text-gray-600">
                      若企業能有效執行自主減量計畫或符合特定條件，可適用優惠費率以茲鼓勵。
                    </p>
                    
                    <h4 className="font-semibold text-gray-900">碳洩漏風險</h4>
                    <p className="text-sm text-gray-600">
                      為保護國內產業競爭力，對具備高碳洩漏風險的事業設有不同的收費係數，避免產業外移。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 碳費試算 */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>碳費試算與三種情境比較</span>
                </CardTitle>
                <CardDescription>
                  輸入年排放量、產業別與減量情境，以預測未來費用
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>年排放量 (噸 CO₂e)</Label>
                    <Input
                      type="number"
                      value={carbonFeeData.emissions}
                      onChange={(e) => setCarbonFeeData({...carbonFeeData, emissions: e.target.value})}
                      placeholder="50000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>產業類別</Label>
                    <Select value={carbonFeeData.industry} onValueChange={(value) => setCarbonFeeData({...carbonFeeData, industry: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="請選擇您的產業別..." />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry.value} value={industry.value}>
                            {industry.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>減量情境選擇</Label>
                    <Select value={carbonFeeData.reductionPlan} onValueChange={(value) => setCarbonFeeData({...carbonFeeData, reductionPlan: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇減量情境" />
                      </SelectTrigger>
                      <SelectContent>
                        {reductionPlans.map((plan) => (
                          <SelectItem key={plan.value} value={plan.value}>
                            {plan.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={calculateCarbonFee} className="w-full" size="lg">
                  <Calculator className="w-4 h-4 mr-2" />
                  計算碳費
                </Button>

                {carbonFeeResults.length > 0 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h4 className="text-lg font-semibold mb-2">減量路徑比較圖 (至2050年)</h4>
                      <p className="text-sm text-gray-600">
                        比較不同減量情境下的排放趨勢。您目前的選擇是：
                        {reductionPlans.find(p => p.value === carbonFeeData.reductionPlan)?.label}
                      </p>
                    </div>

                    <ChartContainer config={carbonFeeChartConfig} className="h-64">
                      <LineChart data={carbonFeeResults.slice(0, 10)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="emissions" 
                          stroke="#2563eb" 
                          strokeWidth={3}
                          name="排放量 (噸)"
                        />
                      </LineChart>
                    </ChartContainer>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">碳費試算與三種情境比較</h4>
                      <p className="text-sm text-gray-600">
                        點擊下方按鈕切換不同費率情境，或啟用高碳洩漏風險模式，查看對應的碳費成本。
                      </p>

                      <div className="grid md:grid-cols-3 gap-4">
                        {Object.entries(feeRates).map(([key, rate]) => (
                          <div
                            key={key}
                            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                              currentFeeRate === key
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setCurrentFeeRate(key)}
                          >
                            <div className="text-center">
                              <h5 className="font-medium mb-2">{rate.label}</h5>
                              <div className="text-lg font-bold text-blue-600 mb-2">
                                ({rate.description})
                              </div>
                              {key !== 'default' && (
                                <div className="text-xs text-gray-600">
                                  {key === 'discount_a' && (
                                    <div>
                                      <p>🎯 適用條件：</p>
                                      <p>提出並通過「自主減量計畫」</p>
                                      <p>達到「行業別指定削減率」</p>
                                    </div>
                                  )}
                                  {key === 'discount_b' && (
                                    <div>
                                      <p>🎯 適用條件：</p>
                                      <p>通過「自主減量計畫」</p>
                                      <p>達到「技術標竿削減率」</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {currentFeeRate !== 'default' && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg">
                          <h5 className="font-medium text-green-900 mb-2">
                            {feeRates[currentFeeRate as keyof typeof feeRates].label} 詳細說明
                          </h5>
                          {currentFeeRate === 'discount_a' && (
                            <div className="text-sm text-green-800 space-y-2">
                              <p><strong>📊 行業別指定削減率舉例：</strong></p>
                              <ul className="list-disc ml-5">
                                <li>鋼鐵業: 25.2%</li>
                                <li>水泥業: 22.3%</li>
                                <li>其他行業: 42.0%</li>
                              </ul>
                              <p><strong>📌 核心精神：</strong></p>
                              <p>您需證明「有效執行減碳行動」且結果達標，才能適用此優惠費率。</p>
                            </div>
                          )}
                          {currentFeeRate === 'discount_b' && (
                            <div className="text-sm text-green-800 space-y-2">
                              <p><strong>🔧 所謂「技術標竿」常見包括：</strong></p>
                              <ul className="list-disc ml-5">
                                <li>引進高效率製程設備</li>
                                <li>能源使用效率顯著優於同業</li>
                                <li>使用再生能源或低碳燃料</li>
                                <li>實施碳捕捉技術 (CCUS)</li>
                              </ul>
                              <p><strong>📌 核心精神：</strong></p>
                              <p>此費率鼓勵具備實質技術投資的企業，並需符合環境部公告之標準。</p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 p-2 text-left">年份</th>
                              <th className="border border-gray-300 p-2 text-left">排放量(噸)</th>
                              <th className="border border-gray-300 p-2 text-left">預設費率</th>
                              <th className="border border-gray-300 p-2 text-left">優惠費率 A</th>
                              <th className="border border-gray-300 p-2 text-left">優惠費率 B</th>
                            </tr>
                          </thead>
                          <tbody>
                            {carbonFeeResults.slice(0, 10).map((result, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="border border-gray-300 p-2">{result.year}</td>
                                <td className="border border-gray-300 p-2">{result.emissions.toLocaleString()}</td>
                                <td className="border border-gray-300 p-2">NT$ {result.defaultFee.toLocaleString()}</td>
                                <td className="border border-gray-300 p-2">NT$ {result.discountA.toLocaleString()}</td>
                                <td className="border border-gray-300 p-2">NT$ {result.discountB.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Export Button */}
        {isCalculated && (
          <div className="flex justify-center mt-8">
            <Button onClick={exportToExcel} size="lg" className="flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>匯出完整報告 (Excel)</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReductionPath;
