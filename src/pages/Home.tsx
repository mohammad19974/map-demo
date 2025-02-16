import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import React, { useEffect, useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import axios from 'axios'
import { App } from '@capacitor/app';

const url = "https://expenses-33.hasura.app/api/rest/DEMO";
const headers = {
  "Content-Type": "application/json",
  "x-hasura-admin-secret": "S10gxN0UoGiiOKIq9WFVEAxXwHEPJ0fbgJUn7F9qQVUiycpUpF90DXoveykPtZ07"
};
function openGoogleMaps(latitude: number, longitude: number) {
  window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_system');
}

const Home: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Request permissions when the component mounts
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const permissionStatus = await Geolocation.checkPermissions();
        if (permissionStatus.location === "granted") {
          setHasPermission(true);
        } else {
          setHasPermission(false);
          await Geolocation.requestPermissions();
        }
      } catch (err) {
        console.error("Error checking permissions:", err);
        setHasPermission(false);
      }
    };
    checkPermissions();
  }, []);

  // Function to get location with retries
  const getCurrentLocation = async (attempt = 1) => {
    if (hasPermission === false) {
      setError("Location permission not granted. Please enable it in settings.");
      return;
    }

    try {
      const position = await Geolocation.getCurrentPosition();
      if (position.coords.latitude && position.coords.longitude) {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

const data = {
  object: {
    latitude: String(position.coords.latitude),
    longitude: String(position.coords.longitude)
  }
};
await axios.post(url, data, { headers })
openGoogleMaps(position.coords.latitude, position.coords.longitude)



      } else if (attempt < 3) {
        console.warn(`Retrying... Attempt ${attempt + 1}`);
        setTimeout(() => getCurrentLocation(attempt + 1), 1000);
      } else {
        setError("Failed to get location after multiple attempts.");
      }
    } catch (err) {
      console.error("Error getting location:", err);
      setError("Error getting location. Please try again.");
    }
  };
  useEffect(() => {
    getCurrentLocation()
  },[])
  return (
    <IonPage>
     
      <IonContent style={{
      }} fullscreen>
        <div style={{
          height:"100%",
                  backgroundImage:"url('https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/w_2240,c_limit/GoogleMapTA.jpg')",

        }}>
          
</div>

      </IonContent>
    </IonPage>
  );
};

export default Home;
