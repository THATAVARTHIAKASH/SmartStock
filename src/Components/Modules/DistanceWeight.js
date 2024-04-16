import { useState, useEffect } from "react";
import React  from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

import { parseJSON, format } from "date-fns";

import { Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { firebaseDB } from "../../firebase";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const FIELDS = ["field1", "field2", "field3", "field4", "field5", "field6", "field7", "field8"];
const labels = ["NoOne", "Bought", "Seen", "Rejected"];
const BAR_COLORS = [
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
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "User Bought Rate",
    },
  },
};

const pieOptions = {
  backgroundColor: [
    "rgba(54, 162, 235, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(255, 206, 86, 0.2)",
    "rgba(255, 99, 132, 0.2)",
  ],
  borderColor: ["rgba(54, 162, 235, 1)", "rgba(75, 192, 192, 1)", "rgba(255, 206, 86, 1)", "rgba(255, 99, 132, 1)"],
  borderWidth: 1,
};

const DistanceWeight = ({ channel, feeds }) => {
  const [fruitsCount, setFruitsCount] = useState(0);
  const [fruitLogs, setFruitLogs] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchFruitLogs();
    generateChartData();
  },[feeds]);

  const fetchFruitLogs = async () => {
    try{
      const fruitLogsCollection = collection(firebaseDB,"fruitLogs");
      const fruitLogsSnapshot = await getDocs(fruitLogsCollection);
      const fetchFruitLogs = fruitLogsSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
      setFruitLogs(fetchFruitLogs);
    } catch (error)
    {
      console.error("Error fectching fruit logs:", error);
    }
  };
  const generateChartData = () => {
    // Fetch fruit logs from firebaseDB or any other source
    // Example:
    // const fruitLogsData = await fetchFruitLogsData();
    // setFruitLogs(fruitLogsData);
    // setIsLoading(false);
    if (!feeds || feeds.length === 0) return;
    let dates = [];
    let charDataTemp = [];
    let pieDataTemp = [];
    FIELDS.forEach((field) => {
      if (!channel[field]) return;
      feeds.forEach((feed) => {
        let date = format(parseJSON(feed.created_at), "dd/MM/yyyy");
        let index = dates.indexOf(date);
        if (index === -1) {
          index = dates.length + 1;
          dates.push(date);
          charDataTemp.push({
            label: date,
            backgroundColor: BAR_COLORS[index % BAR_COLORS.length],
            data: [0, 0, 0, 0],
            distance: [],
            weight: [],
          });
          pieDataTemp.push({
            label: date,
            ...pieOptions,
          });
        }
      });
      if (channel[field].toLowerCase() === "distance") {
        feeds.forEach((feed) => {
          let date = format(parseJSON(feed.created_at), "dd/MM/yyyy");
          let index = dates.indexOf(date);
          charDataTemp[index].distance.push(feed[field]);
        });
      }
      if (channel[field].toLowerCase() === "weight") {
        feeds.forEach((feed) => {
          let date = format(parseJSON(feed.created_at), "dd/MM/yyyy");
          let index = dates.indexOf(date);
          charDataTemp[index].weight.push(feed[field]);
        });
      }
    });
    charDataTemp.forEach((data, index) => {
      for (var i = 1; i < data.distance.length; i++) {
        if (data.distance[i] === data.distance[i - 1] && data.weight[i] === data.weight[i - 1]) data.data[0]++;
        else if (data.distance[i] === data.distance[i - 1] && data.weight[i] < data.weight[i - 1]) data.data[1]++;
        else if (data.distance[i] === data.distance[i - 1] && data.weight[i] > data.weight[i - 1]) data.data[3]++;
        else if (data.weight[i] < data.weight[i - 1]) data.data[1]++;
        else if (data.weight[i] === data.weight[i - 1]) data.data[2]++;
        else if (data.weight[i] > data.weight[i - 1]) data.data[3]++;
      }
      pieDataTemp[index].data = data.data;
    });
    setChartData(charDataTemp);
    setPieData(pieDataTemp);
    setIsLoading(false);
  };

  const handleFruitsCountChange = (event) => {
    setFruitsCount(event.target.value);
  };

  const handleAddFruits = async () => {
    try {
      setIsLoading(true);
      const fruitLogsCollection = collection(firebaseDB, "fruitLogs");
      const docRef = await addDoc(fruitLogsCollection, {
        fruitCount: fruitsCount,
        fruitCountTimestamp: new Date().toISOString(),
        soldFruitsCount: 0,
        soldFruitTimestamp: null,
      });
      setFruitLogs([...fruitLogs, { id: docRef.id, fruitCount: fruitsCount, fruitCountTimestamp: new Date().toISOString(), soldFruitsCount: 0, soldFruitTimestamp: null }]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding fruits:", error);
      setIsLoading(false);
    }
  };
  const handleUpdateSoldFruits = async (index) => {
    try {
      const updatedFruitLogs = [...fruitLogs];
      updatedFruitLogs[index].soldFruitsCount++;
      updatedFruitLogs[index].soldFruitTimestamp = new Date().toISOString();
      const id = updatedFruitLogs[index].id;
      await updateDoc(doc(firebaseDB, "fruitLogs", id), {
        soldFruitsCount: updatedFruitLogs[index].soldFruitsCount,
        soldFruitTimestamp: updatedFruitLogs[index].soldFruitTimestamp,
      });
      setFruitLogs(updatedFruitLogs);
    } catch (error) {
      console.error("Error updating sold fruits:", error);
    }
  };
  const handleSoldFruits = async (id) => {
    try {
      const soldFruitIndex = fruitLogs.findIndex((log) => log.id === id);
      const updatedFruitLogs = [...fruitLogs];
      updatedFruitLogs[soldFruitIndex].soldFruitsCount++;
      updatedFruitLogs[soldFruitIndex].soldFruitTimestamp = new Date().toISOString();
      await updateDoc(doc(firebaseDB, "fruitLogs", id), { soldFruitsCount: updatedFruitLogs[soldFruitIndex].soldFruitsCount, soldFruitTimestamp: updatedFruitLogs[soldFruitIndex].soldFruitTimestamp });
      setFruitLogs(updatedFruitLogs);
    } catch (error) {
      console.error("Error updating sold fruits:", error);
    }
  };
  const handleDeleteFruitLog = async (id) => {
    try {
      await deleteDoc(doc(firebaseDB, "fruitLogs", id));
      setFruitLogs(fruitLogs.filter((log) => log.id !== id));
    } catch (error) {
      console.error("Error deleting fruit log:", error);
    }
  };
  if (isLoading) return <h3>Loading</h3>;
  return (
    <Box>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
          <TextField
            label="Number of Fruits"
            type="number"
            variant="outlined"
            value={fruitsCount}
            onChange={handleFruitsCountChange}
            style={{ marginRight: 10 }}
          />
          <Button variant="contained" onClick={handleAddFruits}>Add Fruits</Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Number of Fruits</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell> Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fruitLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.fruitCount}</TableCell>
                  <TableCell>{log.fruitCountTimestamp}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => handleDeleteFruitLog(log.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Paper>
        <Bar
          options={options}
          data={{
            labels: labels,
            datasets: chartData,
          }}
          getElementAtEvent={(element) => {
            if (element.length > 0) {
              const index = element[0].index;
              handleUpdateSoldFruits(index);
            }
          }}
        />
      </Paper>
      <Box
        sx={{
          flexDirection: "row",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}>
        {pieData.map((data, index) => (
          <Paper key={index} elevation={2} sx={{ my: 2, p: 2, width: "30%" }}>
            <Pie
              data={{
                labels: labels,
                datasets: [data],
              }}
            />
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default DistanceWeight;
