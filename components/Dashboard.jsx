"use client";

import React, { useEffect, useState, useRef } from "react";

function Dashboard() {
  const statsData = [
    { label: "Total Staff", value: 156, change: "↑ 12%", color: "green" },
    { label: "Present", value: 142, change: "↑ 8%", color: "green"},
    { label: "On Leave", value: 8, change: "↓ 3%", color: "red"},
    { label: "Late", value: 6, change: "↓ 15%", color: "red"},
  ];

  const departmentsData = [
    { name: "Sales", percent: 92 },
    { name: "Marketing", percent: 78 },
    { name: "IT", percent: 85 },
  ];

  const weeklyData = [70, 90, 50, 100, 80]; // Attendance %

  const [stats, setStats] = useState(statsData.map((s) => ({ ...s, display: 0 })));
  const [departments, setDepartments] = useState(departmentsData.map((d) => ({ ...d, display: 0 })));
  const [weekly, setWeekly] = useState(weeklyData.map(() => 0));

  const dashboardRef = useRef(null);
  const [inView, setInView] = useState(false);

  // Observe dashboard section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (dashboardRef.current) observer.observe(dashboardRef.current);
    return () => observer.disconnect();
  }, []);

  // Animate numbers and bars
  useEffect(() => {
    if (!inView) return;

    const duration = 1500; // 1.5s
    let start = null;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const fraction = Math.min(progress / duration, 1);

      setStats(statsData.map((s) => ({ ...s, display: Math.floor(s.value * fraction) })));
      setDepartments(departmentsData.map((d) => ({ ...d, display: Math.floor(d.percent * fraction) })));
      setWeekly(weeklyData.map((val) => Math.floor(val * fraction)));

      if (fraction < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [inView]);

  return (
    <div ref={dashboardRef} className="flex w-full flex-col gap-6">
      {/* Outer Rounded Gray Background */}
      <div className="bg-gray-100 rounded-2xl p-6 shadow-xl">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl shadow flex flex-col gap-2 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
                <span>{stat.icon}</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{stat.display}</p>
              <p className={`text-sm mt-1 ${stat.color === "green" ? "text-green-500" : "text-red-500"}`}>
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {/* Weekly Attendance */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300">
            <h2 className="font-semibold text-blue-900 mb-4">Weekly Attendance</h2>
            <div className="flex justify-between items-end h-40 gap-2">
              {weekly.map((val, idx) => (
                <div
                  key={idx}
                  className="bg-blue-700 w-8 rounded-t-md"
                  style={{ height: `${val}%`, transition: "height 0.05s linear" }}
                ></div>
              ))}
            </div>
          </div>

          {/* Department Performance */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300">
            <h2 className="font-semibold text-blue-900 mb-4">Department Performance</h2>
            {departments.map((dept, idx) => (
              <div key={idx} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 font-semibold">{dept.name}</span>
                  <span className="text-gray-600 font-semibold">{dept.display}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-700 h-3 rounded-full"
                    style={{ width: `${dept.display}%`, transition: "width 0.05s linear" }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
