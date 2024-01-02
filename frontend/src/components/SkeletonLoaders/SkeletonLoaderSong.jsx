import React from "react";

const SkeletonLoaderSingleSong = () => {
  return (
    <div className="mt-4 rounded-md">
      <div className="flex justify-center items-center space-x-4">
        <div className="h-16 w-16 rounded-full bg-gray-700 animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 w-[350px] bg-gray-700 animate-pulse" />
          <div className="h-3 w-[250px] bg-gray-700 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

const SkeletonLoaderSong = () => {
  const skeletonArray = Array.from({ length: 10 });

  return (
    <div>
      {skeletonArray.map((_, index) => (
        <SkeletonLoaderSingleSong key={index} />
      ))}
    </div>
  );
};

export default SkeletonLoaderSong;
