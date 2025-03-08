"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
};

function Solution() {
  return (
    <section
      id="solution"
      className="bg-[#DAE7FF] w-full flex flex-col items-center px-6 sm:px-10 md:px-16 lg:px-20 py-10 md:py-16"
    >
      {/* Feature 1 */}
      <div className="w-full p-10 flex justify-center">
        <div className="max-container flex flex-col-reverse md:flex-row items-center">
          {/* Left: Text Content */}
          <motion.div
            className="flex-1 flex flex-col items-center md:items-start text-center md:text-left ml-6 md:ml-0 lg:ml-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInLeft}
          >
            <h2 className="font-custom font-semibold text-3xl sm:text-4xl md:text-5xl leading-tight text-dark-blue mr-10">
              Transform Your HR, No Matter Your Business Size or Industry
            </h2>
            <p className="mt-6 font-custom text-sm sm:text-md md:text-lg lg:text-xl text-gray-700 max-w-lg mr-10">
              Rest Easy Knowing Your Files Are Safe with Us – We're Your Trusted
              Storage Solution.
            </p>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            className="flex-1 flex justify-center mb-10 md:mb-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInRight}
          >
            <Image
              src="/images/solution.png"
              alt="Solution"
              width={400}
              height={300}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
            />
          </motion.div>
        </div>
      </div>

      {/* Feature 2 inside Feature 1 as a rectangle */}
      <motion.div
        className="w-full mx-auto max-x-7xl bg-[#003396] rounded-xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row items-center mt-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={scaleIn}
      >
        {/* Left: Image */}
        <motion.div
          className="flex-1 flex justify-center mb-6 md:mb-0 md:-mt-10 lg:-mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInLeft}
        >
          <Image
            src="/images/solution2.png"
            alt="Advanced Analytics"
            width={300}
            height={250}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md"
          />
        </motion.div>

        {/* Right: Text Content */}
        <motion.div
          className="flex-1 flex flex-col items-center md:items-start text-center md:text-left ml-4 md:ml-230"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInRight}
        >
          <h3 className="font-custom font-semibold text-white text-3xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
            FREE for Small Business
          </h3>
          <p className="mt-0 sm:mt-0 md:mt-12 font-custom text-xl text-white sm:text-lg md:text-4xl max-w-xl">
            Up to 13 Users
          </p>

          {/* Button with Hover Effect */}
          <Button className="mt-6 font-custom text-lg px-6 py-3 rounded-lg shadow-md bg-white text-blue-700 transition-all duration-300 ease-in-out transform hover:bg-gray-200 hover:scale-105">
            Create Account Now
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Solution;
