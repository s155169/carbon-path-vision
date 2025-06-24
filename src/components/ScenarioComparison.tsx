
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Plus, Trash2, BarChart3 } from "lucide-react";
import CarbonChart from "./CarbonChart";

interface ScenarioData {
  id: string;
  name: string;
  electricity: number;
  gasoline: number;
  naturalGas: number;
  water?: number;
  diesel?: number;
  totalEmissions: number;
  carbonFee: number;
}

interface ScenarioComparisonProps {
  baseScenario: ScenarioData;
}

const ScenarioComparison = ({ baseScenario }: ScenarioComparisonProps) => {
  const [scenarios, setScenarios] = useState<ScenarioData[]>([baseScenario]);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([baseScenario.id]);

  const calculateEmissions = (data: Partial<ScenarioData>) => {
    const electricityEmissions = (data.electricity || 0) * 0.502 / 1000;
    const gasolineEmissions = (data.gasoline || 0) * 2.263 / 1000;
    const naturalGasEmissions = (data.naturalGas || 0) * 1.877 / 1000;
    const waterEmissions = (data.water || 0) * 0.348 / 1000;
    const dieselEmissions = (data.diesel || 0) * 2.68 / 1000;

    const total = electricityEmissions + gasolineEmissions + naturalGasEmissions + waterEmissions + dieselEmissions;
    return {
      totalEmissions: total,
      carbonFee: total * 300
    };
  };

  const createNewScenario = () => {
    const newScenario: ScenarioData = {
      id: `scenario_${Date.now()}`,
      name: `情境 ${scenarios.length + 1}`,
      electricity: baseScenario.electricity,
      gasoline: baseScenario.gasoline,
      naturalGas: baseScenario.naturalGas,
      water: 0,
      diesel: 0,
      totalEmissions: 0,
      carbonFee: 0
    };

    const calculated = calculateEmissions(newScenario);
    newScenario.totalEmissions = calculated.totalEmissions;
    newScenario.carbonFee = calculated.carbonFee;

    setScenarios([...scenarios, newScenario]);
  };

  const duplicateScenario = (scenarioId: string) => {
    const original = scenarios.find(s => s.id === scenarioId);
    if (!original) return;

    const duplicate: ScenarioData = {
      ...original,
      id: `scenario_${Date.now()}`,
      name: `${original.name} (複製)`
    };

    setScenarios([...scenarios, duplicate]);
  };

  const updateScenario = (scenarioId: string, field: keyof ScenarioData, value: string | number) => {
    setScenarios(scenarios.map(scenario => {
      if (scenario.id === scenarioId) {
        const updated = { ...scenario, [field]: value };
        if (field !== 'name') {
          const calculated = calculateEmissions(updated);
          updated.totalEmissions = calculated.totalEmissions;
          updated.carbonFee = calculated.carbonFee;
        }
        return updated;
      }
      return scenario;
    }));
  };

  const deleteScenario = (scenarioId: string) => {
    if (scenarios.length > 1) {
      setScenarios(scenarios.filter(s => s.id !== scenarioId));
      setSelectedScenarios(selectedScenarios.filter(id => id !== scenarioId));
    }
  };

  const toggleScenarioSelection = (scenarioId: string) => {
    if (selectedScenarios.includes(scenarioId)) {
      setSelectedScenarios(selectedScenarios.filter(id => id !== scenarioId));
    } else {
      setSelectedScenarios([...selectedScenarios, scenarioId]);
    }
  };

  const getComparisonData = () => {
    const selectedScenariosData = scenarios.filter(s => selectedScenarios.includes(s.id));
    return selectedScenariosData.map(scenario => ({
      name: scenario.name,
      碳排放量: Number(scenario.totalEmissions.toFixed(2)),
      碳費: Number((scenario.carbonFee / 1000).toFixed(1))
    }));
  };

  const getCostSavingsData = () => {
    if (selectedScenarios.length < 2) return [];
    
    const baseScenarioData = scenarios.find(s => s.id === baseScenario.id);
    if (!baseScenarioData) return [];

    return scenarios
      .filter(s => selectedScenarios.includes(s.id) && s.id !== baseScenario.id)
      .map(scenario => {
        const savings = baseScenarioData.carbonFee - scenario.carbonFee;
        const reductionPercent = ((baseScenarioData.totalEmissions - scenario.totalEmissions) / baseScenarioData.totalEmissions) * 100;
        
        return {
          name: scenario.name,
          節省金額: Number((savings / 1000).toFixed(1)),
          減排比例: Number(reductionPercent.toFixed(1))
        };
      });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            情境對比分析
          </CardTitle>
          <CardDescription>
            創建多個情境進行減碳策略比較分析
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button onClick={createNewScenario} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              新增情境
            </Button>
          </div>

          <div className="grid gap-4">
            {scenarios.map(scenario => (
              <Card key={scenario.id} className={`${selectedScenarios.includes(scenario.id) ? 'ring-2 ring-emerald-500' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Input
                        value={scenario.name}
                        onChange={(e) => updateScenario(scenario.id, 'name', e.target.value)}
                        className="font-medium"
                      />
                      {scenario.id === baseScenario.id && (
                        <Badge variant="secondary">基準情境</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleScenarioSelection(scenario.id)}
                      >
                        {selectedScenarios.includes(scenario.id) ? '取消選擇' : '選擇比較'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => duplicateScenario(scenario.id)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      {scenarios.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteScenario(scenario.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <Label htmlFor={`electricity-${scenario.id}`}>電力 (kWh)</Label>
                      <Input
                        id={`electricity-${scenario.id}`}
                        type="number"
                        value={scenario.electricity}
                        onChange={(e) => updateScenario(scenario.id, 'electricity', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`gasoline-${scenario.id}`}>汽油 (L)</Label>
                      <Input
                        id={`gasoline-${scenario.id}`}
                        type="number"
                        value={scenario.gasoline}
                        onChange={(e) => updateScenario(scenario.id, 'gasoline', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`naturalGas-${scenario.id}`}>天然氣 (m³)</Label>
                      <Input
                        id={`naturalGas-${scenario.id}`}
                        type="number"
                        value={scenario.naturalGas}
                        onChange={(e) => updateScenario(scenario.id, 'naturalGas', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`water-${scenario.id}`}>用水 (m³)</Label>
                      <Input
                        id={`water-${scenario.id}`}
                        type="number"
                        value={scenario.water || 0}
                        onChange={(e) => updateScenario(scenario.id, 'water', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`diesel-${scenario.id}`}>柴油 (L)</Label>
                      <Input
                        id={`diesel-${scenario.id}`}
                        type="number"
                        value={scenario.diesel || 0}
                        onChange={(e) => updateScenario(scenario.id, 'diesel', Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm text-gray-600">總碳排放量</span>
                      <p className="font-semibold">{scenario.totalEmissions.toFixed(3)} 公噸 CO2e</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">預估碳費</span>
                      <p className="font-semibold">NT$ {scenario.carbonFee.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedScenarios.length > 1 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <CarbonChart
            data={getComparisonData()}
            title="情境碳排放對比"
            description="各情境的碳排放量和碳費比較"
            type="bar"
          />
          
          {getCostSavingsData().length > 0 && (
            <CarbonChart
              data={getCostSavingsData()}
              title="減碳效益分析"
              description="相較基準情境的節省金額和減排比例"
              type="bar"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ScenarioComparison;
