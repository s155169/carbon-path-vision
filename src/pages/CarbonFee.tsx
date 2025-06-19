
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Zap, Car, Flame, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import StatsCard from "@/components/StatsCard";
import CarbonChart from "@/components/CarbonChart";

const CarbonFee = () => {
  const [electricity, setElectricity] = useState<number>(0);
  const [gasoline, setGasoline] = useState<number>(0);
  const [naturalGas, setNaturalGas] = useState<number>(0);
  const [carbonFeeRate] = useState<number>(300); // 每公噸 CO2 的費用（新台幣）

  // 碳排放係數
  const emissionFactors = {
    electricity: 0.509, // kg CO2/kWh
    gasoline: 2.263, // kg CO2/L
    naturalGas: 1.877, // kg CO2/m³
  };

  // 計算碳排放量
  const calculateEmissions = () => {
    const electricityEmissions = (electricity * emissionFactors.electricity) / 1000; // 轉換為公噸
    const gasolineEmissions = (gasoline * emissionFactors.gasoline) / 1000;
    const naturalGasEmissions = (naturalGas * emissionFactors.naturalGas) / 1000;
    
    return {
      electricity: electricityEmissions,
      gasoline: gasolineEmissions,
      naturalGas: naturalGasEmissions,
      total: electricityEmissions + gasolineEmissions + naturalGasEmissions,
    };
  };

  const emissions = calculateEmissions();
  const totalCarbonFee = emissions.total * carbonFeeRate;

  // 圖表數據
  const emissionData = [
    { name: "電力", value: Number(emissions.electricity.toFixed(2)), color: "#3B82F6" },
    { name: "汽油", value: Number(emissions.gasoline.toFixed(2)), color: "#EF4444" },
    { name: "天然氣", value: Number(emissions.naturalGas.toFixed(2)), color: "#F59E0B" },
  ].filter(item => item.value > 0);

  const monthlyProjection = [
    { name: "1月", value: totalCarbonFee * 0.9 },
    { name: "2月", value: totalCarbonFee * 0.8 },
    { name: "3月", value: totalCarbonFee * 1.1 },
    { name: "4月", value: totalCarbonFee },
    { name: "5月", value: totalCarbonFee * 1.05 },
    { name: "6月", value: totalCarbonFee * 0.95 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <Navigation />
      
      <div className="px-6 py-8 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首頁
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">碳費模擬計算器</h1>
          <p className="text-gray-600">輸入您的能源使用量，計算對應的碳排放量和碳費</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="總碳排放量"
            value={`${emissions.total.toFixed(2)} 公噸`}
            description="CO2 當量"
            icon={Calculator}
            color="emerald"
          />
          <StatsCard
            title="電力排放"
            value={`${emissions.electricity.toFixed(2)} 公噸`}
            description={`${electricity} kWh`}
            icon={Zap}
            color="blue"
          />
          <StatsCard
            title="汽油排放"
            value={`${emissions.gasoline.toFixed(2)} 公噸`}
            description={`${gasoline} L`}
            icon={Car}
            color="red"
          />
          <StatsCard
            title="天然氣排放"
            value={`${emissions.naturalGas.toFixed(2)} 公噸`}
            description={`${naturalGas} m³`}
            icon={Flame}
            color="orange"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 計算器 */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-600" />
                能源使用量輸入
              </CardTitle>
              <CardDescription>
                請輸入您的月度能源使用量來計算碳排放
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="electricity" className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  電力使用量 (kWh)
                </Label>
                <Input
                  id="electricity"
                  type="number"
                  value={electricity}
                  onChange={(e) => setElectricity(Number(e.target.value))}
                  placeholder="例如: 300"
                  className="focus:ring-emerald-500 focus:border-emerald-500"
                />
                <p className="text-xs text-gray-500">
                  排放係數: {emissionFactors.electricity} kg CO2/kWh
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gasoline" className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-red-500" />
                  汽油使用量 (公升)
                </Label>
                <Input
                  id="gasoline"
                  type="number"
                  value={gasoline}
                  onChange={(e) => setGasoline(Number(e.target.value))}
                  placeholder="例如: 50"
                  className="focus:ring-emerald-500 focus:border-emerald-500"
                />
                <p className="text-xs text-gray-500">
                  排放係數: {emissionFactors.gasoline} kg CO2/L
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="naturalGas" className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  天然氣使用量 (立方公尺)
                </Label>
                <Input
                  id="naturalGas"
                  type="number"
                  value={naturalGas}
                  onChange={(e) => setNaturalGas(Number(e.target.value))}
                  placeholder="例如: 20"
                  className="focus:ring-emerald-500 focus:border-emerald-500"
                />
                <p className="text-xs text-gray-500">
                  排放係數: {emissionFactors.naturalGas} kg CO2/m³
                </p>
              </div>

              {/* 計算結果 */}
              <div className="pt-6 border-t border-gray-200">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-emerald-800 mb-2">計算結果</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>總碳排放量:</span>
                      <span className="font-medium">{emissions.total.toFixed(3)} 公噸 CO2e</span>
                    </div>
                    <div className="flex justify-between">
                      <span>碳費費率:</span>
                      <span className="font-medium">NT$ {carbonFeeRate}/公噸</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-emerald-700 pt-2 border-t border-emerald-200">
                      <span>預估碳費:</span>
                      <span>NT$ {totalCarbonFee.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 數據視覺化 */}
          <div className="space-y-6">
            {emissionData.length > 0 && (
              <CarbonChart
                data={emissionData}
                title="碳排放來源分布"
                description="各能源類型的碳排放量比較"
                type="pie"
              />
            )}
            
            {totalCarbonFee > 0 && (
              <CarbonChart
                data={monthlyProjection}
                title="月度碳費預估"
                description="基於當前使用量的未來6個月碳費預測"
                type="line"
              />
            )}
          </div>
        </div>

        {/* 減碳建議 */}
        {emissions.total > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>減碳建議</CardTitle>
              <CardDescription>
                根據您的碳排放情況，我們提供以下減碳建議
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">電力節約</h4>
                  <p className="text-sm text-blue-700">
                    使用LED燈具、節能電器，可減少 20-30% 電力消耗
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">交通減碳</h4>
                  <p className="text-sm text-green-700">
                    多使用大眾運輸、共乘或電動車，減少汽油使用
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-2">能源效率</h4>
                  <p className="text-sm text-orange-700">
                    改善建築隔熱、使用高效率設備，降低天然氣需求
                  </p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link to="/reduction-actions">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    查看更多減碳行動
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CarbonFee;
