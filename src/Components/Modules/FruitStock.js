import React, { useState, useEffect } from 'react';

const FruitStock = () => {
  const [fruitsCount, setFruitsCount] = useState(0);
  const [fruitLogs, setFruitLogs] = useState([]);

  useEffect(() => {
    // Fetch fruit count from storage or server
    const savedFruitsCount = localStorage.getItem('fruitsCount');
    if (savedFruitsCount) {
      setFruitsCount(parseInt(savedFruitsCount));
    }

    // Fetch fruit logs from storage or server
    const savedFruitLogs = JSON.parse(localStorage.getItem('fruitLogs'));
    if (savedFruitLogs) {
      setFruitLogs(savedFruitLogs);
    }
  }, []);

  const handleFruitsSold = () => {
    const newFruitsCount = fruitsCount - 1;
    const newLogEntry = {
      timestamp: new Date().toLocaleString(),
      count: 1,
    };
    setFruitsCount(newFruitsCount);
    setFruitLogs([...fruitLogs, newLogEntry]);

    // Save updated fruit count and logs to storage or server
    localStorage.setItem('fruitsCount', newFruitsCount);
    localStorage.setItem('fruitLogs', JSON.stringify([...fruitLogs, newLogEntry]));
  };

  return (
    <div>
      <h2>Fruit Stock</h2>
      <p>Number of fruits available: {fruitsCount}</p>
      <button onClick={handleFruitsSold}>Sell Fruit</button>
      <h3>Fruit Sales Log</h3>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {fruitLogs.map((log, index) => (
            <tr key={index}>
              <td>{log.timestamp}</td>
              <td>{log.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FruitStock;