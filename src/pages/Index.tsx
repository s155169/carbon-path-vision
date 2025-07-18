import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingDown, Target, Leaf, ArrowRight, BarChart3, Globe, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import StatsCard from "@/components/StatsCard";
import CarbonChart from "@/components/CarbonChart";
import Chatbot from "@/components/Chatbot";

const Index = () => {
  const features = [
    {
      id: "carbon-fee",
      title: "碳費模擬",
      description: "計算您的碳排放費用，了解碳費對您的影響",
      icon: Calculator,
      color: "bg-emerald-500",
      link: "/carbon-fee"
    },
    {
      id: "reduction-path",
      title: "減碳路徑",
      description: "探索不同的減碳策略和實施路線圖",
      icon: TrendingDown,
      color: "bg-blue-500",
      link: "/reduction-path"
    },
    {
      id: "reduction-actions",
      title: "減碳行動",
      description: "發現實用的減碳行動方案與追蹤工具",
      icon: Target,
      color: "bg-green-500",
      link: "/reduction-actions"
    }
  ];

  // 示例數據
  const emissionData = [
    { name: "電力", value: 2.5 },
    { name: "汽油", value: 1.8 },
    { name: "天然氣", value: 0.7 },
    { name: "其他", value: 0.4 },
  ];

  const monthlyTrend = [
    { name: "1月", value: 3.2 },
    { name: "2月", value: 2.8 },
    { name: "3月", value: 3.5 },
    { name: "4月", value: 2.9 },
    { name: "5月", value: 2.6 },
    { name: "6月", value: 2.4 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-90"></div>
        <div className="relative px-6 py-20 mx-auto max-w-7xl">
          <div className="text-center text-white">
            <div className="flex justify-center mb-6">
              <Leaf className="w-16 h-16 text-emerald-200" />
            </div>
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">
              碳管理智慧平台
            </h1>
            <p className="text-xl mb-8 text-emerald-100 max-w-2xl mx-auto animate-fade-in">
              透過科學化的碳費模擬、系統性的減碳路徑規劃，以及實用的減碳行動方案，
              幫助您實現淨零碳排目標
            </p>
            <Link to="/carbon-fee">
              <Button 
                size="lg" 
                className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
              >
                開始模擬碳費
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-12 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatsCard
            title="全球平均碳排放"
            value="4.8 公噸"
            description="每人每年 CO2 當量"
            icon={Globe}
            color="blue"
          />
          <StatsCard
            title="台灣碳費預計"
            value="$300"
            description="每公噸 CO2 (2024)"
            icon={BarChart3}
            trend={{ value: 12, isPositive: true }}
            color="emerald"
          />
          <StatsCard
            title="使用者"
            value="1,234+"
            description="正在追蹤碳足跡"
            icon={Users}
            trend={{ value: 8, isPositive: true }}
            color="green"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <CarbonChart
            data={emissionData}
            title="碳排放來源分析"
            description="不同能源類型的碳排放比例"
            type="pie"
          />
          <CarbonChart
            data={monthlyTrend}
            title="月度碳排放趨勢"
            description="過去6個月的碳排放變化"
            type="area"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-16 mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            三大核心功能
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            從測算到規劃，從策略到行動，全方位支持您的減碳之旅
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={feature.id} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link to={feature.link}>
                    <Button 
                      className="w-full group-hover:bg-emerald-600 transition-colors duration-300"
                      variant="outline"
                    >
                      立即使用
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Leaf className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">碳管理智慧平台</h3>
            <p className="text-gray-400 mb-4">共創永續未來，從現在開始</p>
            <div className="text-sm text-gray-500">
              © 2024 碳管理智慧平台. 版權所有.
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Index;
