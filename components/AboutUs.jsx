export default function AboutUs() {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-center min-h-screen px-10 py-20 bg-white">
      {/* Left Side: Image Grid */}
      <div className="grid grid-cols-2 gap-6 flex-shrink-0 mb-10 lg:mb-0">
        <img
          src="/images/about-1.jpg"
          alt="Team member 1"
          className="w-40 h-40 lg:w-48 lg:h-48 rounded-[25px] object-cover"
        />
        <img
          src="/images/about-1.jpg"
          alt="Team member 2"
          className="w-40 h-40 lg:w-48 lg:h-48 rounded-full object-cover"
        />
        <img
          src="/images/about-1.jpg"
          alt="Team member 3"
          className="w-40 h-40 lg:w-48 lg:h-48 rounded-full object-cover"
        />
        <img
          src="/images/about-1.jpg"
          alt="Team member 4"
          className="w-40 h-40 lg:w-48 lg:h-48 rounded-[25px] object-cover"
        />
      </div>

      {/* Right Side: Text Section */}
      <div className="lg:ml-16 max-w-lg text-center lg:text-left">
        <h2 className="text-4xl font-bold mb-6 text-black">About Us</h2>

        <p className="font-semibold text-lg text-gray-900 mb-4">
          Discover the power behind <span className="font-bold">Embrace</span> — 
          a movement to reshape the future of work.
        </p>

        <p className="text-gray-700 leading-relaxed">
          We’re building tools that free HR from routine and empower people to reach
          their full potential. Together, we’re not just managing work — we’re redefining it.
        </p>
      </div>
    </section>
  );
}
