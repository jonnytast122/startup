"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

function BranchDetail({ open, onOpenChange }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [circle, setCircle] = useState(null);
  const [googleMaps, setGoogleMaps] = useState(null);
  const [centerCoords, setCenterCoords] = useState({
    lat: 11.56786,
    lng: 104.89005,
  });
  const [siteAddress, setSiteAddress] = useState("");
  const [fenceSize, setFenceSize] = useState(300);

  // Get user location
  useEffect(() => {
    if (open && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCenterCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.error("Geolocation error:", err)
      );
    }
  }, [open]);

  // Init Google Map
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
        version: "weekly",
      });

      const google = await loader.load();
      setGoogleMaps(google);

      if (!mapRef.current) return;

      const newMap = new google.maps.Map(mapRef.current, {
        center: centerCoords,
        zoom: 16,
        mapId: "MY_NEXTJS_MAPID",
      });

      setMap(newMap);

      const newCircle = new google.maps.Circle({
        map: newMap,
        center: centerCoords,
        radius: fenceSize,
        fillColor: "#4285F4",
        fillOpacity: 0.2,
        strokeColor: "#4285F4",
        strokeOpacity: 0.5,
        strokeWeight: 2,
      });

      setCircle(newCircle);
    };

    if (open && !map) {
      setTimeout(() => initMap(), 300);
    } else if (map) {
      map.setCenter(centerCoords);
      if (circle) circle.setCenter(centerCoords);
    }
  }, [open, centerCoords]);

  useEffect(() => {
    if (circle) circle.setRadius(fenceSize);
  }, [fenceSize]);

  const handleAddressSearch = async () => {
    if (!googleMaps || !siteAddress) return;
    const geocoder = new googleMaps.maps.Geocoder();
    geocoder.geocode({ address: siteAddress }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        const newCoords = { lat: location.lat(), lng: location.lng() };
        setCenterCoords(newCoords);
        if (map) map.setCenter(newCoords);
        if (circle) circle.setCenter(newCoords);
      } else {
        alert("Geocoding failed: " + status);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full sm:max-w-4xl lg:max-w-6xl p-0 overflow-hidden">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle />
          <h1 className="font-custom text-light-gray text-xl sm:text-2xl lg:text-3xl py-4">
            Branch Details
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]" />
        </DialogHeader>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-4 p-4 sm:p-6">
          {/* Left form */}
          <div className="flex flex-col space-y-4 bg-[#D9D9D933] p-4 sm:p-6 rounded-xl border border-gray-200">
            <div>
              <label className="block text-sm sm:text-base lg:text-lg text-dark-gray font-custom mb-2">
                Branch name
              </label>
              <input
                type="text"
                className="font-custom border text-dark-gray border-gray-300 rounded-lg p-2 w-full"
                placeholder="Enter site name"
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base lg:text-lg text-dark-gray font-custom mb-2">
                Geofencing
              </label>
              <input
                type="text"
                value={siteAddress}
                onChange={(e) => setSiteAddress(e.target.value)}
                className="font-custom border text-dark-gray border-gray-300 rounded-lg p-2 w-full"
                placeholder="Enter site address"
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base lg:text-lg text-dark-gray font-custom mb-2">
                Fence size (meters): {fenceSize}m
              </label>
              <Slider
                min={100}
                max={1000}
                step={50}
                value={[fenceSize]}
                onValueChange={(val) => setFenceSize(val[0])}
              />
            </div>

            {/* Default button (large screens only) */}
            <div className="hidden lg:flex justify-end">
              <Button
                onClick={handleAddressSearch}
                className="py-2 sm:py-3 px-6 text-sm sm:text-md font-custom rounded-full"
              >
                Save
              </Button>
            </div>
          </div>

          {/* Right map */}
          <div className="h-64 sm:h-[500px] w-full flex flex-col">
            <div ref={mapRef} className="flex-1 w-full rounded-lg" />

            {/* Mobile button under map (only small/medium screens) */}
            <div className="flex lg:hidden justify-center mt-4 w-full">
              <Button
                onClick={handleAddressSearch}
                className="w-full sm:w-auto py-2 sm:py-3 px-6 text-sm sm:text-md font-custom rounded-full"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BranchDetail;
