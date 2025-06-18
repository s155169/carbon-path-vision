
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, DollarSign, Factory, Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CarbonFee = () => {
  const [formData, setFormData] = useState({
    industry: "",
    emissions: "",
    energyConsumption: "",
    fuelType: ""
  });
  
  const [result, setResult] = useState<{
    carbonFee: number;
    monthlyFee: number;
    yearlyFee: number;
  } | null>(null);

  const carbonFeeRate = 300; // NT$ per ton CO2

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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Factory className="w-5 h-5 text-blue-600" />
                <span>排放資料輸入</span>
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
                    <SelectItem value="manufacturing">製造業</SelectItem>
                    <SelectItem value="energy">能源業</SelectItem>
                    <SelectItem value="transportation">運輸業</SelectItem>
                    <SelectItem value="construction">建築業</SelectItem>
                    <SelectItem value="service">服務業</SelectItem>
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
                  <span>碳費政策說明</span>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonFee;
