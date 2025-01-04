import React from 'react';

const FeaturesSection = () => {
    return (
        <section id="features" className="py-20 ">
            <div className="container mx-auto text-center">
                <h2 className="text-5xl font-bold mb-12">What We Offer</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                <div className="p-6 bg-white border border-black rounded-lg">
                     <h3 className="text-xl font-mono font-semibold mb-4">All-Inclusive Bill Management</h3>
                        <p className='font-sans'>Manage all types of bills in one place.</p>
                    </div>
                    <div className="p-6 bg-white border border-black rounded-lg">
                        <h3 className="text-xl font-mono font-semibold mb-4">Effortless Bill Tracking and Viewing</h3>
                        <p className='font-sans'>Track and view your bill history with ease.</p>
                    </div>
                    <div className="p-6 bg-white border border-black rounded-lg">
                        <h3 className="text-xl font-mono font-semibold mb-4">Advanced Analytics Tools</h3>
                        <p className='font-sans'>Analyze your bill history using advanced analytics tools.</p>
                    </div>
                    <div className="p-6 bg-white border border-black rounded-lg">
                        <h3 className="text-xl font-mono font-semibold mb-4">Secure Storage</h3>
                        <p className='font-sans'>Keep all your bill information in one secure place.</p>
                    </div>
                    <div className="p-6 bg-white border border-black rounded-lg">
                        <h3 className="text-xl font-mono font-semibold mb-4">Financial Insights</h3>
                        <p className='font-sans'>Generate detailed reports of your expenses for better budgetingGain insights to manage your finances better.</p>
                    </div>
                    
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
