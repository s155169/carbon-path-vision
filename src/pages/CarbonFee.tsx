
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Factory, 
  ArrowLeft, 
  Zap, 
  Fuel, 
  Car, 
  Lightbulb,
  Book,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

const CarbonFee = () => {
  const [formData, setFormData] = useState({
    industry: "",
    emissions: "",
    energyConsumption: "",
    fuelType: ""
  });

  // 新增的能源換算數據
  const [energyData, setEnergyData] = useState({
    electricity: "", // 用電量 (kWh)
    gasoline: "",     // 汽油量 (公升)
    naturalGas: ""    // 天然氣量 (立方公尺)
  });
  
  const [result, setResult] = useState<{
    carbonFee: number;
    monthlyFee: number;
    yearlyFee: number;
  } | null>(null);

  // 碳費試算相關狀態
  const [carbonFeeData, setCarbonFeeData] = useState({
    emissions: "50000",
    industry: "",
    reductionPlan: "none"
  });
  const [carbonFeeResults, setCarbonFeeResults] = useState<any[]>([]);
  const [currentFeeRate, setCurrentFeeRate] = useState("default");

  const carbonFeeRate = 300; // NT$ per ton CO2

  // 碳排放係數 (kg CO2e per unit)
  const emissionFactors = {
    electricity: 0.502,  // kg CO2e/kWh (台灣電力排放係數)
    gasoline: 2.263,     // kg CO2e/公升
    naturalGas: 1.877    // kg CO2e/立方公尺
  };

  const industries = [
    { value: "manufacturing", label: "製造業" },
    { value: "electronics", label: "電子業" },
    { value: "chemical", label: "化工業" },
    { value: "steel", label: "鋼鐵業" },
    { value: "cement", label: "水泥業" },
    { value: "textile", label: "紡織業" },
    { value: "food", label: "食品業" },
    { value: "power", label: "電力業" },
    { value: "service", label: "服務業" },
    { value: "transportation", label: "運輸業" },
    { value: "construction", label: "建築業" }
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

  // 計算能源轉換的碳排放量
  const calculateEnergyEmissions = () => {
    const electricityEmissions = (parseFloat(energyData.electricity) || 0) * emissionFactors.electricity / 1000; // 轉換為噸
    const gasolineEmissions = (parseFloat(energyData.gasoline) || 0) * emissionFactors.gasoline / 1000; // 轉換為噸
    const naturalGasEmissions = (parseFloat(energyData.naturalGas) || 0) * emissionFactors.naturalGas / 1000; // 轉換為噸
    
    return {
      electricity: electricityEmissions,
      gasoline: gasolineEmissions,
      naturalGas: naturalGasEmissions,
      total: electricityEmissions + gasolineEmissions + naturalGasEmissions
    };
  };

  const calculateCarbonFee = () => {
    const emissions = parseFloat(formData.emissions) || 0;
    const energyConsumption = parseFloat(formData.energyConsumption) || 0;
    
    // Simple calculation based on emissions and energy consumption
    const totalEmissions = emissions + (energyConsumption * 0.5); // Simplified formula
    const carbonFee = totalEmissions * carbonFeeRate;
    const monthlyFee = carbonFee / 12;
    const yearlyFee = carbonFee;

    setResult({
      carbonFee: totalEmissions,
      monthlyFee,
      yearlyFee
    });
  };

  const calculateAdvancedCarbonFee = () => {
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

  const energyEmissions = calculateEnergyEmissions();

  const chartConfig = {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
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
                <Calculator className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">碳費模擬計算</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 mx-auto max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">碳費制度模擬與計算</h2>
          <p className="text-lg text-gray-600">
            透過多種計算方式精準估算您的碳費成本，包含能源換算與減量情境分析
          </p>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">基礎計算</TabsTrigger>
            <TabsTrigger value="energy">能源換算</TabsTrigger>
            <TabsTrigger value="advanced">進階試算</TabsTrigger>
            <TabsTrigger value="info">政策說明</TabsTrigger>
          </TabsList>

          {/* Basic Calculation Tab */}
          <TabsContent value="basic" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Factory className="w-5 h-5 text-blue-600" />
                    <span>基礎排放資料</span>
                  </CardTitle>
                  <CardDescription>
                    請填入您的基本資料以計算碳費
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="industry">產業類別</Label>
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

                  <div>
                    <Label htmlFor="emissions">年度碳排放量 (噸 CO2)</Label>
                    <Input
                      id="emissions"
                      type="number"
                      placeholder="例如：1000"
                      value={formData.emissions}
                      onChange={(e) => setFormData({...formData, emissions: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="energyConsumption">年度能源消耗 (MWh)</Label>
                    <Input
                      id="energyConsumption"
                      type="number"
                      placeholder="例如：5000"
                      value={formData.energyConsumption}
                      onChange={(e) => setFormData({...formData, energyConsumption: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="fuelType">主要燃料類型</Label>
                    <Select value={formData.fuelType} onValueChange={(value) => setFormData({...formData, fuelType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇燃料類型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coal">煤炭</SelectItem>
                        <SelectItem value="naturalgas">天然氣</SelectItem>
                        <SelectItem value="oil">石油</SelectItem>
                        <SelectItem value="renewable">再生能源</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={calculateCarbonFee}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    計算碳費
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6">
                {result && (
                  <Card className="shadow-lg bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5" />
                        <span>碳費計算結果</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-white/10 rounded-lg">
                          <div className="text-2xl font-bold">{result.carbonFee.toFixed(1)}</div>
                          <div className="text-sm opacity-90">總碳排放量 (噸)</div>
                        </div>
                        <div className="text-center p-4 bg-white/10 rounded-lg">
                          <div className="text-2xl font-bold">NT$ {result.yearlyFee.toLocaleString()}</div>
                          <div className="text-sm opacity-90">年度碳費</div>
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white/10 rounded-lg">
                        <div className="text-xl font-bold">NT$ {result.monthlyFee.toLocaleString()}</div>
                        <div className="text-sm opacity-90">月平均碳費</div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Information Cards */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                      <span>快速提醒</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <h3 className="font-semibold text-emerald-800 mb-2">碳費標準</h3>
                      <p className="text-sm text-emerald-700">
                        目前碳費費率為每噸 CO2 當量 NT$ 300 元，未來將逐步調整。
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">減免優惠</h3>
                      <p className="text-sm text-blue-700">
                        企業若提出自主減量計畫並達成目標，可享有碳費減免優惠。
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Energy Conversion Tab */}
          <TabsContent value="energy" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span>能源使用量轉換碳排放量</span>
                </CardTitle>
                <CardDescription>
                  輸入用電量、汽油量、天然氣量，自動換算成碳排放量
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2">
                      <Lightbulb className="w-4 h-4" />
                      <span>年度用電量 (kWh)</span>
                    </Label>
                    <Input
                      type="number"
                      placeholder="例如：100000"
                      value={energyData.electricity}
                      onChange={(e) => setEnergyData({...energyData, electricity: e.target.value})}
                    />
                    <p className="text-xs text-gray-500">
                      排放係數：0.502 kg CO2e/kWh
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2">
                      <Car className="w-4 h-4" />
                      <span>年度汽油使用量 (公升)</span>
                    </Label>
                    <Input
                      type="number"
                      placeholder="例如：5000"
                      value={energyData.gasoline}
                      onChange={(e) => setEnergyData({...energyData, gasoline: e.target.value})}
                    />
                    <p className="text-xs text-gray-500">
                      排放係數：2.263 kg CO2e/公升
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2">
                      <Fuel className="w-4 h-4" />
                      <span>年度天然氣使用量 (立方公尺)</span>
                    </Label>
                    <Input
                      type="number"
                      placeholder="例如：10000"
                      value={energyData.naturalGas}
                      onChange={(e) => setEnergyData({...energyData, naturalGas: e.target.value})}
                    />
                    <p className="text-xs text-gray-500">
                      排放係數：1.877 kg CO2e/立方公尺
                    </p>
                  </div>
                </div>

                {(energyData.electricity || energyData.gasoline || energyData.naturalGas) && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                      <CardHeader>
                        <CardTitle className="text-lg">碳排放量換算結果</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center space-x-2">
                            <Lightbulb className="w-4 h-4" />
                            <span>用電排放量</span>
                          </span>
                          <span className="font-medium">{energyEmissions.electricity.toFixed(2)} 噸 CO2e</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center space-x-2">
                            <Car className="w-4 h-4" />
                            <span>汽油排放量</span>
                          </span>
                          <span className="font-medium">{energyEmissions.gasoline.toFixed(2)} 噸 CO2e</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center space-x-2">
                            <Fuel className="w-4 h-4" />
                            <span>天然氣排放量</span>
                          </span>
                          <span className="font-medium">{energyEmissions.naturalGas.toFixed(2)} 噸 CO2e</span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between items-center text-lg font-bold">
                            <span>總排放量</span>
                            <span className="text-blue-600">{energyEmissions.total.toFixed(2)} 噸 CO2e</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-orange-50 to-red-50">
                      <CardHeader>
                        <CardTitle className="text-lg">碳費計算</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>預設費率 (NT$ 300/噸)</span>
                          <span className="font-medium">NT$ {(energyEmissions.total * 300).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>優惠費率 A (NT$ 100/噸)</span>
                          <span className="font-medium">NT$ {(energyEmissions.total * 100).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>優惠費率 B (NT$ 50/噸)</span>
                          <span className="font-medium">NT$ {(energyEmissions.total * 50).toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between items-center text-lg font-bold">
                            <span>年度碳費 (預設)</span>
                            <span className="text-red-600">NT$ {(energyEmissions.total * 300).toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Calculation Tab */}
          <TabsContent value="advanced" className="space-y-6">
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

                <Button onClick={calculateAdvancedCarbonFee} className="w-full" size="lg">
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

                    <ChartContainer config={chartConfig} className="h-64">
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

          {/* Policy Information Tab */}
          <TabsContent value="info" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span>碳費政策詳細說明</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <h3 className="font-semibold text-emerald-800 mb-2">碳費標準</h3>
                  <p className="text-sm text-emerald-700">
                    目前碳費費率為每噸 CO2 當量 NT$ 300 元，未來將逐步調整。
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">減免優惠</h3>
                  <p className="text-sm text-blue-700">
                    企業若提出自主減量計畫並達成目標，可享有碳費減免優惠。
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">繳費時程</h3>
                  <p className="text-sm text-orange-700">
                    碳費按季繳納，需於每季結束後 2 個月內完成申報繳費。
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">適用對象</h3>
                  <p className="text-sm text-purple-700">
                    年排放量達 25,000 噸 CO2e 以上的大型排放源，包含電力業與製造業。
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">未來展望</h3>
                  <p className="text-sm text-gray-700">
                    碳費制度將配合國際趨勢及國內減碳進度，適時檢討調整費率水準。
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CarbonFee;
