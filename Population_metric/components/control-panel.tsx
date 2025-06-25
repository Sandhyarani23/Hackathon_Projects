"use client"

import { useState } from "react"
import { Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ControlPanelProps {
  activeFilters: string[]
  onFiltersChange: (filters: string[]) => void
}

export function ControlPanel({ activeFilters, onFiltersChange }: ControlPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const filters = [
    {
      id: "unemployment",
      label: "Unemployment Clusters",
      color: "bg-red-500",
      description: "Houses with unemployed members",
    },
    { id: "poverty", label: "Poverty Indicators", color: "bg-orange-500", description: "Low income households" },
    { id: "literacy", label: "Literacy Levels", color: "bg-yellow-500", description: "Low literacy households" },
    { id: "voter-id", label: "Voter ID Issues", color: "bg-purple-500", description: "Missing voter IDs" },
  ]

  const toggleFilter = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter((f) => f !== filterId)
      : [...activeFilters, filterId]
    onFiltersChange(newFilters)
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="bg-white shadow-md">
          <Filter className="h-4 w-4 mr-2" />
          Map Filters
          {activeFilters.length > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
              {activeFilters.length}
            </span>
          )}
          <ChevronDown className="h-4 w-4 ml-2 transition-transform group-data-[state=open]:rotate-180" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="mt-2 w-72 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Visualization Overlays</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filters.map((filter) => (
              <div key={filter.id} className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={filter.id}
                    checked={activeFilters.includes(filter.id)}
                    onCheckedChange={() => toggleFilter(filter.id)}
                  />
                  <div className={`w-3 h-3 rounded-full ${filter.color}`}></div>
                  <Label htmlFor={filter.id} className="text-xs flex-1 font-medium">
                    {filter.label}
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground ml-5">{filter.description}</p>
              </div>
            ))}
            {activeFilters.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => onFiltersChange([])} className="w-full mt-3">
                Clear All Filters
              </Button>
            )}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}
