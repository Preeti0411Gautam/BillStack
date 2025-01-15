import React, { useEffect, useState } from 'react';
// import { IoIosArrowForward ,IoIosArrowBack } from "react-icons/io";

const Feedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const res = await fetch('/api/feedback/feedbacks', {
                    method: "GET"
                });
                const data = await res.json();
                if (data.success) {
                    setFeedbacks(data.feedbacks);
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-6 pt-20 pb-20 mx-auto max-w-4xl">
            <h1 className="text-5xl font-bold mb-10 text-center text-gray-800">Cheers!</h1>
            <h2 className="text-2xl font-medium mb-20 text-center ">
                What Our Members Are Saying About Us
            </h2>
            {feedbacks.length === 0 ? (
                <p className="text-center text-gray-400 text-3xl font-semibold border p-4 rounded-lg">No feedbacks available......</p>
            ) : (
                <ul className="grid grid-cols-2 md:grid-cols-2 gap-8">
                    {/* <IoIosArrowBack /> */}
                    {feedbacks.map((feedback) => (
                    
                        <li
                            key={feedback._id}
                            className=" rounded-2xl p-6 border-4 border-gray-100 "
                        >
                            <p className="text-lg text-gray-800 font-bold text-center mb-4">
                                {feedback.name}
                            </p>
                            <p className="text-gray-800 mb-6">{feedback.feedback}</p>
                            <p className="text-xs text-gray-800 text-right">
                                {new Date(feedback.date).toLocaleDateString('en-GB')}
                            </p>
                        </li>
                        
                    ))}
                    {/* <IoIosArrowForward /> */}
                </ul>
            )}
        </div>
    );
};

export default Feedbacks;
