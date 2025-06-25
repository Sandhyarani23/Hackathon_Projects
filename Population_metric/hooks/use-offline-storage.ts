"use client"

import { useState, useEffect, useCallback } from "react"
import type { Household } from "@/app/page"

const STORAGE_KEY = "population_dashboard_data"
const SYNC_STATUS_KEY = "population_dashboard_sync"

export function useOfflineStorage() {
  const [households, setHouseholds] = useState<Household[]>([])
  const [isOnline, setIsOnline] = useState(true)
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)

  // Initialize data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setHouseholds(parsedData)
      } catch (error) {
        console.error("Error parsing saved data:", error)
      }
    }

    const savedSyncTime = localStorage.getItem(SYNC_STATUS_KEY)
    if (savedSyncTime) {
      setLastSyncTime(savedSyncTime)
    }

    // Initialize with sample data if no data exists
    if (!savedData) {
      const sampleData: Household[] = [
        {
          id: "sample_1",
          lat: 28.6139,
          lng: 77.209,
          houseNumber: "A-101",
          address: "Sector 15, Dwarka, New Delhi",
          headOfHousehold: "Rajesh Kumar",
          caste: "General",
          religion: "Hindu",
          language: "Hindi",
          totalResidents: 4,
          houseType: "owned",
          employed: 2,
          unemployed: 0,
          occupation: "govt-employee",
          monthlyIncome: "50000-75000",
          welfareSchemes: ["PDS"],
          totalChildren: 2,
          childrenUnder5: 1,
          childrenInSchool: 1,
          literateAdults: 2,
          highestEducation: "Graduate",
          dropouts: 0,
          hasToilet: true,
          hasCleanWater: true,
          hasChronicIllness: false,
          voterIdAvailable: true,
          aadhaarAvailable: true,
          eligibleVotersListed: true,
          pollingBooth: "Booth 101",
          voterListIssues: "",
          surveyedBy: "Field Agent 1",
          surveyDate: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          syncStatus: "synced",
          residents: [
            {
              name: "Rajesh Kumar",
              age: 35,
              gender: "Male",
              relation: "Head",
              hasVoterId: true,
              education: "Graduate",
              employment: "Employed",
            },
            {
              name: "Priya Kumar",
              age: 32,
              gender: "Female",
              relation: "Wife",
              hasVoterId: true,
              education: "Graduate",
              employment: "Employed",
            },
          ],
        },
      ]
      setHouseholds(sampleData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData))
    }
  }, [])

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Set initial status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Save to localStorage whenever households change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(households))
  }, [households])

  const updateHousehold = useCallback((updatedHousehold: Household) => {
    setHouseholds((prev) => prev.map((h) => (h.id === updatedHousehold.id ? updatedHousehold : h)))
  }, [])

  const addHousehold = useCallback((newHousehold: Household) => {
    setHouseholds((prev) => [...prev, newHousehold])
  }, [])

  const deleteHousehold = useCallback((householdId: string) => {
    setHouseholds((prev) => prev.filter((h) => h.id !== householdId))
  }, [])

  const syncData = useCallback(async () => {
    if (!isOnline) return

    try {
      // In a real app, this would sync with a server
      // For now, we'll just mark all pending items as synced
      const updatedHouseholds = households.map((h) => ({
        ...h,
        syncStatus: "synced" as const,
      }))

      setHouseholds(updatedHouseholds)
      setLastSyncTime(new Date().toISOString())
      localStorage.setItem(SYNC_STATUS_KEY, new Date().toISOString())

      console.log("Data synced successfully")
    } catch (error) {
      console.error("Sync failed:", error)
    }
  }, [households, isOnline])

  const getPendingSyncCount = useCallback(() => {
    return households.filter((h) => h.syncStatus === "pending" || h.syncStatus === "offline").length
  }, [households])

  return {
    households,
    isOnline,
    lastSyncTime,
    updateHousehold,
    addHousehold,
    deleteHousehold,
    syncData,
    getPendingSyncCount,
  }
}
