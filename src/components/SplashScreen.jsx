import splashGif from "../assets/logo/logo.gif";
import './Splash.css';

export default function SplashScreen() {
  return (
    <div className="splash-root">
      <img
        src={splashGif}
        alt="XL Convenience"
        className="splash-gif"
      />
    </div>
  );
}
