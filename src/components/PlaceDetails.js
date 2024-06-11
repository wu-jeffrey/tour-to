import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaStar, FaClock, FaAngleDown, FaAngleUp } from 'react-icons/fa';

import { useTourContext } from '../context/TourContext';
import { getPlaceDetails } from '../api/googlePlacesApi';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const PlaceDetails = () => {
  const { currentLocationId } = useTourContext();
  const [place, setPlace] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!currentLocationId) return;
      try {
        const place = await getPlaceDetails(currentLocationId);
        setPlace(place);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentLocationId]);

  if (!place) return null;

  return (
    <div className="p-6">
      {place.displayName && <h1 className="text-2xl mb-4 text-gray-900">{place.displayName?.text}</h1>}
      {place.editorialSummary && (
        <div className="mb-6 pb-4 border-b">
          <p>{place.editorialSummary?.text}</p>
        </div>
      )}
      {place.photos && place.photos.length > 0 && (
        <div className="flex overflow-x-scroll space-x-4 mb-6">
          {place.photos?.map((photo, index) => (
            <img
              key={index}
              src={`https://places.googleapis.com/v1/places/${place.id}/photos/${photo.name.split('/')[3]}/media?maxWidthPx=1600&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
              alt="Place"
              height={400}
              width={400}
              className="bg-cover min-w-[200px] max-w-[200px] min-h-[200px] max-h-[200px] rounded-xl"
            />
          ))}
        </div>)
      }
      {place.formattedAddress && (
        <div className="border-t pt-4 mb-4 flex items-center">
          <FaMapMarkerAlt className="mr-4 text-blue-500" />
          <span>{place.formattedAddress}</span>
        </div>
      )}
      {place.rating && (
        <div className="border-t pt-4 mb-4 flex items-center">
          <FaStar className="mr-4 text-blue-500" />
          <span>{place.rating}</span>
        </div>
      )}
      {place.regularOpeningHours && (
        <div className="border-t pt-4 mb-4">
          <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
            <FaClock className="mr-4 text-blue-500" />
            {place.regularOpeningHours.openNow ? (
              <span className='font-semibold text-green-500'>Open Now</span>
            ) : (
              <span className='font-semibold text-orange-500'>Closed</span>
            )}
            {(place.regularOpeningHours.periods.length === 7) && (<span className="ml-2">{isDropdownOpen ? <FaAngleUp /> : <FaAngleDown />}</span>)}
          </div>
          {isDropdownOpen && (
            <div className="mt-2 ml-8">
              {(place.regularOpeningHours.periods.length === 7) && place.regularOpeningHours.periods.map((period, index) => (
                <div key={index} className="mt-1">
                  <span className='font-semibold'>{daysOfWeek[period.open.day]}</span> : {`${period.open.hour}:${period.open.minute === 0 ? '00' : period.open.minute} - ${period.close.hour}:${period.close.minute === 0 ? '00' : period.close.minute}`}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="border-b" />
      {place.reviews && place.reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Reviews</h2>
          {place.reviews.map((review, index) => (
            <div key={index} className="border-t pt-4 mb-4">
              <div className="flex items-center mt-2">
                <img
                  src={review.authorAttribution.photoUri}
                  alt="Author"
                  className="w-10 h-10 rounded-full mr-2"
                />
                <div>
                  <span className="font-semibold">{review.authorAttribution.displayName}</span>
                  <span className="block text-sm text-gray-500">{review.relativePublishTimeDescription}</span>
                </div>
              </div>
              <p className="mt-8">{review.text.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlaceDetails;
