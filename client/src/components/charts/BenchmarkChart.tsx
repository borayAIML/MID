import { useEffect, useRef } from "react";

type BenchmarkChartProps = {
  value: number;
  average: number;
  maxValue: number;
  color: string;
};

export default function BenchmarkChart({ value, average, maxValue, color }: BenchmarkChartProps) {
  // Calculate percentages with safety limits
  const valuePercentage = Math.min((value / maxValue) * 100, 100);
  const averagePercentage = Math.min((average / maxValue) * 100, 100);
  
  // Determine background color based on the color prop
  let bgColorClass = 'bg-blue-500';
  if (color === 'green') bgColorClass = 'bg-green-500';
  if (color === 'red') bgColorClass = 'bg-red-500';
  if (color === 'purple') bgColorClass = 'bg-purple-500';
  if (color === 'amber') bgColorClass = 'bg-amber-500';
  if (color === 'pink') bgColorClass = 'bg-pink-500';
  if (color === 'indigo') bgColorClass = 'bg-indigo-500';
  if (color === 'emerald') bgColorClass = 'bg-emerald-500';
  if (color === 'cyan') bgColorClass = 'bg-cyan-500';
  if (color === 'orange') bgColorClass = 'bg-orange-500';

  return (
    <div className="relative h-4 mt-1">
      <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
        <div 
          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${bgColorClass}`}
          style={{ width: `${valuePercentage}%` }}
        ></div>
      </div>
      <div 
        className="absolute top-0 h-2 w-0.5 bg-gray-600"
        style={{ 
          left: `${averagePercentage}%`,
          transform: 'translateX(-50%)',
          marginTop: '0px'
        }}
      ></div>
    </div>
  );
}
