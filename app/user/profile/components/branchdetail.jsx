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

function BranchDetail({ open, onOpenChange, branchData }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [circle, setCircle] = useState(null);
  const [googleMaps, setGoogleMaps] = useState(null);

  const { branch, siteAddress, fenceSize, coords } = branchData || {
    branch: "Main Branch",
    siteAddress: "Phnom Penh",
    fenceSize: 300,
    coords: { lat: 11.56786, lng: 104.89005 },
  };

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
        center: coords,
        zoom: 16,
        mapId: "MY_NEXTJS_MAPID",
      });

      setMap(newMap);

      const newCircle = new google.maps.Circle({
        map: newMap,
        center: coords,
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
      map.setCenter(coords);
      if (circle) circle.setCenter(coords);
    }
  }, [open]);

  const handleSave = () => {
    alert("✅ Branch details saved (view-only mode).");
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
          {/* Left - read-only info */}
          <div className="flex flex-col space-y-4 bg-[#D9D9D933] p-4 sm:p-6 rounded-xl border border-gray-200">
            <div>
              <label className="block text-sm sm:text-base lg:text-lg text-dark-gray font-custom mb-2">
                Branch name
              </label>
              <p className="font-custom text-dark-gray border border-gray-300 rounded-lg p-2 w-full bg-gray-100">
                {branch}
              </p>
            </div>

            <div>
              <label className="block text-sm sm:text-base lg:text-lg text-dark-gray font-custom mb-2">
                Geofencing Address
              </label>
              <p className="font-custom text-dark-gray border border-gray-300 rounded-lg p-2 w-full bg-gray-100">
                {siteAddress}
              </p>
            </div>

            <div>
              <label className="block text-sm sm:text-base lg:text-lg text-dark-gray font-custom mb-2">
                Fence size
              </label>
              <p className="font-custom text-dark-gray border border-gray-300 rounded-lg p-2 w-full bg-gray-100">
                {fenceSize} meters
              </p>
            </div>
          </div>

          {/* Right - map */}
          <div className="h-64 sm:h-[500px] w-full flex flex-col">
            <div ref={mapRef} className="flex-1 w-full rounded-lg" />

            {/* Mobile save button */}
            <div className="flex lg:hidden justify-center mt-4 w-full">
              <Button
                onClick={handleSave}
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
