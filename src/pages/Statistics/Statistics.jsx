import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell } from "recharts";

const investmentData = [
  { year: 2016, investment: 10000 },
  { year: 2017, investment: 20000 },
  { year: 2018, investment: 25000 },
  { year: 2019, investment: 35000 },
  { year: 2020, investment: 30000 },
  { year: 2021, investment: 32000 },
];

const revenueData = [
  { year: 2016, revenue: 8000 },
  { year: 2017, revenue: 15000 },
  { year: 2018, revenue: 22000 },
  { year: 2019, revenue: 27000 },
  { year: 2020, revenue: 25000 },
  { year: 2021, revenue: 31000 },
];

const trendingStock = [
  { name: "Trivago", price: "$520", return: "+5%" },
  { name: "Canon", price: "$480", return: "+10%" },
  { name: "Uber Food", price: "$350", return: "-3%" },
  { name: "Nokia", price: "$940", return: "+2%" },
  { name: "Tiktok", price: "$670", return: "-12%" },
];

const Statistics = () => {
  return (
    <div className="p-6 bg-gray-50">
      {/* Top Stats */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-md shadow-md">
          <p className="text-blue-500 text-sm">Total Invested Amount</p>
          <h2 className="text-xl font-bold">$150,000</h2>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md">
          <p className="text-pink-500 text-sm">Number of Investments</p>
          <h2 className="text-xl font-bold">1,250</h2>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md">
          <p className="text-blue-600 text-sm">Rate of Return</p>
          <h2 className="text-xl font-bold">+5.80%</h2>
        </div>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Yearly Total Investment</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={investmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="investment" stroke="#FFA500" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#00C49F" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* My Investment & Trending Stocks */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">My Investment</h2>
          <div className="space-y-2">
            <div className="p-3 bg-gray-100 rounded-md">
              <p className="text-gray-800">Apple Store</p>
              <p className="text-gray-500 text-sm">E-commerce, Marketplace</p>
              <p className="text-gray-800 font-bold">$54,000 <span className="text-green-500">+16%</span></p>
            </div>
            <div className="p-3 bg-gray-100 rounded-md">
              <p className="text-gray-800">Samsung Mobile</p>
              <p className="text-gray-500 text-sm">E-commerce, Marketplace</p>
              <p className="text-gray-800 font-bold">$25,300 <span className="text-red-500">-4%</span></p>
            </div>
            <div className="p-3 bg-gray-100 rounded-md">
              <p className="text-gray-800">Tesla Motors</p>
              <p className="text-gray-500 text-sm">Electric Vehicles</p>
              <p className="text-gray-800 font-bold">$8,200 <span className="text-green-500">+25%</span></p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Trending Stock</h2>
          <table className="w-full text-left">
            <thead className="border-t text-gray-200 ">
              <tr className="text-gray-500">
                <th className="py-1">SL No</th>
                <th className="py-1">Name</th>
                <th className="py-1">Price</th>
                <th className="py-1">Return</th>
              </tr>
            </thead>
            <tbody>
              {trendingStock.map((stock, index) => (
                <tr key={index} className="border-0 text-gray-700">
                  <td className="py-1">{index + 1}</td>
                  <td className="py-1">{stock.name}</td>
                  <td className="py-1">{stock.price}</td>
                  <td className={`py-1 font-bold ${stock.return.includes("-") ? "text-red-500" : "text-green-500"}`}>
                    {stock.return}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
