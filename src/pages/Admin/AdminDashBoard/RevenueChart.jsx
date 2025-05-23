import React from "react";
import "./RevenueChart.css";

function getYAxisTicks(maxRevenue) {
  // Làm tròn lên đến triệu gần nhất
  const roundedMax = Math.ceil(maxRevenue / 1_000_000) * 1_000_000 || 1_000_000;
  const ticks = [];
  for (let i = 0; i <= roundedMax; i += 1_000_000) {
    ticks.push(i);
  }
  // Đảm bảo có ít nhất 2 mốc (0 và max)
  if (ticks.length < 2) ticks.push(roundedMax);
  return ticks.reverse();
}

export default function RevenueChart({ totalRevenue = [] }) {
  // Lấy 6 ngày có doanh thu lớn nhất
  const top6 = [...(totalRevenue || [])]
    .filter((item) => item.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6)
    .sort((a, b) => {
      const dateA = new Date(a.year, a.month - 1, a.day);
      const dateB = new Date(b.year, b.month - 1, b.day);
      return dateA - dateB;
    })
    .map((item) => ({
      ...item,
      dateLabel: `${item.day}/${item.month}`,
    }));

  const maxRevenue = Math.max(...top6.map((item) => item.revenue)) || 1;
  const yAxisTicks = getYAxisTicks(maxRevenue);

  return (
    <div className="chart-card">
      <h2 className="chart-title">
        Biểu đồ doanh thu (những ngày có doanh thu lớn nhất)
      </h2>
      <div className="chart-container">
        <div className="chart-y-axis">
          {yAxisTicks.map((value, idx) => (
            <div key={idx} className="chart-y-label">
              {value === 0
                ? "0"
                : `${(value / 1_000_000).toLocaleString()} triệu`}
            </div>
          ))}
        </div>
        <div className="chart-bars">
          {top6.map((item, index) => {
            const heightPercent = (item.revenue / yAxisTicks[0]) * 100;
            return (
              <div key={index} className="chart-bar-container">
                <div className="chart-bar-wrapper">
                  {/* Số trên đầu cột */}
                  <div className="chart-bar-value">
                    {item.revenue > 0
                      ? item.revenue >= 1_000_000
                        ? `${(item.revenue / 1_000_000).toFixed(2)}tr`
                        : item.revenue.toLocaleString()
                      : ""}
                  </div>
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
        {top6.map((item, index) => (
          <div key={index} className="chart-x-label">
            {item.dateLabel}
          </div>
        ))}
      </div>
    </div>
  );
}
