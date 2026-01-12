"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";
import { CheckCircle } from "lucide-react";

const cardData = [
  {
    icon: "👥",
    title: "Easy Onboarding",
    description:
      "Get your team up and running in minutes with our intuitive setup process.",
    points: [
      "Quick company setup",
      "Bulk employee import",
      "Simple, no training needed",
    ],
  },
  {
    icon: "🕒",
    title: "Seamless Tracking",
    description:
      "Real-time attendance tracking with automated reports and insights.",
    points: [
      "Live attendance monitoring",
      "Automated time logs",
      "Customizable reports",
    ],
  },
  {
    icon: "💰",
    title: "Accurate Payroll",
    description:
      "Automated payroll processing with zero errors and full compliance.",
    points: [
      "Auto-calculated salaries",
      "Built-in tax & NSSF",
      "One-click approval",
    ],
  },
  {
    icon: "🤖",
    title: "Smart System",
    description: "Automation to optimize your workforce management.",
    points: [
      "Performance insights",
      "Automated reports",
      "Future AI automation",
    ],
  },
];

const Features = () => {
  const [accuracy, setAccuracy] = useState(0);
  const [setupTime, setSetupTime] = useState(0);
  const [timeSaved, setTimeSaved] = useState(0);
  const [supportFirst, setSupportFirst] = useState(0);
  const [supportSecond, setSupportSecond] = useState(0);
  const controls = useAnimation();
  const statsRef = useRef(null);
  const isInView = useInView(statsRef, { once: false, amount: 0.4 });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000; // 2 seconds for all counters
    const targetAccuracy = 99;
    const targetSetup = 5;
    const targetSaved = 50;
    const targetSupportFirst = 24;
    const targetSupportSecond = 7;

    let start = null;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const fraction = Math.min(progress / duration, 1);

      setAccuracy(Math.floor(fraction * targetAccuracy));
      setSetupTime(Math.floor(fraction * targetSetup));
      setTimeSaved(Math.floor(fraction * targetSaved));
      setSupportFirst(Math.floor(fraction * targetSupportFirst));
      setSupportSecond(Math.floor(fraction * targetSupportSecond));

      controls.start({
        y: [10, 0, -5, 0],
        opacity: [0, 1, 1, 1],
        transition: { duration: 0.25, ease: "easeOut" },
      });

      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, controls]);

  const statVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <section className="bg-white text-center py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-3">
          Features
        </h2>
        <p className="text-gray-700 mb-14">
          Everything you need to manage your workforce efficiently and
          effectively
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {cardData.map((card, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 text-left border hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg mb-4 text-2xl">
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{card.description}</p>
              <ul className="space-y-2">
                {card.points.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-gray-700 text-sm"
                  >
                    <CheckCircle className="text-blue-600 w-4 h-4 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <div
          ref={statsRef}
          className="bg-blue-800 text-white rounded-2xl py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 text-center items-center justify-center mb-20"
        >
          {[
            { value: `${accuracy}%`, label: "Accuracy Rate" },
            { value: `${setupTime}min`, label: "Minutes Setup" },
            { value: `${timeSaved}%`, label: "Time Saved" },
            {
              value: `${String(supportFirst).padStart(
                2,
                "0"
              )}/${supportSecond}`,
              label: "Support Available",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={statVariant}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="flex flex-col items-center justify-center"
            >
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <p className="text-sm opacity-80">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Our Customers */}
        {/* <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-3">
            Our Customers
          </h2>
          <p className="text-gray-700 mb-10">
            We have been working with some clients
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 opacity-80">
            {Array(5)
              .fill("/logos/client1.png")
              .map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt={`Client ${i + 1}`}
                  width={100}
                  height={50}
                  className="grayscale hover:grayscale-0 transition-all duration-300"
                />
              ))}
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Features;
