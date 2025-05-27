import React, { useEffect, useState } from "react";

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setSlidesToShow(1);
      else if (window.innerWidth < 1024) setSlidesToShow(2);
      else setSlidesToShow(3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch("/api/feedback/feedbacks");
        const data = await res.json();
        if (data.success) setFeedbacks(data.feedbacks);
        else console.log(data.message);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev >= feedbacks.length - slidesToShow ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev <= 0 ? feedbacks.length - slidesToShow : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="py-20 px-4 sm:px-8 lg:px-20 bg-white">
      <h1 className="text-4xl font-bold text-center mb-2">Cheers!</h1>
      <h2 className="text-lg text-center text-gray-600 mb-10">
        What Our Members Are Saying About Us
      </h2>

      {feedbacks.length === 0 ? (
        <p className="text-center text-gray-500 text-xl">
          No feedbacks available...
        </p>
      ) : (
        <div className="relative">
          {/* Carousel Viewport */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
  transform: `translateX(-${currentIndex * (100 / feedbacks.length)}%)`,
  width: `${(feedbacks.length * 100) / slidesToShow}%`,
}}

            >
              {feedbacks.map((feedback) => (
                <div
                  key={feedback._id}
                  className="p-4 w-full"
                  style={{ width: `${100 / feedbacks.length}%` }}
                >
                  <div className="bg-white rounded-xl border shadow-md h-full p-6 flex flex-col justify-between">
                    <div>
                      <p className="text-center font-semibold text-gray-800 text-lg mb-2">
                        {feedback.name}
                      </p>
                      <p className="text-gray-700 text-sm mb-4 line-clamp-4">
                        {feedback.feedback}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 text-right">
                      {new Date(feedback.date).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {feedbacks.length > slidesToShow && (
            <>
              <button
                onClick={prevSlide}
                className="absolute top-1/2 -translate-y-1/2 left-0 bg-white shadow p-2 rounded-full hover:bg-gray-100 z-10"
              >
                &lt;
              </button>
              <button
                onClick={nextSlide}
                className="absolute top-1/2 -translate-y-1/2 right-0 bg-white shadow p-2 rounded-full hover:bg-gray-100 z-10"
              >
                &gt;
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Feedbacks;
