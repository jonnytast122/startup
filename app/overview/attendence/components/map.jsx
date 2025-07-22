import React, { useEffect, useRef, useState } from "react";
import { Search, GitCompareArrows } from "lucide-react";
import { Loader } from "@googlemaps/js-api-loader";
import "animate.css"; // Import animate.css globally

function Map({ userData = [], selectedDate }) {
  const mapRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [map, setMap] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // NEW

  const filteredUsers = userData.filter((user) => {
    if (!user.status || user.status.trim() === "") return false;

    const userDate = new Date(user.date).toDateString();
    const selected = new Date(selectedDate).toDateString();
    if (userDate !== selected) return false;

    if (selectedUser) {
      return (
        user.firstname === selectedUser.firstname &&
        user.lastname === selectedUser.lastname
      );
    }

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
            onClick={() => {
              setSearchTerm(""); // reset search
              setSelectedUser(null); // reset individual filter
            }}
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
                    <GitCompareArrows
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => {
                        setSelectedUser(user);
                        setSearchTerm("");
                      }}
                    />
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
