"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

function AddBranchDialog() {
  const [open, setOpen] = useState(false);
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [googleMaps, setGoogleMaps] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [centerCoords, setCenterCoords] = useState({
    lat: 11.56786,
    lng: 104.89005,
  });
  const [siteAddress, setSiteAddress] = useState("");

  // Get current location on open
  useEffect(() => {
    if (isOpen && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenterCoords({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, [isOpen]);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
        version: "weekly",
      });

      const google = await loader.load();
      setGoogleMaps(google);

      if (!google || !google.maps || !mapRef.current) return;

      const newMap = new google.maps.Map(mapRef.current, {
        center: centerCoords,
        zoom: 16,
        mapId: "MY_NEXTJS_MAPID",
      });

      setMap(newMap);
    };

    if (isOpen && !map) {
      setTimeout(() => {
        initMap();
      }, 300);
    } else if (map) {
      map.setCenter(centerCoords);
    }
  }, [isOpen, centerCoords]);

  const handleOpenChange = (open) => {
    setIsOpen(open);
  };

  const handleAddressSearch = async () => {
    if (!googleMaps || !siteAddress) return;

    const geocoder = new googleMaps.maps.Geocoder();
    geocoder.geocode({ address: siteAddress }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        const newCoords = {
          lat: location.lat(),
          lng: location.lng(),
        };
        setCenterCoords(newCoords); // updates map center
        if (map) map.setCenter(newCoords);
      } else {
        alert("Geocoding failed: " + status);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="font-custom text-blue-500 hover:text-blue-700 text-sm transition duration-200"
          onClick={() => setOpen(true)}
        >
          + Add Branch
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl p-0 overflow-hidden">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle></DialogTitle>
          <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
            Branch Details
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-[30%_70%] h-[600px] w-full">
          {/* Left: Site Info */}
          <div className="flex flex-col h-full bg-white pr-6">
            <div className="bg-[#D9D9D933] p-6 rounded-xl border border-gray-200 space-y-4">
              <div>
                <label className="text-lg text-dark-gray font-custom mb-2">
                  Site name:
                </label>
                <input
                  type="text"
                  className="font-custom border text-dark-gray border-gray-300 rounded-lg p-2 w-full"
                  placeholder="Enter site name"
                />
              </div>

              <div>
                <label className="text-lg text-dark-gray font-custom mb-2">
                  Site address:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={siteAddress}
                    onChange={(e) => setSiteAddress(e.target.value)}
                    className="font-custom border text-dark-gray border-gray-300 rounded-lg p-2 w-full"
                    placeholder="Enter site address"
                  />
                  <button
                    onClick={handleAddressSearch}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg"
                  >
                    Find
                  </button>
                </div>
              </div>

              <div>
                <label className="text-lg text-dark-gray font-custom mb-2">
                  Fence size:
                </label>
                <Slider />
              </div>
            </div>
          </div>

          {/* Right: Google Map */}
          <div className="h-full w-full">
            <div ref={mapRef} className="h-full w-full rounded-lg" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddBranchDialog;
