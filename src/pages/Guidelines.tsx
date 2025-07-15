import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  GitCompare, 
  ArrowLeft,
  ChevronRight,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import PdfViewer from '@/components/PdfViewer';
import { useGuideline, Industry } from '@/features/guidelines/hooks/useGuideline';

const Guidelines = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry>('service');
  const [currentPdfPage, setCurrentPdfPage] = useState(1);
  
  const { data, loading, error, updateStepProgress, progress } = useGuideline(selectedIndustry);

  const industryOptions = [
    { value: 'service', label: '服務業' },
    { value: 'hospital', label: '醫院' },
    { value: 'university', label: '大專校院' },
    { value: 'transport', label: '運輸業' }
  ];

  const handleStepToggle = (stepId: string, completed: boolean) => {
    updateStepProgress(stepId, completed);
  };

  const jumpToPdfPage = (page: number) => {
    setCurrentPdfPage(page);
    // In a real implementation, this would control the PDF viewer
    console.log(`Jumping to PDF page: ${page}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">載入指引數據中...</p>
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
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首頁
              </Button>
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">盤查指引</span>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">盤查指引</h1>
              <p className="text-gray-600">選擇您的行業，獲得專業的溫室氣體盤查指導</p>
            </div>
            
            <div className="flex gap-3">
              <Select value={selectedIndustry} onValueChange={(value: Industry) => setSelectedIndustry(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {industryOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Link to="/guidelines/compare">
                <Button variant="outline" className="flex items-center gap-2">
                  <GitCompare className="w-4 h-4" />
                  差異比對
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Process Checklist */}
            <div className="lg:col-span-1">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    盤查流程
                  </CardTitle>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>完成進度</span>
                      <span>{progress.completed}/{progress.total}</span>
                    </div>
                    <Progress value={progress.percentage} className="h-2" />
                    <div className="text-right">
                      <Badge variant={progress.percentage === 100 ? "default" : "secondary"}>
                        {progress.percentage}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.steps.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Checkbox
                        checked={step.completed}
                        onCheckedChange={(checked) => handleStepToggle(step.id, !!checked)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-emerald-600">
                            {index + 1}.
                          </span>
                          <h4 className={`text-sm font-medium ${step.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {step.title}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{step.description}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => jumpToPdfPage(step.pdfPage)}
                          className="text-xs h-6 px-2 text-emerald-600 hover:text-emerald-700"
                        >
                          前往 PDF 第{step.pdfPage}頁
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - PDF Viewer */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    {data.name}盤查指引文件
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    點擊左側步驟可快速跳轉到對應頁面
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  <PdfViewer
                    industry={data.industry}
                    currentPage={currentPdfPage}
                    onPageChange={setCurrentPdfPage}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guidelines;