import { Scale, Users, AlertTriangle, FileCheck, Globe, Phone } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 py-16 pt-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Scale className="mx-auto h-16 w-16 text-white mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              City Government of San Pablo, Laguna - Website Usage Terms and Conditions
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            
            {/* Last Updated */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
                <p className="text-sm text-blue-800">
                  <strong>Effective Date:</strong> September 17, 2025 | <strong>Last Updated:</strong> September 17, 2025
                </p>
              </div>
            </div>

            {/* Introduction */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Users className="h-6 w-6 text-blue-600 mr-2" />
                Agreement to Terms
              </h2>
              <p className="text-gray-700 mb-4">
                Welcome to the official website of the City Government of San Pablo, Laguna (sanpablocity.gov.ph). These Terms of Service (&quot;Terms&quot;) govern your access to and use of our website, online services, and digital platforms operated by the Local Government Unit of San Pablo City.
              </p>
              <p className="text-gray-700 mb-4">
                By accessing or using our website and services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree with any part of these terms, please do not use our website or services.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>Important:</strong> These Terms are legally binding. Please read them carefully before using our services.
                </p>
              </div>
            </div>

            {/* Definitions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Definitions</h2>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-700"><strong>&quot;City&quot; or &quot;LGU&quot;</strong> refers to the City Government of San Pablo, Laguna</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-700"><strong>&quot;Website&quot;</strong> refers to sanpablocity.gov.ph and all associated subdomains</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-700"><strong>&quot;Services&quot;</strong> refers to all online services, applications, and digital platforms provided by the City</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-700"><strong>&quot;User&quot; or &quot;You&quot;</strong> refers to any individual or entity accessing or using our website and services</p>
                </div>
              </div>
            </div>

            {/* Acceptable Use */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptable Use Policy</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Permitted Uses</h3>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <ul className="list-disc pl-6 space-y-2 text-green-800">
                  <li>Accessing information about city services and programs</li>
                  <li>Applying for permits, licenses, and certificates</li>
                  <li>Submitting legitimate inquiries and feedback</li>
                  <li>Participating in official surveys and consultations</li>
                  <li>Using services for their intended lawful purposes</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Prohibited Uses</h3>
              <div className="bg-red-50 p-4 rounded-lg mb-4">
                <ul className="list-disc pl-6 space-y-2 text-red-800">
                  <li>Submitting false, misleading, or fraudulent information</li>
                  <li>Attempting to gain unauthorized access to systems or data</li>
                  <li>Disrupting or interfering with website functionality</li>
                  <li>Using automated tools to access services excessively</li>
                  <li>Transmitting malware, viruses, or harmful code</li>
                  <li>Engaging in harassment, hate speech, or inappropriate content</li>
                  <li>Commercial use without proper authorization</li>
                  <li>Violating any applicable laws or regulations</li>
                </ul>
              </div>
            </div>

            {/* User Responsibilities */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FileCheck className="h-6 w-6 text-blue-600 mr-2" />
                User Responsibilities
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Account Security</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Keep login credentials secure</li>
                    <li>• Use strong passwords</li>
                    <li>• Log out after each session</li>
                    <li>• Report suspicious activity</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Information Accuracy</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Provide truthful information</li>
                    <li>• Update personal details</li>
                    <li>• Verify document authenticity</li>
                    <li>• Report errors promptly</li>
                  </ul>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                <h4 className="font-semibold text-orange-800 mb-2">Legal Compliance</h4>
                <p className="text-sm text-orange-700">
                  Users must comply with all applicable Philippine laws, regulations, and local ordinances when using our services. Violations may result in legal action and account suspension.
                </p>
              </div>
            </div>

            {/* Service Availability */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Globe className="h-6 w-6 text-blue-600 mr-2" />
                Service Availability and Modifications
              </h2>
              <p className="text-gray-700 mb-4">
                We strive to provide reliable and accessible online services, but we cannot guarantee:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Uninterrupted access to our website and services</li>
                <li>Error-free operation of all systems</li>
                <li>Availability during maintenance periods</li>
                <li>Compatibility with all devices and browsers</li>
              </ul>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Scheduled Maintenance</h4>
                <p className="text-gray-700 text-sm">
                  We may perform scheduled maintenance that temporarily interrupts service. We will provide advance notice when possible and minimize disruptions to essential services.
                </p>
              </div>

              <p className="text-gray-700">
                The City reserves the right to modify, suspend, or discontinue any service at any time with or without notice. We may also update these Terms as needed to reflect changes in our services or legal requirements.
              </p>
            </div>

            {/* Intellectual Property */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property Rights</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">City Content</h3>
              <p className="text-gray-700 mb-4">
                All content on our website, including text, images, logos, videos, and documents, is owned by the City Government of San Pablo, Laguna or used with proper authorization. This content is protected by intellectual property laws.
              </p>

              <div className="bg-emerald-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-emerald-800 mb-2">Permitted Use of City Content</h4>
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>• Personal, non-commercial use</li>
                  <li>• Educational and research purposes</li>
                  <li>• News reporting with proper attribution</li>
                  <li>• Academic studies and publications</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">User-Generated Content</h3>
              <p className="text-gray-700 mb-2">
                When you submit content through our website (forms, comments, feedback), you grant the City a non-exclusive right to use such content for official purposes, including:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Processing your requests and applications</li>
                <li>Improving our services based on feedback</li>
                <li>Statistical analysis and reporting (anonymized)</li>
              </ul>
            </div>

            {/* Privacy and Data Protection */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Data Privacy Compliance:</strong> We adhere to the Data Privacy Act of 2012 (RA 10173) and related regulations. Please review our Privacy Policy for detailed information about how we handle your personal data.
                </p>
              </div>
            </div>

            {/* Disclaimers */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimers and Limitations</h2>
              
              <div className="space-y-4">
                <div className="border border-yellow-200 bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Information Accuracy</h4>
                  <p className="text-sm text-yellow-700">
                    While we strive to provide accurate and up-to-date information, we make no warranties about the completeness, accuracy, or timeliness of content on our website.
                  </p>
                </div>
                
                <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Third-Party Links</h4>
                  <p className="text-sm text-red-700">
                    Our website may contain links to third-party websites. We are not responsible for the content, privacy practices, or services of external sites.
                  </p>
                </div>
                
                <div className="border border-purple-200 bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Technical Issues</h4>
                  <p className="text-sm text-purple-700">
                    We are not liable for technical difficulties, service interruptions, or data loss that may occur during your use of our services.
                  </p>
                </div>
              </div>
            </div>

            {/* Governing Law */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law and Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                These Terms are governed by the laws of the Republic of the Philippines. Any disputes arising from the use of our website or services shall be resolved through:
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                  <li><strong>Direct Communication:</strong> Initial attempt to resolve issues through our official channels</li>
                  <li><strong>Administrative Remedies:</strong> Following established government complaint procedures</li>
                  <li><strong>Legal Proceedings:</strong> Courts of competent jurisdiction in San Pablo City, Laguna</li>
                </ol>
              </div>
            </div>

            {/* Enforcement */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Enforcement and Penalties</h2>
              <p className="text-gray-700 mb-4">
                Violations of these Terms may result in the following actions:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Administrative Actions</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Warning notifications</li>
                    <li>• Account suspension</li>
                    <li>• Service restrictions</li>
                    <li>• Account termination</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Legal Consequences</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Civil liability</li>
                    <li>• Criminal charges</li>
                    <li>• Regulatory sanctions</li>
                    <li>• Restitution requirements</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Phone className="h-6 w-6 text-blue-600 mr-2" />
                Contact Information
              </h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">For Terms of Service Questions</h3>
                <div className="space-y-2 text-blue-700">
                  <p><strong>Office:</strong> City Administrator&#39;s Office</p>
                  <p><strong>Address:</strong> City Hall, San Pablo City, Laguna</p>
                  <p><strong>Email:</strong> admin@sanpablocity.gov.ph</p>
                  <p><strong>Phone:</strong> (049) 562-3156</p>
                  <p><strong>Business Hours:</strong> Monday to Friday, 8:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>

            {/* Severability */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Severability and Entire Agreement</h2>
              <p className="text-gray-700 mb-4">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue to be valid and enforceable. These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and the City regarding the use of our website and services.
              </p>
            </div>

            {/* Acknowledgment */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Acknowledgment</h2>
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg">
                <p className="text-emerald-800 mb-4">
                  <strong>By using our website and services, you acknowledge that:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2 text-emerald-700">
                  <li>You have read and understood these Terms of Service</li>
                  <li>You agree to be bound by these Terms and our Privacy Policy</li>
                  <li>You will use our services responsibly and lawfully</li>
                  <li>You understand the consequences of violating these Terms</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600 text-center mb-2">
                This Terms of Service document is issued in accordance with Philippine law and DICT Government Website Standards.
              </p>
              <p className="text-xs text-gray-500 text-center">
                City Government of San Pablo, Laguna © 2025. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}