
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingDown, 
  Lightbulb, 
  Zap, 
  Recycle, 
  Leaf, 
  ArrowLeft,
  CheckCircle,
  Clock,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";

const ReductionPath = () => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const pathways = [
    {
      id: "energy-efficiency",
      title: "能源效率提升",
      description: "透過設備升級和能源管理系統提升能源使用效率",
      icon: Zap,
      color: "bg-yellow-500",
      reduction: "30-50%",
      timeframe: "1-2 年",
      investment: "中等",
      steps: [
        { title: "能源審計", description: "全面評估現有能源使用情況", status: "completed" },
        { title: "設備升級", description: "更換高效能設備和LED照明", status: "in-progress" },
        { title: "智慧監控", description: "安裝能源管理系統", status: "pending" },
        { title: "持續優化", description: "定期檢討和改善", status: "pending" }
      ]
    },
    {
      id: "renewable-energy",
      title: "再生能源轉換",
      description: "導入太陽能、風能等再生能源替代傳統化石燃料",
      icon: Leaf,
      color: "bg-green-500",
      reduction: "50-80%",
      timeframe: "2-3 年",
      investment: "高",
      steps: [
        { title: "可行性評估", description: "評估再生能源導入潛力", status: "completed" },
        { title: "方案設計", description: "設計最適再生能源方案", status: "completed" },
        { title: "設備安裝", description: "安裝太陽能板或風力設備", status: "in-progress" },
        { title: "系統整合", description: "與現有電力系統整合", status: "pending" }
      ]
    },
    {
      id: "circular-economy",
      title: "循環經濟模式",
      description: "建立廢棄物減量、回收再利用的循環經濟體系",
      icon: Recycle,
      color: "bg-blue-500",
      reduction: "20-40%",
      timeframe: "1-3 年",
      investment: "低-中等",
      steps: [
        { title: "廢棄物盤點", description: "全面盤點廢棄物產生源", status: "completed" },
        { title: "回收系統", description: "建立分類回收系統", status: "in-progress" },
        { title: "供應鏈整合", description: "與供應商建立循環模式", status: "in-progress" },
        { title: "創新應用", description: "開發廢棄物再利用技術", status: "pending" }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Target className="w-4 h-4 text-gray-400" />;
    }
  };

  const getProgressValue = (steps: any[]) => {
    const completedSteps = steps.filter(step => step.status === "completed").length;
    return (completedSteps / steps.length) * 100;
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">選擇您的減碳策略</h2>
          <p className="text-lg text-gray-600">
            根據您的企業特性選擇最適合的減碳路徑，制定系統性的減碳計畫
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">策略總覽</TabsTrigger>
            <TabsTrigger value="detailed">詳細規劃</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {pathways.map((pathway) => {
                const IconComponent = pathway.icon;
                return (
                  <Card 
                    key={pathway.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      selectedPath === pathway.id ? 'ring-2 ring-green-500' : ''
                    }`}
                    onClick={() => setSelectedPath(pathway.id)}
                  >
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 ${pathway.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl">{pathway.title}</CardTitle>
                      <CardDescription className="text-center">
                        {pathway.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">減碳潛力</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {pathway.reduction}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">實施時間</span>
                        <span className="font-medium">{pathway.timeframe}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">投資規模</span>
                        <span className="font-medium">{pathway.investment}</span>
                      </div>
                      <Progress value={getProgressValue(pathway.steps)} className="mt-4" />
                      <div className="text-xs text-gray-500 text-center">
                        進度：{Math.round(getProgressValue(pathway.steps))}%
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            {selectedPath ? (
              <div className="space-y-6">
                {pathways
                  .filter(pathway => pathway.id === selectedPath)
                  .map(pathway => (
                    <Card key={pathway.id} className="shadow-lg">
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${pathway.color} rounded-full flex items-center justify-center`}>
                            <pathway.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl">{pathway.title}</CardTitle>
                            <CardDescription className="text-lg">
                              {pathway.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">{pathway.reduction}</div>
                              <div className="text-sm text-gray-600">減碳潛力</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">{pathway.timeframe}</div>
                              <div className="text-sm text-gray-600">實施時間</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-orange-600">{pathway.investment}</div>
                              <div className="text-sm text-gray-600">投資規模</div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-4">實施步驟</h3>
                            <div className="space-y-4">
                              {pathway.steps.map((step, index) => (
                                <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg border">
                                  <div className="flex-shrink-0 mt-1">
                                    {getStatusIcon(step.status)}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{step.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                                  </div>
                                  <div className="flex-shrink-0">
                                    <Badge 
                                      variant={step.status === "completed" ? "default" : "secondary"}
                                      className={
                                        step.status === "completed" 
                                          ? "bg-green-100 text-green-800" 
                                          : step.status === "in-progress"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-gray-100 text-gray-800"
                                      }
                                    >
                                      {step.status === "completed" ? "已完成" : 
                                       step.status === "in-progress" ? "進行中" : "待執行"}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <Card className="shadow-lg">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Lightbulb className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">請選擇減碳策略</h3>
                  <p className="text-gray-600 text-center">
                    請先在策略總覽中選擇一個減碳路徑，然後回到這裡查看詳細的實施計畫
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
