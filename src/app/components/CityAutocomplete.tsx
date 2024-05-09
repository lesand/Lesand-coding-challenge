import React, { useState, useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';

interface CityAutocompleteProps {
  city: string;
  hasErrors: boolean;
  onCityChange: (city: string) => void;
}

const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  city,
  hasErrors,
  onCityChange,
}) => {
  const [inputValue, setInputValue] = useState<string>(city);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        onCityChange(place.formatted_address || '');
        setInputValue(place.formatted_address || inputValue);
      }
    }
  };

  return (
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="search city..."
        className={`input ${hasErrors ? 'input-error' : ''}`}
      />
    </Autocomplete>
  );
};

export default CityAutocomplete;
