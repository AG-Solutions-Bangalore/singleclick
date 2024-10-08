import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import { Button, Card, IconButton } from "@material-tailwind/react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { MdArrowBack, MdEdit, MdSend } from "react-icons/md";
import Layout from "../../../layout/Layout";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const profileOptions = [
  { value: "0", label: "Business" },
  { value: "1", label: "Service" },
  { value: "0,1", label: "Business/Service" },
];

const CategoryEdit = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [categoryData, setCategoryData] = useState({
    category: "",
    category_status: "",
    category_type: "",
    category_image: "",
  });
  const [subcategories, setSubcategories] = useState([]);
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();

  const onInputChange = (e) => {
    setCategoryData({
      ...categoryData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-categories-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCategoryData(response.data.categories);
        setSubcategories(response.data.categoriessub);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category", categoryData.category);
    formData.append("category_status", categoryData.category_status);
    formData.append("category_type", categoryData.category_type);
    formData.append("category_image", selectedFile);

    try {
      setIsButtonDisabled(true);
      const response = await axios.post(
        `${BASE_URL}/api/panel-update-categories/${id}?_method=PUT`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.code == "200") {
        toast.success("Category updated successfully");
        navigate("/category");
      } else {
        toast.error("Duplicate entry");
      }
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const imageUrl = categoryData.category_image
    ? `https://singleclik.com/api/storage/app/public/categories_images/${categoryData.category_image}`
    : "https://singleclik.com/api/storage/app/public/no_image.jpg";

  return (
    <Layout>
      <div className="flex justify-start gap-2 mt-10">
        <Card className="p-6 w-full max-w-md shadow-lg rounded-lg flex-grow">
          <div className="text-center">
            <h2 className="text-2xl border-b border-green-900 font-bold text-gray-800 mb-4">
              Category Edit
            </h2>
          </div>
          <div className="flex flex-col items-center mb-4">
            <img
              src={imageUrl}
              alt="Category"
              className="w-32 h-32 rounded-full mb-2"
            />
            <div className="absolute top-[160px] right-[170px]">
              <div
                className=" border bg-green-400 cursor-pointer hover:bg-blue-300 border-black rounded-full p-[3px] "
                onClick={() => fileInputRef.current.click()}
              >
                <MdEdit className="w-6 h-6 text-black" />
              </div>

              <input
                type="file"
                ref={fileInputRef}
                name="category_image"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                style={{ display: "none" }}
              />
            </div>
            {selectedFile && (
              <p className="text-gray-600 text-sm">{selectedFile.name}</p>
            )}
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold">
              {categoryData.category || "Category Name"}
            </h3>
            <span className="text-gray-600">
              {profileOptions.find(
                (type) => type.value === categoryData.category_type
              )?.label || "Category Type"}
            </span>
          </div>
          <form
            id="categoryForm"
            autoComplete="off"
            onSubmit={handleSubmit}
            className="mt-6"
          >
            <div className="mb-4">
              <FormControl fullWidth>
                <InputLabel>
                  <span className="text-sm">
                    Category Status <span className="text-red-700">*</span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  name="category_status"
                  value={categoryData.category_status}
                  onChange={onInputChange}
                  required
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="flex justify-between">
              <Button type="submit" disabled={isButtonDisabled}>
                <div className="flex gap-1">
                  <MdSend className="w-4 h-4" />
                  <span> {isButtonDisabled ? "Updating..." : "Update"}</span>
                </div>
              </Button>
              <Link to="/category">
                <Button>
                  <div className=" flex gap-1">
                    <MdArrowBack className="w-4 h-4" />
                    <span>Back</span>
                  </div>
                </Button>
              </Link>
            </div>
          </form>
        </Card>
        <Card className="p-6 shadow-lg rounded-lg w-full flex-grow ">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-green-900">
            SubCategory List
          </h3>
          <div className="overflow-x-auto custom-scroll">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-50">
                <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Sl No
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Subcategory of {categoryData.category}
                  </th>
                 
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subcategories.map((subcat, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                     <td className="px-4 py-2 text-gray-700">
                      {index+1}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {subcat.subcategory} 
                    </td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default CategoryEdit;
