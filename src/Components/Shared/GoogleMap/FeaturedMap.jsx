import React, { useRef, useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import "Components/Shared/GoogleMap/FeaturedMap.css"
import MarkerClusterer from '@googlemaps/markerclustererplus';
import PropertyIconMap from "Assets/Images/PropertyIconMap.png";
import PropertiesCard from 'Pages/Properties/FeaturedProperties/Components/PropertiesCard/PropertiesCard';
import ReactDOM from 'react-dom';
import { BsXCircle } from 'react-icons/bs';
import validationHelper from "Helpers/validationHelper";
import { useTranslation } from 'react-i18next';

const FeaturedMap = ({ propertyDetails, locationValue, quotationSID, selectedStartDate, selectedEndDate, maximumMap, specialOffer }) => {
    const mapRef = useRef(null);
    const [openInfoWindow, setOpenInfoWindow] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        return () => {
            if (openInfoWindow) {
                openInfoWindow.close();
            }
        };
    }, [openInfoWindow]);

    useEffect(() => {
        const loader = new Loader({
            apiKey: process.env.REACT_APP_API_KEY,
            version: 'weekly',
            libraries: ['places'],
        });
        loader.load().then(() => {

            if (!window.google || !window.google.maps) {
                // Handle error: Google Maps API not available
                return;
            }


            const geocoder = new window.google.maps.Geocoder();
            const map = new window.google.maps.Map(mapRef.current, {
                zoom: locationValue?.entity_name === 'area' || locationValue?.entity_name === 'property' ? 13 : 10.5,
                zoomControl: false,
                fullscreenControl: false,
                mapTypeControlOptions: {
                    position: window.google.maps.ControlPosition.RIGHT_TOP,
                },
                styles: [
                    {
                        elementType: 'geometry',
                        stylers: [{ color: '#f5f5f5' }],
                    },
                    {
                        elementType: 'labels.icon',
                        stylers: [{ visibility: 'off' }],
                    },
                    {
                        elementType: 'labels.text.fill',
                        //stylers: [{ color: '#616161' }],
                        stylers: [{ color: '#616161' }, { visibility: 'off' }],
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

                    //Remove Labels or Tex
                    // {
                    //     featureType: 'poi',
                    //     elementType: 'labels',
                    //     stylers: [{ visibility: 'off' }],
                    // },
                    // {
                    //     featureType: 'poi.business',
                    //     stylers: [{ visibility: 'off' }],
                    // },
                    // {
                    //     featureType: 'transit',
                    //     elementType: 'labels.icon',
                    //     stylers: [{ visibility: 'off' }],
                    // },
                    // {
                    //     featureType: 'road',
                    //     elementType: 'labels',
                    //     stylers: [{ visibility: 'off' }],
                    //   },
                ],
                //scrollwheel: true
            });

            if (!maximumMap) {
                map.setOptions({ scrollwheel: true });
            }

            if (locationValue?.entity_name && locationValue?.name && (locationValue?.entity_name === 'city' || locationValue?.entity_name === 'area')) {
                geocoder.geocode({ address: locationValue?.name }, (results, status) => {
                    //debugger
                    if (status === window.google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0]?.geometry.location);
                    }
                    else {
                        if (propertyDetails && propertyDetails.length > 0) {
                            const firstPlace = propertyDetails[0];
                            const { latitude, longitude } = firstPlace;
                            const location = new window.google.maps.LatLng(latitude, longitude);
                            map.setCenter(location);
                        } else {
                            if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(
                                    (position) => {
                                        const { latitude, longitude } = position.coords;
                                        const userLocation = new window.google.maps.LatLng(latitude, longitude);
                                        map.setCenter(userLocation);
                                    },
                                    (error) => {
                                        console.error('Error getting current position:', error);
                                        // Set a fallback location if geolocation fails
                                        const fallbackLocation = new window.google.maps.LatLng(
                                            25.2048, // Default latitude
                                            55.2708 // Default longitude
                                        );
                                        map.setCenter(fallbackLocation);
                                    }
                                );
                            } else {
                                console.error('Geolocation is not supported by this browser.');
                                // Set a fallback location if geolocation is not supported
                                const fallbackLocation = new window.google.maps.LatLng(
                                    25.2048, // Default latitude
                                    55.2708 // Default longitude
                                );
                                map.setCenter(fallbackLocation);
                            }
                        }
                    }
                })
            }
            else {
                if (propertyDetails && propertyDetails.length > 0) {
                    const firstPlace = propertyDetails[0];
                    const { latitude, longitude } = firstPlace;
                    const location = new window.google.maps.LatLng(latitude, longitude);
                    map.setCenter(location);
                } else {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                const { latitude, longitude } = position.coords;
                                const userLocation = new window.google.maps.LatLng(latitude, longitude);
                                map.setCenter(userLocation);
                            },
                            (error) => {
                                console.error('Error getting current position:', error);
                                // Set a fallback location if geolocation fails
                                const fallbackLocation = new window.google.maps.LatLng(
                                    25.2048, // Default latitude
                                    55.2708 // Default longitude
                                );
                                map.setCenter(fallbackLocation);
                            }
                        );
                    } else {
                        console.error('Geolocation is not supported by this browser.');
                        // Set a fallback location if geolocation is not supported
                        const fallbackLocation = new window.google.maps.LatLng(
                            25.2048, // Default latitude
                            55.2708 // Default longitude
                        );
                        map.setCenter(fallbackLocation);
                    }
                }
            }


            if (propertyDetails) {
                const markers = [];
                //priceMarkers add for second icon which is price icon
                const priceMarkers = [];
                propertyDetails.forEach((place, index) => {
                    //debugger
                    const lat = Number(place.latitude);
                    const lng = Number(place.longitude);

                    const apartmentDetailsArr = place?.apartment_details;
                    let minStrikePrice = 0;
                    if (apartmentDetailsArr && apartmentDetailsArr?.length > 1) {
                        // Use reduce to find the minimum strike_price
                        minStrikePrice = apartmentDetailsArr?.reduce((min, apartment) => {
                            const strikePrice = apartment?.striked_price;
                            return strikePrice < min ? strikePrice : min;
                        }, apartmentDetailsArr[0]?.striked_price); // Initialize with the first element's strike_price
                    }

                    const priceLabel = {
                        // text: place.minimum_price === place.maximum_price ? `Starts from ${place.currency_code_display} ${place.minimum_price}` : `Starts from ${place.currency_code_display} ${place.minimum_price} to ${place.maximum_price}`,
                        //text: `${place.currency_code_display} ${validationHelper.formatFloatValue(place.minimum_price)}/${t("common_lables.month")}`,
                        text: place?.apartment_details?.length > 1 ? `${t("pages.properties.card.from")} ${place.currency_code_display} ${validationHelper.formatFloatValue(minStrikePrice)}/${t("common_lables.month")}` : `${place.currency_code_display} ${validationHelper.formatFloatValue(place?.apartment_details[0]?.striked_price)}/${t("common_lables.month")}`,
                        color: '#00000',
                        fontWeight: 'bold'
                    };

                    const minPriceLength = place?.apartment_details?.length > 1 ? minStrikePrice.toString().length + 8 : place?.apartment_details[0]?.striked_price.toString().length + 6;
                    const borderRadius = 5;


                    const markerIcon = {
                        url: PropertyIconMap, // Replace with the path to your custom marker icon image
                        size: new window.google.maps.Size(32, 32), // Adjust the size as needed
                        origin: new window.google.maps.Point(0, 0),
                        anchor: new window.google.maps.Point(16, 16), // Adjust the anchor position as needed,
                        labelOrigin: new window.google.maps.Point(28, 4),
                        label: {
                            text: `${place?.apartment_details?.length}`, // Use the dynamic count value here
                            color: 'black', // Customize the color of the count text
                            fontWeight: 'bold', // Customize the font weight of the count text
                        },
                    };


                    // const markerIcon = {
                    //     //path: 'M -16 -8 L 16 -8 L 16 8 L -16 8 Z', // Path to draw a square box
                    //     path: `M -${minPriceLength * 4} -7 
                    //            L ${minPriceLength * 4} -7 
                    //            L ${minPriceLength * 4} 7 
                    //            L -${minPriceLength * 4} 7 Z`, // Path to create the marker icon

                    //     fillColor: '#ffffff', // Fill color of the box
                    //     fillOpacity: 1, // Opacity of the fill color
                    //     strokeColor: '#ffffff', // Stroke color of the box
                    //     strokeWeight: 1, // Stroke weight of the box
                    //     scale: 1.5, // Scale of the marker icon
                    // };

                    const priceMarkerIcon = {
                        //path: 'M -16 -8 L 16 -8 L 16 8 L -16 8 Z', // Path to draw a square box
                        path: `M -${minPriceLength * 5} 7 
                               L ${minPriceLength * 5} 7
                               L ${minPriceLength * 5} 22 
                               L -${minPriceLength * 5} 22 Z`, // Path to create the marker icon

                        fillColor: '#ffffff', // Fill color of the box
                        fillOpacity: 1, // Opacity of the fill color
                        strokeColor: '#ffffff', // Stroke color of the box
                        strokeWeight: 1, // Stroke weight of the box
                        scale: 1.5, // Scale of the marker icon
                        labelOrigin: new window.google.maps.Point(0, 14),
                    };

                    const marker = new window.google.maps.Marker({
                        position: { lat, lng },
                        map,
                        title: place.property_name,
                        label: place?.apartment_details != null && place?.apartment_details?.length > 0 ? markerIcon?.label : "",
                        icon: markerIcon
                    });

                    const priceMarker = new window.google.maps.Marker({
                        position: { lat, lng },
                        map,
                        title: place.property_name,
                        label: priceLabel,
                        icon: priceMarkerIcon
                    });

                    // ${place.image_url && place.image_url != "" ? `<img src="${place.image_url}" alt="Property Image" style="border-radius: 10px; margin-bottom: 10px" width="100%" height="100"> <br>` : ''}
                    // ${place.image_url && place.image_url != "" ? `<img src="${place.image_url}" style="border-radius: 10px; margin-bottom: 10px" alt="Property Image" width="100%" height="100"> <br>` : ''}


                    // const infowindow = new window.google.maps.InfoWindow({
                    //     content: place.minimum_price === place.maximum_price ?
                    //         `<div style="width: 200px;">
                    //     ${place.image_url && place.image_url !== "" ? `<img src="${place.image_url?.replace(/\/([^/]+)$/, '/thumb_$1')}" alt="Property Image" style="border-radius: 10px; margin-bottom: 10px" width="100%" height="100" onerror="this.src='${place.image_url}'"> <br>` : ''}

                    //     <strong>${place.property_name}</strong>
                    //     <br> Starts from <b>${place.currency_code_display} ${place.minimum_price}</b>
                    //     <br> ${place.area_name},
                    //     ${place.city_name},
                    //     <br>${place.country_name}
                    //     ` :

                    //         `<div style="width: 200px;">
                    //         ${place.image_url && place.image_url !== "" ? `<img src="${place.image_url?.replace(/\/([^/]+)$/, '/thumb_$1')}" alt="Property Image" style="border-radius: 10px; margin-bottom: 10px" width="100%" height="100" onerror="this.src='${place.image_url}'"> <br>` : ''}
                    //     <strong>${place.property_name}</strong>
                    //     <br> Starts from <b>${place.currency_code_display} ${place.minimum_price} to ${place.maximum_price}</b></div>
                    //     ${place.area_name},
                    //     ${place.city_name},
                    //     <br>${place.country_name}`,
                    // });

                    const TitleComponent = () => {
                        const handleTitleClick = () => {
                            infowindow.close();
                        };

                        return (
                            <div className='inMapTitle'>
                                <span>{place?.property_name}</span>
                                <button className='bg-transparent p-0 border-0' onClick={handleTitleClick}>
                                    <BsXCircle size={22} />
                                </button>
                            </div>
                        );
                    };

                    const apartmentDetailsContent = place?.apartment_details?.map((apartment, index) => {
                        return (
                            <>

                                <div className='inMapPropertyCard mt-3'>
                                    <PropertiesCard
                                        key={index}
                                        data={apartment}
                                        isFromMainList={true}
                                        quotationSID={quotationSID}
                                        selectedStartDate={selectedStartDate}
                                        selectedEndDate={selectedEndDate}
                                        specialOffer={specialOffer}
                                    />
                                </div>
                            </>
                        );
                    });

                    // Render the React component to HTML
                    // const div = document.createElement('div');
                    // ReactDOM.render(apartmentDetailsContent, div);
                    // div.className = 'infowindow-content d-flex flex-column gap-3';

                    // Create a div for the apartment details content
                    const apartmentDetailsDiv = document.createElement('div');
                    ReactDOM.render(apartmentDetailsContent, apartmentDetailsDiv);

                    // Create a container div for the entire infowindow content
                    const infowindowContentDiv = document.createElement('div');
                    infowindowContentDiv.className = 'infowindow-content';

                    // Render the TitleComponent and append it to the infowindow container
                    ReactDOM.render(<TitleComponent />, infowindowContentDiv);
                    infowindowContentDiv.appendChild(apartmentDetailsDiv);

                    // Create the Google Maps InfoWindow
                    const infowindow = new window.google.maps.InfoWindow({
                        content: infowindowContentDiv
                    });

                    marker.addListener('click', () => {
                        if (infowindow.getMap()) {
                            infowindow.close();
                        } else {
                            infowindow.open(map, marker);
                        }
                    });

                    marker.addListener('click', () => {
                        if (openInfoWindow) {
                            openInfoWindow.close();
                        }
                        infowindow.open(map, marker);
                        setOpenInfoWindow(infowindow);
                    });

                    priceMarker.addListener('click', () => {
                        if (infowindow.getMap()) {
                            infowindow.close();
                        } else {
                            infowindow.open(map, priceMarker);
                        }
                    });

                    priceMarker.addListener('click', () => {
                        if (openInfoWindow) {
                            openInfoWindow.close();
                        }
                        infowindow.open(map, priceMarker);
                        setOpenInfoWindow(infowindow);
                    });

                    markers.push(marker);
                    priceMarkers.push(priceMarker);

                    map.addListener('click', () => {
                        infowindow.close();
                    });
                });

                // Create a MarkerClusterer to cluster the markers
                const markerCluster = new MarkerClusterer(map, markers, {
                    imagePath:
                        'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
                    gridSize: 60, // Adjust the grid size as needed
                    maxZoom: 15, // Adjust the maxZoom as needed
                });

                const markerCluster1 = new MarkerClusterer(map, priceMarkers, {
                    imagePath:
                        'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
                    gridSize: 60, // Adjust the grid size as needed
                    maxZoom: 15, // Adjust the maxZoom as needed
                });
            }
        });
    }, [propertyDetails, maximumMap]);


    return (
        <>
            <div ref={mapRef} style={{ height: '100%', width: '100%', borderRadius: '10px 0px 0px 10px' }}></div>
        </>
    );
}
export default FeaturedMap;