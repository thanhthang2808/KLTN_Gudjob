import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Importing icons from Lucide React

function BannerSlider() {
  // Sample banner data (replace this with API data or your own dynamic data)
  const banners = [
    {
      imageUrl:
        "https://res.cloudinary.com/dpocdj6eu/image/upload/v1731266252/hwjmlci7iqxuuyrkah4c.jpg",
      altText: "First Banner",
    },
    {
      imageUrl:
        "https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/img/Banner%201.png",
      altText: "Second Banner",
    },
    {
      imageUrl:
        "https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/img/Banner%201.png",
      altText: "Third Banner",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [banners]);

  const handlePrev = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative max-w-[80%] mx-auto mt-0.5 py-2">
      {/* Banner Slide */}
      <div className="relative w-full h-64 sm:h-80 md:h-[300px] rounded-lg overflow-hidden">
        {banners.length > 0 && (
          <div
            className="flex transition-transform"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              transition: "transform 0.5s ease-in-out",
              alignItems: "center",
            }}
          >
            {banners.map((banner, index) => (
              <div key={index} className="w-full h-full flex-shrink-0">
                <img
                  src={banner.imageUrl}
                  alt={banner.altText || "Banner Image"}
                  className="w-full h-full object-cover object-center rounded-lg"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Left Arrow using Lucide Icon */}
      <button
        className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white bg-gray-800 p-2 rounded-full"
        onClick={handlePrev}
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right Arrow using Lucide Icon */}
      <button
        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white bg-gray-800 p-2 rounded-full"
        onClick={handleNext}
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <div
            key={index}
            onClick={() => handleDotClick(index)}
            className={`cursor-pointer rounded-full ${index === currentSlide ? "bg-white" : "bg-gray-500"}`}
            style={{
              width: "20px", // Adjust size for better UI
              height: "5px",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default BannerSlider;
