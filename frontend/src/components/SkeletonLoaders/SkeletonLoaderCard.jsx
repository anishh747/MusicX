import React from 'react'

const SkeletonLoaderBox = () => {
    const skeletonArray = Array.from({ length: 4 });

    return (
        <div>
            <main className="p-4">
                <div className="flex flex-wrap">
                    {skeletonArray.map((_, index) => (
                        <div key={index} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-2">
                            <div className="rounded-lg shadow-md bg-gray-800">
                                <div className="rounded-lg h-48 bg-gray-700 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

const SkeletonLoaderCard = () => {
    const skeletonArray = Array.from({ length: 6 });

    return (
        <main className="p-4">
            <div className="flex flex-wrap">
                {skeletonArray.map((_, index) => (
                    <div key={index} className="w-full md:w-1/4 lg:w-1/5 xl:w-1/6 p-2">
                        <div className="rounded-lg shadow-mdbg-gray-800">
                            <div className="rounded-lg h-48 bg-gray-700 animate-pulse" />
                            <div className="p-4 space-y-2">
                                <div className="h-4 bg-gray-700 animate-pulse" />
                                <div className="h-3 bg-gray-700 w-3/4 animate-pulse" />
                                <div className="h-3 bg-gray-700 w-1/2 animate-pulse" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

const SkeletonLoaderHome = () => {
    return(
        <div>
            <SkeletonLoaderCard />
            <SkeletonLoaderCard />
            <SkeletonLoaderBox />
            <SkeletonLoaderCard />
            <SkeletonLoaderCard />
        </div>
    );
}

export { SkeletonLoaderCard, SkeletonLoaderBox };
export default SkeletonLoaderHome;