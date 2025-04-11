import React from 'react';

type BenchmarkChartProps = {
  industry: string;
  value: number;
  average: number;
  label: string;
  unit: string;
  higher_is_better: boolean;
};

/**
 * A horizontal bar chart for comparing a company's metrics to industry benchmarks
 */
const BenchmarkChart: React.FC<BenchmarkChartProps> = ({
  industry,
  value,
  average,
  label,
  unit,
  higher_is_better,
}) => {
  // Calculate the percentage for the value and average (cap at 100%)
  const maxValue = Math.max(value, average) * 1.2; // Give some headroom
  const valuePercentage = Math.min((value / maxValue) * 100, 100);
  const avgPercentage = Math.min((average / maxValue) * 100, 100);

  // Determine if the company is performing better/worse than benchmark
  const isPerformingBetter = higher_is_better ? value > average : value < average;

  // Format values based on unit
  const formatValue = (val: number) => {
    if (unit === '%') return `${val.toFixed(1)}%`;
    if (unit === 'x') return `${val.toFixed(2)}x`;
    if (unit === '€') return `€${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    return val.toString();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium text-gray-700">{label}</div>
        <div className="text-sm text-gray-500">{industry} average</div>
      </div>

      <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden mb-1">
        {/* Industry average marker */}
        <div
          className="absolute h-full w-0.5 bg-gray-500 z-10"
          style={{ left: `${avgPercentage}%` }}
        ></div>

        {/* Company value bar */}
        <div
          className={`h-full ${isPerformingBetter ? 'bg-green-500' : 'bg-amber-500'}`}
          style={{ width: `${valuePercentage}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <div className="font-semibold">{formatValue(value)}</div>
        <div className="text-gray-500">Avg: {formatValue(average)}</div>
      </div>

      <div className="mt-1 text-xs text-right">
        <span className={isPerformingBetter ? 'text-green-600' : 'text-amber-600'}>
          {isPerformingBetter ? 'Above' : 'Below'} industry average
        </span>
      </div>
    </div>
  );
};

export default BenchmarkChart;