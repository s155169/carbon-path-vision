import { useState, useEffect } from 'react';

export interface ComparisonItem {
  content: string;
  description: string;
  pages: string;
}

export interface ComparisonRow {
  aspect: string;
  service: ComparisonItem;
  hospital: ComparisonItem;
  university: ComparisonItem;
  transport: ComparisonItem;
}

export interface ComparisonData {
  comparisonData: ComparisonRow[];
}

export function useComparison() {
  const [data, setData] = useState<ComparisonRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComparison = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await import('../data/comparison.json');
        const comparisonData = response.default as ComparisonData;
        
        setData(comparisonData.comparisonData);
      } catch (err) {
        setError('載入比較數據失敗');
        console.error('Error loading comparison data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadComparison();
  }, []);

  return { data, loading, error };
}