import { useState, useEffect } from 'react';

export type Industry = 'service' | 'hospital' | 'university' | 'transport';

export interface Step {
  id: string;
  title: string;
  description: string;
  pdfPage: number;
  completed: boolean;
}

export interface Template {
  id: string;
  name: string;
  docxUrl: string;
  markdownUrl: string;
}

export interface GuidelineData {
  industry: Industry;
  name: string;
  steps: Step[];
  templates: Template[];
}

export function useGuideline(industry: Industry) {
  const [data, setData] = useState<GuidelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGuideline = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await import(`../data/${industry}.json`);
        const guidelineData = response.default as GuidelineData;
        
        // Load progress from localStorage
        const progressKey = `guideline-progress-${industry}`;
        const savedProgress = localStorage.getItem(progressKey);
        
        if (savedProgress) {
          const progress = JSON.parse(savedProgress);
          guidelineData.steps = guidelineData.steps.map(step => ({
            ...step,
            completed: progress[step.id] || false
          }));
        }
        
        setData(guidelineData);
      } catch (err) {
        setError('載入指引數據失敗');
        console.error('Error loading guideline:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGuideline();
  }, [industry]);

  const updateStepProgress = (stepId: string, completed: boolean) => {
    if (!data) return;

    const updatedSteps = data.steps.map(step =>
      step.id === stepId ? { ...step, completed } : step
    );

    setData({ ...data, steps: updatedSteps });

    // Save progress to localStorage
    const progressKey = `guideline-progress-${industry}`;
    const progress = updatedSteps.reduce((acc, step) => {
      acc[step.id] = step.completed;
      return acc;
    }, {} as Record<string, boolean>);
    
    localStorage.setItem(progressKey, JSON.stringify(progress));
  };

  const getProgress = () => {
    if (!data) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = data.steps.filter(step => step.completed).length;
    const total = data.steps.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  return {
    data,
    loading,
    error,
    updateStepProgress,
    progress: getProgress()
  };
}