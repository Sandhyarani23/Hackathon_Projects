"use client"

import { useState } from "react"
import { X, Save, Users, Briefcase, GraduationCap, Heart, Vote, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { Household } from "@/app/page"

interface HouseholdPanelProps {
  household: Household
  onUpdate: (household: Household) => void
  onClose: () => void
  currentLocation: { lat: number; lng: number } | null
}

export function HouseholdPanel({ household, onUpdate, onClose, currentLocation }: HouseholdPanelProps) {
  const [formData, setFormData] = useState<Household>(household)

  const handleSave = () => {
    const updatedHousehold = {
      ...formData,
      lastModified: new Date().toISOString(),
      syncStatus: "pending" as const,
    }
    onUpdate(updatedHousehold)
  }

  const updateField = (field: keyof Household, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateCurrentLocation = () => {
    if (currentLocation) {
      updateField("lat", currentLocation.lat)
      updateField("lng", currentLocation.lng)
    }
  }

  const toggleWelfareScheme = (scheme: string) => {
    const schemes = formData.welfareSchemes.includes(scheme)
      ? formData.welfareSchemes.filter((s) => s !== scheme)
      : [...formData.welfareSchemes, scheme]
    updateField("welfareSchemes", schemes)
  }

  const addResident = () => {
    const newResident = {
      name: "",
      age: 0,
      gender: "Male",
      relation: "",
      hasVoterId: false,
      education: "",
      employment: "",
      phoneNumber: "",
      aadhaarNumber: "",
    }
    updateField("residents", [...formData.residents, newResident])
  }

  const updateResident = (index: number, field: string, value: any) => {
    const updatedResidents = [...formData.residents]
    updatedResidents[index] = { ...updatedResidents[index], [field]: value }
    updateField("residents", updatedResidents)
  }

  const removeResident = (index: number) => {
    const updatedResidents = formData.residents.filter((_, i) => i !== index)
    updateField("residents", updatedResidents)
  }

  return (
    <div className="w-96 bg-white border-l border-border h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-border bg-primary text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{formData.houseNumber || "New House"}</h2>
            <p className="text-sm opacity-90">{formData.address || "No address"}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={formData.syncStatus === "synced" ? "default" : "secondary"}>{formData.syncStatus}</Badge>
              {formData.surveyDate && (
                <span className="text-xs opacity-75">{new Date(formData.surveyDate).toLocaleDateString()}</span>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-primary/20">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic" className="text-xs">
              <Users className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="employment" className="text-xs">
              <Briefcase className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="education" className="text-xs">
              <GraduationCap className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="health" className="text-xs">
              <Heart className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="electoral" className="text-xs">
              <Vote className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="residents" className="text-xs">
              <Users className="h-3 w-3" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Basic Household Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="houseNumber" className="text-xs">
                    House Number *
                  </Label>
                  <Input
                    id="houseNumber"
                    value={formData.houseNumber}
                    onChange={(e) => updateField("houseNumber", e.target.value)}
                    className="h-8"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-xs">
                    Full Address *
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className="min-h-[60px]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="headOfHousehold" className="text-xs">
                    Head of Household *
                  </Label>
                  <Input
                    id="headOfHousehold"
                    value={formData.headOfHousehold}
                    onChange={(e) => updateField("headOfHousehold", e.target.value)}
                    className="h-8"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="caste" className="text-xs">
                      Caste Category
                    </Label>
                    <Select value={formData.caste} onValueChange={(value) => updateField("caste", value)}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="SC">SC</SelectItem>
                        <SelectItem value="ST">ST</SelectItem>
                        <SelectItem value="OBC">OBC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="religion" className="text-xs">
                      Religion
                    </Label>
                    <Input
                      id="religion"
                      value={formData.religion}
                      onChange={(e) => updateField("religion", e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="language" className="text-xs">
                      Primary Language
                    </Label>
                    <Input
                      id="language"
                      value={formData.language}
                      onChange={(e) => updateField("language", e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalResidents" className="text-xs">
                      Total Residents
                    </Label>
                    <Input
                      id="totalResidents"
                      type="number"
                      value={formData.totalResidents}
                      onChange={(e) => updateField("totalResidents", Number.parseInt(e.target.value) || 0)}
                      className="h-8"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="houseType" className="text-xs">
                    House Type
                  </Label>
                  <Select value={formData.houseType} onValueChange={(value) => updateField("houseType", value)}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owned">Owned</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="slum">Slum</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Information */}
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs font-medium">GPS Location</Label>
                    <Button variant="outline" size="sm" onClick={updateCurrentLocation} disabled={!currentLocation}>
                      <MapPin className="h-3 w-3 mr-1" />
                      Update
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="lat" className="text-xs">
                        Latitude
                      </Label>
                      <Input
                        id="lat"
                        type="number"
                        step="any"
                        value={formData.lat}
                        onChange={(e) => updateField("lat", Number.parseFloat(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lng" className="text-xs">
                        Longitude
                      </Label>
                      <Input
                        id="lng"
                        type="number"
                        step="any"
                        value={formData.lng}
                        onChange={(e) => updateField("lng", Number.parseFloat(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Employment & Income</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="employed" className="text-xs">
                      Employed Persons
                    </Label>
                    <Input
                      id="employed"
                      type="number"
                      value={formData.employed}
                      onChange={(e) => updateField("employed", Number.parseInt(e.target.value) || 0)}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unemployed" className="text-xs">
                      Unemployed Persons
                    </Label>
                    <Input
                      id="unemployed"
                      type="number"
                      value={formData.unemployed}
                      onChange={(e) => updateField("unemployed", Number.parseInt(e.target.value) || 0)}
                      className="h-8"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="occupation" className="text-xs">
                    Primary Occupation
                  </Label>
                  <Select value={formData.occupation} onValueChange={(value) => updateField("occupation", value)}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select occupation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="farmer">Farmer</SelectItem>
                      <SelectItem value="laborer">Laborer</SelectItem>
                      <SelectItem value="govt-employee">Government Employee</SelectItem>
                      <SelectItem value="self-employed">Self Employed</SelectItem>
                      <SelectItem value="private-job">Private Job</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="monthlyIncome" className="text-xs">
                    Monthly Income Range
                  </Label>
                  <Select value={formData.monthlyIncome} onValueChange={(value) => updateField("monthlyIncome", value)}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select income range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-15000">₹0 - ₹15,000</SelectItem>
                      <SelectItem value="15000-25000">₹15,000 - ₹25,000</SelectItem>
                      <SelectItem value="25000-50000">₹25,000 - ₹50,000</SelectItem>
                      <SelectItem value="50000-75000">₹50,000 - ₹75,000</SelectItem>
                      <SelectItem value="75000+">₹75,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Welfare Schemes Availed</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {["MGNREGA", "PDS", "PM-KISAN", "Ayushman Bharat", "LPG Subsidy", "PM Awas Yojana"].map(
                      (scheme) => (
                        <div key={scheme} className="flex items-center space-x-2">
                          <Checkbox
                            id={scheme}
                            checked={formData.welfareSchemes.includes(scheme)}
                            onCheckedChange={() => toggleWelfareScheme(scheme)}
                          />
                          <Label htmlFor={scheme} className="text-xs">
                            {scheme}
                          </Label>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Children & Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="totalChildren" className="text-xs">
                      Total Children
                    </Label>
                    <Input
                      id="totalChildren"
                      type="number"
                      value={formData.totalChildren}
                      onChange={(e) => updateField("totalChildren", Number.parseInt(e.target.value) || 0)}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="childrenUnder5" className="text-xs">
                      Under 5 Years
                    </Label>
                    <Input
                      id="childrenUnder5"
                      type="number"
                      value={formData.childrenUnder5}
                      onChange={(e) => updateField("childrenUnder5", Number.parseInt(e.target.value) || 0)}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="childrenInSchool" className="text-xs">
                      In School
                    </Label>
                    <Input
                      id="childrenInSchool"
                      type="number"
                      value={formData.childrenInSchool}
                      onChange={(e) => updateField("childrenInSchool", Number.parseInt(e.target.value) || 0)}
                      className="h-8"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="literateAdults" className="text-xs">
                      Literate Adults
                    </Label>
                    <Input
                      id="literateAdults"
                      type="number"
                      value={formData.literateAdults}
                      onChange={(e) => updateField("literateAdults", Number.parseInt(e.target.value) || 0)}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dropouts" className="text-xs">
                      School Dropouts
                    </Label>
                    <Input
                      id="dropouts"
                      type="number"
                      value={formData.dropouts}
                      onChange={(e) => updateField("dropouts", Number.parseInt(e.target.value) || 0)}
                      className="h-8"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="highestEducation" className="text-xs">
                    Highest Education Level in Household
                  </Label>
                  <Select
                    value={formData.highestEducation}
                    onValueChange={(value) => updateField("highestEducation", value)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Primary">Primary (1-5)</SelectItem>
                      <SelectItem value="Secondary">Secondary (6-10)</SelectItem>
                      <SelectItem value="Higher Secondary">Higher Secondary (11-12)</SelectItem>
                      <SelectItem value="Graduate">Graduate</SelectItem>
                      <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                      <SelectItem value="Professional">Professional Degree</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Health & Sanitation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasToilet"
                      checked={formData.hasToilet}
                      onCheckedChange={(checked) => updateField("hasToilet", checked)}
                    />
                    <Label htmlFor="hasToilet" className="text-xs">
                      Access to Toilet/Sanitation Facility
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasCleanWater"
                      checked={formData.hasCleanWater}
                      onCheckedChange={(checked) => updateField("hasCleanWater", checked)}
                    />
                    <Label htmlFor="hasCleanWater" className="text-xs">
                      Access to Clean Drinking Water
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasChronicIllness"
                      checked={formData.hasChronicIllness}
                      onCheckedChange={(checked) => updateField("hasChronicIllness", checked)}
                    />
                    <Label htmlFor="hasChronicIllness" className="text-xs">
                      Chronic Illness/Disabilities Present in Household
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="electoral" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Electoral & ID Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="voterIdAvailable"
                      checked={formData.voterIdAvailable}
                      onCheckedChange={(checked) => updateField("voterIdAvailable", checked)}
                    />
                    <Label htmlFor="voterIdAvailable" className="text-xs">
                      Voter ID Available for Eligible Members
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="aadhaarAvailable"
                      checked={formData.aadhaarAvailable}
                      onCheckedChange={(checked) => updateField("aadhaarAvailable", checked)}
                    />
                    <Label htmlFor="aadhaarAvailable" className="text-xs">
                      Aadhaar Card Available for All Members
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="eligibleVotersListed"
                      checked={formData.eligibleVotersListed}
                      onCheckedChange={(checked) => updateField("eligibleVotersListed", checked)}
                    />
                    <Label htmlFor="eligibleVotersListed" className="text-xs">
                      All Eligible Voters Listed on Electoral Roll
                    </Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="pollingBooth" className="text-xs">
                    Assigned Polling Booth
                  </Label>
                  <Input
                    id="pollingBooth"
                    value={formData.pollingBooth}
                    onChange={(e) => updateField("pollingBooth", e.target.value)}
                    className="h-8"
                    placeholder="e.g., Booth 101, ABC School"
                  />
                </div>
                <div>
                  <Label htmlFor="voterListIssues" className="text-xs">
                    Voter List Issues/Corrections Required
                  </Label>
                  <Textarea
                    id="voterListIssues"
                    value={formData.voterListIssues}
                    onChange={(e) => updateField("voterListIssues", e.target.value)}
                    className="min-h-[60px]"
                    placeholder="Describe any issues with voter registration, name corrections, address updates, etc."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="residents" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Household Members</CardTitle>
                  <Button variant="outline" size="sm" onClick={addResident}>
                    <Users className="h-3 w-3 mr-1" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.residents.map((resident, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Member {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeResident(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Name</Label>
                        <Input
                          value={resident.name}
                          onChange={(e) => updateResident(index, "name", e.target.value)}
                          className="h-7 text-xs"
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Age</Label>
                        <Input
                          type="number"
                          value={resident.age}
                          onChange={(e) => updateResident(index, "age", Number.parseInt(e.target.value) || 0)}
                          className="h-7 text-xs"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Gender</Label>
                        <Select
                          value={resident.gender}
                          onValueChange={(value) => updateResident(index, "gender", value)}
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Relation</Label>
                        <Input
                          value={resident.relation}
                          onChange={(e) => updateResident(index, "relation", e.target.value)}
                          className="h-7 text-xs"
                          placeholder="e.g., Head, Wife, Son"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Education</Label>
                        <Select
                          value={resident.education}
                          onValueChange={(value) => updateResident(index, "education", value)}
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="Primary">Primary</SelectItem>
                            <SelectItem value="Secondary">Secondary</SelectItem>
                            <SelectItem value="Higher Secondary">Higher Secondary</SelectItem>
                            <SelectItem value="Graduate">Graduate</SelectItem>
                            <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Employment</Label>
                        <Select
                          value={resident.employment}
                          onValueChange={(value) => updateResident(index, "employment", value)}
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Employed">Employed</SelectItem>
                            <SelectItem value="Unemployed">Unemployed</SelectItem>
                            <SelectItem value="Student">Student</SelectItem>
                            <SelectItem value="Retired">Retired</SelectItem>
                            <SelectItem value="Homemaker">Homemaker</SelectItem>
                            <SelectItem value="Child">Child</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`voterId-${index}`}
                        checked={resident.hasVoterId}
                        onCheckedChange={(checked) => updateResident(index, "hasVoterId", checked)}
                      />
                      <Label htmlFor={`voterId-${index}`} className="text-xs">
                        Has Voter ID
                      </Label>
                    </div>
                  </div>
                ))}
                {formData.residents.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-4">
                    No household members added yet. Click "Add Member" to start.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="mt-6 pt-4 border-t border-border">
          <Button onClick={handleSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Household Data
          </Button>
        </div>
      </div>
    </div>
  )
}
