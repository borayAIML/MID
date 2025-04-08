import { useEffect, useRef } from "react";

type ValuationChartProps = {
  min: number;
  median: number;
  max: number;
};

export default function ValuationChart({ min, median, max }: ValuationChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    const total = max - min;
    const medianPosition = ((median - min) / total) * 100;
    
    const progressBar = chartRef.current.querySelector('.progress-bar') as HTMLDivElement;
    if (progressBar) {
      progressBar.style.width = `${medianPosition}%`;
    }
  }, [min, median, max]);

  return (
    <div className="mt-2" ref={chartRef}>
      <div className="w-full bg-blue-200 rounded-full h-2.5 mt-2">
        <div className="bg-blue-600 h-2.5 rounded-full progress-bar"></div>
      </div>
      <div className="flex justify-between text-xs text-blue-800 mt-1">
        <span>Min</span>
        <span>Median</span>
        <span>Max</span>
      </div>
    </div>
  );
}
