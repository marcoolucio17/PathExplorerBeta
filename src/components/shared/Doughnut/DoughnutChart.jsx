import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 
import React from 'react';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels); 

/**
 * Este componente recibe las top skills y regresa un Doughnut chart con las frecuencias recibidas
 * @param {data} data 
 * @returns componente chart de doughnut
 */
const DoughnutChart = ({ data }) => {
  const labels = data.map(item => item.name);
  const percentages = data.map(item => parseFloat(item.percentage));

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Skill frequency',
        data: percentages,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
        borderColor: '#121212',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '50%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e1e1e',
        titleColor: '#ffffff',
        bodyColor: '#dddddd',
        padding: 8,
        bodyFont: {
          size: 12,
        },
      },
      datalabels: {
        color: '#ffffff',
        font: {
          weight: 'bold',
          size: 10,
        },
        formatter: (value) => `${value}%`,
      },
    },
    layout: {
      padding: 4,
    },
  };

  return (
    <div style={{ height: 200, width: 200 }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DoughnutChart;
