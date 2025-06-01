"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { FaTelegram } from "react-icons/fa";
import { Button } from "@/components/ui/button"; // shadcn UI button
import { FaRegEye, FaStar, FaHeart } from "react-icons/fa";

export default function SupportPage() {

    const openTelegram = () => {
        window.open("https://t.me/example", "_blank");
    };

    const videos = [
        {
            id: 1,
            title: "Tutorial 01",
            duration: "10 mins",
            rating: 4.9,
            src: "https://www.w3schools.com/html/mov_bbb.mp4",
            poster: "https://via.placeholder.com/300x180?text=Tutorial+01",
        },
        {
            id: 2,
            title: "Tutorial 02",
            duration: "10 mins",
            rating: 4.9,
            src: "https://www.w3schools.com/html/movie.mp4",
            poster: "https://via.placeholder.com/300x180?text=Tutorial+02",
        },
        {
            id: 3,
            title: "Tutorial 03",
            duration: "10 mins",
            rating: 4.9,
            src: "https://www.w3schools.com/html/mov_bbb.mp4",
            poster: "https://via.placeholder.com/300x180?text=Tutorial+03",
        },
        {
            id: 4,
            title: "Tutorial 04",
            duration: "10 mins",
            rating: 4.9,
            src: "https://www.w3schools.com/html/movie.mp4",
            poster: "https://via.placeholder.com/300x180?text=Tutorial+04",
        },
        {
            id: 5,
            title: "Tutorial 02",
            duration: "10 mins",
            rating: 4.9,
            src: "https://www.w3schools.com/html/movie.mp4",
            poster: "https://via.placeholder.com/300x180?text=Tutorial+02",
        },
        {
            id: 6,
            title: "Tutorial 03",
            duration: "10 mins",
            rating: 4.9,
            src: "https://www.w3schools.com/html/mov_bbb.mp4",
            poster: "https://via.placeholder.com/300x180?text=Tutorial+03",
        },
        {
            id: 7,
            title: "Tutorial 04",
            duration: "10 mins",
            rating: 4.9,
            src: "https://www.w3schools.com/html/movie.mp4",
            poster: "https://via.placeholder.com/300x180?text=Tutorial+04",
        },
    ];

    return (
        <div className="font-custom">
            {/* Header */}
            <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
                <div className="flex items-center space-x-3 p-6">
                    <Info className="text-[#2998FF]" width={40} height={40} />
                    <span className="font-custom text-3xl text-black">Help</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-xl shadow-md px-6 py-10">
                <div className="text-center">
                    <h1 className="text-3xl font-semibold mb-6">How can we help you?</h1>
                    <Button
                        onClick={openTelegram}
                        variant="outline"
                        className="mx-auto flex items-center gap-4 w-80 h-20 border border-blue-400 text-blue-400 bg-white rounded-2xl shadow-sm hover:bg-blue-50"
                    >
                        <FaTelegram className="text-9xl" />
                        <span className="text-2xl font-semibold">Telegram</span>
                    </Button>
                </div>

                {/* Explore More Section */}
                <div className=" px-6 py-4 rounded-lg mb-6">
                    <h2 className="text-sm bg-blue-50 text-blue-400 p-3 rounded-xl font-semibold mb-3">Explore More</h2>
                    <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
                        {videos.map((video) => (
                            <div
                                key={video.id}
                                className="min-w-[220px] bg-white rounded-xl shadow-sm border border-gray-200"
                            >
                                <div className="relative">
                                    <video
                                        controls
                                        poster={video.poster}
                                        src={video.src}
                                        className="rounded-t-xl w-full h-36 object-cover"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                    <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
                                        <FaHeart className="text-gray-400" />
                                    </button>
                                </div>
                                <div className="px-3 py-2">
                                    <p className="font-semibold text-sm mb-2">{video.title}</p>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <FaRegEye className="text-blue-500" />
                                            <span className="text-blue-500">{video.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FaStar className="text-yellow-400" />
                                            <span>{video.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
                {/* Explore More Section */}
                <div className=" px-6 py-4 rounded-lg mb-6">
                    <h2 className="text-sm bg-blue-50 text-blue-400 p-3 rounded-xl font-semibold mb-3">Explore More</h2>
                    <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
                        {videos.map((video) => (
                            <div
                                key={video.id}
                                className="min-w-[220px] bg-white rounded-xl shadow-sm border border-gray-200"
                            >
                                <div className="relative">
                                    <video
                                        controls
                                        poster={video.poster}
                                        src={video.src}
                                        className="rounded-t-xl w-full h-36 object-cover"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                    <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
                                        <FaHeart className="text-gray-400" />
                                    </button>
                                </div>
                                <div className="px-3 py-2">
                                    <p className="font-semibold text-sm mb-2">{video.title}</p>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <FaRegEye className="text-blue-500" />
                                            <span className="text-blue-500">{video.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FaStar className="text-yellow-400" />
                                            <span>{video.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
