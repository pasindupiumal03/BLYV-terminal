import { Copy } from 'lucide-react';
import React, { memo } from 'react';
import Chart from 'react-apexcharts';

const TokenDetailsComponent = memo(function TokenDetailsComponent({ tokenData, chartData }) {
  const series = [
    {
      data: chartData.map(item => ({
        x: new Date(item.time * 1000),
        y: [item.open, item.high, item.low, item.close]
      }))
    }
  ];

  const options = {
    chart: {
      type: 'candlestick',
      height: 250,
      toolbar: { show: true },
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true
      },
      background: '#ffffff'
    },
    plotOptions: {
      candlestick: {
        candleWidth: 20,
        colors: {
          upward: '#22c55e', // Tailwind green-500
          downward: '#ef4444', // Tailwind red-500
        }
      }
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        const [open, high, low, close] = data.y;
        const formatPrice = (value) => {
          if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
          if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
          return `$${value.toFixed(6)}`;
        };

        return `
          <div style="padding: 8px; font-size: 12px; background-color: #f9fafb; border: 1px solid #ccc;">
            <div><strong>Time:</strong> ${new Date(data.x).toLocaleString()}</div>
            <div><strong>Open:</strong> ${formatPrice(open)}</div>
            <div><strong>High:</strong> ${formatPrice(high)}</div>
            <div><strong>Low:</strong> ${formatPrice(low)}</div>
            <div><strong>Close:</strong> ${formatPrice(close)}</div>
          </div>
        `;
      }
    },
    title: {
      text: 'Price Chart (1m)',
      align: 'left',
      style: { color: '#1f2937', fontSize: '14px' }
    },
    xaxis: {
      type: 'datetime',
      tickAmount: 6,
      labels: {
        show: true,
        rotate: -45,
        style: { colors: '#4b5563', fontSize: '10px' }
      },
      axisBorder: { color: '#e5e7eb' }
    },
    yaxis: {
      tickAmount: 6,
      tooltip: { enabled: true },
      labels: {
        style: { colors: '#4b5563', fontSize: '10px' },
        formatter: function (val) {
          if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
          if (val >= 1000) return `$${(val / 1000).toFixed(2)}K`;
          return `$${val.toFixed(6)}`;
        }
      },
      axisBorder: { color: '#e5e7eb' }
    },
    grid: {
      borderColor: '#e5e7eb'
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert('Copied to clipboard'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  return (
    <div className="bg-white text-gray-800 w-full border border-gray-200 shadow rounded m-auto">
      {/* Token address */}
      <div className="bg-gray-100 p-2 flex justify-between items-center border-b border-gray-300">
        <div className="flex items-center">
          <span className="text-gray-500 text-sm mr-2">Token Address:</span>
          <span className="text-gray-700 text-sm truncate max-w-xs">{tokenData.address}</span>
        </div>
        <button
          onClick={() => copyToClipboard(tokenData.address)}
          className="text-blue-600 hover:text-blue-800 p-1"
        >
          <Copy size={14} />
        </button>
      </div>

      <div className="w-full h-10 m-4 flex items-center">
        <img src={tokenData.image} alt="token-img" className="w-10 h-10" />
        <p className="ml-5 font-bold">{tokenData.name}</p>
      </div>

      {/* Chart section */}
      <div className="bg-white p-2">
        <div className="h-64">
          <Chart options={options} series={series} type="candlestick" height={250} />
        </div>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-2 gap-0 mt-2">
        <div className="p-4 border-r border-gray-300">
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs">Price</span>
            <span className="text-green-600 text-lg font-bold">${tokenData.price.toFixed(6)}</span>
          </div>
          <div className="flex flex-col mt-4">
            <span className="text-gray-500 text-xs">Market Cap</span>
            <span className="text-gray-800 text-base">${(tokenData.marketCap / 1000000).toFixed(2)}M</span>
          </div>
          <div className="flex flex-col mt-4">
            <span className="text-gray-500 text-xs">Creator</span>
            <div className="flex items-center">
              <span className="text-gray-700 text-xs truncate max-w-xs font-bold">
                {tokenData.creator ? tokenData.creator : "No Creator Found"}
              </span>
              {tokenData.creator &&
                <button
                  onClick={() => copyToClipboard(tokenData.creator)}
                  className="text-blue-600 hover:text-blue-800 ml-2 p-1"
                >
                  <Copy size={12} />
                </button>
              }
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs">24h Change</span>
            <span
              className={
                (tokenData.change24h >= 0
                  ? "text-green-600"
                  : "text-red-600") +
                " text-base font-bold"
              }
            >
              {tokenData.change24h >= 0 ? '+' : ''}{tokenData.change24h.toFixed(1)}%
            </span>
          </div>
          <div className="flex flex-col mt-4">
            <span className="text-gray-500 text-xs">24h Volume</span>
            <span className="text-gray-800 text-base">${(tokenData.volume24h / 1000).toFixed(2)}K</span>
          </div>
        </div>
      </div>
    </div>
  );
})

export default TokenDetailsComponent;
