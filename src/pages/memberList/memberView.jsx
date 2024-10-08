import Layout from "../../layout/Layout";
import React, { useRef, useState, useEffect, useContext } from "react";
import { FaPrint } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { ContextPanel } from "../../utils/ContextPanel";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import useEscapeKey from "../../utils/escape/useEscapeKey";

const MemberView = () => {
  const componentRef = useRef();
  const { id } = useParams();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfileViewData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-member-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(response.data?.user);
        
      } catch (error) {
        console.error("Error fetching Profile list data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileViewData();
    setLoading(false);
  }, []);
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${BASE_URL}/api/panel-fetch-categories`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );
  //       setCategories(response.data.categories);
  //     } catch (error) {
  //       console.error("Error fetching Categories:", error);
  //     }
  //   };

  //   fetchCategories();
  // }, []);
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${BASE_URL}/api/panel-fetch-sub-categories-by-value/${profile.sub_category}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );
  //       setCategories(response.data.categories);
  //     } catch (error) {
  //       console.error("Error fetching Categories:", error);
  //     }
  //   };

  //   fetchCategories();
  // }, []);


  // const getCategoryNameById = (id) => {
  //   const category = categories.find(cat => cat.id === Number(id));
  //   return category ? category.category : "Unknown Category";
  // };

  useEscapeKey()
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="w-full bg-white shadow-md rounded-lg p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold border-b  border-blue-700">
              Profile Details
            </h1>
            <ReactToPrint
              trigger={() => (
                <button className="text-blue-500 border border-blue-400 p-2 rounded-lg hover:text-blue-700 flex items-center space-x-2">
                  <FaPrint />
                  <span>Print</span>
                </button>
              )}
              content={() => componentRef.current}
            />
          </div>

          <div ref={componentRef} className=" mt-6 px-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-1">
            <div className="mb-8 ">
              <h2 className="text-xl font-semibold">
                {profile.name} -{" "}
                {profile.status}
              </h2>
              
            </div>
            <div>
            <img style={{ width: "85px", height: "85px", objectFit: "cover", float: "right" }} src={profile.photo
            ? `https://singleclik.com/api/storage/app/public/user_images/${profile.photo}`
            : "https://singleclik.com/api/storage/app/public/no_image.jpg"}/>
            </div>
            </div>
            {/* Add a black border around the entire section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-1">
              <div>
                <h3 className="font-semibold text-lg">Contact Information</h3>
                <table className="w-full mt-2 border-collapse border border-black">
                  <tbody>
                    <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black">
                        Company
                      </th>
                      <td className="p-2">:</td>
                      <td className="p-2">{profile.company_name}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black">
                        Mobile
                      </th>
                      <td className="p-2">:</td>
                      <td className="p-2">{profile.mobile}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black">
                      Whats App
                      </th>
                      <td className="p-2">:</td>
                      <td className="p-2">{profile.whatsapp}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black">
                        Email
                      </th>
                      <td className="p-2">:</td>
                      <td className="p-2">{profile.email}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black">
                        Website
                      </th>
                      <td className="p-2">:</td>
                      <td className="p-2">{profile.website}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="font-semibold text-lg">Identification</h3>
                <table className="w-full mt-2 border-collapse border border-black">
                  <tbody>
                  <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black">
                      Business Profile
                      </th>
                      <td className="p-2">:</td>
                      <td className="p-2">{(profile.profile_type == 0 ? "Business" : profile.profile_type == 1 ? "Service" : "Business/Service")}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black">
                      Business Category
                      </th>
                      <td className="p-2">:</td>
                      <td className="p-2">{profile.category}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black">
                      Sub Category
                      </th>
                      <td className="p-2">:</td>
                      <td className="p-2">{profile.subcategory}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black">
                      Area
                      </th>
                      <td className="p-2">:</td>
                      <td className="p-2">{profile.area}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black">
                      Referral Code
                      </th>
                      <td className="p-2">:</td>
                      <td className="p-2">{profile.referral_code}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 p-4">
            <table className="w-full mt-2 border-collapse border border-black">
                  <tbody>
                    <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black">
                      About Your Buisness
                      </th>
                      <td className="p-2">:</td>
                      <td className="p-2">{profile.about_us}</td>
                    </tr>
                    
                  </tbody>
                </table>
            </div>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default MemberView;
