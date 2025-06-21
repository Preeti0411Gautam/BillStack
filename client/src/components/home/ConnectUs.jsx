import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";

const ConnectUs = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, message } = formData;
        try {
            const res = await fetch(`https://billstack.onrender.com/api/contact-us/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });

            const data = await res.json();
            if (!data.success) {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-8 md:p-16 bg-white">
            <h1 className="text-5xl font-bold text-center mb-8">
                Connect With Us!
            </h1>
            <div className="flex justify-center space-x-6 mb-8">
                <FaFacebook
                    size={40}
                    className="text-blue-600 cursor-pointer"
                />
                <FaInstagram
                    size={40}
                    className="text-pink-600 cursor-pointer hover:scale-110 hover:text-pink-700 transition duration-300"
                />
                <FaLinkedin
                    size={40}
                    className="text-blue-800 cursor-pointer hover:scale-110 hover:text-blue-900 transition duration-300"
                />
                <MdOutlineMail
                    size={40}
                    className="text-red-600 cursor-pointer hover:scale-110 hover:text-red-700 transition duration-300"
                />
            </div>
            <div className="rounded-lg border p-10">
                <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                    Get in Touch Now
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        id="name"
                        onChange={handleChange}
                        value={formData.name}
                        type="text"
                        placeholder="Name"
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                    <input
                        id="email"
                        onChange={handleChange}
                        value={formData.email}
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                    <textarea
                        id="message"
                        onChange={handleChange}
                        value={formData.message}
                        placeholder="Message"
                        rows="5"
                        className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    ></textarea>
                    <button
                        type="submit"
                        className="w-full bg-red-800 hover:bg-red-700 text-white font-semibold p-3 rounded-md"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConnectUs;
