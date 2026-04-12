"use client";

export default function AboutUsPage() {
  return (
    <>
      <section id="about" className="pt-40 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                About San Pablo City
              </h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  Known as the &quot;City of Seven Lakes,&quot; San Pablo City
                  is a 1st class component city in the province of Laguna,
                  Philippines. Nestled at the foot of Mount San Cristobal and
                  bordered by lush natural landscapes, our city is renowned for
                  its natural beauty, rich cultural heritage, and vibrant
                  community spirit.
                </p>
                <p>
                  Established as a municipality in 1647 and chartered as a city
                  on May 7, 1940, by virtue of Commonwealth Act No. 520, San
                  Pablo City spans 197.56 km². It is home to a population of
                  285,348 (2020 census) and serves as a key economic and
                  cultural hub in the region, blending urban progress with
                  environmental preservation.
                </p>
                <p>
                  We are committed to providing excellent public services,
                  promoting sustainable development, and ensuring the welfare of
                  our citizens through transparent and accountable governance.
                </p>
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="border-l-4 border-emerald-600 pl-4">
                    <div className="text-2xl font-bold text-emerald-600">
                      1940
                    </div>
                    <div className="text-gray-600">City Charter</div>
                  </div>
                  <div className="border-l-4 border-emerald-600 pl-4">
                    <div className="text-2xl font-bold text-emerald-600">
                      197.56
                    </div>
                    <div className="text-gray-600">km² Area</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Our Vision
              </h3>
              <blockquote className="text-lg text-gray-700 italic mb-6">
                &quot;A walkable and progressive economic hub driven by
                investment and tourism by year 2034 with God-loving, empowered,
                educated, healthy and disciplined citizens proud of their
                cultural heritage and natural wonders guided by inclusive
                growth, sustainable development under a transparent, innovative
                and accountable governance.&quot;
              </blockquote>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Our Mission
              </h3>
              <blockquote className="text-lg text-gray-700 italic mb-6">
                &quot;To serve as the catalyst for inclusive and sustainable
                local development by creating an enabling environment for
                investment, tourism, enterprise growth. We are committed to
                empowering our citizens through responsive programs, transparent
                governance, and strong partnerships that uphold cultural pride,
                protect natural resources and ensure the well being and
                prosperity of every constituent.&quot;
              </blockquote>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2" />
                  <span className="text-gray-700">
                    Transparent and accountable governance
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2" />
                  <span className="text-gray-700">
                    Sustainable environmental protection
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2" />
                  <span className="text-gray-700">
                    Inclusive economic development
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
