import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Table from "../../components/Table/Table";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-50">
        <Header />
        <div className="p-6">
          <Table />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
