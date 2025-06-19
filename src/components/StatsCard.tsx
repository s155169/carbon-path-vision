
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

const StatsCard = ({ title, value, description, icon: Icon, trend, color = "emerald" }: StatsCardProps) => {
  const colorClasses = {
    emerald: "bg-emerald-500 text-emerald-500",
    blue: "bg-blue-500 text-blue-500", 
    green: "bg-green-500 text-green-500",
    orange: "bg-orange-500 text-orange-500",
    red: "bg-red-500 text-red-500",
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]?.replace('text-', 'bg-')} bg-opacity-10`}>
          <Icon className={`w-4 h-4 ${colorClasses[color as keyof typeof colorClasses]?.split(' ')[1]}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {description && (
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        )}
        {trend && (
          <div className={`flex items-center mt-2 text-xs ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <span>{trend.isPositive ? '↗' : '↘'}</span>
            <span className="ml-1">{Math.abs(trend.value)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
