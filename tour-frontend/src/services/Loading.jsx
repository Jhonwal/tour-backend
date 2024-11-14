const Loading = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            {/* Outer spinning border */}
            <div className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 border-4 border-transparent text-4xl animate-spin flex items-center justify-center border-t-orange-600 rounded-full">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-72 lg:h-72 xl:w-80 xl:h-80 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-blue-300 rounded-full"></div>
            </div>
            {/* Static image inside the spinning divs */}
            <img
                src={`/images/waguer.png`}
                alt="Loading"
                className="absolute w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-48 lg:h-48 xl:w-56 xl:h-56 object-contain animate-ping"
            />
        </div>
    );
};

export default Loading;
