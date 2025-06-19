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
  File
} from "lucide-react";
import { Link } from "react-router-dom";
import * as XLSX from 'xlsx';

const ReductionPath = () => {
  const [formData, setFormData] = useState({
    scope1: "",
    scope2: "",
    baseYear: "2023",
    targetYear: "2050",
    reductionModel: "",
    companyName: "",
    industry: ""
  });
  
  const [pathData, setPathData] = useState<any[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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
    { value: "textile", label: "紡織業" },
    { value: "food", label: "食品業" }
  ];

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

  const calculatePath = () => {
    const scope1 = parseFloat(formData.scope1) || 0;
    const scope2 = parseFloat(formData.scope2) || 0;
    const totalEmissions = scope1 + scope2;
    const baseYear = parseInt(formData.baseYear);
    const targetYear = parseInt(formData.targetYear);
    const yearSpan = targetYear - baseYear;
    
    const selectedModel = reductionModels.find(m => m.value === formData.reductionModel);
    if (!selectedModel) return;
    
    const annualReduction = selectedModel.annualReduction / 100;
    
    const data = [];
    for (let year = baseYear; year <= targetYear; year++) {
      const yearsFromBase = year - baseYear;
      const remainingEmissions = totalEmissions * Math.pow(1 - annualReduction, yearsFromBase);
      const reductionFromBase = totalEmissions - remainingEmissions;
      const reductionPercentage = (reductionFromBase / totalEmissions) * 100;
      
      data.push({
        year,
        totalEmissions: Math.max(0, remainingEmissions),
        scope1: Math.max(0, scope1 * Math.pow(1 - annualReduction, yearsFromBase)),
        scope2: Math.max(0, scope2 * Math.pow(1 - annualReduction, yearsFromBase)),
        reductionPercentage: Math.min(100, reductionPercentage),
        cumulativeReduction: reductionFromBase
      });
    }
    
    setPathData(data);
    setIsCalculated(true);
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
      ['減碳模型', selectedModel?.label || ''],
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
    const pathHeaders = ['年份', '總排放量(噸)', '範疇一(噸)', '範疇二(噸)', '減排比例(%)', '累積減排量(噸)'];
    const pathRows = pathData.map(data => [
      data.year,
      data.totalEmissions.toFixed(1),
      data.scope1.toFixed(1),
      data.scope2.toFixed(1),
      data.reductionPercentage.toFixed(1),
      data.cumulativeReduction.toFixed(1)
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
      color: "hsl(var(--chart-1))"
    },
    scope1: {
      label: "範疇一",
      color: "hsl(var(--chart-2))"
    },
    scope2: {
      label: "範疇二", 
      color: "hsl(var(--chart-3))"
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="input">數據輸入</TabsTrigger>
            <TabsTrigger value="upload">文件上傳</TabsTrigger>
            <TabsTrigger value="model">減碳模型</TabsTrigger>
            <TabsTrigger value="result">路徑結果</TabsTrigger>
            <TabsTrigger value="report">完整報告</TabsTrigger>
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

                <div className="grid md:grid-cols-2 gap-6">
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
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="totalEmissions" 
                          stroke="var(--color-totalEmissions)" 
                          strokeWidth={3}
                          name="總排放量 (噸)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="scope1" 
                          stroke="var(--color-scope1)" 
                          strokeWidth={2}
                          name="範疇一 (噸)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="scope2" 
                          stroke="var(--color-scope2)" 
                          strokeWidth={2}
                          name="範疇二 (噸)"
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
                      {pathData.map((data, index) => (
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

          {/* Report Tab */}
          <TabsContent value="report" className="space-y-6">
            {isCalculated && pathData.length > 0 ? (
              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>完整減碳路徑報告</span>
                    </CardTitle>
                    <CardDescription>
                      完整的路徑規劃報告，可匯出為Excel格式
                    </CardDescription>
                  </div>
                  <Button onClick={exportToExcel} className="flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>匯出Excel報告</span>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {pathData[pathData.length - 1]?.reductionPercentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-blue-800">最終減排比例</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {pathData[pathData.length - 1]?.cumulativeReduction.toFixed(0)}
                      </div>
                      <div className="text-sm text-green-800">累積減排量 (噸)</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 mb-2">
                        {formData.targetYear}
                      </div>
                      <div className="text-sm text-orange-800">目標達成年</div>
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <h4 className="text-lg font-semibold mb-3">報告摘要</h4>
                    <p className="text-gray-700">
                      本報告基於 {formData.companyName || '貴企業'} 在 {formData.baseYear} 年的排放基準，
                      採用 {reductionModels.find(m => m.value === formData.reductionModel)?.label} 模型，
                      規劃至 {formData.targetYear} 年的減碳路徑。預計可達成 
                      {pathData[pathData.length - 1]?.reductionPercentage.toFixed(1)}% 的減排目標，
                      累積減少 {pathData[pathData.length - 1]?.cumulativeReduction.toFixed(0)} 噸 CO2 �當量排放。
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">報告尚未生成</h3>
                  <p className="text-gray-600 text-center">
                    請先完成減碳路徑計算，系統將自動生成完整報告
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReductionPath;
