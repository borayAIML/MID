import { useEffect, useState } from "react";

type RiskScoreChartProps = {
  score: number;
};

export default function RiskScoreChart({ score }: RiskScoreChartProps) {
  const [color, setColor] = useState("yellow");
  
  useEffect(() => {
    if (score > 70) {
      setColor("green");
    } else if (score > 40) {
      setColor("yellow");
    } else {
      setColor("red");
    }
  }, [score]);

  return (
    <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-${color}-100 border-4 border-${color}-400`}>
      <span className={`text-xl font-bold text-${color}-600`}>{score}</span>
    </div>
  );
}
