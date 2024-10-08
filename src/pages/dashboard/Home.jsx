import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Layout from "../../layout/Layout";
import { ContextPanel } from "../../utils/ContextPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";

const Home = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategoriesData(response.data?.total_categories);
      } catch (error) {
        console.error("Error fetching user list data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, [isPanelUp, navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <Layout>
      <motion.div
        className="mt-12 p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categoriesData.map((item, index) => (
          <motion.div
            key={index}
            className="relative bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl overflow-hidden shadow-lg border border-white border-opacity-20"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.3, ease: "easeInOut" }
            }}
          >
            <div className="relative flex justify-center items-center p-4">
              <motion.img
                src={
                  item.category_image === "null" || !item.category_image
                    ? "https://singleclik.com/api/storage/app/public/no_image.jpg"
                    : `https://singleclik.com/api/storage/app/public/categories_images/${item.category_image}`
                }
                alt={item.category}
                className="w-28 h-28 object-cover rounded-full shadow-md"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <motion.div
                className="absolute   top-2 right-2 bg-red-500 bg-opacity-80 text-white text-xs px-2 py-1 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {item.member_count}
              </motion.div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-center text-gray-800 truncate">
                {item.category}
              </h3>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Layout>
  );
};

export default Home;