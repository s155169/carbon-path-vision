import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Eye, 
  GitCompare, 
  ArrowLeft,
  ChevronRight,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import Navigation from '@/components/Navigation';
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

            {/* Middle Column - Templates */}
            <div className="lg:col-span-1">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    報告書範本
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    選擇適合的子行業範本下載或預覽
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.templates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-medium text-gray-900 mb-3">{template.name}</h4>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 text-xs"
                          onClick={() => window.open(template.docxUrl, '_blank')}
                        >
                          <Download className="w-3 h-3" />
                          下載 DOCX
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2 text-xs"
                          onClick={() => window.open(template.markdownUrl, '_blank')}
                        >
                          <Eye className="w-3 h-3" />
                          預覽 Markdown
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - PDF Viewer */}
            <div className="lg:col-span-1">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    PDF 指引文件
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    當前頁面：第 {currentPdfPage} 頁
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="font-medium mb-2">{data.name}盤查指引</p>
                      <p className="text-sm mb-4">PDF 檢視器將在此顯示</p>
                      <p className="text-xs">
                        檔案路徑: /assets/guidelines/{data.industry}.pdf
                      </p>
                      <div className="mt-4 flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPdfPage(Math.max(1, currentPdfPage - 1))}
                          disabled={currentPdfPage <= 1}
                        >
                          上一頁
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPdfPage(currentPdfPage + 1)}
                        >
                          下一頁
                        </Button>
                      </div>
                    </div>
                  </div>
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