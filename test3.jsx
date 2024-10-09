import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from '@mui/styles'; // Import makeStyles
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { ContextPanel } from "../../utils/ContextPanel";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { RiEditLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { TbStatusChange } from "react-icons/tb";

// Define styles using makeStyles
const useStyles = makeStyles(() => ({
  greenBackground: {
    backgroundColor: 'green',
    '& th, & td': {
      color: 'white', // Optional: Change text color to white for better contrast
    },
  },
}));

const MemberList = () => {
  const classes = useStyles(); // Use the defined styles
  const [MemberListData, setMemberListData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemberListData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-member-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMemberListData(response.data?.user);
      } catch (error) {
        console.error("Error fetching user list data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMemberListData();
  }, [isPanelUp, navigate]);

  // ... (rest of your code remains the same)

  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    tableBodyClassName: classes.greenBackground, // Apply the green background class
  };

  return (
    <Layout>
      <div className="mt-5">
        <MUIDataTable
          title={"Member List"}
          data={MemberListData ? MemberListData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default MemberList;
