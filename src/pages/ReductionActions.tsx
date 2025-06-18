import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Target, 
  CheckCircle2, 
  Plus, 
  ArrowLeft,
  Factory,
  Zap,
  Car,
  Users,
  Settings,
  Building2,
  DollarSign,
  Calendar,
  Filter,
  Download,
  BarChart3,
  Grid3X3,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";

const ReductionActions = () => {
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [companySize, setCompanySize] = useState<string>("");
  const [showPlan, setShowPlan] = useState(false);

  const industries = [
    { value: "manufacturing", label: "製造業" },
    { value: "electronics", label: "電子業" },
    { value: "chemical", label: "化工業" },
    { value: "textile", label: "紡織業" },
    { value: "food", label: "食品業" },
    { value: "automotive", label: "汽車業" },
    { value: "steel", label: "鋼鐵業" },
    { value: "petrochemical", label: "石化業" }
  ];

  const companySizes = [
    { value: "small", label: "小型企業 (50人以下)" },
    { value: "medium", label: "中型企業 (50-250人)" },
    { value: "large", label: "大型企業 (250人以上)" }
  ];

  const actionCategories = [
    {
      id: "manufacturing",
      title: "製程優化",
      icon: Factory,
      color: "bg-blue-600",
      industries: ["manufacturing", "electronics", "chemical", "textile", "food"],
      actions: [
        { id: "process-efficiency", title: "製程效率改善", impact: "高", difficulty: "中等", co2Saved: 2.5, cost: 200000, description: "優化生產流程，減少能源浪費" },
        { id: "waste-heat-recovery", title: "廢熱回收系統", impact: "高", difficulty: "困難", co2Saved: 3.2, cost: 800000, description: "回收製程中的廢熱進行再利用" },
        { id: "equipment-upgrade", title: "老舊設備汰換", impact: "中", difficulty: "中等", co2Saved: 1.8, cost: 500000, description: "更換高效能生產設備" },
        { id: "automation", title: "智慧化自動控制", impact: "中", difficulty: "困難", co2Saved: 1.5, cost: 600000, description: "導入AI智慧控制系統" }
      ]
    },
    {
      id: "facility",
      title: "設施節能",
      icon: Zap,
      color: "bg-yellow-500",
      industries: ["manufacturing", "electronics", "chemical", "automotive"],
      actions: [
        { id: "led-lighting", title: "LED照明系統", impact: "中", difficulty: "簡單", co2Saved: 0.8, cost: 150000, description: "全面更換LED節能照明" },
        { id: "hvac-optimization", title: "空調系統優化", impact: "高", difficulty: "中等", co2Saved: 2.0, cost: 300000, description: "升級高效率空調系統" },
        { id: "solar-panels", title: "太陽能發電系統", impact: "高", difficulty: "困難", co2Saved: 4.5, cost: 1200000, description: "安裝屋頂太陽能板" },
        { id: "energy-monitoring", title: "能源監控系統", impact: "中", difficulty: "中等", co2Saved: 1.2, cost: 250000, description: "即時監控各區域用電狀況" }
      ]
    },
    {
      id: "transport",
      title: "運輸物流",
      icon: Car,
      color: "bg-green-600",
      industries: ["manufacturing", "food", "automotive", "textile"],
      actions: [
        { id: "fleet-electrification", title: "車隊電動化", impact: "高", difficulty: "困難", co2Saved: 3.8, cost: 2000000, description: "將公司車隊更換為電動車" },
        { id: "route-optimization", title: "運輸路線優化", impact: "中", difficulty: "簡單", co2Saved: 1.0, cost: 50000, description: "使用AI優化配送路線" },
        { id: "logistics-consolidation", title: "物流整合", impact: "中", difficulty: "中等", co2Saved: 1.5, cost: 100000, description: "整合供應鏈減少運輸次數" },
        { id: "remote-work", title: "遠距工作政策", impact: "中", difficulty: "簡單", co2Saved: 0.8, cost: 20000, description: "減少員工通勤排放" }
      ]
    },
    {
      id: "hr-management",
      title: "人力資源",
      icon: Users,
      color: "bg-purple-600",
      industries: ["manufacturing", "electronics", "chemical", "automotive"],
      actions: [
        { id: "green-training", title: "綠色技能培訓", impact: "中", difficulty: "簡單", co2Saved: 0.5, cost: 80000, description: "員工環保意識與技能培訓" },
        { id: "incentive-program", title: "綠色行為獎勵", impact: "低", difficulty: "簡單", co2Saved: 0.3, cost: 30000, description: "鼓勵員工節能減碳行為" },
        { id: "carpooling", title: "員工共乘計畫", impact: "中", difficulty: "簡單", co2Saved: 0.6, cost: 15000, description: "推動員工共乘減少通勤排放" },
        { id: "green-procurement", title: "綠色採購政策", impact: "中", difficulty: "中等", co2Saved: 1.2, cost: 50000, description: "優先採購環保產品和服務" }
      ]
    }
  ];

  const getFilteredCategories = () => {
    if (!selectedIndustry && !companySize) return actionCategories;
    
    return actionCategories.filter(category => {
      const industryMatch = !selectedIndustry || category.industries.includes(selectedIndustry);
      return industryMatch;
    });
  };

  const toggleAction = (actionId: string) => {
    if (completedActions.includes(actionId)) {
      setCompletedActions(completedActions.filter(id => id !== actionId));
    } else {
      setCompletedActions([...completedActions, actionId]);
    }
  };

  const getTotalCO2Saved = () => {
    let total = 0;
    getFilteredCategories().forEach(category => {
      category.actions.forEach(action => {
        if (completedActions.includes(action.id)) {
          total += action.co2Saved;
        }
      });
    });
    return total;
  };

  const getTotalCost = () => {
    let total = 0;
    getFilteredCategories().forEach(category => {
      category.actions.forEach(action => {
        if (completedActions.includes(action.id)) {
          total += action.cost;
        }
      });
    });
    return total;
  };

  const getTotalActions = () => {
    return getFilteredCategories().reduce((total, category) => total + category.actions.length, 0);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "高": return "bg-red-100 text-red-800";
      case "中": return "bg-yellow-100 text-yellow-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "困難": return "bg-red-100 text-red-800";
      case "中等": return "bg-yellow-100 text-yellow-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  const exportPlan = () => {
    const selectedActions = getSelectedActions();
    
    const planData = {
      companyInfo: {
        industry: selectedIndustry,
        size: companySize
      },
      summary: {
        totalActions: selectedActions.length,
        totalCO2Saved: getTotalCO2Saved(),
        totalCost: getTotalCost()
      },
      actions: selectedActions,
      exportDate: new Date().toLocaleDateString('zh-TW')
    };

    const dataStr = JSON.stringify(planData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `企業減碳行動計畫_${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getSelectedActions = () => {
    const selected = [];
    getFilteredCategories().forEach(category => {
      category.actions.forEach(action => {
        if (completedActions.includes(action.id)) {
          selected.push({
            ...action,
            category: category.title,
            categoryIcon: category.icon
          });
        }
      });
    });
    return selected;
  };

  const filteredCategories = getFilteredCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
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
                <Target className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">企業減碳行動</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 mx-auto max-w-7xl">
        {/* Company Profile Selection */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>企業資訊設定</span>
            </CardTitle>
            <CardDescription>
              請選擇您的產業類型和企業規模，系統將為您推薦最適合的減碳行動方案
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>產業類型</Label>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇您的產業" />
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
                <Label>企業規模</Label>
                <Select value={companySize} onValueChange={setCompanySize}>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇企業規模" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <div className="mb-8">
          <Card className="shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-6 h-6" />
                <span>減碳執行成果</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">{completedActions.length}</div>
                  <div className="text-sm opacity-90">已執行項目</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">{getTotalCO2Saved().toFixed(1)} 噸</div>
                  <div className="text-sm opacity-90">年減碳量</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">NT$ {getTotalCost().toLocaleString()}</div>
                  <div className="text-sm opacity-90">總投資金額</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">
                    {getTotalActions() > 0 ? Math.round((completedActions.length / getTotalActions()) * 100) : 0}%
                  </div>
                  <div className="text-sm opacity-90">執行進度</div>
                </div>
              </div>
              <Progress 
                value={getTotalActions() > 0 ? (completedActions.length / getTotalActions()) * 100 : 0} 
                className="mt-6 bg-white/20"
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">企業減碳行動方案</h2>
            <p className="text-gray-600">
              {selectedIndustry || companySize ? 
                `根據您的企業特性篩選出 ${filteredCategories.length} 個行動類別` : 
                "選擇適合您企業的減碳行動，建立系統性的減碳策略"
              }
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              onClick={() => setShowPlan(!showPlan)}
              className="flex items-center space-x-2"
              variant={showPlan ? "default" : "outline"}
            >
              <Calendar className="w-4 h-4" />
              <span>執行計畫</span>
            </Button>
            {completedActions.length > 0 && (
              <Button onClick={exportPlan} className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>匯出報告</span>
              </Button>
            )}
          </div>
        </div>

        {/* Execution Plan View */}
        {showPlan && completedActions.length > 0 && (
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>執行計畫摘要</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">{getSelectedActions().length}</div>
                  <div className="text-sm text-blue-800">選定方案數</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">{getTotalCO2Saved().toFixed(1)} 噸</div>
                  <div className="text-sm text-green-800">年減碳效益</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-2">NT$ {getTotalCost().toLocaleString()}</div>
                  <div className="text-sm text-orange-800">預估投資額</div>
                </div>
              </div>

              <div className="space-y-3">
                {getSelectedActions().map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-gray-600">{action.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        減碳 {action.co2Saved} 噸/年
                      </div>
                      <div className="text-sm text-gray-600">
                        投資 NT$ {action.cost.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category) => {
            const IconComponent = category.icon;
            const categoryCompleted = category.actions.filter(action => 
              completedActions.includes(action.id)
            ).length;
            
            return (
              <Card key={category.id} className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{category.title}</CardTitle>
                        <CardDescription>
                          {categoryCompleted} / {category.actions.length} 項目已選定
                        </CardDescription>
                      </div>
                    </div>
                    <Progress 
                      value={(categoryCompleted / category.actions.length) * 100}
                      className="w-32"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {category.actions.map((action) => {
                      const isCompleted = completedActions.includes(action.id);
                      return (
                        <div
                          key={action.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                            isCompleted 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => toggleAction(action.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              checked={isCompleted}
                              onChange={() => toggleAction(action.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className={`font-medium ${isCompleted ? 'text-blue-700' : ''}`}>
                                  {action.title}
                                </h3>
                                {isCompleted && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="secondary" className={getImpactColor(action.impact)}>
                                  影響：{action.impact}
                                </Badge>
                                <Badge variant="secondary" className={getDifficultyColor(action.difficulty)}>
                                  難度：{action.difficulty}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div>減碳效益：{action.co2Saved} 噸 CO2/年</div>
                                <div>投資金額：NT$ {action.cost.toLocaleString()}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReductionActions;
