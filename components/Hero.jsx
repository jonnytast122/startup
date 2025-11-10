"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Dashboard from "./Dashboard"; // Import your Dashboard component

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const fadeInWithScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: "easeOut" },
  },
};

function Hero() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary-blue w-full flex flex-col gap-10 py-10 pb-20 lg:py-20 xl:flex-row">
        <motion.div
          className="relative flex flex-1 flex-col items-center text-center px-4 sm:px-6 md:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h1 className="font-vietname-bold text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white">
            Smart Attendance, Accurate <br />
            Payroll - Simplify Your Workforce
            <br />
            Management with ANAN
          </h1>
          <p className="mt-5 font-custom text-sm sm:text-md md:text-lg lg:text-2xl text-white max-w-4xl">
            ANAN simplifies workforce management by seamlessly integrating real-
            <br />
            time attendance tracking with automated payroll processing in one
            user-
            <br />
            friendly platform.
          </p>

          {/* Buttons Section */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <motion.a
              href="/signup"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 4px 12px rgba(255, 255, 255, 0.3)",
              }}
              className="bg-white text-purple font-custom text-sm sm:text-sm md:text-md lg:text-lg py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 lg:px-9 rounded-lg shadow-md hover:bg-[#e6e0ff] hover:text-[#5a3ec8] transition w-full sm:w-auto text-center"
            >
              Try for free
            </motion.a>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 4px 12px rgba(255, 255, 255, 0.3)",
              }}
              className="bg-transparent border border-white text-white font-custom text-sm sm:text-sm md:text-md lg:text-lg py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 lg:px-9 rounded-lg hover:bg-white hover:text-blue-600 transition w-full sm:w-auto"
            >
              Watch a demo
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Dashboard Section */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInWithScale}
          className="-mt-8 sm:-mt-12 md:-mt-16" // smaller negative margin for gentle overlap
        >
          <div className="bg-gray-100 rounded-2xl shadow-xl p-6 md:p-8">
            <Dashboard />
          </div>
        </motion.div>
      </section>

      {/* Image Section with Overlap */}
      <div className="relative w-full flex flex-col items-center">
        {/* Image Overlapping Blue and White */}
        <motion.div
          className="relative -mt-[10vh] sm:-mt-[8vh] md:-mt-[12vh] z-10 flex justify-center w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInWithScale}
        ></motion.div>
      </div>
    </>
  );
}

export default Hero;
