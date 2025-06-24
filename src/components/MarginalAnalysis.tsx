
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Calculator, DollarSign } from "lucide-react";
import CarbonChart from "./CarbonChart";

interface ReductionMeasure {
  id: string;
  name: string;
  reductionPercent: number;
  implementationCost: number;
  annualOperationCost: number;
  lifespan: number;
  category: string;
}

interface MarginalAnalysisProps {
  currentEmissions: number;
  currentCarbonFee: number;
}

const MarginalAnalysis = ({ currentEmissions, currentCarbonFee }: MarginalAnalysisProps) => {
  const [selectedMeasures, setSelectedMeasures] = useState<string[]>([]);
  const [carbonFeeGrowthRate, setCarbonFeeGrowthRate] = useState<number>(5);
  const [analysisYears, setAnalysisYears] = useState<number>(10);

  const reductionMeasures: ReductionMeasure[] = [
    {
      id: "led_lighting",
      name: "LED燈具更換",
      reductionPercent: 15,
      implementationCost: 50000,
      annualOperationCost: 2000,
      lifespan: 8,
      category: "電力節約"
    },
    {
      id: "solar_panels",
      name: "太陽能板安裝",
      reductionPercent: 40,
      implementationCost: 500000,
      annualOperationCost: 15000,
      lifespan: 20,
      category: "再生能源"
    },
    {
      id: "smart_hvac",
      name: "智慧空調系統",
      reductionPercent: 25,
      implementationCost: 200000,
      annualOperationCost: 8000,
      lifespan: 12,
      category: "建築節能"
    },
    {
      id: "electric_vehicle",
      name: "電動車轉換",
      reductionPercent: 80,
      implementationCost: 800000,
      annualOperationCost: 20000,
      lifespan: 8,
      category: "交通減碳"
    },
    {
      id: "insulation",
      name: "建築隔熱改善",
      reductionPercent: 20,
      implementationCost: 150000,
      annualOperationCost: 3000,
      lifespan: 15,
      category: "建築節能"
    },
    {
      id: "energy_monitor",
      name: "智慧電錶系統",
      reductionPercent: 12,
      implementationCost: 30000,
      annualOperationCost: 1500,
      lifespan: 10,
      category: "電力節約"
    }
  ];

  const calculateROI = (measure: ReductionMeasure) => {
    const annualEmissionReduction = currentEmissions * (measure.reductionPercent / 100);
    const totalCosts = measure.implementationCost + (measure.annualOperationCost * measure.lifespan);
    
    let totalSavings = 0;
    let currentFee = currentCarbonFee * (measure.reductionPercent / 100);
    
    for (let year = 1; year <= measure.lifespan; year++) {
      totalSavings += currentFee;
      currentFee *= (1 + carbonFeeGrowthRate / 100);
    }
    
    const roi = ((totalSavings - totalCosts) / totalCosts) * 100;
    const paybackPeriod = measure.implementationCost / (currentCarbonFee * (measure.reductionPercent / 100));
    
    return {
      roi,
      paybackPeriod,
      totalSavings,
      totalCosts,
      annualEmissionReduction,
      netPresentValue: totalSavings - totalCosts
    };
  };

  const getCumulativeAnalysis = () => {
    if (selectedMeasures.length === 0) return [];
    
    const measures = selectedMeasures.map(id => 
      reductionMeasures.find(m => m.id === id)!
    ).sort((a, b) => {
      const roiA = calculateROI(a).roi;
      const roiB = calculateROI(b).roi;
      return roiB - roiA;
    });

    let cumulativeInvestment = 0;
    let cumulativeReduction = 0;
    let cumulativeSavings = 0;

    return measures.map(measure => {
      const analysis = calculateROI(measure);
      cumulativeInvestment += measure.implementationCost;
      cumulativeReduction += measure.reductionPercent;
      cumulativeSavings += analysis.totalSavings;

      return {
        name: measure.name,
        累積投資: Number((cumulativeInvestment / 10000).toFixed(1)),
        累積減排: Number(Math.min(cumulativeReduction, 100).toFixed(1)),
        累積節省: Number((cumulativeSavings / 10000).toFixed(1)),
        ROI: Number(analysis.roi.toFixed(1))
      };
    });
  };

  const getYearlyProjection = () => {
    if (selectedMeasures.length === 0) return [];
    
    const totalReduction = selectedMeasures.reduce((sum, id) => {
      const measure = reductionMeasures.find(m => m.id === id)!;
      return sum + (measure.reductionPercent / 100);
    }, 0);

    const clampedReduction = Math.min(totalReduction, 1);
    const annualSavings = currentCarbonFee * clampedReduction;

    return Array.from({ length: analysisYears }, (_, index) => ({
      年份: `第${index + 1}年`,
      節省金額: Number((annualSavings * Math.pow(1 + carbonFeeGrowthRate / 100, index) / 1000).toFixed(1)),
      累積節省: Number((annualSavings * ((Math.pow(1 + carbonFeeGrowthRate / 100, index + 1) - 1) / (carbonFeeGrowthRate / 100)) / 1000).toFixed(1))
    }));
  };

  const toggleMeasure = (measureId: string) => {
    if (selectedMeasures.includes(measureId)) {
      setSelectedMeasures(selectedMeasures.filter(id => id !== measureId));
    } else {
      setSelectedMeasures([...selectedMeasures, measureId]);
    }
  };

  const getTotalAnalysis = () => {
    if (selectedMeasures.length === 0) return null;

    const totalImplementationCost = selectedMeasures.reduce((sum, id) => {
      const measure = reductionMeasures.find(m => m.id === id)!;
      return sum + measure.implementationCost;
    }, 0);

    const totalReductionPercent = Math.min(selectedMeasures.reduce((sum, id) => {
      const measure = reductionMeasures.find(m => m.id === id)!;
      return sum + measure.reductionPercent;
    }, 0), 100);

    const averageLifespan = selectedMeasures.reduce((sum, id) => {
      const measure = reductionMeasures.find(m => m.id === id)!;
      return sum + measure.lifespan;
    }, 0) / selectedMeasures.length;

    const annualSavings = currentCarbonFee * (totalReductionPercent / 100);
    let totalSavings = 0;
    let currentFee = annualSavings;
    
    for (let year = 1; year <= averageLifespan; year++) {
      totalSavings += currentFee;
      currentFee *= (1 + carbonFeeGrowthRate / 100);
    }

    const roi = ((totalSavings - totalImplementationCost) / totalImplementationCost) * 100;
    const paybackPeriod = totalImplementationCost / annualSavings;

    return {
      totalImplementationCost,
      totalReductionPercent,
      totalSavings,
      roi,
      paybackPeriod,
      annualEmissionReduction: currentEmissions * (totalReductionPercent / 100)
    };
  };

  const totalAnalysis = getTotalAnalysis();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            邊際與累積收益分析
          </CardTitle>
          <CardDescription>
            分析減排投資的邊際收益和累積回報率
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="carbonFeeGrowthRate">碳費年增長率 (%)</Label>
              <Input
                id="carbonFeeGrowthRate"
                type="number"
                value={carbonFeeGrowthRate}
                onChange={(e) => setCarbonFeeGrowthRate(Number(e.target.value))}
                min="0"
                max="20"
              />
            </div>
            <div>
              <Label htmlFor="analysisYears">分析年限</Label>
              <Select value={analysisYears.toString()} onValueChange={(value) => setAnalysisYears(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5年</SelectItem>
                  <SelectItem value="10">10年</SelectItem>
                  <SelectItem value="15">15年</SelectItem>
                  <SelectItem value="20">20年</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">選擇減碳措施</h4>
            <div className="grid gap-3">
              {reductionMeasures.map(measure => {
                const analysis = calculateROI(measure);
                const isSelected = selectedMeasures.includes(measure.id);
                
                return (
                  <Card key={measure.id} className={`cursor-pointer transition-colors ${isSelected ? 'ring-2 ring-emerald-500 bg-emerald-50' : 'hover:bg-gray-50'}`}>
                    <CardContent className="p-4" onClick={() => toggleMeasure(measure.id)}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium">{measure.name}</h5>
                            <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">{measure.category}</span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                            <div>減排: {measure.reductionPercent}%</div>
                            <div>投資: NT$ {measure.implementationCost.toLocaleString()}</div>
                            <div>ROI: {analysis.roi.toFixed(1)}%</div>
                            <div>回收: {analysis.paybackPeriod.toFixed(1)}年</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-emerald-600">
                            年節省: NT$ {(currentCarbonFee * (measure.reductionPercent / 100)).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {totalAnalysis && (
            <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
              <h4 className="font-semibold text-emerald-800 mb-3">綜合分析結果</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-emerald-700">總投資成本</span>
                  <p className="font-medium">NT$ {totalAnalysis.totalImplementationCost.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-emerald-700">總減排比例</span>
                  <p className="font-medium">{totalAnalysis.totalReductionPercent.toFixed(1)}%</p>
                </div>
                <div>
                  <span className="text-emerald-700">總投資回報率</span>
                  <p className="font-medium">{totalAnalysis.roi.toFixed(1)}%</p>
                </div>
                <div>
                  <span className="text-emerald-700">投資回收期</span>
                  <p className="font-medium">{totalAnalysis.paybackPeriod.toFixed(1)}年</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedMeasures.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <CarbonChart
            data={getCumulativeAnalysis()}
            title="累積投資效益分析"
            description="按ROI排序的累積投資和減排效果"
            type="bar"
          />
          
          <CarbonChart
            data={getYearlyProjection()}
            title="年度節省金額預測"
            description={`未來${analysisYears}年的節省金額趨勢（碳費年增長${carbonFeeGrowthRate}%）`}
            type="line"
          />
        </div>
      )}
    </div>
  );
};

export default MarginalAnalysis;
