import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ArrowLeft, Info, ExternalLink } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useComparison, ComparisonItem } from '@/features/guidelines/hooks/useComparison';

const GuidelinesComparison = () => {
  const { data, loading, error } = useComparison();
  const [selectedCell, setSelectedCell] = useState<{
    aspect: string;
    industry: string;
    data: ComparisonItem;
  } | null>(null);

  const industryLabels = {
    service: '服務業',
    hospital: '醫院',
    university: '大專校院',
    transport: '運輸業'
  };

  const getVariantByContent = (content: string) => {
    if (content.includes('詳細') || content.includes('多種') || content.includes('五大類')) {
      return 'default';
    }
    if (content.includes('簡要') || content.includes('無')) {
      return 'secondary';
    }
    return 'outline';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">載入比較數據中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>重新載入</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/guidelines">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回指引
              </Button>
            </Link>
          </div>
          
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">四大行業盤查指引差異比對</h1>
            <p className="text-gray-600">比較服務業、醫院、大專校院、運輸業在盤查流程上的關鍵差異</p>
          </div>
        </div>

        {/* Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              差異比對表
            </CardTitle>
            <p className="text-sm text-gray-600">
              點擊表格內容可查看詳細說明和頁碼參考
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32 font-semibold">比較項目</TableHead>
                    <TableHead className="text-center font-semibold">服務業</TableHead>
                    <TableHead className="text-center font-semibold">醫院</TableHead>
                    <TableHead className="text-center font-semibold">大專校院</TableHead>
                    <TableHead className="text-center font-semibold">運輸業</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.aspect} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">
                        {row.aspect}
                      </TableCell>
                      {(['service', 'hospital', 'university', 'transport'] as const).map((industry) => (
                        <TableCell key={industry} className="text-center">
                          <Drawer>
                            <DrawerTrigger asChild>
                              <button
                                className="w-full p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                onClick={() => setSelectedCell({
                                  aspect: row.aspect,
                                  industry: industryLabels[industry],
                                  data: row[industry]
                                })}
                              >
                                <Badge 
                                  variant={getVariantByContent(row[industry].content)}
                                  className="w-full justify-center"
                                >
                                  {row[industry].content}
                                </Badge>
                              </button>
                            </DrawerTrigger>
                            <DrawerContent>
                              <DrawerHeader>
                                <DrawerTitle className="flex items-center gap-2">
                                  <ExternalLink className="w-5 h-5" />
                                  {row.aspect} - {industryLabels[industry]}
                                </DrawerTitle>
                                <DrawerDescription>
                                  詳細說明與參考頁碼
                                </DrawerDescription>
                              </DrawerHeader>
                              <div className="px-4 pb-6">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium text-gray-900 mb-2">內容摘要</h4>
                                    <Badge variant={getVariantByContent(row[industry].content)}>
                                      {row[industry].content}
                                    </Badge>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium text-gray-900 mb-2">詳細說明</h4>
                                    <p className="text-gray-700">{row[industry].description}</p>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium text-gray-900 mb-2">參考頁碼</h4>
                                    <Badge variant="outline">
                                      第 {row[industry].pages} 頁
                                    </Badge>
                                  </div>
                                  
                                  <div className="pt-4">
                                    <Button
                                      variant="outline"
                                      className="w-full"
                                      onClick={() => {
                                        // In a real implementation, this would open the specific PDF page
                                        console.log(`Opening ${industry} PDF at pages ${row[industry].pages}`);
                                      }}
                                    >
                                      前往 PDF 查看原文
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </DrawerContent>
                          </Drawer>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">圖例說明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="default">詳細/多樣</Badge>
                <span className="text-sm text-gray-600">該行業在此方面有詳細規範或多種方法</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">標準</Badge>
                <span className="text-sm text-gray-600">標準規範，與其他行業類似</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">簡要/無</Badge>
                <span className="text-sm text-gray-600">簡要說明或無特殊規範</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuidelinesComparison;