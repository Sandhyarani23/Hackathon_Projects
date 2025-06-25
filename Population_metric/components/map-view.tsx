"use client"

import { useEffect, useRef } from "react"
import type { Household, MapBounds } from "@/app/page"

interface MapViewProps {
  households: Household[]
  selectedHousehold: Household | null
  onSelectHousehold: (household: Household) => void
  activeFilters: string[]
  currentLocation: { lat: number; lng: number } | null
  onBoundsChange: (bounds: MapBounds) => void
}

export function MapView({
  households,
  selectedHousehold,
  onSelectHousehold,
  activeFilters,
  currentLocation,
  onBoundsChange,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const currentLocationMarkerRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current && !mapInstanceRef.current) {
      // Dynamically import Leaflet to avoid SSR issues
      import("leaflet").then((L) => {
        // Initialize map
        const map = L.map(mapRef.current!).setView([28.6139, 77.209], 13)

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map)

        mapInstanceRef.current = map

        // Update bounds when map moves
        map.on("moveend", () => {
          const bounds = map.getBounds()
          onBoundsChange({
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
          })
        })

        // Custom icons
        const createHouseIcon = (color: string, isSelected: boolean) => {
          return L.divIcon({
            html: `<div style="
              width: ${isSelected ? "24px" : "20px"}; 
              height: ${isSelected ? "24px" : "20px"}; 
              background-color: ${color}; 
              border: 2px solid white; 
              border-radius: 50%; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              color: white;
            ">🏠</div>`,
            className: "custom-house-marker",
            iconSize: [isSelected ? 24 : 20, isSelected ? 24 : 20],
            iconAnchor: [isSelected ? 12 : 10, isSelected ? 12 : 10],
          })
        }

        const getMarkerColor = (household: Household, filters: string[]) => {
          if (filters.includes("unemployment") && household.unemployed > 0) {
            return "#ef4444" // red
          }
          if (filters.includes("poverty") && household.monthlyIncome.includes("15000")) {
            return "#f97316" // orange
          }
          if (filters.includes("literacy") && household.literateAdults < 2) {
            return "#eab308" // yellow
          }
          if (filters.includes("voter-id") && !household.voterIdAvailable) {
            return "#a855f7" // purple
          }
          return "#3b82f6" // blue
        }

        // Update markers when households or filters change
        const updateMarkers = () => {
          // Clear existing markers
          markersRef.current.forEach((marker) => map.removeLayer(marker))
          markersRef.current = []

          // Add household markers
          households.forEach((household) => {
            const color = getMarkerColor(household, activeFilters)
            const isSelected = selectedHousehold?.id === household.id
            const icon = createHouseIcon(color, isSelected)

            const marker = L.marker([household.lat, household.lng], { icon })
              .addTo(map)
              .on("click", () => onSelectHousehold(household))

            // Add popup with basic info
            marker.bindPopup(`
              <div style="font-size: 12px;">
                <strong>${household.houseNumber || "New House"}</strong><br/>
                ${household.headOfHousehold || "No name"}<br/>
                ${household.address || "No address"}<br/>
                <small>Residents: ${household.totalResidents}</small>
              </div>
            `)

            markersRef.current.push(marker)
          })
        }

        updateMarkers()

        // Store update function for external use
        mapInstanceRef.current.updateMarkers = updateMarkers
      })
    }
  }, [])

  // Update markers when dependencies change
  useEffect(() => {
    if (mapInstanceRef.current?.updateMarkers) {
      mapInstanceRef.current.updateMarkers()
    }
  }, [households, selectedHousehold, activeFilters, onSelectHousehold])

  // Update current location marker
  useEffect(() => {
    if (mapInstanceRef.current && typeof window !== "undefined") {
      import("leaflet").then((L) => {
        const map = mapInstanceRef.current

        // Remove existing current location marker
        if (currentLocationMarkerRef.current) {
          map.removeLayer(currentLocationMarkerRef.current)
        }

        // Add new current location marker
        if (currentLocation) {
          const currentLocationIcon = L.divIcon({
            html: `<div style="
              width: 16px; 
              height: 16px; 
              background-color: #10b981; 
              border: 3px solid white; 
              border-radius: 50%; 
              box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
            "></div>`,
            className: "current-location-marker",
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })

          currentLocationMarkerRef.current = L.marker([currentLocation.lat, currentLocation.lng], {
            icon: currentLocationIcon,
          }).addTo(map)

          currentLocationMarkerRef.current.bindPopup("Your Current Location")
        }
      })
    }
  }, [currentLocation])

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />

      {/* Legend */}
      {activeFilters.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg">
          <h4 className="font-semibold text-sm mb-2">Legend</h4>
          <div className="space-y-1 text-xs">
            {activeFilters.includes("unemployment") && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>High Unemployment</span>
              </div>
            )}
            {activeFilters.includes("poverty") && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Low Income</span>
              </div>
            )}
            {activeFilters.includes("literacy") && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Low Literacy</span>
              </div>
            )}
            {activeFilters.includes("voter-id") && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Missing Voter ID</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Your Location</span>
            </div>
          </div>
        </div>
      )}

      {/* Map Attribution */}
      <div className="absolute bottom-1 left-1 text-xs text-gray-500 bg-white bg-opacity-75 px-1 rounded">
        © OpenStreetMap contributors
      </div>
    </div>
  )
}
