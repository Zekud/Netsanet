import { Link } from "react-router-dom";
import {
  Heart,
  Scale,
  FileText,
  Users,
  BookOpen,
  MessageCircle,
  Shield,
  Globe,
} from "lucide-react";
import { useState, useEffect } from "react";

const Home = () => {
  const images = [
    "/women1.jpeg",
    "/women2.jpg",
    "/women3.jfif",
    "/women4.jfif",
    "/women5.jfif",
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);
  
  const features = [
    {
      icon: Scale,
      title: "AI Legal Advisor",
      description:
        "Get personalized legal guidance based on Ethiopian law and your specific situation.",
      path: "/legal-advisor",
      color: "bg-blue-500",
    },
    {
      icon: FileText,
      title: "Appeal Generator",
      description:
        "Generate formal appeal letters in both Amharic and English for your case.",
      path: "/appeal-generator",
      color: "bg-green-500",
    },
    {
      icon: Users,
      title: "Support Directory",
      description:
        "Find nearby legal aid organizations and support services in your region.",
      path: "/support-directory",
      color: "bg-purple-500",
    },
    {
      icon: BookOpen,
      title: "Case Stories",
      description:
        "Read inspiring stories from other women who have overcome similar challenges.",
      path: "/case-stories",
      color: "bg-orange-500",
    },
    {
      icon: MessageCircle,
      title: "Story Wall",
      description:
        "Share your experiences anonymously and connect with others.",
      path: "/story-wall",
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
      {/* Hero Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="container-responsive relative z-10">
          <div className="grid-responsive-2 items-center gap-8 lg:gap-12">
            <div className="text-center lg:text-left space-responsive-md">
              <h1 className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 text-responsive-4xl lg:text-responsive-5xl font-bold">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex-shrink-0" />
                <span>Netsanet</span>
              </h1>
              <p className="text-responsive-xl lg:text-responsive-2xl opacity-90 font-medium">
                AI-Powered Support for Women in Ethiopia
              </p>
              <p className="text-responsive-lg lg:text-responsive-xl opacity-80 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Get legal guidance, generate formal appeals, and connect with
                support organizations. You're not alone in your journey toward
                justice and empowerment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/legal-advisor" className="btn btn-primary btn-large">
                  Get Legal Advice
                </Link>
                <Link to="/support-directory" className="btn btn-secondary btn-large">
                  Find Support
                </Link>
              </div>
            </div>
            
            <div className="flex items-center justify-center lg:justify-end">
              <div className="carousel-container">
                {/* Carousel Images */}
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`carousel-image ${
                      index === currentImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Empowered women ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  </div>
                ))}

                {/* Carousel Indicators */}
                <div className="carousel-indicators">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`carousel-indicator ${
                        index === currentImageIndex
                          ? "carousel-indicator-active"
                          : "carousel-indicator-inactive"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-responsive">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="section-title text-gray-900">
              How We Can Help You
            </h2>
            <p className="text-responsive-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive support services designed to empower women and provide access to justice
            </p>
          </div>
          
          <div className="grid-responsive-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={index}
                  to={feature.path}
                  className="card hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group"
                >
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-responsive-xl font-semibold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-responsive-base">
                    {feature.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-responsive">
          <div className="grid-responsive-2 gap-8 lg:gap-12 items-start">
            <div className="space-responsive-md">
              <h2 className="text-responsive-3xl lg:text-responsive-4xl font-bold text-gray-900">
                About Netsanet
              </h2>
              <p className="text-gray-600 leading-relaxed text-responsive-lg">
                Netsanet is dedicated to supporting women in Ethiopia who
                experience abuse and discrimination. Our AI-powered platform
                provides:
              </p>
              <ul className="space-responsive-sm">
                <li className="flex items-start gap-3 text-gray-600 text-responsive-base">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Legal guidance based on Ethiopian Constitution and laws</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600 text-responsive-base">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Formal appeal letter generation in multiple languages</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600 text-responsive-base">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Directory of local support organizations</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600 text-responsive-base">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Community of shared experiences and support</span>
                </li>
              </ul>
              <p className="text-gray-600 leading-relaxed text-responsive-lg">
                We believe every woman deserves access to justice and support.
                Your rights matter, and we're here to help you navigate the
                legal system.
              </p>
            </div>
            
            <div className="space-responsive-md">
              <div className="card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-responsive-lg font-semibold mb-2 text-gray-900">
                      Ethiopia-wide
                    </h3>
                    <p className="text-gray-600 text-responsive-sm">
                      Support available across all regions with local expertise and resources
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-responsive-lg font-semibold mb-2 text-gray-900">
                      Confidential & Secure
                    </h3>
                    <p className="text-gray-600 text-responsive-sm">
                      Your privacy and safety are our priority with secure, anonymous access
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-500 text-center">
        <div className="container-responsive">
          <div className="max-w-4xl mx-auto space-responsive-md">
            <h2 className="text-responsive-3xl lg:text-responsive-4xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="text-responsive-xl opacity-90 max-w-2xl mx-auto">
              Take the first step toward justice and empowerment. Our platform is here to support you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/legal-advisor" className="btn btn-primary btn-large">
                Start Your Journey
              </Link>
              <Link to="/support-directory" className="btn btn-secondary btn-large">
                Find Local Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
