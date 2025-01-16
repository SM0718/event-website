import React, { useState, useEffect } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tabs,
  Tab,
  Divider,
} from '@nextui-org/react';
import { Calendar, Users } from 'lucide-react';
import EventsDashboard from './EventDashboard';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getCurrentUser } from '@/utils/getCurrentUser';


const Home = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      name: 'Tech Conference 2025',
      description: 'Annual technology conference',
      date: '2025-03-15',
      time: '09:00',
      category: 'Technology',
      attendees: 45,
    },
    {
      id: 2,
      name: 'Music Festival',
      description: 'Summer music festival',
      date: '2025-07-20',
      time: '14:00',
      category: 'Entertainment',
      attendees: 120,
    },
  ]);
  

  return (
    <div className="min-h-screen bg-gray-100">
      {/* {isLoggedIn ? (
        <MainContent events={events} setEvents={setEvents} />
      ) : (
        <AuthScreen setIsLoggedIn={setIsLoggedIn} />
      )} */}
      <EventsDashboard events={events} setEvents={setEvents} />
    </div>
  );
};

export const Header = () => {
  const { isLoggedIn, setIsLoggedIn, clearUserInfo } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
      let data
      const getUser = async() => {
        data = await getCurrentUser()
        if(data.statusCode === 200) {
          setIsLoggedIn(true);
          setUserInfo(data.data.user);
        }
      }
      getUser()
    }, [])
    
  const logout = async () => {
    const token = localStorage.getItem('accessToken')
    try {
      const request = await fetch(`https://event.up.railway.app/api/v1/users/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (request.ok) {
        const data = await request.json();
        if (data.statusCode === 200) {
          setIsLoggedIn(false);
          clearUserInfo();
          window.location.reload();
        }
      }
    } catch (error) {
      alert(error.message)
    }
  };

  return (
    <Navbar className="bg-gray-800 p-4 shadow-md rounded-b-xl">
      <NavbarBrand className="flex items-center space-x-2">
        <span className="text-3xl font-semibold text-white">🎉</span>
        <p onClick={() => navigate('/')} className="font-bold cursor-pointer text-xl text-white">
          Event Manager
        </p>
      </NavbarBrand>
      <NavbarContent justify="end" className="flex items-center space-x-4">
        {isLoggedIn ? (
          <Button
            color="error"
            variant="flat"
            className="text-white rounded-lg p-2 hover:bg-red-500 hover:text-white transition"
            onClick={() => logout()}
          >
            Logout
          </Button>
        ) : (
          <Button
            color="primary"
            variant="flat"
            className="text-white p-2 rounded-lg hover:bg-blue-500 hover:text-white transition"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export const AuthScreen = ({ setIsLoggedIn }) => {
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="px-6 py-4">
          <h4 className="text-2xl font-bold">
            {authMode === 'login' ? 'Login' : 'Register'}
          </h4>
          <p className="text-sm text-gray-500 mt-2">
            {authMode === 'login'
              ? 'Welcome back! Please login to continue.'
              : 'Create a new account to get started.'}
          </p>
        </CardHeader>
        <CardBody className="px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {authMode === 'register' && (
              <Input
                label="Name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            )}
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Button type="submit" color="primary" className="w-full">
              {authMode === 'login' ? 'Login' : 'Register'}
            </Button>
          </form>
        </CardBody>
        <CardFooter className="px-6 py-4 flex flex-col gap-3">
          <Button
            variant="light"
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
          >
            {authMode === 'login'
              ? "Don't have an account? Register"
              : 'Already have an account? Login'}
          </Button>
          <Divider />
          <Button variant="flat" color="secondary" onClick={() => setIsLoggedIn(true)}>
            Continue as Guest
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export const MainContent = ({ events, setEvents }) => {
  const currentDate = new Date();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-6 py-10">
    <div className="flex flex-col justify-between items-center mb-8">
      <Tabs aria-label="Events" className="w-full">
        <Tab key="upcoming" title="Upcoming Events" className="text-xl font-semibold text-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {events
              .filter((event) => new Date(event.date) >= currentDate)
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>
        </Tab>
        <Tab key="past" title="Past Events" className="text-xl font-semibold text-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {events
              .filter((event) => new Date(event.date) < currentDate)
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>
        </Tab>
      </Tabs>
      <Button
        color="primary"
        onClick={() => setCreateModalOpen(true)}
        className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
      >
        + Create Event
      </Button>
    </div>
  
    <CreateEventModal
      isOpen={createModalOpen}
      onClose={() => setCreateModalOpen(false)}
      events={events}
      setEvents={setEvents}
    />
  </div>
  
  );
};

export const EventCard = ({ event }) => (
  <Card className="shadow-md">
    <CardHeader className="flex flex-col items-start p-4">
      <h4 className="text-lg font-bold">{event.name}</h4>
      <p className="text-sm text-gray-500">{event.description}</p>
    </CardHeader>
    <CardBody className="p-4">
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600" />
          <span>{event.attendees} attendees</span>
        </div>
      </div>
    </CardBody>
    <CardFooter className="p-4">
      <Button color="primary" className="w-full">
        Join Event
      </Button>
    </CardFooter>
  </Card>
);

export const CreateEventModal = ({ isOpen, onClose, events, setEvents }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    category: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = { id: events.length + 1, ...formData, attendees: 0 };
    setEvents([...events, newEvent]);
    onClose();
    setFormData({ name: '', description: '', date: '', time: '', category: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Create New Event</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Event Name"
              placeholder="Enter event name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Description"
              placeholder="Enter event description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <Input
              label="Time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
            <Input
              label="Category"
              placeholder="Enter event category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" color="danger" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSubmit}>
            Create Event
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Home;
