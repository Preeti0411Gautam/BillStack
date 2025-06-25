import { useEffect, useState, useCallback } from "react";
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from "react-icons/fa";
const baseURL = import.meta.env.VITE_BACKEND_URL;

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [autoSlide, setAutoSlide] = useState(true);

  // Responsive slides calculation
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

  // Auto-slide functionality
  useEffect(() => {
    if (!autoSlide || feedbacks.length <= slidesToShow) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev + 1 >= feedbacks.length - (slidesToShow - 1) ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [autoSlide, feedbacks.length, slidesToShow]);

  // Fetch feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(`${baseURL}/api/feedback/feedbacks`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch feedbacks");

        const data = await res.json();
        if (data.success) {
          setFeedbacks(data.feedbacks);
        } else {
          throw new Error(data.message || "Unknown error occurred");
        }
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) =>
      prev + 1 >= feedbacks.length - (slidesToShow - 1) ? 0 : prev + 1
    );
    setAutoSlide(false);
    setTimeout(() => setAutoSlide(true), 10000); // Re-enable auto-slide after 10s
  }, [feedbacks.length, slidesToShow]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) =>
      prev <= 0 ? feedbacks.length - slidesToShow : prev - 1
    );
    setAutoSlide(false);
    setTimeout(() => setAutoSlide(true), 10000); // Re-enable auto-slide after 10s
  }, [feedbacks.length, slidesToShow]);

  // Calculate visible feedbacks for dot indicators
  const totalSlides = Math.max(feedbacks.length - slidesToShow + 1, 1);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-lg text-gray-600">Loading feedbacks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <section className="py-10 px-4 sm:px-8 lg:px-20 bg-gradient-to-b from-yellow-50 via-gray-200">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-5">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Cheers!</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            What Our Members Are Saying About Us
          </p>
        </header>

        {feedbacks.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm">
            <p className="text-gray-600 text-lg">
              No feedback available yet. Be the first to share your experience!
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Carousel Viewport */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${
                    (100 / slidesToShow) * currentIndex
                  }%)`,
                  width: `${(feedbacks.length * 100) / slidesToShow}%`,
                }}
              >
                {feedbacks.map((feedback) => (
                  <div
                    key={feedback._id}
                    className="p-4"
                    style={{ minWidth: `${100 / slidesToShow}%` }}
                  >
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md h-full p-4 flex flex-col transition-all duration-300 hover:scale-[1.02]">
                      <div className="mb-4 text-indigo-500">
                        <FaQuoteLeft className="text-2xl opacity-50" />
                      </div>
                      <p className="text-gray-700 mb-6 line-clamp-5">
                        {feedback.feedback}
                      </p>
                      <div className="mt-auto">
                        <p className="font-semibold text-gray-700">
                          {feedback.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(feedback.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
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
                  aria-label="Previous feedback"
                  className="absolute top-1/2 -translate-y-1/2 -left-4 bg-white shadow-md p-3 rounded-full hover:bg-indigo-50 text-indigo-600 transition-all z-20 hover:scale-110"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next feedback"
                  className="absolute top-1/2 -translate-y-1/2 -right-4 bg-white shadow-md p-3 rounded-full hover:bg-indigo-50 text-indigo-600 transition-all z-20 hover:scale-110"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Dot Indicators */}
            {feedbacks.length > slidesToShow && (
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-indigo-600 w-6"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Feedbacks;
