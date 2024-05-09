import { useEffect } from 'react';

const useLoadGoogleMapsScript = (apiKey: string) => {
    useEffect(() => {
        if (!document.getElementById('google-maps-script')) {
            const script = document.createElement('script');
            script.id = 'google-maps-script';
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=en`;
            script.async = true;
            document.head.appendChild(script);

            return () => {
                document.head.removeChild(script);
            };
        }
    }, [apiKey]);
};

export default useLoadGoogleMapsScript;