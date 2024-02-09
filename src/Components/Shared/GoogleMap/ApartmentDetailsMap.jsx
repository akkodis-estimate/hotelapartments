import React, { useRef, useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import PropertyIconMap from "Assets/Images/PropertyIcon.png";
import pointOfInterestIcon from "Assets/Images/Map Icons/08.png";
import airportIcon from "Assets/Images/Map Icons/07.png"
import hospitalIcon from "Assets/Images/Map Icons/06.png";
import lodgingIcon from "Assets/Images/Map Icons/09.png";
import shoppingIcon from "Assets/Images/Map Icons/04.png";
import busIcon from "Assets/Images/Map Icons/10.png";
import cityHallIcon from "Assets/Images/Map Icons/11.png";
import universityIcon from "Assets/Images/Map Icons/13.png";
import taxiIcon from "Assets/Images/Map Icons/05.png";
import cafeIcon from "Assets/Images/Map Icons/02.png";
import restaurantIcon from "Assets/Images/Map Icons/03.png";
import stadiumIcon from "Assets/Images/Map Icons/01.png";
import fireIcon from "Assets/Images/Map Icons/12.png"
import { useTranslation } from 'react-i18next';

const ApartmentDetailsMap = ({ lat, long, property, filterPlaces, zoom }) => {
    const mapRef = useRef(null);
    const { t } = useTranslation();
    const [openInfoWindow, setOpenInfoWindow] = useState(false);

    useEffect(() => {
        return () => {
            if (openInfoWindow) {
                openInfoWindow.close();
            }
        };
    }, [openInfoWindow]);

    const setMarkerCustomIcon = (type) => {
        if (type == "airport") {
            return airportIcon;
        }
        else if (type == "hospital") {
            return hospitalIcon;
        }
        else if (type == "stadium") {
            return stadiumIcon;
        }
        else if (type == "point_of_interest") {
            return pointOfInterestIcon;
        }
        else if (type == "lodging") {
            return lodgingIcon;
        }
        else if (type == "shopping_mall" || type == "supermarket") {
            return shoppingIcon;
        }
        else if (type == "bus_station") {
            return busIcon;
        }
        else if (type == "city_hall") {
            return cityHallIcon;
        }
        else if (type == "fire_station") {
            return fireIcon;
        }
        else if (type == "university") {
            return universityIcon;
        }
        else if (type == "taxi_stand") {
            return taxiIcon;
        }
        else if (type == "school" || type == "primary_school" || type == "secondary_school") {
            return universityIcon;
        }
        else if (type == "cafe") {
            return cafeIcon;
        }
        else if (type == "restaurant") {
            return restaurantIcon;
        }
        else if (type == "pharmacy") {
            return hospitalIcon;
        }
        else {
            return pointOfInterestIcon;
        }
    }

    useEffect(() => {
        const loader = new Loader({
            apiKey: process.env.REACT_APP_API_KEY,
            version: 'weekly',
            libraries: ['places'],
        });
        loader.load().then(() => {
            const map = new window.google.maps.Map(mapRef.current, {
                zoom: zoom || 11,
                styles: [
                    {
                        elementType: 'geometry',
                        stylers: [{ color: '#f5f5f5' }],
                    },
                    {
                        elementType: 'labels.icon',
                        //stylers: [{ visibility: 'off' }],
                    },
                    {
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#616161' }],
                        //stylers: [{ color: '#616161' }, {visibility: 'off'}],
                    },
                    {
                        elementType: 'labels.text.stroke',
                        stylers: [{ color: '#f5f5f5' }],
                    },
                    {
                        featureType: 'administrative.land_parcel',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#bdbdbd' }],
                    },
                    {
                        featureType: 'poi',
                        elementType: 'geometry',
                        stylers: [{ color: '#eeeeee' }],
                    },
                    {
                        featureType: 'poi',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#757575' }],
                    },
                    {
                        featureType: 'poi.park',
                        elementType: 'geometry',
                        stylers: [{ color: '#e5e5e5' }],
                    },
                    {
                        featureType: 'poi.park',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#9e9e9e' }],
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry',
                        stylers: [{ color: '#ffffff' }],
                    },
                    {
                        featureType: 'road',
                        elementType: 'labels.icon',
                        stylers: [{ visibility: 'off' }],
                    },
                    {
                        featureType: 'road.arterial',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#757575' }],
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'geometry',
                        stylers: [{ color: '#dadada' }],
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#616161' }],
                    },
                    {
                        featureType: 'road.local',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#9e9e9e' }],
                    },
                    {
                        featureType: 'transit.line',
                        elementType: 'geometry',
                        stylers: [{ color: '#e5e5e5' }],
                    },
                    {
                        featureType: 'transit.station',
                        elementType: 'geometry',
                        stylers: [{ color: '#eeeeee' }],
                    },
                    {
                        featureType: 'water',
                        elementType: 'geometry',
                        stylers: [{ color: '#c9c9c9' }],
                    },
                    {
                        featureType: 'water',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#9e9e9e' }],
                    },

                ],
            });
            //const placesService = new window.google.maps.places.PlacesService(map);
            // Geocode the address to get its location
            // geocoder.geocode({ address: `${property}, ${area}, ${city}, ${country}` }, (results, status) => {
            //     if (status === 'OK') {
            if (lat && long) {
                const customLatLng = new window.google.maps.LatLng(lat, long);
                // Set the center of the map to the location of the property
                //map.setCenter(results[0].geometry.location);
                map.setCenter(customLatLng);
                const customMarker = new window.google.maps.Marker({
                    position: customLatLng,
                    map: map,
                    title: property,
                    icon: {
                        url: PropertyIconMap, // Replace with your custom marker image URL
                        scaledSize: new window.google.maps.Size(34, 34), // Adjust the size as needed
                    },
                });

                // Loop through filterPlaces array
                filterPlaces?.forEach((place) => {
                    // Geocode the address for each place
                    //geocoder.geocode({ address: place.address }, (placeResults, placeStatus) => {
                    //if (placeStatus === 'OK') {
                    if (place?.lat && place?.long) {
                        const placeLatLng = new window.google.maps.LatLng(place.lat, place.long);
                        // Create a marker for each place and set its position on the map
                        const marker = new window.google.maps.Marker({
                            position: placeLatLng, //placeResults[0].geometry.location,
                            map: map,
                            title: place.place,
                            icon: {
                                url: setMarkerCustomIcon(place.type), // Replace with your custom marker image URL
                                scaledSize: new window.google.maps.Size(29, 29), // Adjust the size as needed,
                            },
                        });

                        const distance = place.distance ? Number(place.distance).toFixed(2) : 0;

                        const infowindow = new window.google.maps.InfoWindow({
                            content: `<div style="width: 200px;"><span style="font-size: 16px"><h6>${place.place}</h6></span><p style="margin-top: 7px">${place.address}</p><hr><p style="font-weight: 500; margin-top: 2px;">${distance + t("common_lables.away_from")}</p></div>`,
                        });

                        marker.addListener('click', () => {
                            if (openInfoWindow) {
                                openInfoWindow.close();
                            }
                            infowindow.open(map, marker);
                            setOpenInfoWindow(infowindow);
                        });

                        map.addListener('click', () => {
                            infowindow.close();
                        });


                    } else {
                        console.error('Geocode was not successful for the following reason: ');
                    }
                    //});
                });

                // placesService.nearbySearch(request, (results, status) => {
                //     if (status === 'OK') {
                //         // Add a marker for each place in the list
                //         results.forEach((place) => {
                //             const marker = new window.google.maps.Marker({
                //                 position: place.geometry.location,
                //                 map: map,
                //                 title: place.name,
                //             });

                //         });
                //     }
                // });

            } else {
                console.error('Geocode was not successful for the following reason: ');
            }
            // }
            // );
        });
    }, [lat, long, property, filterPlaces]);


    return (
        <>
            <div ref={mapRef} style={{ height: '400px', width: '100%' }}></div>
        </>
    );
}
export default ApartmentDetailsMap;