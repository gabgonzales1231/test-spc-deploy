//src/app/about-us/mission-vision/page.tsx

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Award, Navigation, Star, Goal } from "lucide-react";

import Section from "@/components/city-government/Section";
import SectionHeader from "@/components/city-government/SectionHeader";

import ServiceStandardStack from "@/components/mission-vision/service-standard";

type ServiceStandardProps = {
  number: number;
  text: string;
};

const ServiceStandard = ({ number, text }: ServiceStandardProps) => (
  <Card className="h-full hover:shadow-lg transition-all duration-300 group border-emerald-200/50">
    <CardContent className="p-6">
      <div className="flex items-start space-x-4">
        <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 group-hover:scale-110 transition-transform">
          {number}
        </div>
        <p className="text-gray-700 leading-relaxed">{text}</p>
      </div>
    </CardContent>
  </Card>
);

export default function SanPabloCityInfoPage() {
const serviceStandards = [
  "When we go to work, we will come in complete uniform and display our identification cards.",
  "We will greet our clients with a sincere smile.",
  "When you enter our office premises, we will introduce ourselves to you so that you can address us back in an appropriate manner.",
  "We will attend our clients' inquiries within three (3) minutes.",
  "Appropriate action will immediately follow your queries and you will be referred accordingly.",
  "We will make you comfortable inside our facilities while you wait for your service request.",
  "Express/special lanes are provided for Senior Citizens, pregnant women and People With Disabilities.",
  "We will teach the clients, needed requirements that can expedite their service request.",
  "We will promptly return your denied request and explain to you the reason for such, which in turn will allow us to reprocess it.",
  "Our service stations will be properly labeled that will include our organizational chart and service flow chart.",
  "Directional signs will be displayed conspicuously as guide so that you can establish familiarity with our work place.",
  "Public Assistance Complaints Desk (PACD) is at your service in strategic locations.",
  "An information and hotline service is available 24/7 for anyone who has queries.",
  "No noon-break policy is followed and we are to serve beyond office hours if needed.",
  "A satisfied client is our happiness in the government service.",
];

  const strategicDirections = [
    "Existing policies of the city/agency have to be reviewed and revisited by the implementing office.",
    "Implementation of recruitment, selection and promotion plan, along with the performance management plan, learning and development strategy and rewards and recognition policies have to be strictly observed by the city and to be upheld by the city's implementing officials/officers at all times.",
    "Monitor day-to-day activities of all employees.",
    "Public service has to be the top most priority of all employees.",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Hero Section */}
      <section className="relative py-20 pt-40 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
            <Goal className="w-4 h-4 mr-2" />
            About San Pablo City
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Vision and Mission
            <br />
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Our vision and mission to our rich history and commitment to
            excellent public service.
          </p>
        </div>
      </section>
      <div className="py-12">
        {/* Vision */}
        <Section className="relative z-10">
          <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200/30 shadow-xl">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 rounded-2xl mb-8">
                  <Eye className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-8">
                  VISION
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
                  A walkable and progressive economic hub driven by investment
                  and tourism by year 2034 with God-loving, empowered, educated,
                  healthy and disciplined citizens proud of their cultural
                  heritage and natural wonders guided by inclusive growth,
                  sustainable development under a transparent, innovative and
                  accountable governance.
                </p>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* MIssion */}
        <Section className="bg-white/50 backdrop-blur-sm">
          <Card className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white shadow-xl">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-8">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold mb-8">MISSION</h2>
                <p className="text-xl text-emerald-100 leading-relaxed max-w-4xl mx-auto">
                  To serve as the catalyst for inclusive and sustainable local
                  development by creating an enabling environment for
                  investment, tourism, enterprise growth. We are committed to
                  empowering our citizens through responsive programs,
                  transparent governance, and strong partnerships that uphold
                  cultural pride, protect natural resources and ensure the well
                  being and prosperity of every constituent.
                </p>
              </div>
            </CardContent>
          </Card>
        </Section>

{/* 15-Point Service Standards */}
<Section>
  <SectionHeader
    title="Our 15-Point Service Standards for Clients"
    subtitle="Our commitment to excellence in public service delivery"
    icon={<Star />}
  />
  <ServiceStandardStack standards={serviceStandards} />
</Section>

        {/* Performance Appearance / Agency Mandate */}
        <Section className="bg-white/70 backdrop-blur-sm">
          <Card className="shadow-lg border-emerald-200/50">
            <CardContent className="p-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-2xl mb-6">
                  <Award className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  PERFORMANCE APPEARANCE / AGENCY MANDATE
                </h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed text-center max-w-5xl mx-auto">
                All employees both rank and file and personnel holding key
                positions in different departments of the local government are
                mandated to deliver quality service through the implementation
                of its programs to make them efficient and sustainable that have
                been developed in partnership with the private sector.
              </p>
            </CardContent>
          </Card>
        </Section>

        {/* Strategic Directions */}
        <Section>
          <SectionHeader
            title="Strategic Directions"
            subtitle="These directions can be realized by strictly following:"
            icon={<Navigation />}
          />
          <div className="grid gap-6">
            {strategicDirections.map((direction, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 border-emerald-200/50"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {direction}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
