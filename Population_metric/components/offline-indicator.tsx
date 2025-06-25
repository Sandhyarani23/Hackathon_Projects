"use client"

import { Wifi, WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface OfflineIndicatorProps {
  isOnline: boolean
}

export function OfflineIndicator({ isOnline }: OfflineIndicatorProps) {
  return (
    <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-1">
      {isOnline ? (
        <>
          <Wifi className="h-3 w-3" />
          Online
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          Offline
        </>
      )}
    </Badge>
  )
}
