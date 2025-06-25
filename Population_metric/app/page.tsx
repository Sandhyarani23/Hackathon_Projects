"use client"

import { useState, useEffect } from "react"
import { MapView } from "@/components/map-view"
import { HouseholdPanel } from "@/components/household-panel"
import { ControlPanel } from "@/components/control-panel"
import { DashboardSummary } from "@/components/dashboard-summary"
import { SearchBar } from "@/components/search-bar"
import { ExportPanel } from "@/components/export-panel"
import { OfflineIndicator } from "@/components/offline-indicator"
import { GPSTracker } from "@/components/gps-tracker"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useOfflineStorage } from "@/hooks/use-offline-storage"
import { useGPS } from "@/hooks/use-gps"

export interface Household {
  id: string
  lat: number
  lng: number
  houseNumber: string
  address: string
  headOfHousehold: string
  caste: string
  religion: string
  language: string
  totalResidents: number
  houseType: string
  employed: number
  unemployed: number
  occupation: string
  monthlyIncome: string
  welfareSchemes: string[]
  totalChildren: number
  childrenUnder5: number
  childrenInSchool: number
  literateAdults: number
  highestEducation: string
  dropouts: number
  hasToilet: boolean
  hasCleanWater: boolean
  hasChronicIllness: boolean
  voterIdAvailable: boolean
  aadhaarAvailable: boolean
  eligibleVotersListed: boolean
  pollingBooth: string
  voterListIssues: string
  surveyedBy: string
  surveyDate: string
  lastModified: string
  syncStatus: "synced" | "pending" | "offline"
  residents: Array<{
    name: string
    age: number
    gender: string
    relation: string
    hasVoterId: boolean
    education: string
    employment: string
    phoneNumber?: string
    aadhaarNumber?: string
  }>
}

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

export default function PopulationDashboard() {
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null)
  const [isExportPanelOpen, setIsExportPanelOpen] = useState(false)

  const { households, updateHousehold, addHousehold, isOnline, syncData } = useOfflineStorage()
  const { currentLocation, accuracy, isTracking, startTracking, stopTracking } = useGPS()

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline) {
      // we don’t include `syncData` in deps to avoid an infinite loop
      syncData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline])

  const handleAddNewHousehold = () => {
    if (currentLocation) {
      const newHousehold: Household = {
        id: `house_${Date.now()}`,
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        houseNumber: "",
        address: "",
        headOfHousehold: "",
        caste: "General",
        religion: "",
        language: "",
        totalResidents: 0,
        houseType: "owned",
        employed: 0,
        unemployed: 0,
        occupation: "",
        monthlyIncome: "",
        welfareSchemes: [],
        totalChildren: 0,
        childrenUnder5: 0,
        childrenInSchool: 0,
        literateAdults: 0,
        highestEducation: "",
        dropouts: 0,
        hasToilet: false,
        hasCleanWater: false,
        hasChronicIllness: false,
        voterIdAvailable: false,
        aadhaarAvailable: false,
        eligibleVotersListed: false,
        pollingBooth: "",
        voterListIssues: "",
        surveyedBy: "Field Agent", // This would come from auth
        surveyDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        syncStatus: "offline",
        residents: [],
      }
      addHousehold(newHousehold)
      setSelectedHousehold(newHousehold)
    }
  }

  return (
    <SidebarProvider>
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="bg-white border-b border-border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-primary">Population Dashboard</h1>
                <p className="text-sm text-muted-foreground">Election Commission Field Agent Portal</p>
              </div>
              <OfflineIndicator isOnline={isOnline} />
            </div>
            <div className="flex items-center gap-4">
              <GPSTracker
                currentLocation={currentLocation}
                accuracy={accuracy}
                isTracking={isTracking}
                onStartTracking={startTracking}
                onStopTracking={stopTracking}
                onAddHousehold={handleAddNewHousehold}
              />
              <SearchBar households={households} onSelectHousehold={setSelectedHousehold} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex relative">
          {/* Map */}
          <div className="flex-1 relative">
            <MapView
              households={households}
              selectedHousehold={selectedHousehold}
              onSelectHousehold={setSelectedHousehold}
              activeFilters={activeFilters}
              currentLocation={currentLocation}
              onBoundsChange={setMapBounds}
            />

            {/* Floating Controls */}
            <div className="absolute top-4 left-4 z-10 space-y-2">
              <ControlPanel activeFilters={activeFilters} onFiltersChange={setActiveFilters} />
              <button
                onClick={() => setIsExportPanelOpen(true)}
                className="bg-white shadow-md px-4 py-2 rounded-md border border-border hover:bg-gray-50 text-sm font-medium"
              >
                📊 Export Data
              </button>
            </div>

            {/* Dashboard Summary */}
            <div className="absolute bottom-4 left-4 z-10">
              <DashboardSummary households={households} />
            </div>
          </div>

          {/* Side Panel */}
          {selectedHousehold && (
            <HouseholdPanel
              household={selectedHousehold}
              onUpdate={updateHousehold}
              onClose={() => setSelectedHousehold(null)}
              currentLocation={currentLocation}
            />
          )}
        </div>

        {/* Export Panel */}
        {isExportPanelOpen && (
          <ExportPanel households={households} mapBounds={mapBounds} onClose={() => setIsExportPanelOpen(false)} />
        )}
      </div>
    </SidebarProvider>
  )
}
