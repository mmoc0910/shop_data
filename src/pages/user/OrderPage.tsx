import { Table } from "antd";

const OrderPage = () => {
  const dataSource = undefined;

  const columns = [
    {
      title: "Mã Đơn Hàng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Chu Kì",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Tổng Tiền Đơn Hàng",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Trạng Thái Đơn Hàng",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Thời Gian Khởi Tạo",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Thao Tác",
      dataIndex: "address",
      key: "address",
    },
  ];

  return <Table dataSource={dataSource} columns={columns} />;
};

export default OrderPage;
