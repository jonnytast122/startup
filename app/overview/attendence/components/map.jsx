<<<<<<< HEAD:app/overview/timeclock/components/map.jsx
import React, { useEffect, useRef, useState } from "react";
import { Search, GitCompareArrows } from "lucide-react";
import { Loader } from "@googlemaps/js-api-loader";
import 'animate.css';  // Import animate.css globally

function Map({ userData = [], selectedDate }) {
  const mapRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [map, setMap] = useState(null);

  const filteredUsers = userData.filter((user) => {
    if (!user.status || user.status.trim() === "") return false;

    const userDate = new Date(user.date).toDateString();
    const selected = new Date(selectedDate).toDateString();
    if (userDate !== selected) return false;

    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
    const search = searchTerm.toLowerCase();

    return (
      user.firstname.toLowerCase().includes(search) ||
      user.lastname.toLowerCase().includes(search) ||
      fullName.includes(search) ||
      user.job.toLowerCase().includes(search)
    );
  });
  

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
        version: "weekly",
      });

      const google = await loader.load();
      if (!google || !google.maps) return;

      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: 11.56786, lng: 104.89005 }, // Default: RUPP, Cambodia
        zoom: 16,
        mapId: "MY_NEXTJS_MAPID",
      });

      setMap(newMap);
    };

    initMap();
  }, []);

  useEffect(() => {
    if (!map) return;
  
    const markers = [];
    const overlays = [];
  
    let firstMatch = null; // Store the first matched user
  
    filteredUsers.forEach((user, index) => {
      const marker = new google.maps.Marker({
        position: { lat: user.lat, lng: user.lng },
        map,
        icon: {
          url: user.profile || "/default-avatar.png",
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 20),
        },
        title: `${user.firstname} ${user.lastname}`,
      });
  
      markers.push(marker);
  
      if (index === 0) {
        firstMatch = user; // Capture first matched user
      }
  
      // Animated overlay
      const overlay = new google.maps.OverlayView();
      overlay.onAdd = function () {
        const div = document.createElement("div");
        div.className = "breathing-animation";
        div.style.position = "absolute";
        div.style.width = "50px";
        div.style.height = "50px";
        div.style.borderRadius = "50%";
        div.style.backgroundColor = "rgba(84, 148, 218, 0.3)";
        div.style.animation = "pulse-animation 2s infinite";
  
        this.div = div;
        const panes = this.getPanes();
        panes.overlayLayer.appendChild(div);
      };
  
      overlay.draw = function () {
        const projection = this.getProjection();
        if (!projection) return;
        const position = projection.fromLatLngToDivPixel(
          new google.maps.LatLng(user.lat, user.lng)
        );
        if (position) {
          this.div.style.left = `${position.x - 25}px`;
          this.div.style.top = `${position.y - 25}px`;
        }
      };
  
      overlay.onRemove = function () {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
      };
  
      overlay.setMap(map);
      overlays.push(overlay);
    });
  
    // If a user is found, pan and zoom into their location
    if (firstMatch) {
      map.panTo(new google.maps.LatLng(firstMatch.lat, firstMatch.lng));
      map.setZoom(18); // Zoom into the location
    } else {
      map.setZoom(16); // Reset zoom if no user is found
    }
  
    return () => {
      markers.forEach((marker) => marker.setMap(null));
      overlays.forEach((overlay) => overlay.setMap(null));
    };
  }, [filteredUsers, map]);
  

  return (
    <div className="relative w-full h-[500px]">
      {/* Floating User List */}
      <div className="absolute top-5 left-5 z-10 bg-white shadow-lg p-6 rounded-lg border border-[#5494DA] w-80 animate__animated animate__fadeIn">
        <h2 className="text-lg font-custom text-dark-blue mb-4">
          All users that clocked in today
        </h2>

        {/* Search Input and "All" Button */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 p-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1.5 h-5 w-5 text-gray-500" />
          </div>

          {/* "All" Button */}
          <button
            className="flex items-center px-4 py-1.5 text-white bg-blue-500 rounded-full hover:bg-blue-600"
            onClick={() => setSearchTerm("")} // Clears search
          >
            <GitCompareArrows className="w-4 h-4 mr-1" /> All
          </button>
        </div>

        <ul className="space-y-2">
          {filteredUsers.map((user, index) => (
            <li
              key={index}
              className="flex items-center space-x-2 border-b border-[#E0E0E0] pb-2"
            >
              <img
                src={user.profile || "/default-avatar.png"}
                alt={user.firstname}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex items-center space-x-3 flex-1">
                {/* Name */}
                <span className="text-xs sm:text-sm md:text-md lg:text-md font-custom text-dark-blue">
                  {user.firstname} {user.lastname}
                </span>
                {/* Job with Icon Outside */}
                <div className="flex items-center space-x-2">
                  {/* Job Title */}
                  <div className="px-5 py-1 text-xs sm:text-sm md:text-md lg:text-md font-custom rounded-full border border-[#5494DA] text-blue">
                    {user.job}
                  </div>
                  {/* Blue Circle with Icon (Outside) */}
                  <div className="w-9 h-9 bg-blue-500 text-white flex items-center justify-center rounded-full">
                    <GitCompareArrows className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Google Map */}
      <div ref={mapRef} className="h-full w-full rounded-md border" />
    </div>
  );
}

export default Map;
=======
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, GitCompareArrows } from "lucide-react";
import { Loader } from "@googlemaps/js-api-loader";
import "animate.css";

function Map({ userData = [], selectedDate }) {
  const mapRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [map, setMap] = useState(null);
  const [hideAll, setHideAll] = useState(false);
  const [hiddenUsers, setHiddenUsers] = useState([]);

  const filteredUsers = userData.filter((user) => {
    if (!user.status || user.status.trim() === "") return false;

    const userDate = new Date(user.date).toDateString();
    const selected = new Date(selectedDate).toDateString();
    if (userDate !== selected) return false;

    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
    const search = searchTerm.toLowerCase();

    return (
      user.firstname.toLowerCase().includes(search) ||
      user.lastname.toLowerCase().includes(search) ||
      fullName.includes(search) ||
      user.job.toLowerCase().includes(search)
    );
  });

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
        version: "weekly",
      });

      const google = await loader.load();
      if (!google || !google.maps) return;

      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: 11.56786, lng: 104.89005 },
        zoom: 16,
        mapId: "MY_NEXTJS_MAPID",
      });

      setMap(newMap);
    };

    initMap();
  }, []);

  useEffect(() => {
    if (!map) return;

    const markers = [];
    const overlays = [];

    const usersToRender = hideAll
      ? []
      : filteredUsers.filter(
          (user) =>
            !hiddenUsers.some(
              (h) =>
                h.firstname === user.firstname && h.lastname === user.lastname
            )
        );

    usersToRender.forEach((user) => {
      const marker = new google.maps.Marker({
        position: { lat: user.lat, lng: user.lng },
        map,
        icon: {
          url: user.profile || "/default-avatar.png",
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 20),
        },
        title: `${user.firstname} ${user.lastname}`,
      });

      markers.push(marker);

      const overlay = new google.maps.OverlayView();
      overlay.onAdd = function () {
        const div = document.createElement("div");
        div.className = "breathing-animation";
        div.style.position = "absolute";
        div.style.width = "50px";
        div.style.height = "50px";
        div.style.borderRadius = "50%";
        div.style.backgroundColor = "rgba(84, 148, 218, 0.3)";
        div.style.animation = "pulse-animation 2s infinite";

        this.div = div;
        const panes = this.getPanes();
        panes.overlayLayer.appendChild(div);
      };

      overlay.draw = function () {
        const projection = this.getProjection();
        if (!projection) return;
        const position = projection.fromLatLngToDivPixel(
          new google.maps.LatLng(user.lat, user.lng)
        );
        if (position) {
          this.div.style.left = `${position.x - 25}px`;
          this.div.style.top = `${position.y - 25}px`;
        }
      };

      overlay.onRemove = function () {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
      };

      overlay.setMap(map);
      overlays.push(overlay);
    });

    const centerUser = usersToRender[0];
    if (centerUser) {
      map.panTo(new google.maps.LatLng(centerUser.lat, centerUser.lng));
      map.setZoom(18);
    } else {
      map.setZoom(16);
    }

    return () => {
      markers.forEach((marker) => marker.setMap(null));
      overlays.forEach((overlay) => overlay.setMap(null));
    };
  }, [filteredUsers, hiddenUsers, hideAll, map]);

  return (
    <div className="relative w-full h-[500px]">
      <div className="absolute top-5 left-5 z-10 bg-white shadow-lg p-6 rounded-lg border border-[#5494DA] w-80 animate__animated animate__fadeIn">
        <h2 className="text-lg font-custom text-dark-blue mb-4">
          All users that clocked in today
        </h2>

        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 p-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1.5 h-5 w-5 text-gray-500" />
          </div>

          <button
            className={`flex items-center px-4 py-1.5 rounded-full transition-colors duration-200 ${
              hideAll
                ? "bg-gray-400 text-white hover:bg-gray-500"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={() => {
              setSelectedUser(null);
              setSearchTerm("");

              if (hideAll || hiddenUsers.length > 0) {
                // Reset all: unhide everyone, and turn map back on
                setHideAll(false);
                setHiddenUsers([]);
              } else {
                // Hide all
                setHideAll(true);
              }
            }}
          >
            <GitCompareArrows className="w-4 h-4 mr-1" /> All
          </button>
        </div>

        <ul className="space-y-2 max-h-[300px] overflow-y-auto">
          {filteredUsers.map((user, index) => {
            const isSelected =
              selectedUser &&
              selectedUser.firstname === user.firstname &&
              selectedUser.lastname === user.lastname;

            return (
              <li
                key={index}
                className="flex items-center space-x-2 border-b border-[#E0E0E0] pb-2"
              >
                <img
                  src={user.profile || "/default-avatar.png"}
                  alt={user.firstname}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-xs sm:text-sm md:text-md lg:text-md font-custom text-dark-blue">
                    {user.firstname} {user.lastname}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="px-5 py-1 text-xs sm:text-sm md:text-md lg:text-md font-custom rounded-full border border-[#5494DA] text-blue">
                      {user.job}
                    </div>
                    <div className="w-9 h-9 bg-blue-500 text-white flex items-center justify-center rounded-full">
                      <GitCompareArrows
                        className={`w-4 h-4 cursor-pointer transition-colors duration-200 ${
                          hiddenUsers.some(
                            (h) =>
                              h.firstname === user.firstname &&
                              h.lastname === user.lastname
                          )
                            ? "text-gray-400"
                            : "text-white"
                        }`}
                        onClick={() => {
                          const isHidden = hiddenUsers.some(
                            (h) =>
                              h.firstname === user.firstname &&
                              h.lastname === user.lastname
                          );

                          if (isHidden) {
                            // Unhide user
                            setHiddenUsers((prev) =>
                              prev.filter(
                                (h) =>
                                  h.firstname !== user.firstname ||
                                  h.lastname !== user.lastname
                              )
                            );
                          } else {
                            // Hide user
                            setHiddenUsers((prev) => [...prev, user]);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div ref={mapRef} className="h-full w-full rounded-md border" />
    </div>
  );
}

export default Map;
>>>>>>> d8c38a63385556dd479c08931b9c55ec7f45827c:app/overview/attendence/components/map.jsx
