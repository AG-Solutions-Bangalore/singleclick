import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { ContextPanel } from "../../utils/ContextPanel";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { MdDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { RiEditLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { TbStatusChange } from "react-icons/tb";

const MemberList = () => {
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
    setLoading(false);
  }, []);


  const whatsApp = (e, value,userName) => {
    e.preventDefault();
    
    const phoneNumber = value;
    const code='+91'
    const message = ` Dear ${userName}.
    \n
    Thank you for registering with us.
    \n
    We received your information but did not find your photo; please share your photo.
    \n
    Thanks and regards,\n
    Govind Garg\n
    AG Solutions`;
    const whatsappLink = `https://wa.me/${code}${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappLink, '_blank');
    
}

const handleChangeToHold = async (e, id) => {
  e.preventDefault();
  try {
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await axios({
      url: BASE_URL + "/api/panel-convert-business-consumer/" + id, 
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.data.code == "200") {
      toast.success("Member Hold  succesfully")
      setMemberListData((prevMemberListData) => 
        prevMemberListData.filter((member) => member.id !== id && member.status === member.status)
      );
     
    } else {
      toast.error("Member Cannot be Hold");
    }
  } catch (error) {
    console.error("Error Meber hol data", error);
    toast.error("Error member hold data");
  } finally {
    setLoading(false);
  }
};

  
  const columns = [
    {
      name: "slNo",
      label: "SL No",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          return tableMeta.rowIndex + 1;
        },
      },
    },
    {
      name: "photo",
      label: "IMAGE",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (image) => {
          const imageUrl = image
            ? `https://singleclik.com/api/storage/app/public/user_images/${image}`
            : "https://singleclik.com/api/storage/app/public/no_image.jpg";
          return (
            <img
              src={imageUrl}
              alt="Member"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
          );
        },
      },
    },
    {
      name: "name",
      label: "Full name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "company_name",
      label: "Company",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "mobile",
      label: "Mobile",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "profile_type",
      label: "Profile",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          if (value == 0) {
            return "Business";
          } else if (value == 1) {
            return "Service";
          } else if (value == "0,1") {
            return "Business/Service";
          }
          return "Unknown";
        },
      },
    },

    {
      name: "status",
      label: "STATUS",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "id",
      label: "ACTION",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id, tableMeta) => {
            const usermobile = MemberListData[tableMeta.rowIndex].mobile;
            const userName = MemberListData[tableMeta.rowIndex].name;
            const userphoto = MemberListData[tableMeta.rowIndex].photo;
          return (
            <div className="flex items-center space-x-2">
                {/* common  */}
                { !userphoto &&
                <FaWhatsapp
                onClick={(e) => whatsApp(e,usermobile,userName)}
                title="Send WhatsApp Message"
                className="h-5 w-5 cursor-pointer"
              />
            }
                <RiEditLine
                    onClick={() => navigate(`/member-edit/${id}`)}
                    title="Edit Member Info"
                    className="h-5 w-5 cursor-pointer"
                  />
                <MdOutlineRemoveRedEye
                onClick={() => navigate(`/member-view/${id}`)}
                title="View Member Info"
                className="h-5 w-5 cursor-pointer"
              />
              <TbStatusChange
              onClick={(e)=>handleChangeToHold(e,id)}
              title="Hold" className="w-6 h-6 text-red-700 cursor-pointer" />
            </div>
          );
        },
      },
    },
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,
  
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    
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
