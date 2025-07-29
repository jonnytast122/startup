"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Jenny Wilson",
    role: "Product Manager",
    image: "/avatars/jenny.png",
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
    featured: true,
  },
  {
    name: "Ralph Edwards",
    role: "Game Developer",
    image: "/avatars/ralph.png",
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
  },
  {
    name: "Cameron Williamson",
    role: "Growth Hacker",
    image: "/avatars/cameron.png",
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
  },
  {
    name: "Theresa Webb",
    role: "Full-Stack Developer",
    image: "/avatars/theresa.png",
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
  },
];

const CustomerFeedback = () => {
  return (
    <section id="customer" className="max-container py-16 px-16 md:px-28">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Section */}
        <div>
          <h2 className="font-custom text-2xl md:text-2xl lg:text-4xl font-bold text-gray-900">
            Feedback from our customers
          </h2>
          <p className="mt-4 font-custom text-sm sm:text-sm md:text-md lg:text-lg text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            varius enim in eros elementum tristique. Duis cursus, mi quis
            viverra ornare, eros dolor interdum nulla, ut commodo diam libero
            vitae erat.
          </p>
          <div className="mt-6 flex items-center gap-6">
            <Button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
              Contact Us
            </Button>
            <a href="#" className="text-blue-600 font-medium">See All &gt;</a>
          </div>
        </div>

        {/* Right Section - Testimonials with Hover Effect */}
        <div className="space-y-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
              className={`p-6 border rounded-lg transition-all duration-300 ${
                testimonial.featured
                  ? "bg-white border-gray-300"
                  : "bg-white border-gray-200"
              } hover:border-orange-500 hover:bg-orange-100`}
            >
              {/* Stars */}
              <div className="flex mb-3">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i} className="text-orange-400 text-xl">★</span>
                ))}
              </div>

              {/* Review Text with Hover Pop-Up */}
              <motion.div className="relative group">
                <p className="text-gray-700 font-custom text-sm sm:text-md md:text-lg lg:text-xl cursor-pointer">
                  "{testimonial.review}"
                </p>
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  whileHover={{ opacity: 1, y: -5, scale: 1 }}
                  transition={{ duration: 0, ease: "easeOut" }}
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white text-gray-800 shadow-lg rounded-lg p-3 text-sm font-medium w-72 hidden group-hover:block"
                >
                  {testimonial.review}
                </motion.div>
              </motion.div>

              {/* User Info */}
              <div className="flex items-center mt-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="ml-3">
                  <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                  <p className="text-xs sm:text-xs md:text-xs lg:text-xs text-gray-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerFeedback;
