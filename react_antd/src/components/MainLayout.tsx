import React, {useState} from "react";
import {Layout, Menu, MenuProps} from "antd";
import Header from "@/components/Header";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Home from "@/pages/Home.tsx";
import AdminList from "@/pages/admin/AdminList.tsx";
import FacultyList from "@/pages/faculty/FacultyList.tsx";
import MajorList from "@/pages/major/MajorList.tsx";
import StudentList from "@/pages/student/StudentList.tsx";
import DormitoryBuildingList from "@/pages/dormitoryBuilding/DormitoryBuildingList.tsx";
import DormitoryRoomList from "@/pages/dormitoryRoom/DormitoryRoomList.tsx";
import DormitoryAllocationList from "@/pages/dormitoryAllocation/DormitoryAllocationList.tsx";
import DormitoryFeeList from "@/pages/dormitoryFee/DormitoryFeeList.tsx";
import StaffList from "@/pages/staff/StaffList.tsx";
import RoomMaintenanceRecordList from "@/pages/roomMaintenanceRecord/RoomMaintenanceRecordList.tsx";
import DormitoryVisitorList from "@/pages/dormitoryVisitor/DormitoryVisitorList.tsx";
import ChartList from "@/pages/chart/ChartList.tsx";
import {
  AuditOutlined,
  BankOutlined,
  BellOutlined,
  HomeOutlined,
  MehOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoneyCollectOutlined,
  OrderedListOutlined,
  PieChartOutlined,
  SettingOutlined,
  SolutionOutlined,
  TableOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons";
import {useTranslation} from "react-i18next";

const MainLayout: React.FC = () => {

  const {Sider, Content} = Layout;
  const { t } = useTranslation();

  const contentStyle: React.CSSProperties = {
    height: '100%',
    width: '100%',
    padding: '10px 10px',
    overflowY: 'auto'
  };

  const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '120px',
    overflowY: 'auto'
  };

  const layoutStyle = {
    overflow: 'hidden',
    height: '100vh',
    width: '100vw',
  };

  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { key: 'collapse', label: '收起', icon: collapsed ? React.createElement(MenuUnfoldOutlined) : React.createElement(MenuFoldOutlined) },
    { key: '/Home', label: '主页', path: '/Home', icon: React.createElement(HomeOutlined) },
    { key: '/AdminList', label: '管理员', path: '/AdminList', icon: React.createElement(UserOutlined) },
    { key: '/FacultyList', label: '院系信息', path: '/FacultyList', icon: React.createElement(BankOutlined) },
    { key: '/MajorList', label: '专业信息', path: '/MajorList', icon: React.createElement(TableOutlined) },
    { key: '/StudentList', label: '学生信息', path: '/StudentList', icon: React.createElement(TeamOutlined) },
    { key: '/DormitoryBuildingList', label: '宿舍楼栋信息', path: '/DormitoryBuildingList', icon: React.createElement(OrderedListOutlined) },
    { key: '/DormitoryRoomList', label: '宿舍房间信息', path: '/DormitoryRoomList', icon: React.createElement(SolutionOutlined) },
    { key: '/DormitoryAllocationList', label: '宿舍分配信息', path: '/DormitoryAllocationList', icon: React.createElement(AuditOutlined) },
    { key: '/DormitoryFeeList', label: '费用信息', path: '/DormitoryFeeList', icon: React.createElement(MoneyCollectOutlined) },
    { key: '/StaffList', label: '员工信息', path: '/StaffList', icon: React.createElement(MehOutlined) },
    { key: '/RoomMaintenanceRecordList', label: '房间维护记录', path: '/RoomMaintenanceRecordList', icon: React.createElement(SettingOutlined) },
    { key: '/DormitoryVisitorList', label: '访客记录', path: '/DormitoryVisitorList', icon: React.createElement(BellOutlined) },
    { key: '/ChartList', label: '数据统计', path: '/ChartList', icon: React.createElement(PieChartOutlined) }
  ];

  const navigate = useNavigate();

  const location = useLocation();
  const defaultLocation = location.pathname === '/' ? '/Home' : location.pathname;

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'collapse') {
      setCollapsed(!collapsed)
      return
    }
    navigate(e.key);
  };

  return (
    <Layout style={layoutStyle}>
      <Header title={t('title')}/>
      <Layout>
        <Sider collapsible collapsed={collapsed} style={siderStyle} theme={"light"} trigger={null}>
          <Menu
            onClick={handleMenuClick}
            defaultSelectedKeys={[defaultLocation]}
            defaultOpenKeys={[defaultLocation]}
            mode="inline"
            items={menuItems}
          />
        </Sider>
        <Content style={contentStyle}>
          <Routes>
            <Route path="/Home" element={<Home/>} />
            <Route path="/AdminList" element={<AdminList/>} />
            <Route path="/FacultyList" element={<FacultyList/>} />
            <Route path="/MajorList" element={<MajorList/>} />
            <Route path="/StudentList" element={<StudentList/>} />
            <Route path="/DormitoryBuildingList" element={<DormitoryBuildingList/>} />
            <Route path="/DormitoryRoomList" element={<DormitoryRoomList/>} />
            <Route path="/DormitoryAllocationList" element={<DormitoryAllocationList/>} />
            <Route path="/DormitoryFeeList" element={<DormitoryFeeList/>} />
            <Route path="/StaffList" element={<StaffList/>} />
            <Route path="/RoomMaintenanceRecordList" element={<RoomMaintenanceRecordList/>} />
            <Route path="/DormitoryVisitorList" element={<DormitoryVisitorList/>} />
            <Route path="/ChartList" element={<ChartList/>} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout;