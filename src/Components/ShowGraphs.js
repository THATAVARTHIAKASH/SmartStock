import { useState, useEffect, useCallback } from "react";
import React  from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";

import ShowModules from "./ShowModules";

import { format, parseJSON } from "date-fns";

const FIELDS = ["field1", "field2", "field3", "field4", "field5", "field6", "field7", "field8"];
const LINE_COLORS = [
  "#0288D1",
  "#880E4F",
  "#1A237E",
  "#00796B",
  "#546E7A",
  "#689F38",
  "#0D47A1",
  "#303F9F",
  "#ff6f00",
  "#616161",
];

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ShowGraphs = ({ feeds, channel, fetchFeeds }) => {
  const [data, setData] = useState([]);
  const [allFieldsData, setAllFieldsData] = useState(null);

  const makeData = useCallback(() => {
    let allGraphsArray = [];
    FIELDS.forEach((field, index) => {
      if (channel[field]) {
        let graphData = {
          data: {
            labels: [],
            datasets: [
              {
                label: channel[field],
                data: [],
                borderColor: LINE_COLORS[index],
                backgroundColor: LINE_COLORS[index],
              },
            ],
          },
          options: {
            responsive: true,
            text: channel[field],
            borderWidth: 2,
            interaction: {
              mode: "index",
              intersect: false,
            },
            stacked: false,
            plugins: {
              title: {
                display: true,
                text: channel[field] + " Field",
              },
            },
          },
        };
        feeds.forEach((feed) => {
          graphData.data.labels.push(format(parseJSON(feed.created_at), "h:m bbb"));
          graphData.data.datasets[0].data.push(feed[field]);
        });
        allGraphsArray.push(graphData);
      }
    });
    setData(allGraphsArray);
  }, [feeds, channel]);

  const makeAllFieldsData = useCallback(() => {
    let allFieldsData = {
      options: {
        responsive: true,
        borderWidth: 2,
        interaction: {
          mode: "index",
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: "All Fields",
          },
        },
      },
      data: {
        labels: [],
        datasets: [],
      },
    };
    FIELDS.forEach((field, index) => {
      if (channel[field]) {
        allFieldsData.data.datasets[index] = {
          label: channel[field],
          data: [],
          borderColor: LINE_COLORS[index],
          backgroundColor: LINE_COLORS[index],
        };
        feeds.forEach((feed) => {
          if (index === 0) allFieldsData.data.labels.push(format(parseJSON(feed.created_at), "h:m bbb"));
          allFieldsData.data.datasets[index].data.push(feed[field]);
        });
      }
    });
    setAllFieldsData(allFieldsData);
  }, [feeds, channel]);

  useEffect(() => {
    makeData();
    makeAllFieldsData();
  }, [makeData, makeAllFieldsData]);

  return (
    <Box>
      <Box>
        <Button endIcon={<RefreshIcon />} variant="outlined" onClick={fetchFeeds}>
          Refresh
        </Button>
      </Box>
      {data.map((graph, index) => {
        return (
          <Paper key={index} elevation={2} sx={{ my: 2, p: 2, width: "99.8%" }}>
            <Line data={graph.data} options={graph.options} />
          </Paper>
        );
      })}
      <Divider />

      {allFieldsData && (
        <Paper elevation={2} sx={{ my: 2, p: 2, width: "99.8%" }}>
          <Line data={allFieldsData.data} options={allFieldsData.options} />
        </Paper>
      )}
      {/* {channel.modules && channel.modules.length > 0 && <ShowModules channel={channel} />}? */}
      {feeds.length && channel.modules && channel.modules.length > 0 && <ShowModules channel={channel} feeds={feeds} />}
    </Box>
  );
};

export default ShowGraphs;
