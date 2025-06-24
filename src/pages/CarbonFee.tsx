
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Zap, Car, Flame, ArrowLeft, Droplets, Fuel, Factory, Snowflake } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import StatsCard from "@/components/StatsCard";
import CarbonChart from "@/components/CarbonChart";
import FileUpload from "@/components/FileUpload";
import ExcelReportGenerator from "@/components/ExcelReportGenerator";
import ScenarioComparison from "@/components/ScenarioComparison";
import MarginalAnalysis from "@/components/MarginalAnalysis";
import { getAllEmissionFactors, indirectEmissionFactors } from "@/data/emissionFactors";

const CarbonFee = () => {
  const [electricity, setElectricity] = useState<number>(0);
  const [gasoline, setGasoline] = useState<number>(0);
  const [naturalGas, setNaturalGas] = useState<number>(0);
  const [water, setWater] = useState<number>(0);
  const [diesel, setDiesel] = useState<number>(0);
  const [heavyOil, setHeavyOil] = useState<number>(0);
  const [coal, setCoal] = useState<number>(0);
  const [lpg, setLpg] = useState<number>(0);
  const [refrigerants, setRefrigerants] = useState<{ [key: string]: number }>({});
  const [carbonFeeRate] = useState<number>(300);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [detectedFuels, setDetectedFuels] = useState<string[]>([]);

  // 更新後的排放係數（基於提供的數據）
  const emissionFactors = {
    electricity: 0.502, // kg CO2e/kWh (間接排放)
    gasoline: 2.263, // kg CO2/L (移動燃燒)
    naturalGas: 1.877, // kg CO2/m³
    water: 0.348, // kg CO2e/m³ (間接排放)
    diesel: 2.68, // kg CO2/L
    heavyOil: 3.2, // kg CO2/L (估算)
    coal: 2.42, // kg CO2/kg (估算)
    lpg: 1.51, // kg CO2/L (估算)
  };

  // 計算碳排放量
  const calculateEmissions = () => {
    const electricityEmissions = (electricity * emissionFactors.electricity) / 1000;
    const gasolineEmissions = (gasoline * emissionFactors.gasoline) / 1000;
    const naturalGasEmissions = (naturalGas * emissionFactors.naturalGas) / 1000;
    const waterEmissions = (water * emissionFactors.water) / 1000;
    const dieselEmissions = (diesel * emissionFactors.diesel) / 1000;
    const heavyOilEmissions = (heavyOil * emissionFactors.heavyOil) / 1000;
    const coalEmissions = (coal * emissionFactors.coal) / 1000;
    const lpgEmissions = (lpg * emissionFactors.lpg) / 1000;
    
    // 冷媒排放計算（使用GWP值）
    let refrigerantEmissions = 0;
    Object.entries(refrigerants).forEach(([type, amount]) => {
      const gwpValues: { [key: string]: number } = {
        'R-134a': 1430,
        'R-404A': 3922,
        'R-407C': 1774,
        'R-410A': 2088,
        'R-22': 1810,
        'R-12': 10900,
        'R-32': 675
      };
      if (gwpValues[type]) {
        refrigerantEmissions += (amount * gwpValues[type]) / 1000;
      }
    });
    
    return {
      electricity: electricityEmissions,
      gasoline: gasolineEmissions,
      naturalGas: naturalGasEmissions,
      water: waterEmissions,
      diesel: dieselEmissions,
      heavyOil: heavyOilEmissions,
      coal: coalEmissions,
      lpg: lpgEmissions,
      refrigerant: refrigerantEmissions,
      total: electricityEmissions + gasolineEmissions + naturalGasEmissions + waterEmissions + 
             dieselEmissions + heavyOilEmissions + coalEmissions + lpgEmissions + refrigerantEmissions,
    };
  };

  // 處理文件上傳的數據
  const handleFileDataExtracted = (data: any) => {
    setElectricity(data.electricity);
    setGasoline(data.gasoline);
    setNaturalGas(data.naturalGas);
    setWater(data.water || 0);
    setDiesel(data.diesel || 0);
    setHeavyOil(data.heavyOil || 0);
    setCoal(data.coal || 0);
    setLpg(data.lpg || 0);
    setRefrigerants(data.refrigerants || {});
    setUploadedFileName(data.month + "水電費單");
    setDetectedFuels(data.detectedFuels || []);
    console.log('從文件提取的數據:', data);
  };

  const emissions = calculateEmissions();
  const totalCarbonFee = emissions.total * carbonFeeRate;

  // 圖表數據 - 只顯示有數值的項目
  const emissionData = [
    { name: "電力", value: Number(emissions.electricity.toFixed(3)), color: "#3B82F6" },
    { name: "汽油", value: Number(emissions.gasoline.toFixed(3)), color: "#EF4444" },
    { name: "天然氣", value: Number(emissions.naturalGas.toFixed(3)), color: "#F59E0B" },
    { name: "用水", value: Number(emissions.water.toFixed(3)), color: "#06B6D4" },
    { name: "柴油", value: Number(emissions.diesel.toFixed(3)), color: "#8B5CF6" },
    { name: "重油", value: Number(emissions.heavyOil.toFixed(3)), color: "#F97316" },
    { name: "煤", value: Number(emissions.coal.toFixed(3)), color: "#374151" },
    { name: "液化石油氣", value: Number(emissions.lpg.toFixed(3)), color: "#10B981" },
    { name: "冷媒", value: Number(emissions.refrigerant.toFixed(3)), color: "#EC4899" },
  ].filter(item => item.value > 0);

  // 基準情境數據
  const baseScenario = {
    id: 'base',
    name: '基準情境',
    electricity,
    gasoline,
    naturalGas,
    water,
    diesel,
    totalEmissions: emissions.total,
    carbonFee: totalCarbonFee
  };

  // 報告數據
  const reportData = {
    carbonEmissions: emissions,
    carbonFee: totalCarbonFee,
    uploadedFileName,
    calculationDate: new Date(),
  };

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
          <p className="text-gray-600">上傳水電費單或手動輸入能源使用量，計算對應的碳排放量和碳費</p>
          {detectedFuels.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-emerald-600">
                已識別燃料類型: {detectedFuels.join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* 文件上傳區域 */}
        <div className="mb-8">
          <FileUpload onDataExtracted={handleFileDataExtracted} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatsCard
            title="總碳排放量"
            value={`${emissions.total.toFixed(3)} 公噸`}
            description="CO2 當量"
            icon={Calculator}
            color="emerald"
          />
          <StatsCard
            title="電力排放"
            value={`${emissions.electricity.toFixed(3)} 公噸`}
            description={`${electricity} kWh`}
            icon={Zap}
            color="blue"
          />
          <StatsCard
            title="汽油排放"
            value={`${emissions.gasoline.toFixed(3)} 公噸`}
            description={`${gasoline} L`}
            icon={Car}
            color="red"
          />
          <StatsCard
            title="天然氣排放"
            value={`${emissions.naturalGas.toFixed(3)} 公噸`}
            description={`${naturalGas} m³`}
            icon={Flame}
            color="orange"
          />
          <StatsCard
            title="預估碳費"
            value={`NT$ ${totalCarbonFee.toLocaleString()}`}
            description="月度碳費"
            icon={Calculator}
            color="emerald"
          />
        </div>

        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calculator">基本計算</TabsTrigger>
            <TabsTrigger value="scenario">情境分析</TabsTrigger>
            <TabsTrigger value="marginal">投資分析</TabsTrigger>
            <TabsTrigger value="visualization">數據視覺化</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="water" className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-cyan-500" />
                        用水量 (立方公尺)
                      </Label>
                      <Input
                        id="water"
                        type="number"
                        value={water}
                        onChange={(e) => setWater(Number(e.target.value))}
                        placeholder="例如: 15"
                        className="focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="diesel" className="flex items-center gap-2">
                        <Fuel className="w-4 h-4 text-purple-500" />
                        柴油使用量 (公升)
                      </Label>
                      <Input
                        id="diesel"
                        type="number"
                        value={diesel}
                        onChange={(e) => setDiesel(Number(e.target.value))}
                        placeholder="例如: 30"
                        className="focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="heavyOil" className="flex items-center gap-2">
                        <Factory className="w-4 h-4 text-orange-600" />
                        重油使用量 (公升)
                      </Label>
                      <Input
                        id="heavyOil"
                        type="number"
                        value={heavyOil}
                        onChange={(e) => setHeavyOil(Number(e.target.value))}
                        placeholder="例如: 10"
                        className="focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
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

              {/* Excel報告生成 */}
              <div className="space-y-6">
                {emissionData.length > 0 && (
                  <CarbonChart
                    data={emissionData}
                    title="碳排放來源分布"
                    description="各能源類型的碳排放量比較"
                    type="pie"
                  />
                )}
                
                {emissions.total > 0 && (
                  <ExcelReportGenerator data={reportData} />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scenario">
            <ScenarioComparison baseScenario={baseScenario} />
          </TabsContent>

          <TabsContent value="marginal">
            <MarginalAnalysis 
              currentEmissions={emissions.total} 
              currentCarbonFee={totalCarbonFee}
            />
          </TabsContent>

          <TabsContent value="visualization">
            {emissionData.length > 0 && (
              <div className="grid lg:grid-cols-2 gap-6">
                <CarbonChart
                  data={emissionData}
                  title="碳排放來源分析"
                  description="各能源類型的碳排放量詳細分布"
                  type="pie"
                />
                
                <CarbonChart
                  data={emissionData.map(item => ({ 
                    name: item.name, 
                    value: Number((item.value * carbonFeeRate).toFixed(0)) 
                  }))}
                  title="各能源碳費分布"
                  description="各能源類型對應的碳費金額"
                  type="bar"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

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
