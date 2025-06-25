"use client"

export async function exportToExcel(data: any[], fields: string[], filename: string) {
  // Dynamic import to avoid SSR issues
  const XLSX = await import("xlsx")

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new()

  // Prepare data with proper headers
  const headers = fields.map((field) => {
    const fieldLabels: Record<string, string> = {
      houseNumber: "House Number",
      address: "Address",
      headOfHousehold: "Head of Household",
      totalResidents: "Total Residents",
      caste: "Caste Category",
      religion: "Religion",
      language: "Language",
      houseType: "House Type",
      employed: "Employed Persons",
      unemployed: "Unemployed Persons",
      occupation: "Primary Occupation",
      monthlyIncome: "Monthly Income",
      welfareSchemes: "Welfare Schemes",
      totalChildren: "Total Children",
      childrenUnder5: "Children Under 5",
      childrenInSchool: "Children in School",
      literateAdults: "Literate Adults",
      highestEducation: "Highest Education",
      dropouts: "School Dropouts",
      hasToilet: "Has Toilet",
      hasCleanWater: "Has Clean Water",
      hasChronicIllness: "Chronic Illness",
      voterIdAvailable: "Voter ID Available",
      aadhaarAvailable: "Aadhaar Available",
      eligibleVotersListed: "Eligible Voters Listed",
      pollingBooth: "Polling Booth",
      voterListIssues: "Voter List Issues",
      surveyedBy: "Surveyed By",
      surveyDate: "Survey Date",
      lat: "Latitude",
      lng: "Longitude",
    }
    return fieldLabels[field] || field
  })

  // Prepare rows
  const rows = data.map((item) => {
    const row: any = {}
    fields.forEach((field, index) => {
      let value = item[field]

      // Format specific field types
      if (typeof value === "boolean") {
        value = value ? "Yes" : "No"
      } else if (field === "surveyDate" && value) {
        value = new Date(value).toLocaleDateString()
      } else if (value === null || value === undefined) {
        value = ""
      }

      row[headers[index]] = value
    })
    return row
  })

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(rows)

  // Auto-size columns
  const colWidths = headers.map((header) => ({
    wch: Math.max(header.length, 15),
  }))
  ws["!cols"] = colWidths

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Population Data")

  // Save file
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

export async function exportToPDF(data: any[], fields: string[], filename: string) {
  // Dynamic import to avoid SSR issues
  const jsPDF = (await import("jspdf")).default
  require("jspdf-autotable")

  const doc = new jsPDF("landscape")

  // Add title
  doc.setFontSize(16)
  doc.text("Population Survey Data", 14, 15)

  // Add metadata
  doc.setFontSize(10)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25)
  doc.text(`Total Records: ${data.length}`, 14, 30)

  // Prepare headers
  const headers = fields.map((field) => {
    const fieldLabels: Record<string, string> = {
      houseNumber: "House No.",
      address: "Address",
      headOfHousehold: "Head of Household",
      totalResidents: "Residents",
      caste: "Caste",
      religion: "Religion",
      language: "Language",
      houseType: "House Type",
      employed: "Employed",
      unemployed: "Unemployed",
      occupation: "Occupation",
      monthlyIncome: "Income",
      welfareSchemes: "Welfare Schemes",
      totalChildren: "Children",
      childrenUnder5: "Under 5",
      childrenInSchool: "In School",
      literateAdults: "Literate",
      highestEducation: "Education",
      dropouts: "Dropouts",
      hasToilet: "Toilet",
      hasCleanWater: "Water",
      hasChronicIllness: "Illness",
      voterIdAvailable: "Voter ID",
      aadhaarAvailable: "Aadhaar",
      eligibleVotersListed: "Listed",
      pollingBooth: "Booth",
      voterListIssues: "Issues",
      surveyedBy: "Surveyed By",
      surveyDate: "Date",
      lat: "Latitude",
      lng: "Longitude",
    }
    return fieldLabels[field] || field
  })

  // Prepare rows
  const rows = data.map((item) => {
    return fields.map((field) => {
      let value = item[field]

      // Format specific field types
      if (typeof value === "boolean") {
        value = value ? "Yes" : "No"
      } else if (field === "surveyDate" && value) {
        value = new Date(value).toLocaleDateString()
      } else if (value === null || value === undefined) {
        value = ""
      } else if (typeof value === "string" && value.length > 20) {
        value = value.substring(0, 17) + "..."
      }

      return String(value)
    })
  })

  // Add table
  ;(doc as any).autoTable({
    head: [headers],
    body: rows,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 40, right: 14, bottom: 20, left: 14 },
  })

  // Save file
  doc.save(`${filename}.pdf`)
}
