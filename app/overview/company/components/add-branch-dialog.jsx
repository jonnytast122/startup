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
  const [map, setMap] = useState(null);
  const [circle, setCircle] = useState(null);
  const [googleMaps, setGoogleMaps] = useState(null);
  const [centerCoords, setCenterCoords] = useState({
    lat: 11.56786,
    lng: 104.89005,
  });

  const [branchName, setBranchName] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [fenceSize, setFenceSize] = useState(300);
  const [formatAddress, setFormatAddress] = useState("");
  const inputRef = useRef(null);

  const queryClient = useQueryClient();

  const { user } = useAuth();

  // Get user location when dialog opens
  useEffect(() => {
    if (open && "geolocation" in navigator) {
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
  }, [open]);

  // Initialize Google Map
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
        version: "weekly",
        libraries: ["places"],
      });

      const google = await loader.load();

      setGoogleMaps(google);

      if (!google || !google.maps || !mapRef.current) return;

      const newMap = new google.maps.Map(mapRef.current, {
        center: centerCoords,
        zoom: 16,
        // mapId: "MY_NEXTJS_MAPID",
      });

      setMap(newMap);

      //Draw circle
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

      // Attach SearchBox to input
      // if (inputRef.current) {
      //   const sb = new google.maps.places.SearchBox(inputRef.current);

      //   // Bias results to current map viewport
      //   newMap.addListener("bounds_changed", () => {
      //     sb.setBounds(newMap.getBounds());
      //   });

      //   sb.addListener("places_changed", () => {
      //     const places = sb.getPlaces();
      //     if (!places || places.length === 0) return;

      //     const place = places[0];
      //     if (!place.geometry || !place.geometry.location) return;

      //     const newCoords = {
      //       lat: place.geometry.location.lat(),
      //       lng: place.geometry.location.lng(),
      //     };

      //     setSiteAddress(place.formatted_address);
      //     setCenterCoords(newCoords);

      //     // Move map + circle
      //     newMap.setCenter(newCoords);
      //     if (circle) circle.setCenter(newCoords);
      //   });
      // }

      // Initialize autocomplete
      if (inputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["geocode"],
          }
        );

        // Bias results to map viewport
        newMap.addListener("bounds_changed", () => {
          autocomplete.setBounds(newMap.getBounds());
        });

        // Place selected
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry || !place.geometry.location) return;

          const newCoords = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          // Update input value with Google suggestion
          setSiteAddress(place.formatted_address || place.name);

          // Move map & circle
          newMap.setCenter(newCoords);
          if (newCircle) newCircle.setCenter(newCoords);
          setCenterCoords(newCoords);
        });
      }
    };

    if (open) {
      initMap();
    } else if (map) {
      map.setCenter(centerCoords);
      if (circle) circle.setCenter(centerCoords);
    }
  }, [open, centerCoords, fenceSize, inputRef]);

  useEffect(() => {
    if (circle) {
      circle.setRadius(fenceSize);
    }

    if (isEdit) {
      setBranchName(branch?.name || "");
      setSiteAddress(branch?.location || "");
      if (branch?.geofence && branch.geofence.length > 0) {
        const gf = branch.geofence[0];
        const lat = gf.latitude || 11.56786;
        const lng = gf.longitude || 104.89005;
        const radius = gf.radius || 300;
        setCenterCoords({ lat, lng });
        setFenceSize(radius);
      }
    }
  }, [branch]);

  // Geocode address to center map and move circle
  const handleAddressSearch = async () => {
    if (!googleMaps || !siteAddress) return;

    const geocoder = new googleMaps.maps.Geocoder();
    geocoder.geocode({ address: siteAddress }, (results, status) => {
      if (status !== "OK") return;
      if (status === "OK") {
        console.log("Geocoding successful", results);
        const location = results[0].geometry.location;
        const newCoords = {
          lat: location.lat(),
          lng: location.lng(),
        };

        setCenterCoords(newCoords);
        setFormatAddress(results[0].formatted_address);
        if (map) map.setCenter(newCoords);
        if (circle) circle.setCenter(newCoords);
      }
      console.log("Geocode results:", results[0], "Status:", status);
    });
  };

  const debouncedSearch = debounce((val) => {
    handleAddressSearch(val);
  }, 600);

  useEffect(() => {
    if (siteAddress.trim() !== "") {
      debouncedSearch(siteAddress);
    }
  }, [siteAddress]);

  const createBranchMutation = useMutation({
    mutationFn: addBranch,
    onSuccess: () => {
      setSiteAddress("");
      setBranchName("");
      setFenceSize(300);
      setOpen(false);
      queryClient.invalidateQueries(["branches"]);
    },
  });

  const updateBranchMutation = useMutation({
    mutationFn: updateBranch,
    onSuccess: () => {
      setSiteAddress("");
      setBranchName("");
      setFenceSize(300);
      setOpen(false);
      queryClient.invalidateQueries(["branches"]);
    },
  });

  const onHandleCreateBranch = () => {
    createBranchMutation.mutate({
      name: branchName,
      location: siteAddress,
      geofence: [
        {
          latitude: centerCoords.lat,
          longitude: centerCoords.lng,
          radius: fenceSize || 200,
        },
      ],
      manager: user?.id,
    });
  };

  const onHandleUpdateBranch = () => {
    updateBranchMutation.mutate({
      id: branch.id,
      data: {
        name: branchName,
        location: siteAddress,
        geofence: [
          {
            latitude: centerCoords.lat,
            longitude: centerCoords.lng,
            radius: fenceSize || 200,
          },
        ],
        manager: user?.id,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <button
            className="text-grey-400 hover:text-blue-700"
            onClick={() => {
              setOpen(true);
            }}
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
                  Branch name
                </label>
                <input
                  type="text"
                  className="font-custom border text-dark-gray border-gray-300 rounded-lg p-2 w-full"
                  placeholder="Enter site name"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-lg text-dark-gray font-custom mb-2">
                  Geofencing
                </label>
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={siteAddress}
                    onChange={(e) => setSiteAddress(e.target.value)}
                    placeholder="Search location..."
                    className="font-custom border text-dark-gray border-gray-300 rounded-lg p-2 w-full"
                  />
                </div>
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
                  onValueChange={(value) => setFenceSize(value[0])}
                />
              </div>

              <div className="flex justify-end">
                {isEdit ? (
                  <Button
                    onClick={onHandleUpdateBranch}
                    className="py-4 px-6 text-md font-custom rounded-full"
                  >
                    {updateBranchMutation.isPending
                      ? "Updating Branch..."
                      : "Update Branch"}
                  </Button>
                ) : (
                  <Button
                    onClick={onHandleCreateBranch}
                    className="py-4 px-6 text-md font-custom rounded-full"
                  >
                    {createBranchMutation.isPending
                      ? "Saving Branch..."
                      : "Save Branch"}
                  </Button>
                )}
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
