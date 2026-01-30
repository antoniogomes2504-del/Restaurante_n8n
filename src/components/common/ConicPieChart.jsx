import React from 'react';

const ConicPieChart = ({ data }) => {
  let gradientString = '';
  let currentPercent = 0;

  data.forEach((item, index) => {
    const start = currentPercent;
    const end = currentPercent + item.value;
    gradientString += `${item.color} ${start}% ${end}%, `;
    currentPercent = end;
  });

  gradientString = gradientString.slice(0, -2);

  return (
    <div className="flex items-center gap-6">
      <div
        className="w-32 h-32 rounded-full border-4 border-slate-700 shadow-xl"
        style={{ background: `conic-gradient(${gradientString})` }}
      ></div>
      <div className="flex flex-col gap-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
            <span className="text-sm text-slate-300">{item.label} ({item.value}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConicPieChart;
