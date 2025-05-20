import React from "react";
import "./RevenueChart.css";

export default function RevenueChart() {
  const data = [
    { month: "Thg 1", revenue: 4000 },
    { month: "Thg 2", revenue: 3000 },
    { month: "Thg 3", revenue: 2000 },
    { month: "Thg 4", revenue: 2800 },
    { month: "Thg 5", revenue: 1800 },
    { month: "Thg 6", revenue: 2400 },
    { month: "Thg 7", revenue: 3500 },
  ];

  const maxRevenue = Math.max(...data.map((item) => item.revenue)) || 1;

  return (
    <div className="chart-card">
      <h2 className="chart-title">Biểu đồ doanh thu (6 tháng gần nhất)</h2>
      <div className="chart-container">
        <div className="chart-y-axis">
          {[4000, 3000, 2000, 1000, 0].map((value) => (
            <div key={value} className="chart-y-label">
              {value}
            </div>
          ))}
        </div>
        <div className="chart-bars">
          {data.map((item, index) => {
            const heightPercent = (item.revenue / maxRevenue) * 100;
            return (
              <div key={index} className="chart-bar-container">
                <div className="chart-bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{ height: `${heightPercent}%` }}
                  ></div>
                  <span className="chart-tooltip">
                    {item.revenue.toLocaleString()}₫
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="chart-x-axis">
        {data.map((item, index) => (
          <div key={index} className="chart-x-label">
            {item.month}
          </div>
        ))}
      </div>
    </div>
  );
}
