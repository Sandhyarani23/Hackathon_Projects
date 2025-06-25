"use client"

import { useState } from "react"
import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Household } from "@/app/page"

interface SearchBarProps {
  households: Household[]
  onSelectHousehold: (household: Household) => void
}

export function SearchBar({ households, onSelectHousehold }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<Household[]>([])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term.length > 0) {
      const filtered = households.filter(
        (h) =>
          h.houseNumber.toLowerCase().includes(term.toLowerCase()) ||
          h.address.toLowerCase().includes(term.toLowerCase()) ||
          h.headOfHousehold.toLowerCase().includes(term.toLowerCase()) ||
          h.pollingBooth.toLowerCase().includes(term.toLowerCase()),
      )
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }

  const selectHousehold = (household: Household) => {
    onSelectHousehold(household)
    setSearchTerm("")
    setSuggestions([])
  }

  return (
    <div className="relative w-64">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search houses, addresses, names..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          {suggestions.map((household) => (
            <button
              key={household.id}
              onClick={() => selectHousehold(household)}
              className="w-full text-left px-3 py-2 hover:bg-muted text-sm border-b border-border last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">{household.houseNumber || "No house number"}</div>
                  <div className="text-xs text-muted-foreground truncate">{household.address || "No address"}</div>
                  <div className="text-xs text-muted-foreground">{household.headOfHousehold || "No name"}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={household.syncStatus === "synced" ? "default" : "secondary"} className="text-xs">
                    {household.syncStatus}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {household.lat.toFixed(4)}, {household.lng.toFixed(4)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
