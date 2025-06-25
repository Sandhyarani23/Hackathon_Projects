"use client"

import { useState } from "react"
import { X, Download, FileSpreadsheet, FileText, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Household, MapBounds } from "@/app/page"
import { exportToExcel, exportToPDF } from "@/utils/export-utils"

interface ExportPanelProps {
  households: Household[]
  mapBounds: MapBounds | null
  onClose: () => void
}

export function ExportPanel({ households, mapBounds, onClose }: ExportPanelProps) {
  const [exportType, setExportType] = useState<"excel" | "pdf">("excel")
  const [exportScope, setExportScope] = useState<"all" | "visible" | "selected">("all")
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "houseNumber",
    "address",
    "headOfHousehold",
    "totalResidents",
    "caste",
    "religion",
  ])

  const availableFields = [
    { id: "houseNumber", label: "House Number", category: "basic" },
    { id: "address", label: "Address", category: "basic" },
    { id: "headOfHousehold", label: "Head of Household", category: "basic" },
    { id: "totalResidents", label: "Total Residents", category: "basic" },
    { id: "caste", label: "Caste Category", category: "basic" },
    { id: "religion", label: "Religion", category: "basic" },
    { id: "language", label: "Language", category: "basic" },
    { id: "houseType", label: "House Type", category: "basic" },
    { id: "employed", label: "Employed Persons", category: "employment" },
    { id: "unemployed", label: "Unemployed Persons", category: "employment" },
    { id: "occupation", label: "Primary Occupation", category: "employment" },
    { id: "monthlyIncome", label: "Monthly Income", category: "employment" },
    { id: "welfareSchemes", label: "Welfare Schemes", category: "employment" },
    { id: "totalChildren", label: "Total Children", category: "education" },
    { id: "childrenUnder5", label: "Children Under 5", category: "education" },
    { id: "childrenInSchool", label: "Children in School", category: "education" },
    { id: "literateAdults", label: "Literate Adults", category: "education" },
    { id: "highestEducation", label: "Highest Education", category: "education" },
    { id: "dropouts", label: "School Dropouts", category: "education" },
    { id: "hasToilet", label: "Has Toilet", category: "health" },
    { id: "hasCleanWater", label: "Has Clean Water", category: "health" },
    { id: "hasChronicIllness", label: "Chronic Illness", category: "health" },
    { id: "voterIdAvailable", label: "Voter ID Available", category: "electoral" },
    { id: "aadhaarAvailable", label: "Aadhaar Available", category: "electoral" },
    { id: "eligibleVotersListed", label: "Eligible Voters Listed", category: "electoral" },
    { id: "pollingBooth", label: "Polling Booth", category: "electoral" },
    { id: "voterListIssues", label: "Voter List Issues", category: "electoral" },
    { id: "surveyedBy", label: "Surveyed By", category: "meta" },
    { id: "surveyDate", label: "Survey Date", category: "meta" },
    { id: "lat", label: "Latitude", category: "location" },
    { id: "lng", label: "Longitude", category: "location" },
  ]

  const fieldCategories = {
    basic: "Basic Information",
    employment: "Employment & Income",
    education: "Education",
    health: "Health & Sanitation",
    electoral: "Electoral Information",
    meta: "Survey Metadata",
    location: "Location Data",
  }

  const toggleField = (fieldId: string) => {
    setSelectedFields((prev) => (prev.includes(fieldId) ? prev.filter((f) => f !== fieldId) : [...prev, fieldId]))
  }

  const selectAllFields = (category?: string) => {
    if (category) {
      const categoryFields = availableFields.filter((f) => f.category === category).map((f) => f.id)
      setSelectedFields((prev) => [...new Set([...prev, ...categoryFields])])
    } else {
      setSelectedFields(availableFields.map((f) => f.id))
    }
  }

  const deselectAllFields = (category?: string) => {
    if (category) {
      const categoryFields = availableFields.filter((f) => f.category === category).map((f) => f.id)
      setSelectedFields((prev) => prev.filter((f) => !categoryFields.includes(f)))
    } else {
      setSelectedFields([])
    }
  }

  const getFilteredHouseholds = () => {
    switch (exportScope) {
      case "visible":
        if (!mapBounds) return households
        return households.filter(
          (h) =>
            h.lat >= mapBounds.south && h.lat <= mapBounds.north && h.lng >= mapBounds.west && h.lng <= mapBounds.east,
        )
      case "selected":
        // For now, return all households. In a real app, you'd track selected households
        return households
      default:
        return households
    }
  }

  const handleExport = async () => {
    const filteredHouseholds = getFilteredHouseholds()
    const exportData = filteredHouseholds.map((household) => {
      const data: any = {}
      selectedFields.forEach((field) => {
        if (field === "welfareSchemes") {
          data[field] = household[field].join(", ")
        } else {
          data[field] = household[field as keyof Household]
        }
      })
      return data
    })

    try {
      if (exportType === "excel") {
        await exportToExcel(exportData, selectedFields, `population_data_${new Date().toISOString().split("T")[0]}`)
      } else {
        await exportToPDF(exportData, selectedFields, `population_data_${new Date().toISOString().split("T")[0]}`)
      }
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Population Data
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="scope" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="scope">Export Scope</TabsTrigger>
              <TabsTrigger value="fields">Select Fields</TabsTrigger>
              <TabsTrigger value="format">Format & Export</TabsTrigger>
            </TabsList>

            <TabsContent value="scope" className="space-y-4">
              <div>
                <Label className="text-base font-medium">Data Scope</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="all"
                      name="scope"
                      checked={exportScope === "all"}
                      onChange={() => setExportScope("all")}
                    />
                    <Label htmlFor="all">All Households ({households.length} records)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="visible"
                      name="scope"
                      checked={exportScope === "visible"}
                      onChange={() => setExportScope("visible")}
                    />
                    <Label htmlFor="visible">
                      <Map className="h-4 w-4 inline mr-1" />
                      Visible on Map ({getFilteredHouseholds().length} records)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="selected"
                      name="scope"
                      checked={exportScope === "selected"}
                      onChange={() => setExportScope("selected")}
                    />
                    <Label htmlFor="selected">Selected Households (Feature coming soon)</Label>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fields" className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-medium">Select Fields to Export</Label>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => selectAllFields()}>
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deselectAllFields()}>
                    Deselect All
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(fieldCategories).map(([category, label]) => (
                  <div key={category} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">{label}</h4>
                      <div className="space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => selectAllFields(category)}>
                          Select All
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deselectAllFields(category)}>
                          Deselect All
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {availableFields
                        .filter((field) => field.category === category)
                        .map((field) => (
                          <div key={field.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={field.id}
                              checked={selectedFields.includes(field.id)}
                              onCheckedChange={() => toggleField(field.id)}
                            />
                            <Label htmlFor={field.id} className="text-sm">
                              {field.label}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="format" className="space-y-4">
              <div>
                <Label className="text-base font-medium">Export Format</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="excel"
                      name="format"
                      checked={exportType === "excel"}
                      onChange={() => setExportType("excel")}
                    />
                    <Label htmlFor="excel" className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-green-600" />
                      Excel (.xlsx) - Best for data analysis
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="pdf"
                      name="format"
                      checked={exportType === "pdf"}
                      onChange={() => setExportType("pdf")}
                    />
                    <Label htmlFor="pdf" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-red-600" />
                      PDF - Best for reports and printing
                    </Label>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Export Summary</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Records: {getFilteredHouseholds().length}</div>
                  <div>Fields: {selectedFields.length}</div>
                  <div>Format: {exportType.toUpperCase()}</div>
                  <div>
                    Scope:{" "}
                    {exportScope === "all"
                      ? "All households"
                      : exportScope === "visible"
                        ? "Visible on map"
                        : "Selected households"}
                  </div>
                </div>
              </div>

              <Button onClick={handleExport} className="w-full" disabled={selectedFields.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export {exportType.toUpperCase()}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
