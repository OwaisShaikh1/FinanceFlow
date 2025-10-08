"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Calculator } from "lucide-react"
import { ENDPOINTS } from "@/lib/config"

const tdsRates = [
  { section: "194A", description: "Interest on Securities", rate: 10, threshold: 50000, seniorThreshold: 100000 },
  { section: "194C", description: "Payments to contractors", rate: 1, threshold: 30000 },
  { section: "194J", description: "Professional/technical services", rate: 10, threshold: 50000 }, // Updated April 2025
  { section: "194I", description: "Rent payments", rate: 10, threshold: 240000 },
  { section: "194H", description: "Commission/brokerage", rate: 5, threshold: 15000 },
  { section: "194K", description: "Dividend Payments", rate: 10, threshold: 10000 }, // Updated April 2025
  { section: "194B", description: "Winnings from Lottery", rate: 30, threshold: 10000 },
  { section: "194D", description: "Insurance Commission", rate: 5, threshold: 15000 },
]

interface TDSCalculatorProps {
  onTDSRecorded?: () => void;
}

export function TDSCalculator({ onTDSRecorded }: TDSCalculatorProps) {
  const [amount, setAmount] = useState<number>(0)
  const [selectedSection, setSelectedSection] = useState<string>("")
  const [panAvailable, setPanAvailable] = useState<boolean>(true)
  const [payeeType, setPayeeType] = useState<string>("Individual")
  const [isSeniorCitizen, setIsSeniorCitizen] = useState<boolean>(false)
  const [payeeName, setPayeeName] = useState<string>("")
  const [payeePan, setPayeePan] = useState<string>("")
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [recordingResult, setRecordingResult] = useState<any>(null)

  const getTDSDetails = () => {
    const section = tdsRates.find((rate) => rate.section === selectedSection)
    if (!section) return { 
      rate: 0, 
      threshold: 0, 
      description: "",
      tdsAmount: 0,
      netAmount: 0,
      applicable: false
    }

    // Determine applicable threshold based on section and payee type
    let applicableThreshold = section.threshold
    if (section.section === "194A" && isSeniorCitizen) {
      applicableThreshold = section.seniorThreshold || section.threshold
    }

    // Determine rate based on section, payee type, and PAN availability
    let applicableRate = section.rate
    if (section.section === "194C" && payeeType === "Company") {
      applicableRate = 2 // Companies have 2% rate for contractors
    }
    if (!panAvailable) {
      applicableRate = applicableRate * 2 // Double rate if no PAN
    }

    const isApplicable = amount > applicableThreshold
    const tdsAmount = isApplicable ? (amount * applicableRate) / 100 : 0
    const netAmount = amount - tdsAmount

    return {
      ...section,
      rate: applicableRate,
      threshold: applicableThreshold,
      tdsAmount,
      netAmount,
      applicable: isApplicable,
    }
  }

  const tdsDetails = getTDSDetails()

  const recordTDSDeduction = async () => {
    if (!payeeName || amount <= 0 || !selectedSection) {
      return
    }

    setIsRecording(true)
    setRecordingResult(null)

    try {
      const response = await fetch(ENDPOINTS.TDS.RECORD_DEDUCTION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payeeName,
          payeePAN: payeePan || null,
          payeeType,
          paymentAmount: amount,
          paymentDate: new Date().toISOString(),
          tdsSection: selectedSection,
          isSeniorCitizen,
          remarks: `TDS calculated via calculator for ${tdsDetails.description}`
        }),
      })

      const data = await response.json()

      if (data.success) {
        setRecordingResult(data.data)
        // Reset form
        setPayeeName("")
        setPayeePan("")
        setAmount(0)
        setSelectedSection("")
        
        // Call the callback to refresh the dashboard
        if (onTDSRecorded) {
          onTDSRecorded();
        }
      } else {
        console.error('Failed to record TDS:', data.message)
      }
    } catch (error) {
      console.error('Error recording TDS:', error)
    } finally {
      setIsRecording(false)
    }
  }

  return (
    <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Calculator className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-purple-900">TDS Calculator</CardTitle>
            <p className="text-sm text-purple-700 mt-1">Calculate and record TDS deductions</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payeeName" className="text-sm font-medium">Payee Name</Label>
              <Input
                id="payeeName"
                type="text"
                placeholder="Enter payee name"
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
                className="bg-white border-purple-200 hover:border-purple-300"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payeePan" className="text-sm font-medium">Payee PAN</Label>
              <Input
                id="payeePan"
                type="text"
                placeholder="ABCDE1234F"
                value={payeePan}
                onChange={(e) => {
                  setPayeePan(e.target.value)
                  setPanAvailable(e.target.value.length === 10)
                }}
                className="bg-white border-purple-200 hover:border-purple-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">Payment Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter payment amount"
              value={amount || ""}
              onChange={(e) => setAmount(Number.parseFloat(e.target.value) || 0)}
              className="bg-white border-purple-200 hover:border-purple-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="section" className="text-sm font-medium">TDS Section</Label>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="bg-white border-purple-200 hover:border-purple-300">
                <SelectValue placeholder="Select TDS section" />
              </SelectTrigger>
              <SelectContent>
                {tdsRates.map((rate) => (
                  <SelectItem key={rate.section} value={rate.section}>
                    {rate.section} - {rate.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Payee Type</Label>
              <Select value={payeeType} onValueChange={setPayeeType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Company">Company</SelectItem>
                  <SelectItem value="HUF">HUF</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Senior Citizen Status</Label>
              <Select
                value={isSeniorCitizen ? "yes" : "no"}
                onValueChange={(value) => setIsSeniorCitizen(value === "yes")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">Regular Citizen</SelectItem>
                  <SelectItem value="yes">Senior Citizen (60+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!panAvailable && payeePan.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 font-medium">⚠️ Invalid PAN format - Higher TDS rate will be applied</p>
            </div>
          )}
        </div>

        {selectedSection && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-lg">TDS Calculation Result</h3>
            
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-gray-600">Payee:</span>
                <span className="font-medium">{payeeName || "Not specified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Section:</span>
                <span className="font-medium">{selectedSection} - {tdsDetails.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Amount:</span>
                <span className="font-medium">₹{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Applicable Threshold:</span>
                <span className="font-medium">₹{tdsDetails.threshold.toLocaleString()}
                  {selectedSection === "194A" && isSeniorCitizen && <span className="text-xs text-blue-600 ml-1">(Senior Citizen)</span>}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TDS Rate:</span>
                <span className="font-medium">{tdsDetails.rate}%
                  {!panAvailable && <span className="text-xs text-red-600 ml-1">(No PAN)</span>}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600 font-medium">TDS Amount:</span>
                <span className="font-bold text-red-600">₹{tdsDetails.tdsAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Net Payment:</span>
                <span className="text-green-600">₹{tdsDetails.netAmount.toFixed(2)}</span>
              </div>
            </div>

            {!tdsDetails.applicable && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  ✅ TDS not applicable - Amount ₹{amount.toLocaleString()} is below threshold of ₹{tdsDetails.threshold.toLocaleString()}
                </p>
              </div>
            )}

            {tdsDetails.applicable && selectedSection === "194A" && isSeniorCitizen && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  ℹ️ Senior Citizen benefit applied - Higher threshold of ₹{tdsDetails.threshold.toLocaleString()} used (Updated April 2025)
                </p>
              </div>
            )}

            {!panAvailable && tdsDetails.applicable && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium">
                  ⚠️ Higher TDS rate ({tdsDetails.rate}%) applied due to invalid/unavailable PAN
                </p>
              </div>
            )}

            {(selectedSection === "194A" || selectedSection === "194J" || selectedSection === "194K") && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800 font-medium">
                  🆕 Updated Thresholds (April 2025): 
                  {selectedSection === "194A" && " Interest threshold increased to ₹50,000 (₹1,00,000 for Senior Citizens)"}
                  {selectedSection === "194J" && " Professional services threshold increased to ₹50,000"}
                  {selectedSection === "194K" && " Dividend threshold increased to ₹10,000"}
                </p>
              </div>
            )}

            <Button 
              className="w-full" 
              disabled={!payeeName || amount <= 0 || !selectedSection || isRecording}
              onClick={recordTDSDeduction}
            >
              {isRecording ? "Recording..." : "Record TDS Deduction"}
            </Button>

            {recordingResult && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-600">✅</span>
                  <h4 className="font-semibold text-green-800">TDS Deduction Recorded Successfully!</h4>
                </div>
                <div className="text-sm space-y-1 text-green-700">
                  <p><strong>Payee:</strong> {recordingResult.payeeName}</p>
                  <p><strong>TDS Amount:</strong> ₹{recordingResult.tdsAmount?.toLocaleString()}</p>
                  <p><strong>Net Payment:</strong> ₹{recordingResult.netPayment?.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
