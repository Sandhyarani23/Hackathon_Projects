"use client"

import { MapPin, Navigation, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface GPSTrackerProps {
  currentLocation: { lat: number; lng: number } | null
  accuracy: number | null
  isTracking: boolean
  onStartTracking: () => void
  onStopTracking: () => void
  onAddHousehold: () => void
}

export function GPSTracker({
  currentLocation,
  accuracy,
  isTracking,
  onStartTracking,
  onStopTracking,
  onAddHousehold,
}: GPSTrackerProps) {
  const formatCoordinate = (coord: number) => coord.toFixed(6)

  return (
    <Card className="w-64">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <MapPin className={`h-4 w-4 ${isTracking ? "text-green-500" : "text-gray-400"}`} />
            <span className="text-sm font-medium">GPS Tracker</span>
          </div>
          <Button
            variant={isTracking ? "destructive" : "default"}
            size="sm"
            onClick={isTracking ? onStopTracking : onStartTracking}
          >
            <Navigation className="h-3 w-3 mr-1" />
            {isTracking ? "Stop" : "Start"}
          </Button>
        </div>

        {currentLocation ? (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              <div>Lat: {formatCoordinate(currentLocation.lat)}</div>
              <div>Lng: {formatCoordinate(currentLocation.lng)}</div>
              {accuracy && <div>Accuracy: ±{Math.round(accuracy)}m</div>}
            </div>
            <Button onClick={onAddHousehold} size="sm" className="w-full" disabled={!isTracking}>
              <Plus className="h-3 w-3 mr-1" />
              Add House Here
            </Button>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            {isTracking ? "Getting location..." : "Location not available"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
