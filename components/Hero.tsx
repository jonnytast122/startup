import React from "react";

function Hero() {
  return (
    <section className="bg-primary-blue w-full flex flex-col gap-10 py-10 pb-32 lg:py-20 xl:flex-row">
      <div className="relative flex flex-1 flex-col items-center text-center">
        <h1 className="font-vietname-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
          Smart Attendance, Accurate <br />
          Payroll - Simplify Your Workforce
          <br />
          Management with ANAN
        </h1>
        <p className="mt-8 font-custom text-xs sm:text-sm md:text-md lg:text-xl text-white max-w-2xl">
          ANAN simplifies workforce management by seamlessly integrating real-
          <br />
          time attendance tracking with automated payroll processing in one
          user-
          <br />
          friendly platform.
        </p>
      </div>
    </section>
  );
}

export default Hero;
