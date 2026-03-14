"use client";

import { useEffect, useRef } from "react";

interface VenuePickerProps {
  onSelect: (coords: { lat: number; lng: number }) => void;
  initialValue?: string;
}

const SCRIPT_ID = "google-maps-places-script";

export function VenuePicker({ onSelect, initialValue }: VenuePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    function initAutocomplete() {
      if (!inputRef.current || autocompleteRef.current) return;

      const ac = new google.maps.places.Autocomplete(inputRef.current, {
        types: ["establishment"],
        fields: ["geometry", "name", "formatted_address"],
      });

      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        const loc = place.geometry?.location;
        if (loc) {
          onSelect({ lat: loc.lat(), lng: loc.lng() });
        }
      });

      autocompleteRef.current = ac;
    }

    // If the script is already loaded and google.maps.places exists, init directly
    if (typeof google !== "undefined" && google.maps?.places) {
      initAutocomplete();
      return;
    }

    // If the script tag already exists but hasn't finished loading, wait for it
    if (document.getElementById(SCRIPT_ID)) {
      const check = setInterval(() => {
        if (typeof google !== "undefined" && google.maps?.places) {
          clearInterval(check);
          initAutocomplete();
        }
      }, 100);
      return () => clearInterval(check);
    }

    // Load the script
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => initAutocomplete();
    document.head.appendChild(script);
  }, [onSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      defaultValue={initialValue ?? ""}
      placeholder="Search for a venue..."
      className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
    />
  );
}
