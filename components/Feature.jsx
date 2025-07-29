"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

function Feature() {
  return (
    <section className="w-full">
      {/* First Feature (Image on Right, Text on Left) */}
      <div className="bg-primary-blue w-full px-10 sm:px-10 md:px-16 lg:px-32 py-10 md:py-12">
        <div className="max-container mx-auto flex flex-col-reverse md:flex-row items-center">
          {/* Text Section */}
          <motion.div
            className="flex-1 text-white flex flex-col items-center md:items-start ml-6 md:ml-12 lg:ml-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInLeft}
          >
            <h2 className="font-custom font-semibold text-3xl sm:text-4xl md:text-5xl leading-tight text-center md:text-left">
              We Optimize Attendance, Payroll, and Insights All in One Platform
            </h2>
            <p className="font-custom mt-6 text-sm sm:text-md md:text-lg lg:text-xl text-center md:text-left">
              We make it easy for users to use our platform, that's why we provide
              this benefit.
            </p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="flex-1 flex justify-center mb-10 md:mb-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInRight}
          >
            <Image
              src="/images/feature.png"
              alt="Productivity Boost"
              width={500}
              height={300}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
            />
          </motion.div>
        </div>
      </div>

      {/* Second Feature (Image on Left, Text on Right) */}
      <div className="max-container mx-auto w-full flex flex-col md:flex-row items-center px-6 sm:px-10 md:px-16 lg:px-20 py-10 md:py-12">
        {/* Image Section */}
        <motion.div
          className="flex-1 flex justify-center mb-10 md:mb-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInLeft}
        >
          <Image
            src="/images/feature2.png"
            alt="Enhanced Efficiency"
            width={500}
            height={300}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
          />
        </motion.div>

        {/* Text Section */}
        <motion.div
          className="flex-1 text-black flex flex-col items-center md:items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInRight}
        >
          <h2 className="font-custom font-semibold text-3xl sm:text-4xl md:text-5xl leading-tight text-center md:text-left">
            Effortless Attendance Management
          </h2>
          <p className="font-custom mt-6 text-sm sm:text-md md:text-lg lg:text-xl text-center md:text-left">
            Instantly track employee attendance with live updates and secure
            data storage.
          </p>
        </motion.div>
      </div>

      {/* Third Feature (Image on Right, Text on Left) */}
      <div className="max-container mx-auto w-full flex flex-col-reverse md:flex-row items-center px-6 sm:px-10 md:px-16 lg:px-20 py-10 md:py-12">
        {/* Text Section */}
        <motion.div
          className="flex-1 text-black flex flex-col items-center md:items-start md:ml-10 lg:ml-40"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInLeft}
        >
          <h2 className="font-custom font-semibold text-3xl sm:text-4xl md:text-5xl leading-tight text-center md:text-left">
            Automated Payroll Processing
          </h2>
          <p className="font-custom mt-6 text-sm sm:text-md md:text-lg lg:text-xl text-center md:text-left">
            Effortlessly manage payroll with accurate, automated calculations
            based on real-time data.
          </p>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="flex-1 flex justify-center mb-10 md:mb-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInRight}
        >
          <Image
            src="/images/feature3.png"
            alt="Smart Insights"
            width={300}
            height={180}
            className="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px]"
          />
        </motion.div>
      </div>

      {/* Fourth Feature (Image on Left, Text on Right) */}
      <div className="max-container mx-auto w-full flex flex-col md:flex-row items-center px-6 sm:px-10 md:px-16 lg:px-20 py-10 md:py-12">
        {/* Image Section */}
        <motion.div
          className="flex-1 flex justify-center mb-10 md:mb-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInLeft}
        >
          <Image
            src="/images/feature4.png"
            alt="Seamless Integration"
            width={300}
            height={180}
            className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-[280px] lg:max-w-[350px]"
          />
        </motion.div>

        {/* Text Section */}
        <motion.div
          className="flex-1 text-black flex flex-col items-center md:items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInRight}
        >
          <h2 className="font-custom font-semibold text-3xl sm:text-4xl md:text-5xl leading-tight text-center md:text-left">
            User-Friendly Dashboard
          </h2>
          <p className="font-custom mt-6 text-sm sm:text-md md:text-lg lg:text-xl text-center md:text-left">
            Navigate easily with a clean, intuitive interface designed for both
            administrators and employees.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default Feature;