import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Charts/charts.css";

const Charts = (props) => {
  const [chartsData, setChartsData] = useState(props.charts);

  return (
    <>
      <div className="charts-container">
        <div className="px-4">
          <div className="container-title">
            <h1 className="text-3xl font-bold mb-4">Top Charts</h1>
          </div>
          <div className="grid grid-cols-2 lg-grid-cols-2 gap-5 md:grid-cols-4 md:lg-grid-cols-4 md:gap-10">
            {chartsData.map((items, key) => (
              <article key={key} className="chart-card">
                <Link to={`playlist/${items.id}`} className="flex flex-col">
                  <img
                    src={items.image[2].link}
                    loading="lazy"
                    alt={items.image[2].link}
                    className="w-full h-32 object-cover mb-2"
                  />
                  <div className="card-info">
                    <h3 className="text-lg font-semibold text-center">
                      {items.title}
                    </h3>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Charts;