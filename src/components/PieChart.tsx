"use client";

import React from "react";

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = 0;

  const calculateAngle = (value: number) => (value / totalValue) * 360;

  return (
    <div className="flex items-center text-[12px] md:text-[14px]"> 
      <svg width="200" height="200" viewBox="0 0 200 200">
        {data.map((item, index) => {
          const angle = calculateAngle(item.value);
          const endAngle = startAngle + angle;
          const largeArcFlag = angle > 180 ? 1 : 0;

          const x1 = 100 + 90 * Math.cos(degToRad(startAngle));
          const y1 = 100 + 90 * Math.sin(degToRad(startAngle));
          const x2 = 100 + 90 * Math.cos(degToRad(endAngle));
          const y2 = 100 + 90 * Math.sin(degToRad(endAngle));

          const pathData = `M100,100 L${x1},${y1} A90,90 0 ${largeArcFlag},1 ${x2},${y2} Z`;

          startAngle = endAngle;

          return (
            <g key={index}>
              <path d={pathData} fill={item.color} />
            </g>
          );
        })}

         <circle cx="100" cy="100" r="60" fill="black" />

         <text
          x="50%" 
          y="50%" 
          dominantBaseline="middle" 
          textAnchor="middle" 
          className="text-gray-300 text-sm font-bold fill-gray-300"
        >
          Total: {totalValue} 
        </text>
      </svg>

      <div className="ml-2 md:ml-4">
        {data.map((item) => (
          <div key={item.label} className="flex items-center mb-2">
            <span
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="text-gray-400 text-sm">
              {item.label}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

function degToRad(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export default PieChart;