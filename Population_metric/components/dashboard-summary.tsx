"use client"

import { useState } from "react"
import { BarChart3, ChevronUp, Users, GraduationCap, Briefcase, Vote, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { Household } from "@/app/page"

interface DashboardSummaryProps {
  households: Household[]
}

export function DashboardSummary({ households }: DashboardSummaryProps) {
  const [isOpen, setIsOpen] = useState(false)

  const stats = {
    totalHouseholds: households.length,
    totalPopulation: households.reduce((sum, h) => sum + h.totalResidents, 0),
    literacyRate:
      households.length > 0
        ? Math.round(
            (households.reduce((sum, h) => sum + h.literateAdults, 0) /
              households.reduce((sum, h) => sum + h.totalResidents, 0)) *
              100,
          )
        : 0,
    unemploymentRate:
      households.length > 0
        ? Math.round(
            (households.reduce((sum, h) => sum + h.unemployed, 0) /
              households.reduce((sum, h) => sum + h.employed + h.unemployed, 0)) *
              100,
          )
        : 0,
    missingVoterIds: households.filter((h) => !h.voterIdAvailable).length,
    pendingSync: households.filter((h) => h.syncStatus === "pending" || h.syncStatus === "offline").length,
    averageIncome: "₹35,000", // Simplified calculation
    surveyProgress: Math.round((households.filter((h) => h.houseNumber).length / Math.max(households.length, 1)) * 100),
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="bg-white shadow-md">
          <BarChart3 className="h-4 w-4 mr-2" />
          Dashboard Summary
          {stats.pendingSync > 0 && (
            <Badge variant="destructive" className="ml-2">
              {stats.pendingSync} pending
            </Badge>
          )}
          <ChevronUp className="h-4 w-4 ml-2 transition-transform group-data-[state=open]:rotate-180" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="mt-2 w-80 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              Survey Statistics
              <Badge variant={stats.pendingSync === 0 ? "default" : "destructive"}>
                {stats.pendingSync === 0 ? (
                  <>
                    <Wifi className="h-3 w-3 mr-1" />
                    Synced
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3 mr-1" />
                    {stats.pendingSync} Pending
                  </>
                )}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="h-4 w-4 text-blue-500 mr-1" />
                </div>
                <div className="text-2xl font-bold">{stats.totalHouseholds}</div>
                <div className="text-xs text-muted-foreground">Households</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="h-4 w-4 text-green-500 mr-1" />
                </div>
                <div className="text-2xl font-bold">{stats.totalPopulation}</div>
                <div className="text-xs text-muted-foreground">Population</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <BarChart3 className="h-3 w-3 text-blue-500 mr-1" />
                    <span className="text-xs">Survey Progress</span>
                  </div>
                  <span className="text-xs font-semibold">{stats.surveyProgress}%</span>
                </div>
                <Progress value={stats.surveyProgress} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <GraduationCap className="h-3 w-3 text-blue-500 mr-1" />
                    <span className="text-xs">Literacy Rate</span>
                  </div>
                  <span className="text-xs font-semibold">{stats.literacyRate}%</span>
                </div>
                <Progress value={stats.literacyRate} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <Briefcase className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-xs">Unemployment Rate</span>
                  </div>
                  <span className="text-xs font-semibold">{stats.unemploymentRate}%</span>
                </div>
                <Progress value={stats.unemploymentRate} className="h-2" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Vote className="h-3 w-3 text-purple-500 mr-1" />
                  <span className="text-xs">Missing Voter IDs</span>
                </div>
                <span className="text-xs font-semibold">{stats.missingVoterIds}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs">Average Income</span>
                <span className="text-xs font-semibold">{stats.averageIncome}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}
