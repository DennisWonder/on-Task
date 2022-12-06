import React, { useState } from "react";
import Chart from "chart.js";
import { supabaseClient } from "../../config/supabase-client";
import moment from "moment";

export default function CardLineChart({ userId }) {
  // check number
  const [jan, setJan] = useState(0);
  const [feb, setFeb] = useState(0);
  const [mar, setMar] = useState(0);
  const [apr, setApr] = useState(0);
  const [may, setMay] = useState(0);
  const [jun, setJun] = useState(0);
  const [jul, setJul] = useState(0);
  const [aug, setAug] = useState(0);
  const [sep, setSep] = useState(0);
  const [oct, setOct] = useState(0);
  const [nov, setNov] = useState(0);
  const [dec, setDec] = useState(0);

  // check completions for

  const [janComplete, setJanComplete] = useState(0);
  const [febComplete, setFebComplete] = useState(0);
  const [marComplete, setMarComplete] = useState(0);
  const [aprComplete, setAprComplete] = useState(0);
  const [mayComplete, setMayComplete] = useState(0);
  const [junComplete, setJunComplete] = useState(0);
  const [julComplete, setJulComplete] = useState(0);
  const [augComplete, setAugComplete] = useState(0);
  const [sepComplete, setSepComplete] = useState(0);
  const [octComplete, setOctComplete] = useState(0);
  const [novComplete, setNovComplete] = useState(0);
  const [decComplete, setDecComplete] = useState(0);

  const getTasks = async function () {
    try {
      const { data, error } = await supabaseClient
        .from("tasks")
        .select("inserted_at, is_complete")
        .eq("user_id", userId);

      if (error) {
        throw error;
      } else {
        setJan(
          data.filter((task) => moment(task.inserted_at).format("MM") === "01")
            .length
        );
        setFeb(
          data.filter((task) => moment(task.inserted_at).format("MM") === "02")
            .length
        );
        setMar(
          data.filter((task) => moment(task.inserted_at).format("MM") === "03")
            .length
        );
        setApr(
          data.filter((task) => moment(task.inserted_at).format("MM") === "04")
            .length
        );
        setMay(
          data.filter((task) => moment(task.inserted_at).format("MM") === "05")
            .length
        );
        setJun(
          data.filter((task) => moment(task.inserted_at).format("MM") === "06")
            .length
        );
        setJul(
          data.filter((task) => moment(task.inserted_at).format("MM") === "07")
            .length
        );
        setAug(
          data.filter((task) => moment(task.inserted_at).format("MM") === "08")
            .length
        );
        setSep(
          data.filter((task) => moment(task.inserted_at).format("MM") === "09")
            .length
        );
        setOct(
          data.filter((task) => moment(task.inserted_at).format("MM") === "10")
            .length
        );
        setNov(
          data.filter((task) => moment(task.inserted_at).format("MM") === "11")
            .length
        );
        setDec(
          data.filter((task) => moment(task.inserted_at).format("MM") === "12")
            .length
        );

        // checkcomplete
        setJanComplete(
          data.filter(
            (task) =>
              moment(task.inserted_at).format("MM") === "01" &&
              task.is_complete === true
          ).length
        );
        setFebComplete(
          data.filter(
            (task) =>
              moment(task.inserted_at).format("MM") === "02" &&
              task.is_complete === true
          ).length
        );
        setMarComplete(
          data.filter(
            (task) =>
              moment(task.inserted_at).format("MM") === "03" &&
              task.is_complete === true
          ).length
        );
        setAprComplete(
          data.filter(
            (task) =>
              moment(task.inserted_at).format("MM") === "04" &&
              task.is_complete === true
          ).length
        );
        setMayComplete(
          data.filter(
            (task) =>
              moment(task.inserted_at).format("MM") === "05" &&
              task.is_complete === true
          ).length
        );
        setJunComplete(
          data.filter(
            (task) =>
              moment(task.inserted_at).format("MM") === "06" &&
              task.is_complete === true
          ).length
        );
        setJulComplete(
          data.filter(
            (task) =>
              moment(task.inserted_at).format("MM") === "07" &&
              task.is_complete === true
          ).length
        );
        setAugComplete(
          data.filter(
            (task) =>
              moment(task.inserted_at).format("MM") === "08" &&
              task.is_complete === true
          ).length
        );
        setSepComplete(
          data.filter(
            (task) =>
              moment(task.inserted_at).format("MM") === "09" &&
              task.is_complete === true
          ).length
        );
        setOctComplete(
          data.filter(
            (task) =>
              moment(task.inserted_at).format("MM") === "10" &&
              task.is_complete === true
          ).length
        );
        setNovComplete(
          data.filter(
            (task) =>
              moment(task.inserted_at).format("MM") === "11" &&
              task.is_complete === true
          ).length
        );
        setDecComplete(
          data.filter(
            (task) =>
              moment(task.inserted_at).format("MM") === "12" &&
              task.is_complete === true
          ).length
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  React.useEffect(() => {
    getTasks();
    var config = {
      type: "line",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: "Created Tasks",
            backgroundColor: "#3182ce",
            borderColor: "#3182ce",
            data: [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec],
            fill: false,
          },
          {
            label: "Completed Tasks",
            fill: false,
            backgroundColor: "#ed64a6",
            borderColor: "#ed64a6",
            data: [
              janComplete,
              febComplete,
              marComplete,
              aprComplete,
              mayComplete,
              junComplete,
              julComplete,
              augComplete,
              sepComplete,
              octComplete,
              novComplete,
              decComplete,
            ],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          fontColor: "black",
        },
        legend: {
          labels: {
            fontColor: "black",
          },
          align: "end",
          position: "bottom",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: "rgba(255,255,255,.7)",
              },
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Month",
                fontColor: "white",
              },
              gridLines: {
                display: false,
                borderDash: [2],
                borderDashOffset: [2],
                color: "rgba(33, 37, 41, 0.3)",
                zeroLineColor: "rgba(0, 0, 0, 0)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontColor: "rgba(255,255,255,.7)",
              },
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Value",
                fontColor: "white",
              },
              gridLines: {
                borderDash: [3],
                borderDashOffset: [3],
                drawBorder: false,
                color: "rgba(255, 255, 255, 0.15)",
                zeroLineColor: "rgba(33, 37, 41, 0)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
        },
      },
    };
    var ctx = document.getElementById("line-chart").getContext("2d");
    window.myLine = new Chart(ctx, config);
  }, [
    jan,
    feb,
    mar,
    apr,
    may,
    jun,
    jul,
    aug,
    sep,
    oct,
    nov,
    dec,
    janComplete,
    febComplete,
    marComplete,
    aprComplete,
    mayComplete,
    junComplete,
    julComplete,
    augComplete,
    sepComplete,
    octComplete,
    novComplete,
    decComplete,
  ]);
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                Overview
              </h6>
            </div>
          </div>
        </div>
        <div className="p-4 flex-auto">
          {/* Chart */}
          <div className="relative h-350-px">
            <canvas id="line-chart"></canvas>
          </div>
        </div>
      </div>
    </>
  );
}
