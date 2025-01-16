
import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCurrentUser } from '@/utils/getCurrentUser';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    imageUrl: null,
    capacity: '',
  });

  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    let user;
    const getUser = async() => {
      user = await getCurrentUser();
      // console.log(user);
      if(user.statusCode !== 200) {
        toast.success("Login To Create Event, Redirecting...", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
        
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    }
    getUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImgUrl(e.target.files[0]);
    setFormData({ ...formData, imageUrl: e.target.files[0] });
  };

  const handleImageDelete = () => {
    setFormData({ ...formData, imageUrl: "" });
    setImgUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData = new FormData();
      Object.keys(formData).forEach((key) => {
        eventData.append(key, formData[key]);
      });
      // console.log(eventData);

      const response = await fetch('https://event.up.railway.app/api/v1/event/create-event', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: eventData,
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error('Event creation failed');
      }
  
      const data = await response.json();
      // console.log('Event created successfully:', data);

      toast.success("Event created successfully!", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: '',
        imageUrl: null,
        capacity: '',
      });
      navigate('/');
    } catch (error) {
      // console.error('Error creating event:', error);
      toast.error('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Cross = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  );

  return (
    <div className="min-h-screen my-8 flex justify-center items-center bg-gray-100 px-4 sm:px-6 lg:px-8">
    <Card className="w-full max-w-xs sm:max-w-md md:max-w-lg shadow-md bg-white">
      <CardHeader className="p-4 sm:p-6 bg-indigo-600 text-white">
        <h4 className="text-base sm:text-lg font-bold">Create New Event</h4>
      </CardHeader>
      <CardBody className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Event Title
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Enter event title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
  
          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Input
              id="description"
              name="description"
              placeholder="Enter event description"
              required
              value={formData.description}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
  
          {/* Date */}
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <Input
              id="date"
              name="date"
              type="date"
              required
              value={formData.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
  
          {/* Time */}
          <div className="space-y-2">
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <Input
              id="time"
              name="time"
              type="time"
              required
              value={formData.time}
              onChange={(e) => {
                const selectedTime = e.target.value;
                const selectedDate = formData.date;
                const now = new Date();
                const currentDate = now.toISOString().split('T')[0];
  
                if (selectedDate === currentDate) {
                  const currentHours = String(now.getHours()).padStart(2, '0');
                  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
                  const currentTime = `${currentHours}:${currentMinutes}`;
  
                  if (selectedTime <= currentTime) {
                    toast.error("Please select a future time", {
                      position: "top-right",
                      autoClose: 3000,
                      theme: "dark",
                    });
                    return;
                  }
                }
  
                handleInputChange({
                  target: {
                    name: 'time',
                    value: selectedTime,
                  },
                });
              }}
              className="w-full"
            />
          </div>
  
          {/* Location */}
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <Input
              id="location"
              name="location"
              placeholder="Enter event location"
              required
              value={formData.location}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
  
          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <Input
              id="category"
              name="category"
              placeholder="Enter event category"
              required
              value={formData.category}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
  
          {/* Capacity */}
          <div className="space-y-2">
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
              Capacity
            </label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              placeholder="Enter event capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
  
          {/* Image Upload */}
          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Event Image
            </label>
            {!imgUrl ? (
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e)}
                className="w-full"
              />
            ) : (
              <div className="relative">
                <img
                  src={URL.createObjectURL(imgUrl)}
                  alt={`${imgUrl.name}`}
                  className="w-full h-40 object-cover rounded"
                />
                <button
                  onClick={() => handleImageDelete()}
                  type="button"
                  className="absolute -top-2 -right-2"
                >
                  <Cross />
                </button>
              </div>
            )}
          </div>
  
          {/* Submit Button */}
          <Button
            type="submit"
            color="primary"
            className="w-full py-2 text-white bg-indigo-600 hover:bg-indigo-700 mt-4"
            isDisabled={loading}
          >
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
        </form>
      </CardBody>
    </Card>
  </div>
  
  );
};

export default CreateEvent;