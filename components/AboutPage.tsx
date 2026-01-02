import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Our Story
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          Reimagining commerce with intelligent automation.
        </p>
      </div>

      <div className="mt-16 space-y-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
                <img 
                    src="https://picsum.photos/seed/about1/800/600" 
                    alt="Team working" 
                    className="rounded-2xl shadow-lg"
                />
            </div>
            <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Built for the Future</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                    ShopGenius wasn't built to just be another store. We wanted to create an ecosystem where finding the perfect product is effortless, and selling your creations is instantaneous.
                </p>
            </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
             <div className="flex-1">
                <img 
                    src="https://picsum.photos/seed/about2/800/600" 
                    alt="Craftsmanship" 
                    className="rounded-2xl shadow-lg"
                />
            </div>
            <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Curated Excellence</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                    Every item in our marketplace is verified for quality. We leverage advanced technology to ensure that descriptions match reality, giving you confidence in every purchase.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};