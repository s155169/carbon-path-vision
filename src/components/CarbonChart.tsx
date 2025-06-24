
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";

interface CarbonData {
  name: string;
  value?: number;
  [key: string]: any;
}

interface CarbonChartProps {
  data: CarbonData[];
  title: string;
  description: string;
  type?: "bar" | "pie" | "line" | "area";
  dataKeys?: string[];
}

const CarbonChart = ({ data, title, description, type = "bar", dataKeys }: CarbonChartProps) => {
  // Determine which keys to use for the chart
  const getDataKeys = () => {
    if (dataKeys) return dataKeys;
    if (data.length === 0) return [];
    
    const firstItem = data[0];
    return Object.keys(firstItem).filter(key => 
      key !== 'name' && typeof firstItem[key] === 'number'
    );
  };

  const keys = getDataKeys();
  const primaryKey = keys[0] || 'value';

  const chartConfig = {
    [primaryKey]: {
      label: primaryKey,
      color: "#059669",
    },
  };

  const renderChart = () => {
    switch (type) {
      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey={primaryKey}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || `hsl(${160 + index * 30}, 70%, 50%)`} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        );
      
      case "line":
        return (
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            {keys.map((key, index) => (
              <Line 
                key={key}
                type="monotone" 
                dataKey={key} 
                stroke={`hsl(${160 + index * 60}, 70%, 50%)`} 
                strokeWidth={2} 
              />
            ))}
          </LineChart>
        );
      
      case "area":
        return (
          <AreaChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area type="monotone" dataKey={primaryKey} stroke="#059669" fill="#059669" fillOpacity={0.6} />
          </AreaChart>
        );
      
      default:
        return (
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            {keys.map((key, index) => (
              <Bar 
                key={key}
                dataKey={key} 
                fill={`hsl(${160 + index * 60}, 70%, 50%)`} 
                radius={[4, 4, 0, 0]} 
              />
            ))}
          </BarChart>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CarbonChart;
