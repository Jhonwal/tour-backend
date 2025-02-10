import React, { useEffect, useState, useRef } from "react";
import useApi from "@/services/api";
import Loading from "@/services/Loading";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import DayDetails from "./components/DayDetails";
import ServiceTable from "./components/ServiceTable";
import TourPrices from "./components/TourPrices";
import { Reserve } from "./components/Reserve";
import { useParams } from "react-router-dom";

function TourDetails() {
  const api = useApi();
  const [tour, setTour] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const { id } = useParams(); 

  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  useEffect(() => {
    api.get(`/api/tour/slug/${id}`).then((response) => {
      const tourData = response.data;
      setTour(tourData);
      setMainImage(tourData.map_image);
      if (tourData.tour_days && tourData.tour_days.length > 0) {
        setSelectedDay(tourData.tour_days[0].id);
      }
    });
  }, [id]);

  if (!tour) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Promotional Banner */}
      {tour.promotions > 0 && (
        <div className="bg-gradient-to-r max-w-[90%] mx-auto from-orange-500 to-red-500 text-white p-4 mb-6 rounded-lg shadow-lg animate-pulse">
          <div className="flex justify-center items-center gap-4">
            <div className="text-3xl font-bold">🎉</div>
            <div className="text-center">
              <span className="text-2xl font-bold">Special Offer!</span>
              <br />
              <span className="text-xl">Save {tour.promotions}% on this amazing tour</span>
            </div>
            <div className="text-3xl font-bold">🎉</div>
          </div>
        </div>
      )}

      {/* Tour Title with Promo Badge */}
      <div className="relative max-w-[90%] text-center mb-8">
        <h1 className="text-2xl font-bold text-orange-700 inline-block">
          Tour: {tour.name}
          {tour.promotions > 0 && (
            <span className="absolute -top-4 -right-16 bg-red-500 text-white px-4 py-1 rounded-full text-sm transform rotate-12 shadow-lg">
              -{tour.promotions}% OFF!
            </span>
          )}
        </h1>
      </div>

      {/* Tour Overview */}
      <div className={`flex flex-col lg:flex-row gap-8 p-5 shadow-md ${tour.promotions > 0 ? 'shadow-red-300' : 'shadow-orange-300'}`}>
        {/* Left Section */}
        <div className="flex-1">
          <h2 className="text-3xl font-semibold mb-4 text-orange-700">
            Overview:
          </h2>
          <p className="text-md">{tour.description}</p>

          {/* Services Table */}
          <div className="mt-8">
            <h3 className="text-3xl font-semibold mb-4 text-orange-700">
              Services:
            </h3>
            <ServiceTable
              includedServices={tour.included_services}
              excludedServices={tour.excluded_services}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1">
          {/* Main Image with Promo Badge */}
          <div className="relative">
            <img
              src={mainImage}
              alt="Main"
              className="w-full h-64 object-cover object-center cursor-pointer rounded-lg"
              onClick={() => setIsModalOpen(true)}
            />
            {tour.promotions > 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg transform rotate-12">
                <div className="text-lg font-bold">SAVE</div>
                <div className="text-2xl font-bold">{tour.promotions}%</div>
              </div>
            )}
          </div>

          {/* Carousel */}
          <div className="mt-4">
            <Carousel
              opts={{ align: "start" }}
              className="w-full grid-flow-col"
              loop={true}
              plugins={[autoplayPlugin.current]}
              onMouseEnter={() => autoplayPlugin.current.stop()}
              onMouseLeave={() => autoplayPlugin.current.play()}
            >
              <CarouselContent>
                <CarouselItem className="basis-1/3 md:basis-1/4">
                  <div className="p-1">
                    <img
                      src={tour.map_image}
                      alt="Map Thumbnail"
                      className={`w-full h-24 object-cover rounded-lg cursor-pointer ${
                        tour.map_image === mainImage
                          ? "border-4 border-orange-500"
                          : "border border-gray-200"
                      }`}
                      onClick={() => setMainImage(tour.map_image)}
                    />
                  </div>
                </CarouselItem>

                <CarouselItem className="basis-1/3 md:basis-1/4">
                  <div className="p-1">
                    <img
                      src={tour.banner}
                      alt="Banner Thumbnail"
                      className={`w-full h-24 object-cover rounded-lg cursor-pointer ${
                        tour.banner === mainImage
                          ? "border-4 border-orange-500"
                          : "border border-gray-200"
                      }`}
                      onClick={() => setMainImage(tour.banner)}
                    />
                  </div>
                </CarouselItem>

                {tour.tour_images?.map((image) => (
                  <CarouselItem key={image.id} className="basis-1/3 md:basis-1/4">
                    <div className="p-1">
                      <img
                        src={image.url}
                        alt={`Tour Image ${image.id}`}
                        className={`w-full h-24 object-cover rounded-lg cursor-pointer ${
                          image.url === mainImage
                            ? "border-4 border-orange-500"
                            : "border border-gray-200"
                        }`}
                        onClick={() => setMainImage(image.url)}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Destinations */}
          <div className="mt-8">
            <h3 className="text-3xl font-semibold mb-4 text-orange-700">
              Destinations:
            </h3>
            <div className="mt-2">
              {tour.destinations?.map((destination) => (
                <span key={destination.id}>
                  {destination.name}: {destination.number_of_nights} nights |{" "}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tour Itinerary */}
      <div className="mt-12">
        <h3 className={`text-2xl font-semibold text-white ${tour.promotions > 0 ? 'bg-gradient-to-r from-orange-400 to-red-500' : 'bg-orange-300'} header-waguer border-b-8 border-orange-300 p-3 text-center`}>
          Tour Itinerary
        </h3>
        <div className="flex flex-wrap gap-2 mt-4">
          {tour.tour_days?.map((day) => (
            <button
              key={day.id}
              className={`text-orange-800 font-semibold px-4 py-2 rounded shadow-md ${
                selectedDay === day.id
                  ? tour.promotions > 0
                    ? "bg-red-200 border border-red-500"
                    : "bg-orange-200 border border-orange-500"
                  : "bg-gray-100 hover:bg-orange-100"
              }`}
              aria-expanded={selectedDay === day.id}
              aria-controls={`day-${day.id}-details`}
              onClick={() => setSelectedDay(selectedDay === day.id ? null : day.id)}
            >
              Day {day.number}: {day.title}
            </button>
          ))}
        </div>

        {selectedDay && (
          <div
            id={`day-${selectedDay}-details`}
            className="mt-6 p-4 bg-gray-100 rounded shadow-lg"
          >
            <DayDetails dayId={selectedDay} />
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-orange-300 bg-opacity-70 flex justify-center items-center"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative">
            <img src={mainImage} alt="Full Size" className="max-w-full max-h-full" />
          </div>
        </div>
      )}

      <TourPrices price={tour.price} promo={tour.promotions}/>
      <Reserve tourId={tour.id} name={tour.name} promo={tour.promotions}/>
    </div>
  );
}

export default TourDetails;