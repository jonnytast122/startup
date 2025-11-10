export default function AboutUs() {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-center min-h-screen px-10 py-20 bg-white">
      {/* Left Side: Image Grid */}
      <div className="grid grid-cols-2 gap-6 flex-shrink-0 mb-10 lg:mb-0">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/anan-image.appspot.com/o/avatar%2FIMG_3467.JPG?alt=media&token=717e8bcc-b8fc-48f6-b49c-9c7ac1aca60b"
          alt="Team member 1"
          className="w-40 h-40 lg:w-48 lg:h-48 rounded-[25px] object-cover"
        />
        <img
          src="https://firebasestorage.googleapis.com/v0/b/anan-image.appspot.com/o/avatar%2FIMG_3387.JPG?alt=media&token=0fb62074-f0c9-4d01-95ea-36ada6865c53"
          alt="Team member 2"
          className="w-40 h-40 lg:w-48 lg:h-48 rounded-full object-cover"
        />
        <img
          src="https://firebasestorage.googleapis.com/v0/b/anan-image.appspot.com/o/avatar%2FIMG_3385.JPG?alt=media&token=dafca77a-51ce-48f2-a8e1-60bd0fa11da0"
          alt="Team member 3"
          className="w-40 h-40 lg:w-48 lg:h-48 rounded-full object-cover"
        />
        <img
          src="https://firebasestorage.googleapis.com/v0/b/anan-image.appspot.com/o/avatar%2FIMG_3395.JPG?alt=media&token=80be6ce2-cf32-4888-bd5a-148dee0d0aef"
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
          We’re building tools that free HR from routine and empower people to
          reach their full potential. Together, we’re not just managing work —
          we’re redefining it.
        </p>
      </div>
    </section>
  );
}
