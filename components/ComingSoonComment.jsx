"use client";

const ComingSoonComment = () => {
  return (
    <div className="relative isolate overflow-hidden flex items-center justify-center min-h-screen px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] rounded-full" />

      <div className="mx-auto max-w-2xl lg:max-w-4xl text-center space-y-20">
        <img
          alt=""
          src="https://firebasestorage.googleapis.com/v0/b/anan-image.appspot.com/o/ANAN-text.png?alt=media&token=f696243c-b9fe-42a4-9292-09823548fedc"
          className="mx-auto w-32"
        />

        <figure>
          <blockquote className="text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
            <p>
              “The future of management is here, and it's more accessible than
              ever.”
            </p>
          </blockquote>
          <figcaption className="mt-6 flex flex-col items-center space-y-3">
            <img
              alt=""
              src="https://firebasestorage.googleapis.com/v0/b/anan-image.appspot.com/o/avatar%2FIMG_3387.JPG?alt=media&token=0fb62074-f0c9-4d01-95ea-36ada6865c53"
              className="h-24 w-24 rounded-full"
            />
            <div className="text-base font-semibold text-gray-900">
              Ms. Hay Lyna
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <span>Co-Founder of</span>
              <span className="text-blue-400">Anan</span>
            </div>
          </figcaption>
        </figure>

        <figure>
          <blockquote className="text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
            <p>“No Risk, No Ferrari”</p>
          </blockquote>
          <figcaption className="mt-6 flex flex-col items-center space-y-3">
            <img
              alt=""
              src="https://firebasestorage.googleapis.com/v0/b/anan-image.appspot.com/o/avatar%2FIMG_3385.JPG?alt=media&token=dafca77a-51ce-48f2-a8e1-60bd0fa11da0"
              className="h-24 w-24 rounded-full"
            />
            <div className="text-base font-semibold text-gray-900">
              Mr. Veiy Sokheng
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <span>Co-Founder of</span>
              <span className="text-blue-400">Anan</span>
            </div>
          </figcaption>
        </figure>
      </div>
    </div>
  );
};

export default ComingSoonComment;
