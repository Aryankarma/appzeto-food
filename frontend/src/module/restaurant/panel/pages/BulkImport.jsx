import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Download,
  FileSpreadsheet,
  Sparkles,
  Settings,
  Upload,
} from "lucide-react"
import Footer from "../components/Footer"

export default function BulkImport() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [variationText, setVariationText] = useState("")

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setVariationText("")
  }

  return (
    <div className="space-y-6 flex flex-col min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-orange to-orange-600 flex items-center justify-center shadow-md">
            <FileSpreadsheet className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Foods Bulk Import</h1>
            <p className="text-sm text-gray-500 mt-0.5">Import multiple food items at once</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-gray-600 hover:bg-gray-100"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Three-Step Process */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-gray-200 bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">STEP 1</p>
                <p className="text-xs text-gray-600">Download Excel File</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">STEP 2</p>
                <p className="text-xs text-gray-600">Match Spread sheet data according to instruction</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">STEP 3</p>
                <p className="text-xs text-gray-600">Validate data and and complete import</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions Section */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
          <CardTitle className="text-lg font-semibold text-blue-600">Instructions</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ol className="space-y-3 list-decimal list-inside text-sm text-gray-700">
            <li className="leading-relaxed">
              Download the format file and fill it with proper data.
            </li>
            <li className="leading-relaxed">
              You can download the example file to understand how the data must be filled.
            </li>
            <li className="leading-relaxed">
              Once you have downloaded and filled the format file upload it in the form below and submit.
            </li>
            <li className="leading-relaxed">
              After uploading foods you need to edit them and set image and variations.
            </li>
            <li className="leading-relaxed">
              You can get category id from their list please input the right ids.
            </li>
            <li className="leading-relaxed">
              Don't forget to fill all the fields
            </li>
            <li className="leading-relaxed">
              For veg food enter 1 and for non-veg enter 0 on veg field.
            </li>
            <li className="leading-relaxed">
              Image file name must be in 30 character.
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Download Spreadsheet Template Section */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b border-gray-100">
          <CardTitle className="text-lg font-semibold text-gray-800 text-center">
            Download Spreadsheet Template
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 font-semibold shadow-md">
              <Download className="h-5 w-5 mr-2" />
              Template with Existing Data
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 font-semibold shadow-md">
              <Download className="h-5 w-5 mr-2" />
              Template without Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import Restaurants Section */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b border-gray-100">
          <CardTitle className="text-lg font-semibold text-gray-800">Import Restaurants</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                Choose File
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  id="file-upload"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md cursor-pointer text-sm font-medium text-gray-700 transition-colors"
                >
                  <Upload className="h-4 w-4 inline mr-2" />
                  Choose File
                </label>
                <span className="text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : "No file chosen"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 h-10 px-6 font-semibold"
              >
                Reset
              </Button>
              <Button className="bg-primary-orange hover:bg-primary-orange/90 text-white h-10 px-6 font-semibold">
                Update
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-6 font-semibold">
                Import
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Food Variations Generator Section */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-cyan-50 to-white border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Food Variations Generator
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="border-teal-300 text-teal-600 hover:bg-teal-50"
            >
              <Upload className="h-4 w-4 mr-1.5" />
              Add new variation
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Textarea
              placeholder="Enter variation data..."
              value={variationText}
              onChange={(e) => setVariationText(e.target.value)}
              className="min-h-[200px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-y"
            />
            <div className="flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Section */}
      <Footer />
    </div>
  )
}

