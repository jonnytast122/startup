"use client";
import React from "react";
import { Cover } from "@/components/ui/cover";
import { FlipWords } from "@/components/ui/flip-words";
import SignupForBeta from "@/components/ui/SignupForBeta";
import { ComingSoonTimeline } from "@/components/ComingSoonTimeline";
import ComingSoonTeam from "@/components/ComingSoonTeam";
import ComingSoonComment from "@/components/ComingSoonComment";
import ComingSoonFooter from "@/components/ComingSoonFooter";
const ComingSoon = () => {
  const words = [
    "Stay tuned",
    "Stay connected",
    "Stay together",
    "Stay forever",
  ];

  return (
    <div className="font-Tw_Cen_Mt z-40 ">
      <div className="isolate px-6 lg:px-8 py-16 z-30 bg-grey/10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] flex flex-col justify-center items-center h-1/2 lg:h-screen md:h-screen bg-fixed rounded-b-full">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 z-20 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-aero to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        <div className="mx-auto max-w-2xl pt-32 animate-fade-up animate-once ">
          <div className="text-center">
            <h1 className="text-6xl md:text-6xl lg:text-8xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-30 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
              <Cover>Coming Soon!</Cover>
            </h1>
            <p className="mt-6 text-lg md:text-xl lg:text-2xl text-gray-900 leading-6 md:leading-8 lg:leading-8 ">
              " A tech startup focused on innovation, driven by a passionate
              team committed to creating impactful solutions in the{" "}
              <span className="text-blue-400">technology space.</span> "
            </p>
            <SignupForBeta />
          </div>
        </div>
      </div>

      <section className="bg-gray-900 h-96">
        <div className="flex flex-col items-center justify-center py-16 h-full bg-white/10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]">
          <h1 className="text-lg md:text-xl lg:text-4xl text-white max-w-3xl text-center">
            We are working hard to bring you something amazing.
            <FlipWords words={words} className="text-blue-400" /> <br />
          </h1>
        </div>
      </section>

      <section className="mt-10">
        <ComingSoonTimeline />
      </section>

      <section className="mt-10">
        <ComingSoonTeam />
      </section>

      <section>
        <ComingSoonComment />
      </section>

      <section>
        <ComingSoonFooter />
      </section>
    </div>
  );
};

export default ComingSoon;
