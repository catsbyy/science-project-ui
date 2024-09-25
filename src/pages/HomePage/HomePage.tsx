import { useEffect, useState } from "react";
import "./HomePage.css";
import Lottie from "lottie-react";
import rocketAnimation from "./../../assets/rocketAnimation.json";

interface Props {}

function HomePage({}: Props) {
  const [statistics, setStatistics] = useState({ candidate_count: 0, business_count: 0 });

  const [rocketFly, setRocketFly] = useState(false);

  useEffect(() => {
    fetch("/api/get-meta-data/statistics")
      .then((response) => response.json())
      .then((data) => setStatistics(data))
      .catch((error) => console.error("Error fetching statistics:", error));
  }, []);

  return (
    <div className="home-page">
      <div className="intro">
        <div className="waves">
          <div className="wave -one"> </div>
          <div className="wave -two"></div>

          <div className="home-section">
            <h2 className="home-title">
              Знаходьте найкращих кандидатів та ідеальних роботодавців
              <br />
              <span
                className="accent"
                onClick={() => {
                  setRocketFly(!rocketFly);
                }}
              >
                швидко та легко.
              </span>
            </h2>
            <div className="home-content">
              {rocketFly && (
                <div className="rocket">
                  <Lottie animationData={rocketAnimation} />
                </div>
              )}

              <div className="statistics">
                <p className="statistics-text">
                  <span className="statistics-icon">&#128187;</span>
                  {statistics.candidate_count} кандидатів
                </p>{" "}
                <p className="statistics-text">
                  <span className="statistics-icon">&#128188;</span>
                  {statistics.business_count} роботодавців
                </p>
              </div>

              <div className="service-text">
                <p>вже користуються нашим сервісом</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
