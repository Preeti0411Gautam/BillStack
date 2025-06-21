const FeaturesSection = () => {
  return (
    <section id="features" className="sm:py-20 px-6 sm:px-10 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            What We Offer
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Powerful tools to simplify your bill management and financial tracking
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "All-Inclusive Bill Management",
              description: "Manage all types of bills in one place.",
              icon: "📊"
            },
            {
              title: "Effortless Bill Tracking",
              description: "Track and view your bill history with ease.",
              icon: "👀"
            },
            {
              title: "Advanced Analytics",
              description: "Analyze your bill history using advanced analytics tools.",
              icon: "📈"
            },
            {
              title: "Secure Storage",
              description: "Keep all your bill information in one secure place.",
              icon: "🔒"
            },
            {
              title: "Financial Insights",
              description: "Generate detailed reports for better budgeting and financial management.",
              icon: "💡"
            },
            {
              title: "Custom Notifications",
              description: "Get alerts for upcoming bills and payment deadlines.",
              icon: "🔔"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="p-8 bg-slate-50 rounded-xl border border-slate-200 hover:border-amber-300 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="text-3xl mb-4 group-hover:text-amber-500 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3 group-hover:text-amber-600 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;