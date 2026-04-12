import { Scale, FileDown, FolderOpen, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
            Downloadable Forms
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Public Forms & Documents – City of San Pablo aligned with major offices
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200/30 shadow-xl">
            <CardContent className="p-16 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
                  <FileDown className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Coming Soon
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Our downloadable forms portal is currently under development. We&apos;re working to provide 
                  easy access to all official government forms and documents from various city offices.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <div className="flex items-center px-4 py-2 bg-emerald-50 rounded-lg">
                    <FolderOpen className="w-5 h-5 text-emerald-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Business Permits & Licensing</span>
                  </div>
                  <div className="flex items-center px-4 py-2 bg-emerald-50 rounded-lg">
                    <FolderOpen className="w-5 h-5 text-emerald-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">City Planning & Development</span>
                  </div>
                  <div className="flex items-center px-4 py-2 bg-emerald-50 rounded-lg">
                    <FolderOpen className="w-5 h-5 text-emerald-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Building Official</span>
                  </div>
                  <div className="flex items-center px-4 py-2 bg-emerald-50 rounded-lg">
                    <FolderOpen className="w-5 h-5 text-emerald-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Civil Society Organizations</span>
                  </div>
                  <div className="flex items-center px-4 py-2 bg-emerald-50 rounded-lg">
                    <FolderOpen className="w-5 h-5 text-emerald-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Senior Citizens Affairs</span>
                  </div>
                </div>
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg shadow-lg">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="font-medium">Expected Launch: Q4 2025</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 bg-white/80 backdrop-blur-sm border border-emerald-200/30 rounded-lg shadow-lg p-6">
            <p className="text-sm text-gray-600 text-center mb-2">
              In the meantime, you may visit or contact the respective offices directly for form requests.
            </p>
            <p className="text-xs text-gray-500 text-center">
              For queries, please contact the City Hall main office at (049) 562-1234.
            </p>
          </div>

          <div className="text-center mt-8">
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-200/30">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse" />
              <p className="text-sm text-gray-600">
                Forms portal under development. Check back soon for updates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}