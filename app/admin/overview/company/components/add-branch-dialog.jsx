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
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBranch, updateBranch } from "@/lib/api/branch";
import { useAuth } from "@/contexts/AuthContext";
import debounce from "lodash.debounce";
import { Pen } from "lucide-react";

function AddBranchDialog({ isEdit, branch }) {
  const [open, setOpen] = useState(false);
  const mapRef = useRef(null);
  const inputRef = useRef(null);

  const [map, setMap] = useState(null);
  const [circle, setCircle] = useState(null);
  const [marker, setMarker] = useState(null);
  const [googleMaps, setGoogleMaps] = useState(null);
  const [centerCoords, setCenterCoords] = useState({
    lat: 11.56786,
    lng: 104.89005,
  });

  const [branchName, setBranchName] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [fenceSize, setFenceSize] = useState(300);
  const [formatAddress, setFormatAddress] = useState("");

  const queryClient = useQueryClient();
  const { user } = useAuth();

  // ✅ Get user location when dialog opens
  useEffect(() => {
    if (open && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCenterCoords({ lat: latitude, lng: longitude });
        }
        // (err) => console.error("Geolocation error:", err)
      );
    }
  }, [open]);

  // ✅ Initialize Google Map and Autocomplete
  useEffect(() => {
    const initMap = async () => {
      if (!window._googleMapsLoader) {
        window._googleMapsLoader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          version: "weekly",
          libraries: ["places"],
          language: "km",
          region: "KH",
        });
      }

      const google = await window._googleMapsLoader.load();
      setGoogleMaps(google);
      if (!mapRef.current) return;

      const newMap = new google.maps.Map(mapRef.current, {
        center: centerCoords,
        zoom: 16,
        disableDefaultUI: true,
        zoomControl: true,
      });
      setMap(newMap);

      // ✅ Draw circle & marker
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
      const newMarker = new google.maps.Marker({
        position: centerCoords,
        map: newMap,
      });
      setCircle(newCircle);
      setMarker(newMarker);

      // ✅ Click on map to move marker
      newMap.addListener("click", (event) => {
        const newCoords = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };
        newMarker.setPosition(newCoords);
        newCircle.setCenter(newCoords);
        newMap.setCenter(newCoords);
        setCenterCoords(newCoords);

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: newCoords }, (results, status) => {
          if (status === "OK" && results[0]) {
            setSiteAddress(results[0].formatted_address);
            setFormatAddress(results[0].formatted_address);
          }
        });
      });

      // ✅ Setup Autocomplete
      if (inputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["geocode"],
            componentRestrictions: { country: "KH" },
            fields: ["geometry", "name", "formatted_address"],
          }
        );

        const cambodiaBounds = new google.maps.LatLngBounds(
          { lat: 10.4, lng: 103.0 },
          { lat: 14.7, lng: 107.6 }
        );
        autocomplete.setBounds(cambodiaBounds);

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry) return;

          const newCoords = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          const formatted = place.formatted_address || place.name || "";

          // ✅ Update everything consistently
          setSiteAddress(formatted);
          setFormatAddress(formatted);
          setCenterCoords(newCoords);

          // ✅ Move map, marker, and circle
          newMarker.setPosition(newCoords);
          newCircle.setCenter(newCoords);
          newMap.setCenter(newCoords);
          newMap.setZoom(17);
        });
      }
    };

    if (open) initMap();
  }, [open]);

  // ✅ Update map circle when fence size changes
  useEffect(() => {
    if (circle) circle.setRadius(fenceSize);
  }, [fenceSize]);

  // ✅ When editing an existing branch
  useEffect(() => {
    if (isEdit && branch) {
      setBranchName(branch?.name || "");
      setSiteAddress(branch?.location || "");
      const gf = branch?.geofence?.[0];
      if (gf) {
        setCenterCoords({
          lat: gf.latitude || 11.56786,
          lng: gf.longitude || 104.89005,
        });
        setFenceSize(gf.radius || 300);
      }
    }
  }, [branch]);

  // ✅ Debounced manual typing geocode
  const handleAddressSearch = async () => {
    if (!googleMaps || !siteAddress) return;

    const geocoder = new googleMaps.maps.Geocoder();
    geocoder.geocode({ address: siteAddress }, (results, status) => {
      if (status === "OK" && results[0]) {
        const loc = results[0].geometry.location;
        const newCoords = { lat: loc.lat(), lng: loc.lng() };

        setCenterCoords(newCoords);
        setFormatAddress(results[0].formatted_address);
        if (map) map.setCenter(newCoords);
        if (circle) circle.setCenter(newCoords);
        if (marker) marker.setPosition(newCoords);
      }
    });
  };
  const debouncedSearch = debounce(handleAddressSearch, 600);
  useEffect(() => {
    if (siteAddress.trim()) debouncedSearch(siteAddress);
  }, [siteAddress]);

  // ✅ Mutations
  const queryKey = ["branches"];
  const createBranchMutation = useMutation({
    mutationFn: addBranch,
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries(queryKey);
    },
  });
  const updateBranchMutation = useMutation({
    mutationFn: updateBranch,
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries(queryKey);
    },
  });

  const handleSave = () => {
    const data = {
      name: branchName,
      location: siteAddress,
      geofence: [
        {
          latitude: centerCoords.lat,
          longitude: centerCoords.lng,
          radius: fenceSize,
        },
      ],
      manager: user?.id,
    };

    if (isEdit) {
      updateBranchMutation.mutate({ id: branch.id, data });
    } else {
      createBranchMutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <button
            className="text-grey-400 hover:text-blue-700"
            onClick={() => setOpen(true)}
          >
            <Pen className="w-4 h-4" />
          </button>
        ) : (
          <button
            className="font-custom text-blue-500 hover:text-blue-700 text-sm transition duration-200"
            onClick={() => {
              setOpen(true);
              setSiteAddress("");
            }}
          >
            + Add Branch
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-6xl p-0 overflow-hidden">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle />
          <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
            Branch Details
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]" />
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-[30%_70%] h-[600px] w-full">
          {/* Left Side */}
          <div className="flex flex-col h-full bg-white pr-6">
            <div className="bg-[#D9D9D933] p-6 rounded-xl border border-gray-200 space-y-4">
              <div>
                <label className="text-lg text-dark-gray font-custom mb-2">
                  Branch name
                </label>
                <input
                  type="text"
                  className="font-custom border text-dark-gray border-gray-300 rounded-lg p-2 w-full"
                  placeholder="Enter branch name"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-lg text-dark-gray font-custom mb-2">
                  Site address
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={siteAddress}
                  onChange={(e) => setSiteAddress(e.target.value)}
                  placeholder="Search location..."
                  className="font-custom border text-dark-gray border-gray-300 rounded-lg p-2 w-full"
                />
              </div>

              <div>
                <label className="text-lg text-dark-gray font-custom mb-2">
                  Fence size (meters): {fenceSize}m
                </label>
                <Slider
                  min={100}
                  max={1000}
                  step={50}
                  value={[fenceSize]}
                  onValueChange={(v) => setFenceSize(v[0])}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  className="py-4 px-6 text-md font-custom rounded-full"
                >
                  {isEdit
                    ? updateBranchMutation.isPending
                      ? "Updating..."
                      : "Update Branch"
                    : createBranchMutation.isPending
                    ? "Saving..."
                    : "Save Branch"}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side Map */}
          <div className="h-full w-full">
            <div ref={mapRef} className="h-full w-full rounded-lg" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddBranchDialog;
