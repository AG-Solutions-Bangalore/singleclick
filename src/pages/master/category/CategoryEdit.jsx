import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import { Button, Card, Input } from "@material-tailwind/react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { MdArrowBack, MdSend } from "react-icons/md";
const status = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Inactive",
    label: "Inactive",
  },
];

const profile_type = [
  {
    value: "0",
    label: "Business",
  },
  {
    value: "1",
    label: "Service",
  },
  {
    value: "0,1",
    label: "Business/Service",
  },
];
const CategoryEdit = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [categories, setCategories] = useState({
    category: "",
    category_status: "",
    category_type: "",
    category_image: "",
  });
  const { id } = useParams();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();

  const onInputChange = (e) => {
    setCategories({
      ...categories,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-categories-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };

    fetchServiceData();
  }, [id]);

  const onSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("category", categories.category);
    data.append("category_type", categories.category_type);
    data.append("category_status", categories.category_status);
    data.append("category_image", selectedFile);

    const form = document.getElementById("addIndiv");
    if (form.checkValidity()) {
      setIsButtonDisabled(true);

      axios({
        url: `${BASE_URL}/api/panel-update-categories/${id}?_method=PUT`,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.data.code == "200") {
            toast.success("update succesfull");
            navigate("/");
          } else {
            toast.error("duplicate entry");
          }
        })
        .finally(() => {
          setIsButtonDisabled(false);
        });
    }
  };

  const imageUrl = categories?.category_image
    ? `https://singleclik.com/api/storage/app/public/categories_images/${categories.category_image}`
    : "https://singleclik.com/api/storage/app/public/no_image.jpg";

  return (
    <Layout>
      <div className="textfields-wrapper">
        <div className="my-4 text-2xl font-bold text-gray-800">
          Edit Category
        </div>
        <Card className="p-6 mt-6">
          <form
            id="addIndiv"
            autoComplete="off"
            onSubmit={onSubmit}
            className="p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Service Image */}
              <div className="flex justify-center items-center  rounded-lg shadow-lg shadow-blue-400">
                <img src={imageUrl} alt="Service" className="w-52 h-52" />
              </div>
              {/* Service Fields */}
              <div className=" rounded-lg shadow-lg shadow-orange-400 p-2 ">
                <div className="mb-6">
                  <Input
                    label="Category Name"
                    type="text"
                    name="category"
                    onChange={(e) => onInputChange(e)}
                    value={categories.category}
                    required
                    labelProps={{
                      className: "!text-gray-600   ",
                    }}
                  />
                </div>
                <div className="mb-6">
                  <FormControl fullWidth>
                    <InputLabel id="service-select-label">
                      <span className="text-sm relative bottom-[6px]">
                        Category Type <span className="text-red-700">*</span>
                      </span>
                    </InputLabel>
                    <Select
                      sx={{ height: "40px", borderRadius: "5px" }}
                      labelId="service-select-label"
                      id="service-select"
                      name="category_type"
                      onChange={(e) => onInputChange(e)}
                      value={categories.category_type}
                      label="Category Type"
                      required
                    >
                      {profile_type.map((data) => (
                        <MenuItem key={data.value} value={String(data.value)}>
                          {data.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="mb-6">
                  <Input
                    label="Category Image"
                    type="file"
                    name="category_image"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="w-full border border-gray-700 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <FormControl fullWidth>
                    <InputLabel id="service-select-label">
                      <span className="text-sm relative bottom-[6px]">
                        Category Status <span className="text-red-700">*</span>
                      </span>
                    </InputLabel>
                    <Select
                      sx={{ height: "40px", borderRadius: "5px" }}
                      labelId="service-select-label"
                      id="service-select"
                      name="category_status"
                      onChange={(e) => onInputChange(e)}
                      value={categories.category_status}
                      label="Category Status"
                      required
                    >
                      {status.map((data) => (
                        <MenuItem key={data.label} value={String(data.value)}>
                          {data.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
            {/* Buttons */}
            <div className="text-center mt-6">
              <Button
                type="submit"
                className="mr-2 mb-2"
                color="primary"
                disabled={isButtonDisabled}
              >
                <div className="flex gap-1">
                  <MdSend className="w-4 h-4" />
                  <span>{isButtonDisabled ? "Updating..." : "Update"}</span>
                </div>
              </Button>

              <Link to="/">
                <Button className="mr-2 mb-2" color="primary">
                  <div className="flex gap-1">
                    <MdArrowBack className="w-4 h-4" />
                    <span>Back</span>
                  </div>
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default CategoryEdit;
