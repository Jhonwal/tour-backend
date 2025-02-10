import useApi from "@/services/api";
import Loading from "@/services/Loading";
import React, { useEffect, useState, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


const DayDetails = ({ dayId }) => {
  const api = useApi();
  const [day, setDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false }) // Autoplay carousel
  );

  useEffect(() => {
    const fetchDayDetails = async () => {
      try {
        const response = await api.get(`/api/tour/day/${dayId}`);
        setDay(response.data);
        setMainImage(response.data.day_images[0]?.url || null); // Set the first image as the main image
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching day details");
        setLoading(false);
      }
    };

    fetchDayDetails();
  }, [dayId]);

  if (loading) {
    return <Loading />;
  }
  const hotels = day?.hotels ? JSON.parse(day.hotels) : [];
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <>
        <div className="p-2 bg-orange-200">        
            <h1 className="text-2xl font-semibold font-verdana text-orange-800 text-center">{day.name}</h1>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 bg-white shadow-md rounded-lg p-2">
            {/* Right Section: Description and Activities */}
            <div className="lg:w-1/2">
                {/* Day Name and Description */}
                <div className="mb-6">
                <p className="text-gray-500 mt-2">{day.description}</p>
                </div>

                {/* Activities Section */}
                <div className="mt-6">
                <h2 className="text-xl font-semibold font-verdana text-orange-700">Activities :</h2>
                    {day.activities.length > 0 ? (
                        day.activities.map((activity) => (
                            <p key={activity.id}>
                            <TooltipProvider>
                                <Tooltip>
                                <TooltipTrigger>{activity.activites?.activity_name || "Unnamed Activity"}</TooltipTrigger>
                                <TooltipContent>
                                    {activity.activites?.activity_description ||
                                        "No description provided."}
                                </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            </p>
                        ))
                        ) : (
                        <p>No activities available.</p>
                    )}
                </div>
                {hotels.length > 0 && (
                    <div className="mt-6 p-2">
                        <h3 className="text-2xl font-bold text-orange-500 mb-4">Stay At:</h3>
                        <p className="text-sm text-orange-600 mb-4 italic">
                            Click on a hotel name to see more details.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {hotels.map((hotel, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="p-2">
                                        <a
                                            href={hotel.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-orange-700 hover:text-orange-900 font-semibold text-lg hover:underline transition duration-300"
                                        >
                                            {hotel.name}
                                        </a>
                                        <p className="text-sm text-gray-600 mt-2">{hotel.description}</p> {/* Add a description to your hotel data */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="lg:w-1/2 text-center place-content-center">
                {mainImage && (
                    <div>
                    <img
                        src={mainImage}
                        alt="Main Day Image"
                        className="rounded-lg shadow-md object-cover w-full h-64 cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                    />
                    </div>
                )}

                {/* Carousel for Other Images */}
                {day.day_images.length > 0 ? (
                    <div className="mt-4">
                    <Carousel
                        opts={{
                        align: "start",
                        }}
                        className="w-full"
                        loop={true}
                        plugins={[autoplayPlugin.current]}
                        onMouseEnter={() => autoplayPlugin.current.stop()}
                        onMouseLeave={() => autoplayPlugin.current.play()}
                    >
                        <CarouselContent>
                        {day.day_images.map((image) => (
                            <CarouselItem key={image.id} className="basis-1/3 md:basis-1/4">
                            <div className="p-1 my-auto">
                                <img
                                src={image.url}
                                alt={`Day ${day.number} Thumbnail`}
                                className={`rounded-lg shadow-md cursor-pointer object-cover ${
                                    image.url === mainImage
                                    ? "border-2 border-orange-500"
                                    : "border border-gray-200"
                                }`}
                                onClick={() => setMainImage(image.url)} // Update the main image on click
                                />
                            </div>
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                    </Carousel>
                    </div>
                ) : (
                    <p className="text-red-500 mx-auto place-content-center">No images available for this day.</p>
                )}
                </div>

            {/* Image Modal */}
            {isModalOpen && (
                <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
                onClick={() => setIsModalOpen(false)}
                >
                <div className="relative">
                    <img
                    src={mainImage}
                    alt="Full Size Day Image"
                    className="max-w-screen-lg max-h-screen"
                    />
                </div>
                </div>
            )}
        </div>
    </>
  );
};

export default DayDetails;

