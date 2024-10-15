// category edit full code 

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import { Button, Card, IconButton, Input } from "@material-tailwind/react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { MdArrowBack, MdEdit, MdSend } from "react-icons/md";
import Layout from "../../../layout/Layout";
import { CiEdit } from "react-icons/ci";
import { RiArrowUpDoubleFill } from "react-icons/ri";
import { p } from "framer-motion/client";
import SubCategoryEditList from "../../../components/categoryEdit/SubCategoryEditList";

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
    category_sort: "",
  });
  const [categoryUser, setCategoryUser] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // subcategory edit
  const [editIndex, setEditIndex] = useState(null);
  const [editedSubcategories, setEditedSubcategories] = useState([]);
  const [isSubcatButtonDisabled, setIsSubcatButtonDisabled] = useState(false);

  //
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
        setEditedSubcategories(response.data.categoriessub); // for edit show
        setCategoryUser(response.data.user); // for user list of particular category
      } catch (error) {
        console.error("Error fetching category edit:", error);
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
    formData.append("category_sort", categoryData.category_sort);
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


  

  //subcategory edit

  // const handleEditClick = (index) => {
  //   setEditIndex(index);
  // };

  // const handleUpdateSubCat = (e,index) => {
  //   e.preventDefault()
    
  //   setEditIndex(null);
  //   const subcategoryId = editedSubcategories[index].id;
  //   setIsSubcatButtonDisabled(true);

  //   let data = {
  //     category_id: editedSubcategories[index].category_id,
  //     subcategory: editedSubcategories[index].subcategory,
  //     subcategory_status: editedSubcategories[index].subcategory_status,
  //   };
    
  //   axios({
  //     url: `${BASE_URL}/api/panel-update-sub-categories/${subcategoryId}`,
  //     method: "Put",
  //     data,
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   }).then((res) => {
  //     if (res.data.code == "200") {
  //       toast.success("Sub Category Updated");
  //       setIsSubcatButtonDisabled(false)
  //     } else {
  //       toast.error("duplicate entry");
  //       setIsSubcatButtonDisabled(false)
  //     }
  //   })
    
  // };


  // const handleChange = (index, field, value) => {
  //   const updatedSubcategories = [...editedSubcategories];
  //   updatedSubcategories[index][field] = value;
  //   setEditedSubcategories(updatedSubcategories);
  // };
  //

  const imageUrl = categoryData.category_image
    ? `https://singleclik.com/api/storage/app/public/categories_images/${categoryData.category_image}`
    : "https://singleclik.com/api/storage/app/public/no_image.jpg";

  // for user

  return (
    <Layout>
      <div className="flex flex-row lg:flex-row justify-start gap-2 mt-5 ">
        <Card className="p-3  min-w-full  h-auto shadow-lg rounded-lg">
          <div className="flex flex-col  lg:flex-row items-center gap-4 p-1">
            {/* Image Section */}
            <div className="relative w-44 flex-shrink-0 flex items-center justify-center">
              <img
                src={imageUrl}
                alt="Category"
                className="w-20 h-20 border-l-4 border-orange-600 border-dashed rounded-full mb-2"
              />
              <div className="absolute bottom-0 right-0 lg:bottom-1/2 lg:right-0 lg:transform lg:-translate-x-10 lg:-translate-y-1 transform -translate-x-10 -translate-y-6">
                <div
                  className="border bg-green-400 cursor-pointer hover:bg-blue-300 border-black rounded-full p-[3px]"
                  onClick={() => fileInputRef.current.click()}
                >
                  <MdEdit title="Edit Pic" className="w-4 h-4 text-black" />
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  name="category_image"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            {/* Form Section */}
            <form
              id="categoryForm"
              autoComplete="off"
              onSubmit={handleSubmit}
              className="flex-grow"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Category Input */}

                <Input
                  type="text"
                  name="category"
                  onChange={(e) => onInputChange(e)}
                  value={categoryData.category}
                  disabled
                  labelProps={{ className: "!text-gray-600" }}
                  label="Category"
                  required
                  className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
                />

                {/* Category Type */}

                <Input
                  type="text"
                  name="category_type"
                  disabled
                  labelProps={{ className: "!text-gray-600" }}
                  onChange={(e) => onInputChange(e)}
                  value={
                    profileOptions.find(
                      (type) => type.value === categoryData.category_type
                    )?.label || "Category Type"
                  }
                  label="Category Type"
                  required
                  className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
                />

                {/* Category Sort Input */}

                <Input
                  type="number"
                  min="0"
                  name="category_sort"
                  onChange={(e) => onInputChange(e)}
                  value={categoryData.category_sort}
                  label="Category Sort"
                  required
                  className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
                />

                {/* Category Status Select */}

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

              <div className="flex flex-col lg:flex-row justify-between gap-4 mt-4">
                <div>
                  {/* File Name Display */}
                  {selectedFile && (
                    <div className="mt-2">
                      <p className="text-red-600 text-sm">
                        {selectedFile.name}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col lg:flex-row gap-2">
                  {/* Submit Button */}
                  <div className="w-full lg:w-auto">
                    <Button type="submit" disabled={isButtonDisabled}>
                      <div className="flex gap-1 items-center">
                        <MdSend className="w-3 h-3" />
                        <span className="text-xs">
                          {isButtonDisabled ? "Updating..." : "Update"}
                        </span>
                      </div>
                    </Button>
                  </div>

                  {/* Back Button */}
                  <div className="w-full lg:w-auto">
                    <Link to="/category">
                      <Button>
                        <div className="flex gap-1 items-center">
                          <MdArrowBack className="w-3 h-3" />
                          <span className="text-xs">Back</span>
                        </div>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Card>
      </div>
      <div className="flex flex-col lg:flex-row mt-2 gap-2">
        <Card className="p-6 w-full lg:max-w-md h-[420px] shadow-lg rounded-lg overflow-hidden bg-white">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-green-900">
            User List
          </h3>
          <div className="h-full overflow-y-auto custom-scro">
            {categoryUser.length === 0 ? (
              <p className="text-center text-gray-400 italic">
                No users available
              </p>
            ) : (
              categoryUser.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center  gap-4 mb-4 border-b border-dashed border-gray-200 pb-2"
                >
                  <img
                    src={
                      item.photo
                        ? `https://singleclik.com/api/storage/app/public/user_images/${item.photo}`
                        : "https://singleclik.com/api/storage/app/public/no_image.jpg"
                    }
                    alt="User photo"
                    className="w-12 h-12  rounded-full border-r-2 border-blue-700 shadow-sm"
                  />
                  <p className="text-sm  font-semibold text-gray-800">
                    {item.name}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
           
        {/* h-420px  */}
        {/* <Card className="p-6 shadow-lg rounded-lg w-full h-[420px] ">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-green-900">
            SubCategory List
          </h3>
          <div className="overflow-x-auto custom-scro">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Sl No
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Subcategory of {categoryData.category}
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subcategories.map((subcat, index) => (
                  <tr key={index} className="hover:bg-red-50 transition-colors">
                    <td className="px-4 py-2 text-gray-700">{index + 1}</td>

                    <td className="px-4 py-2 text-gray-700">
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editedSubcategories[index].subcategory}
                          onChange={(e) => handleChange(index, "subcategory", e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1"
                        />
                      ) : (
                        subcat.subcategory
                      )}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {editIndex === index ? (
                        <select
                          value={editedSubcategories[index].subcategory_status}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "subcategory_status",
                              e.target.value
                            )
                          }
                          className="border border-gray-300 rounded px-2 py-1"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        subcat.subcategory_status
                      )}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      
                      
                      {editIndex === index ? (
                        <RiArrowUpDoubleFill
                          className="w-5 h-5 hover:text-green-800 cursor-pointer text-green-800"
                          onClick={(e) => handleUpdateSubCat(e,index)}
                          disabled={isSubcatButtonDisabled}
                        />
                      ) : (
                        <CiEdit
                          className="w-5 h-5 hover:text-red-800 cursor-pointer text-green-800"
                          onClick={() => handleEditClick(index)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card> */}
        <SubCategoryEditList/>
      </div>
    </Layout>
  );
};

export default CategoryEdit;
