"use client";

import {
  Cookie,
  Settings,
  BarChart3,
  Shield,
  Trash2,
  Phone,
} from "lucide-react";
import { useState } from "react";

export default function CookiePolicy() {
  const [activeTab, setActiveTab] = useState("overview");

  type CookieColor = "emerald" | "blue" | "purple" | "red";

  interface CookieType {
    category: string;
    description: string;
    examples: string[];
    retention: string;
    canDisable: boolean;
    color: CookieColor;
  }

  const cookieTypes: CookieType[] = [
    {
      category: "Essential Cookies",
      description: "Required for basic website functionality",
      examples: ["Session management", "Security tokens", "User preferences"],
      retention: "Session duration or as needed",
      canDisable: false,
      color: "emerald",
    },
    {
      category: "Functional Cookies",
      description: "Enhance user experience and remember settings",
      examples: ["Language preference", "Form data", "Accessibility settings"],
      retention: "30 days to 1 year",
      canDisable: true,
      color: "blue",
    },
    {
      category: "Analytics Cookies",
      description: "Help us understand website usage patterns",
      examples: ["Page views", "User journey", "Performance metrics"],
      retention: "2 years maximum",
      canDisable: true,
      color: "purple",
    },
    {
      category: "Security Cookies",
      description: "Protect against fraud and security threats",
      examples: ["Login attempts", "IP tracking", "Rate limiting"],
      retention: "30 days to 6 months",
      canDisable: false,
      color: "red",
    },
  ];

  const getColorClasses = (color: "emerald" | "blue" | "purple" | "red") =>
    ({
      emerald: "bg-emerald-50 border-emerald-200 text-emerald-800",
      blue: "bg-blue-50 border-blue-200 text-blue-800",
      purple: "bg-purple-50 border-purple-200 text-purple-800",
      red: "bg-red-50 border-red-200 text-red-800",
    }[color]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-orange-600 to-orange-700 py-16 pt-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Cookie className="mx-auto h-16 w-16 text-white mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">
              Cookie Policy
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              City Government of San Pablo, Laguna - How We Use Cookies and
              Similar Technologies
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Last Updated */}
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-8">
              <div className="flex items-center">
                <Settings className="h-5 w-5 text-orange-600 mr-2" />
                <p className="text-sm text-orange-800">
                  <strong>Last Updated:</strong> September 17, 2025
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex flex-wrap justify-center gap-2">
                {[
                  { id: "overview", label: "Overview", icon: Cookie },
                  { id: "types", label: "Cookie Types", icon: BarChart3 },
                  { id: "management", label: "Manage Cookies", icon: Settings },
                  { id: "contact", label: "Contact", icon: Phone },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === id
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon
                      className={`mr-2 h-5 w-5 ${
                        activeTab === id
                          ? "text-orange-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  What Are Cookies?
                </h2>

                <div className="mb-6">
                  <p className="text-gray-700 mb-4">
                    Cookies are small text files that are stored on your device
                    (computer, tablet, or mobile) when you visit our website.
                    They help us provide you with a better browsing experience
                    by remembering your preferences and analyzing how you use
                    our site.
                  </p>

                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                    <h3 className="font-semibold text-blue-800 mb-2">
                      Why We Use Cookies
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• To ensure our website functions properly</li>
                      <li>• To remember your preferences and settings</li>
                      <li>• To analyze website performance and usage</li>
                      <li>• To improve our services and user experience</li>
                      <li>• To maintain security and prevent fraud</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Types of Information We Collect
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Automatically Collected
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Browser type and version</li>
                      <li>• Operating system</li>
                      <li>• IP address (anonymized)</li>
                      <li>• Pages visited and time spent</li>
                      <li>• Referral source</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      User Preferences
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Language selection</li>
                      <li>• Accessibility settings</li>
                      <li>• Form progress</li>
                      <li>• Session information</li>
                      <li>• Cookie consent choices</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>Government Compliance:</strong> Our use of cookies
                    complies with the Data Privacy Act of 2012 and DICT
                    guidelines for government websites. We only collect
                    information necessary for legitimate government purposes.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "types" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Cookie Categories
                </h2>
                <p className="text-gray-700 mb-6">
                  We use different types of cookies for various purposes. Below
                  is a detailed breakdown of each category:
                </p>

                <div className="space-y-6">
                  {cookieTypes.map((cookie, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-6 ${getColorClasses(
                        cookie.color
                      )}`}
                    >
                      <div className="flex flex-wrap justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold min-w-0">
                          {cookie.category}
                        </h3>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            cookie.canDisable
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {cookie.canDisable ? "Optional" : "Required"}
                        </span>
                      </div>

                      <p className="mb-4">{cookie.description}</p>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Examples:</h4>
                          <ul className="text-sm space-y-1">
                            {cookie.examples.map((example, idx) => (
                              <li key={idx}>• {example}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">
                            Retention Period:
                          </h4>
                          <p className="text-sm">{cookie.retention}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Third-Party Cookies
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Our website may also use cookies from trusted third-party
                    services:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded">
                      <h4 className="font-semibold text-gray-800">
                        Google Analytics
                      </h4>
                      <p className="text-sm text-gray-600">
                        Website traffic analysis (if implemented)
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <h4 className="font-semibold text-gray-800">reCAPTCHA</h4>
                      <p className="text-sm text-gray-600">
                        Bot protection for forms
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <h4 className="font-semibold text-gray-800">
                        CDN Services
                      </h4>
                      <p className="text-sm text-gray-600">
                        Fast content delivery
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "management" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Settings className="h-6 w-6 text-orange-600 mr-2" />
                  Managing Your Cookie Preferences
                </h2>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Cookie Consent Management
                  </h3>
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-4">
                    <p className="text-orange-800 text-sm mb-3">
                      When you first visit our website, you&#39;ll see a cookie
                      consent banner. You can manage your preferences at any
                      time.
                    </p>
                    <div className="bg-white p-3 rounded border">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Cookie Preference Center
                      </h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked
                            disabled
                            className="mr-2"
                          />
                          <span className="text-sm">
                            Essential Cookies (Required)
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="mr-2"
                          />
                          <span className="text-sm">Functional Cookies</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="mr-2"
                          />
                          <span className="text-sm">Analytics Cookies</span>
                        </label>
                      </div>
                      <button className="mt-3 bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700 transition-colors">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Browser Cookie Settings
                </h3>
                <p className="text-gray-700 mb-4">
                  You can also manage cookies directly through your browser
                  settings:
                </p>

                <div className="space-y-4 mb-6">
                  {[
                    {
                      browser: "Google Chrome",
                      steps:
                        "Settings → Privacy and Security → Cookies and other site data",
                    },
                    {
                      browser: "Mozilla Firefox",
                      steps:
                        "Options → Privacy & Security → Cookies and Site Data",
                    },
                    {
                      browser: "Safari",
                      steps: "Preferences → Privacy → Manage Website Data",
                    },
                    {
                      browser: "Microsoft Edge",
                      steps:
                        "Settings → Cookies and site permissions → Cookies and site data",
                    },
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-gray-800">
                        {item.browser}
                      </h4>
                      <p className="text-sm text-gray-600">{item.steps}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
                  <div className="flex flex-wrap items-start gap-3">
                    <Trash2 className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-800 mb-2">
                        Clearing Cookies
                      </h4>
                      <p className="text-sm text-red-700 mb-2">
                        If you choose to delete cookies, please note:
                      </p>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• You may need to re-enter information on forms</li>
                        <li>• Your preferences will be reset</li>
                        <li>• Some website features may not work properly</li>
                        <li>
                          • You&#39;ll need to accept cookies again on your next
                          visit
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Do Not Track
                </h3>
                <p className="text-gray-700">
                  We respect Do Not Track (DNT) browser signals. When DNT is
                  enabled, we will not set non-essential cookies or collect
                  analytics data, while still maintaining essential
                  functionality for government services.
                </p>
              </div>
            )}

            {activeTab === "contact" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Phone className="h-6 w-6 text-orange-600 mr-2" />
                  Contact Information
                </h2>

                <p className="text-gray-700 mb-6">
                  If you have questions about our Cookie Policy or need
                  assistance with cookie settings, please contact us:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-orange-800 mb-3">
                      Technical Support
                    </h3>
                    <div className="space-y-2 text-orange-700">
                      <p>
                        <strong>Office:</strong> Management Information Systems
                        Office
                      </p>
                      <p>
                        <strong>Email:</strong> miso@sanpablocity.gov.ph
                      </p>
                      <p>
                        <strong>Phone:</strong> (049) 562-3156 ext. 120
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">
                      Data Privacy Officer
                    </h3>
                    <div className="space-y-2 text-blue-700">
                      <p>
                        <strong>Office:</strong> City Administrator&#39;s Office
                      </p>
                      <p>
                        <strong>Email:</strong> dpo@sanpablocity.gov.ph
                      </p>
                      <p>
                        <strong>Phone:</strong> (049) 562-3156
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Office Address
                  </h3>
                  <p className="text-gray-700 mb-2">
                    <strong>City Government of San Pablo, Laguna</strong>
                    <br />
                    City Hall Complex
                    <br />
                    San Pablo City, Laguna 4030
                    <br />
                    Philippines
                  </p>
                  <p className="text-gray-700">
                    <strong>Business Hours:</strong> Monday to Friday, 8:00 AM -
                    5:00 PM
                  </p>
                </div>

                <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4">
                  <h4 className="font-semibold text-emerald-800 mb-2">
                    Related Policies
                  </h4>
                  <p className="text-sm text-emerald-700">
                    For comprehensive information about data protection, please
                    also review our
                    <strong>
                      {" "}
                      <a href="/privacy-policy" target="_blank">
                        Privacy Policy
                      </a>{" "}
                    </strong>{" "}
                    and{" "}
                    <strong>
                      <a href="/terms-of-service" target="_blank">
                        Terms of Service
                      </a>
                    </strong>
                    .
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-gray-200 pt-6 mt-8">
              <div className="flex items-center justify-center">
                <Shield className="h-5 w-5 text-gray-400 mr-2" />
                <p className="text-sm text-gray-600 text-center">
                  This Cookie Policy complies with the Data Privacy Act of 2012
                  and DICT Government Website Standards
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
