import { useState } from "react";

export default function SignupForBeta() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Sending via mailto: opens user's email client
    const subject = encodeURIComponent("Beta Signup Request");
    const body = encodeURIComponent(`Please sign me up for beta: ${email}`);
    window.location.href = `mailto:you@domain.com?subject=${subject}&body=${body}`;
    setEmail("");
  };

  return (
    <div className="max-w-md mx-auto my-8 z-30">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row items-center md:justify-between w-full"
      >
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-80 md:w-full lg:w-full px-4 py-3 bg-gray-900 bg-opacity-10 backdrop-blur-md border border-gray-50 placeholder-gray-50 placeholder-opacity-75 focus:outline-none focus:ring-2 focus:ring-gray-50 focus:ring-opacity-50 text-gray-900 mb-4 md:mb-0 md:mr-2"
        />
        <button
          type="submit"
          className="w-80 md:w-full lg:w-full px-4 py-3 bg-gray-50 bg-opacity-30 backdrop-blur-sm hover:bg-gray-900 hover:text-white transition"
        >
          Notify me
        </button>
      </form>
    </div>
  );
}
