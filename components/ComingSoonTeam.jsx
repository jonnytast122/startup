"use client";

import React, { useState } from "react";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
const word = [
  {
    text: "Meet",
  },
  {
    text: "Team.",
    className: "text-blue-500 dark:text-blue-500",
  },
];

const people = [
  // Your list of people...
  {
    name: "Mr. Bon Chandaravon",
    role: "Founder / Business Advisor",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/anan-image.appspot.com/o/avatar%2FIMG_3467.JPG?alt=media&token=717e8bcc-b8fc-48f6-b49c-9c7ac1aca60b",
  },
  {
    name: "Ms. Hay Lyna",
    role: "Co-Founder / Data Analytics",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/anan-image.appspot.com/o/avatar%2FIMG_3387.JPG?alt=media&token=0fb62074-f0c9-4d01-95ea-36ada6865c53",
  },
  {
    name: "Mr. Veiy Sokheng",
    role: "Co-Founder / IT Lead",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/anan-image.appspot.com/o/avatar%2FIMG_3385.JPG?alt=media&token=dafca77a-51ce-48f2-a8e1-60bd0fa11da0",
  },
  {
    name: "Ms. Sareth Pechmoleka",
    role: "Administration",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/anan-image.appspot.com/o/avatar%2FIMG_3395.JPG?alt=media&token=80be6ce2-cf32-4888-bd5a-148dee0d0aef",
  },
  // More people...
];

const Skeleton = () => {
  return (
    <div className="flex flex-col items-center animate-pulse">
      <div className="h-64 w-64 rounded-lg bg-gray-300 m-2"></div>
      <div className="h-6 w-40 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 w-32 bg-gray-300 rounded"></div>
    </div>
  );
};

const PersonCard = ({ person }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className=" flex flex-col items-center z-40">
      {isLoading && <Skeleton />}
      <img
        alt={person.name}
        src={person.imageUrl}
        className={`h-64 w-64 rounded-lg object-cover m-2 transition-all duration-300 ease-in-out ${
          isLoading ? "hidden" : "block"
        } grayscale hover:grayscale-0`}
        onLoad={() => setIsLoading(false)}
      />
      {!isLoading && (
        <div>
          <h3 className="text-xl font-semibold leading-7 tracking-tight text-gray-900">
            {person.name}
          </h3>
          <p className="text-lg font-normal leading-6 text-blue-400">
            {person.role}
          </p>
        </div>
      )}
    </div>
  );
};

const ComingSoonTeam = () => {
  return (
    <div className="flex flex-col items-center justify-center md:h-screen lg:h-screen relative isolate px-6 lg:px-8 font-Tw_Cen_Mt bg-grey/10 rounded-t-3xl">
      <div className="text-center z-40 w-full">
        <div className="max-w-2xl py-10 text-center mx-auto animate-fade-up animate-once">
          <h2 className="flex justify-center text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight text-gray-900 animate-flip-down">
            <TypewriterEffectSmooth words={word} />
          </h2>
          <p className="m-3 text-lg md:text-xl lg:text-2xl leading-6 text-gray-900">
            " We are a team of passionate and experienced individuals who are
            passionate about{" "}
            <span className="text-united_nation_blue">innovation</span> and{" "}
            <span className="text-united_nation_blue">technology</span>. "
          </p>
        </div>
        <div className="w-full max-w-7xl mx-auto p-8">
          <ul
            role="list"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center animate-flip-down"
          >
            {people.map((person) => (
              <li key={person.name}>
                <PersonCard person={person} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default ComingSoonTeam;
