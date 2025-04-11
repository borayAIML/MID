import React from 'react';

type RiskScoreChartProps = {
  score: number;
};

/**
 * A circular gauge chart for displaying risk score
 */
const RiskScoreChart: React.FC<RiskScoreChartProps> = ({ score }) => {
  // Calculate color based on score
  const getColor = () => {
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-red-500';
  };

  // Calculate stroke-dasharray and stroke-dashoffset for SVG circle
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className={getColor()}
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${getColor()}`}>{score}</span>
        </div>
      </div>
      
      <div className="mt-2 text-center">
        <div className={`font-semibold ${getColor()}`}>
          {score >= 70 ? 'Low Risk' : score >= 40 ? 'Moderate Risk' : 'High Risk'}
        </div>
      </div>
    </div>
  );
};

export default RiskScoreChart;