// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import Calendar from './components/Calendar';
import useLoadGoogleMapsScript from './hooks/useLoadGoogleMapsScript';


export function App() {
  useLoadGoogleMapsScript(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
  return (
    <div>
      <Calendar/>
    </div>
  );
}

export default App;
