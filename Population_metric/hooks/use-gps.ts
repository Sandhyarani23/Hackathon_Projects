"use client"

import { useState, useEffect, useCallback } from "react"

interface GPSLocation {
  lat: number
  lng: number
}

export function useGPS() {
  const [currentLocation, setCurrentLocation] = useState<GPSLocation | null>(null)
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      return
    }

    setIsTracking(true)
    setError(null)

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute
    }

    const successCallback = (position: GeolocationPosition) => {
      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
      setAccuracy(position.coords.accuracy)
      setError(null)
    }

    const errorCallback = (error: GeolocationPositionError) => {
      setError(`GPS Error: ${error.message}`)
      setIsTracking(false)
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options)

    // Start watching position
    const id = navigator.geolocation.watchPosition(successCallback, errorCallback, options)
    setWatchId(id)
  }, [])

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
    setIsTracking(false)
  }, [watchId])

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId])

  return {
    currentLocation,
    accuracy,
    isTracking,
    error,
    startTracking,
    stopTracking,
  }
}
