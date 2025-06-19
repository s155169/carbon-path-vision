
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Target, 
  ArrowLeft, 
  CheckCircle, 
  Star,
  Zap,
  Car,
  Home,
  Factory,
  Leaf,
  TrendingUp,
  Calendar,
  DollarSign
} from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import StatsCard from "@/components/StatsCard";
import CarbonChart from "@/components/CarbonChart";

const ReductionActions = () => {
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const actionCategories = [
    { id: "all", name: "全部", icon: Target },
    { id: "energy", name: "能源", icon: Zap },
    { id: "transport", name: "交通", icon: Car },
    { id: "building", name: "建築", icon: Home },
    { id: "industry", name: "工業", icon: Factory },
  ];

  const actions = [
    {
      id: "led-lighting",
      title: "LED照明升級",
      description: "將傳統燈具更換為LED燈具",
      category: "energy",
      impact: "中",
      difficulty: "低",
      cost: "$",
      reduction: 0.5,
      timeframe: "1-2個月",
      priority: "高",
    },
    {
      id: "solar-panels",
      title: "太陽能板安裝",
      description: "在屋頂安裝太陽能發電系統",
      category: "energy",
      impact: "高",
      difficulty: "中",
      cost: "$$$",
      reduction: 3.2,
      timeframe: "3-6個月",
      priority: "中",
    },
    {
      id: "electric-vehicle",
      title: "電動車替換",
      description: "將燃油車輛替換為電動車",
      category: "transport",
      impact: "高",
      difficulty: "中",
      cost: "$$",
      reduction: 2.8,
      timeframe: "即時",
      priority: "高",
    },
    {
      id: "insulation",
      title: "建築隔熱改善",
      description: "加強牆體和屋頂隔熱措施",
      category: "building",
      impact: "中",
      difficulty: "中",
      cost: "$$",
      reduction: 1.5,
      timeframe: "2-4週",
      priority: "中",
    },
    {
      id: "smart-thermostat",
      title: "智慧恆溫器",
      description: "安裝智慧溫控系統",
      category: "building",
      impact: "中",
      difficulty: "低",
      cost: "$",
      reduction: 0.8,
      timeframe: "1週",
      priority: "高",
    },
    {
      id: "efficient-equipment",
      title: "高效設備升級",
      description: "更換為節能認證設備",
      category: "industry",
      impact: "高",
      difficulty: "高",
      cost: "$$$",
      reduction: 4.1,
      timeframe: "6-12個月",
      priority: "中",
    },
    {
      id: "carpooling",
      title: "共乘計畫",
      description: "推行員工共乘減少通勤排放",
      category: "transport",
      impact: "低",
      difficulty: "低",
      cost: "$",
      reduction: 0.3,
      timeframe: "即時",
      priority: "低",
    },
    {
      id: "renewable-energy",
      title: "綠電採購",
      description: "採購再生能源電力",
      category: "energy",
      impact: "高",
      difficulty: "低",
      cost: "$$",
      reduction: 2.5,
      timeframe: "1個月",
      priority: "高",
    },
  ];

  const filteredActions = selectedCategory === "all" 
    ? actions 
    : actions.filter(action => action.category === selectedCategory);

  const toggleAction = (actionId: string) => {
    setCompletedActions(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  // 計算統計數據
  const totalActions = actions.length;
  const completedCount = completedActions.length;
  const completionRate = (completedCount / totalActions) * 100;
  const totalReduction = actions
    .filter(action => completedActions.includes(action.id))
    .reduce((sum, action) => sum + action.reduction, 0);

  // 圖表數據
  const categoryData = [
    { 
      name: "能源", 
      value: actions.filter(a => a.category === "energy").reduce((sum, a) => sum + a.reduction, 0),
      color: "#3B82F6"
    },
    { 
      name: "交通", 
      value: actions.filter(a => a.category === "transport").reduce((sum, a) => sum + a.reduction, 0),
      color: "#EF4444"
    },
    { 
      name: "建築", 
      value: actions.filter(a => a.category === "building").reduce((sum, a) => sum + a.reduction, 0),
      color: "#F59E0B"
    },
    { 
      name: "工業", 
      value: actions.filter(a => a.category === "industry").reduce((sum, a) => sum + a.reduction, 0),
      color: "#10B981"
    },
  ];

  const progressData = [
    { name: "已完成", value: completedCount },
    { name: "進行中", value: Math.ceil(totalActions * 0.2) },
    { name: "計劃中", value: totalActions - completedCount - Math.ceil(totalActions * 0.2) },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "高": return "bg-red-100 text-red-800";
      case "中": return "bg-yellow-100 text-yellow-800";
      case "低": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "高": return "bg-emerald-100 text-emerald-800";
      case "中": return "bg-blue-100 text-blue-800";
      case "低": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">減碳行動方案</h1>
          <p className="text-gray-600">追蹤和管理您的減碳行動，實現淨零目標</p>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="完成率"
            value={`${completionRate.toFixed(1)}%`}
            description={`${completedCount}/${totalActions} 項行動`}
            icon={Target}
            color="emerald"
          />
          <StatsCard
            title="已減碳排量"
            value={`${totalReduction.toFixed(1)} 公噸`}
            description="CO2 當量"
            icon={TrendingUp}
            color="green"
          />
          <StatsCard
            title="高優先級行動"
            value={actions.filter(a => a.priority === "高").length}
            description="需要優先執行"
            icon={Star}
            color="red"
          />
          <StatsCard
            title="預估年減量"
            value={`${(totalReduction * 12).toFixed(1)} 公噸`}
            description="基於當前進度"
            icon={Calendar}
            color="blue"
          />
        </div>

        {/* 進度概覽 */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <CarbonChart
            data={categoryData}
            title="各類別減碳潛力"
            description="不同行動類別的減碳貢獻"
            type="pie"
          />
          
          <CarbonChart
            data={progressData}
            title="行動執行進度"
            description="目前的行動執行狀況分布"
            type="bar"
          />
        </div>

        {/* 類別篩選 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {actionCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* 行動列表 */}
        <div className="grid gap-4 mb-8">
          {filteredActions.map((action) => {
            const isCompleted = completedActions.includes(action.id);
            return (
              <Card key={action.id} className={`transition-all duration-200 ${isCompleted ? 'bg-emerald-50 border-emerald-200' : 'hover:shadow-md'}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={isCompleted}
                      onCheckedChange={() => toggleAction(action.id)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className={`font-semibold ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {action.title}
                          </h3>
                          <p className={`text-sm ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                            {action.description}
                          </p>
                        </div>
                        {isCompleted && (
                          <CheckCircle className="w-6 h-6 text-emerald-500" />
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <Badge className={getPriorityColor(action.priority)}>
                          優先級: {action.priority}
                        </Badge>
                        <Badge className={getImpactColor(action.impact)}>
                          影響: {action.impact}
                        </Badge>
                        <Badge variant="outline">
                          難度: {action.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          成本: {action.cost}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-emerald-500" />
                          <span>減碳: {action.reduction} 公噸/月</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>時程: {action.timeframe}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-orange-500" />
                          <span>投資: {action.cost}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 總體進度 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              總體減碳進度
            </CardTitle>
            <CardDescription>
              追蹤您的減碳目標達成情況
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">行動完成度</span>
                <span className="text-sm text-gray-500">{completedCount}/{totalActions}</span>
              </div>
              <Progress value={completionRate} className="h-3" />
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <h4 className="font-medium text-emerald-800 mb-2">當月減碳量</h4>
                  <p className="text-2xl font-bold text-emerald-600">{totalReduction.toFixed(2)} 公噸</p>
                  <p className="text-sm text-emerald-700">CO2 當量</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">年度預估減量</h4>
                  <p className="text-2xl font-bold text-blue-600">{(totalReduction * 12).toFixed(2)} 公噸</p>
                  <p className="text-sm text-blue-700">基於目前進度</p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link to="/carbon-fee">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 mr-4">
                    查看碳費影響
                  </Button>
                </Link>
                <Link to="/reduction-path">
                  <Button variant="outline">
                    調整減碳路徑
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReductionActions;
