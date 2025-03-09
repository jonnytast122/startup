import Image from "next/image";

export default function ActivityPage() {
  return (
    <div>
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6">
        <div className="flex items-center space-x-3 p-5">
          <Image src="/images/activity.png" alt="" width={40} height={40} />
          <span className="font-custom text-3xl text-black">Activity</span>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md py-6 px-6">
        <h1 className="font-custom text-lg text-[#3F4648] inline-block">
          Date range:
        </h1>
      </div>
    </div>
  );
}
