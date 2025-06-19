
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingDown, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Target,
  Zap,
  Car,
  Home,
  Factory,
  Leaf
} from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import CarbonChart from "@/components/CarbonChart";

const ReductionPath = () => {
  const [selectedPath, setSelectedPath] = useState<string>("conservative");

  const reductionPaths = {
    conservative: {
      name: "保守路徑",
      description: "穩健的減碳策略，風險較低",
      targetReduction: 30,
      timeframe: "2030年",
      cost: "低",
      color: "blue",
      steps: [
        { phase: "第一階段 (2024-2026)", target: 10, actions: ["LED照明改善", "基礎節能措施"] },
        { phase: "第二階段 (2026-2028)", target: 20, actions: ["設備效率提升", "再生能源導入"] },
        { phase: "第三階段 (2028-2030)", target: 30, actions: ["智慧系統整合", "碳抵消方案"] },
      ]
    },
    moderate: {
      name: "積極路徑",
      description: "平衡成本與效果的減碳方案",
      targetReduction: 50,
      timeframe: "2030年",
      cost: "中",
      color: "emerald",
      steps: [
        { phase: "第一階段 (2024-2026)", target: 20, actions: ["全面設備升級", "太陽能安裝"] },
        { phase: "第二階段 (2026-2028)", target: 35, actions: ["電動車隊轉換", "建築節能改造"] },
        { phase: "第三階段 (2028-2030)", target: 50, actions: ["碳捕捉技術", "綠色供應鏈"] },
      ]
    },
    aggressive: {
      name: "激進路徑",
      description: "快速達成淨零目標的全面方案",
      targetReduction: 70,
      timeframe: "2030年",
      cost: "高",
      color: "green",
      steps: [
        { phase: "第一階段 (2024-2026)", target: 30, actions: ["大規模再生能源", "全電氣化改造"] },
        { phase: "第二階段 (2026-2028)", target: 50, actions: ["氫能導入", "碳負排技術"] },
        { phase: "第三階段 (2028-2030)", target: 70, actions: ["循環經濟轉型", "零碳營運"] },
      ]
    },
  };

  const currentPath = reductionPaths[selectedPath as keyof typeof reductionPaths];

  // 生成預測數據
  const generateProjectionData = () => {
    const baseEmission = 100;
    const steps = currentPath.steps;
    let currentEmission = baseEmission;
    
    return [
      { name: "2024", value: baseEmission },
      { name: "2026", value: baseEmission * (100 - steps[0].target) / 100 },
      { name: "2028", value: baseEmission * (100 - steps[1].target) / 100 },
      { name: "2030", value: baseEmission * (100 - steps[2].target) / 100 },
    ];
  };

  const sectorData = [
    { name: "能源", value: 45, color: "#3B82F6" },
    { name: "交通", value: 25, color: "#EF4444" },
    { name: "建築", value: 20, color: "#F59E0B" },
    { name: "工業", value: 10, color: "#10B981" },
  ];

  const actionCategories = [
    {
      icon: Zap,
      title: "能源轉型",
      description: "轉向再生能源，提升能源效率",
      impact: "高",
      difficulty: "中",
      color: "blue"
    },
    {
      icon: Car,
      title: "交通電氣化",
      description: "推動電動車輛和綠色交通",
      impact: "中",
      difficulty: "中",
      color: "red"
    },
    {
      icon: Home,
      title: "建築節能",
      description: "智慧建築和節能改造",
      impact: "中",
      difficulty: "低",
      color: "orange"
    },
    {
      icon: Factory,
      title: "工業升級",
      description: "製程優化和循環經濟",
      impact: "高",
      difficulty: "高",
      color: "green"
    },
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">減碳路徑規劃</h1>
          <p className="text-gray-600">選擇適合的減碳策略，制定系統性的實施計畫</p>
        </div>

        {/* 路徑選擇 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {Object.entries(reductionPaths).map(([key, path]) => (
            <Card 
              key={key}
              className={`cursor-pointer transition-all duration-200 ${
                selectedPath === key 
                  ? 'ring-2 ring-emerald-500 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedPath(key)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {path.name}
                  <Badge variant={selectedPath === key ? "default" : "secondary"}>
                    -{path.targetReduction}%
                  </Badge>
                </CardTitle>
                <CardDescription>{path.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>減碳目標:</span>
                    <span className="font-medium">{path.targetReduction}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>達成時間:</span>
                    <span className="font-medium">{path.timeframe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>投資成本:</span>
                    <span className="font-medium">{path.cost}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 選定路徑詳細資訊 */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                {currentPath.name} - 實施階段
              </CardTitle>
              <CardDescription>
                分階段減碳計畫與具體行動方案
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentPath.steps.map((step, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{step.phase}</h4>
                    <Badge variant="outline">-{step.target}%</Badge>
                  </div>
                  <Progress value={(step.target / currentPath.targetReduction) * 100} className="h-2" />
                  <div className="space-y-1">
                    {step.actions.map((action, actionIndex) => (
                      <div key={actionIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <CarbonChart
              data={generateProjectionData()}
              title="減碳預測曲線"
              description={`${currentPath.name}的減排效果預測`}
              type="area"
            />
            
            <CarbonChart
              data={sectorData}
              title="部門減碳潛力"
              description="各部門的減碳貢獻比例"
              type="pie"
            />
          </div>
        </div>

        {/* 行動類別 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>核心減碳行動類別</CardTitle>
            <CardDescription>
              了解不同減碳行動的影響力和實施難度
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {actionCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                        <Icon className={`w-5 h-5 text-${category.color}-600`} />
                      </div>
                      <h4 className="font-medium">{category.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                    <div className="flex justify-between text-xs">
                      <span>影響力: <Badge variant="outline" size="sm">{category.impact}</Badge></span>
                      <span>難度: <Badge variant="outline" size="sm">{category.difficulty}</Badge></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 時程規劃 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              實施時程規劃
            </CardTitle>
            <CardDescription>
              {currentPath.name}的詳細時程安排
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentPath.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-emerald-600">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{step.phase}</h4>
                    <p className="text-sm text-gray-600 mb-2">目標減碳: {step.target}%</p>
                    <div className="flex flex-wrap gap-2">
                      {step.actions.map((action, actionIndex) => (
                        <Badge key={actionIndex} variant="secondary" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Link to="/reduction-actions">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Leaf className="w-4 h-4 mr-2" />
                  開始執行減碳行動
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReductionPath;
