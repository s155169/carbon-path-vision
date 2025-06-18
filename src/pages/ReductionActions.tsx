
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
  Lightbulb,
  Car,
  Home,
  Utensils,
  Shirt,
  Award,
  Building2,
  DollarSign,
  Calendar,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";

const ReductionActions = () => {
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [showPlan, setShowPlan] = useState(false);

  const industries = [
    { value: "manufacturing", label: "製造業" },
    { value: "retail", label: "零售業" },
    { value: "service", label: "服務業" },
    { value: "tech", label: "科技業" },
    { value: "hospitality", label: "餐旅業" },
    { value: "logistics", label: "物流業" },
    { value: "construction", label: "建築業" },
    { value: "agriculture", label: "農業" }
  ];

  const budgetRanges = [
    { value: "0-50000", label: "5萬以下" },
    { value: "50000-200000", label: "5-20萬" },
    { value: "200000-500000", label: "20-50萬" },
    { value: "500000-1000000", label: "50-100萬" },
    { value: "1000000+", label: "100萬以上" }
  ];

  const actionCategories = [
    {
      id: "energy",
      title: "節能減碳",
      icon: Lightbulb,
      color: "bg-yellow-500",
      industries: ["manufacturing", "retail", "service", "tech"],
      budgetMin: 0,
      actions: [
        { id: "led", title: "更換LED燈具", impact: "高", difficulty: "簡單", co2Saved: 0.5, cost: 30000 },
        { id: "thermostat", title: "調整空調溫度設定", impact: "中", difficulty: "簡單", co2Saved: 0.3, cost: 5000 },
        { id: "unplug", title: "拔除待機電器插頭", impact: "低", difficulty: "簡單", co2Saved: 0.1, cost: 0 },
        { id: "efficient-appliances", title: "選購節能家電", impact: "高", difficulty: "中等", co2Saved: 0.8, cost: 150000 }
      ]
    },
    {
      id: "transport",
      title: "綠色交通",
      icon: Car,
      color: "bg-blue-500", 
      industries: ["logistics", "service", "retail"],
      budgetMin: 10000,
      actions: [
        { id: "public-transport", title: "使用大眾運輸工具", impact: "高", difficulty: "簡單", co2Saved: 1.2, cost: 10000 },
        { id: "bike", title: "騎自行車或步行", impact: "高", difficulty: "簡單", co2Saved: 1.5, cost: 5000 },
        { id: "carpool", title: "共乘或拼車", impact: "中", difficulty: "中等", co2Saved: 0.6, cost: 0 },
        { id: "electric-vehicle", title: "使用電動車", impact: "高", difficulty: "困難", co2Saved: 2.0, cost: 800000 }
      ]
    },
    {
      id: "lifestyle",
      title: "生活方式",
      icon: Home,
      color: "bg-green-500",
      industries: ["service", "hospitality", "retail"],
      budgetMin: 0,
      actions: [
        { id: "recycle", title: "垃圾分類回收", impact: "中", difficulty: "簡單", co2Saved: 0.2, cost: 2000 },
        { id: "reduce-plastic", title: "減少塑膠製品使用", impact: "中", difficulty: "簡單", co2Saved: 0.3, cost: 1000 },
        { id: "local-products", title: "選購在地產品", impact: "中", difficulty: "中等", co2Saved: 0.4, cost: 5000 },
        { id: "minimal-packaging", title: "選擇簡約包裝", impact: "低", difficulty: "簡單", co2Saved: 0.1, cost: 0 }
      ]
    },
    {
      id: "consumption",
      title: "消費習慣",
      icon: Shirt,
      color: "bg-purple-500",
      industries: ["retail", "service", "hospitality"],
      budgetMin: 0,
      actions: [
        { id: "buy-less", title: "減少不必要消費", impact: "高", difficulty: "中等", co2Saved: 1.0, cost: 0 },
        { id: "second-hand", title: "購買二手商品", impact: "中", difficulty: "簡單", co2Saved: 0.5, cost: 0 },
        { id: "repair", title: "修理而非丟棄", impact: "中", difficulty: "中等", co2Saved: 0.4, cost: 3000 },
        { id: "sharing", title: "共享經濟參與", impact: "中", difficulty: "簡單", co2Saved: 0.3, cost: 1000 }
      ]
    }
  ];

  const getFilteredCategories = () => {
    if (!selectedIndustry && !budget) return actionCategories;
    
    const budgetValue = budget ? parseInt(budget.split('-')[0]) : 0;
    
    return actionCategories.filter(category => {
      const industryMatch = !selectedIndustry || category.industries.includes(selectedIndustry);
      const budgetMatch = !budget || budgetValue >= category.budgetMin;
      return industryMatch && budgetMatch;
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

  const filteredCategories = getFilteredCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
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
                <Target className="w-6 h-6 text-green-600" />
                <h1 className="text-2xl font-bold text-gray-900">減碳行動清單</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 mx-auto max-w-7xl">
        {/* Industry and Budget Selection */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>選擇產業與預算</span>
            </CardTitle>
            <CardDescription>
              選擇您的產業類型和預算範圍，系統將為您推薦最適合的減碳行動
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span>產業類型</span>
                </Label>
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
                <Label className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>預算範圍 (新台幣)</span>
                </Label>
                <Select value={budget} onValueChange={setBudget}>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇您的預算範圍" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
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
          <Card className="shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-6 h-6" />
                <span>您的減碳成果</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">{completedActions.length}</div>
                  <div className="text-sm opacity-90">已完成行動</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">{getTotalCO2Saved().toFixed(1)} 噸</div>
                  <div className="text-sm opacity-90">預估年減碳量</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">NT$ {getTotalCost().toLocaleString()}</div>
                  <div className="text-sm opacity-90">總投資成本</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">
                    {getTotalActions() > 0 ? Math.round((completedActions.length / getTotalActions()) * 100) : 0}%
                  </div>
                  <div className="text-sm opacity-90">完成度</div>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">探索減碳行動</h2>
            <p className="text-gray-600">
              {selectedIndustry || budget ? 
                `根據您的條件篩選出 ${filteredCategories.length} 個行動類別` : 
                "選擇適合您的減碳行動，每一個小步驟都能累積成大改變"
              }
            </p>
          </div>
          <Button 
            onClick={() => setShowPlan(!showPlan)}
            className="flex items-center space-x-2"
            variant={showPlan ? "default" : "outline"}
          >
            <Calendar className="w-4 h-4" />
            <span>檢視行動計畫</span>
          </Button>
        </div>

        {/* Action Plan View */}
        {showPlan && (
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>行動計畫</span>
              </CardTitle>
              <CardDescription>
                您已選擇的減碳行動摘要
              </CardDescription>
            </CardHeader>
            <CardContent>
              {completedActions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>尚未選擇任何行動項目</p>
                  <p className="text-sm">開始勾選下方的減碳行動來建立您的計畫</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCategories.map((category) => {
                    const categoryActions = category.actions.filter(action => 
                      completedActions.includes(action.id)
                    );
                    
                    if (categoryActions.length === 0) return null;
                    
                    return (
                      <div key={category.id} className="border rounded-lg p-4">
                        <h4 className="font-semibold text-lg mb-3 flex items-center space-x-2">
                          <category.icon className="w-5 h-5" />
                          <span>{category.title}</span>
                        </h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          {categoryActions.map((action) => (
                            <div key={action.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <div>
                                <div className="font-medium">{action.title}</div>
                                <div className="text-sm text-gray-600">
                                  減碳: {action.co2Saved} 噸/年 | 成本: NT$ {action.cost.toLocaleString()}
                                </div>
                              </div>
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
                          {categoryCompleted} / {category.actions.length} 已完成
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
                              ? 'bg-green-50 border-green-200' 
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
                                <h3 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                                  {action.title}
                                </h3>
                                {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                              </div>
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="secondary" className={getImpactColor(action.impact)}>
                                  影響：{action.impact}
                                </Badge>
                                <Badge variant="secondary" className={getDifficultyColor(action.difficulty)}>
                                  難度：{action.difficulty}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600">
                                預估年減碳量：{action.co2Saved} 噸 CO2
                              </div>
                              <div className="text-sm text-gray-600">
                                投資成本：NT$ {action.cost.toLocaleString()}
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

        {/* Quick Add Section */}
        <Card className="shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>自訂行動</span>
            </CardTitle>
            <CardDescription>
              添加您自己的減碳行動項目
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              新增自訂行動
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReductionActions;
