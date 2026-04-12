import { Scale, FileDown, FolderOpen } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function FormsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <section className="relative py-20 pt-40 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
            <Scale className="w-4 h-4 mr-2" />
            Forms Hub
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Downloadables Form
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              Public Forms & Documents – City of San Pablo aligned with major offices
          </p>
        </div>
        </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <Accordion type="single" collapsible className="w-full space-y-4">

              {/* Business Permits and Licensing Department */}
              <AccordionItem value="business_permits">
                <AccordionTrigger className="text-lg font-semibold text-green-700 flex items-center">
                  <FolderOpen className="h-5 w-5 mr-2 text-green-600" />
                  Business Permits & Licensing Department
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 mt-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Unified Business Application Form</span>
                      <Button variant="outline" size="sm">
                        <FileDown className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Occupational Permit Application Form</span>
                      <Button variant="outline" size="sm">
                        <FileDown className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>2025 Business Permit Requirements</span>
                      <Button variant="outline" size="sm">
                        <FileDown className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* City Planning and Development Office (CPDO) */}
              <AccordionItem value="cpdo">
                <AccordionTrigger className="text-lg font-semibold text-green-700 flex items-center">
                  <FolderOpen className="h-5 w-5 mr-2 text-green-600" />
                  City Planning & Development Office
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 mt-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Application for Locational Clearance</span>
                      <Button variant="outline" size="sm">
                        <FileDown className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Application for Certificate of Conformance</span>
                      <Button variant="outline" size="sm">
                        <FileDown className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Comprehensive Land & Water Use Plan Flyer (2023-2031)</span>
                      <Button variant="outline" size="sm">
                        <FileDown className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Office of the Building Official (OBO) */}
              <AccordionItem value="obo">
                <AccordionTrigger className="text-lg font-semibold text-green-700 flex items-center">
                  <FolderOpen className="h-5 w-5 mr-2 text-green-600" />
                  Office of the Building Official (OBO)
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 mt-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Building Permit Application Form</span>
                      <Button variant="outline" size="sm">
                        <FileDown className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Electrical, Mechanical, & Electronics Permit Application</span>
                      <Button variant="outline" size="sm">
                        <FileDown className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Demolition Permit Application Checklist</span>
                      <Button variant="outline" size="sm">
                        <FileDown className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Sign Permit Application</span>
                      <Button variant="outline" size="sm">
                        <FileDown className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Civil Society Organization (CSO) */}
              <AccordionItem value="cso">
                <AccordionTrigger className="text-lg font-semibold text-green-700 flex items-center">
                  <FolderOpen className="h-5 w-5 mr-2 text-green-600" />
                  Civil Society Organizations (CSO)
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 mt-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>CSO Accreditation Form</span>
                      <Button variant="outline" size="sm">
                        <FileDown className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Participants Profile Form</span>
                      <Button variant="outline" size="sm">
                        <FileDown className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Office of Senior Citizens Affairs (OSCA) or Social Services */}
              <AccordionItem value="senior_citizens">
                <AccordionTrigger className="text-lg font-semibold text-green-700 flex items-center">
                  <FolderOpen className="h-5 w-5 mr-2 text-green-600" />
                  Office of Senior Citizens Affairs
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 mt-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Senior Citizens Application Form</span>
                      <Button variant="outline" size="sm">
                        <FileDown className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                    {/* you can add more forms under OSCA */}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* More categories/offices can be added similarly */}
            </Accordion>

            {/* Footer Note */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600 text-center mb-2">
                All forms are official documents of the City Government of San Pablo.
              </p>
              <p className="text-xs text-gray-500 text-center">
                For queries, please contact the respective office.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
