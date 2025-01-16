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
  Badge,
  Tabs,
  Tab,
} from '@nextui-org/react';
import { Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EventsDashboard = () => {
  const [events, setEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchEvents = async () => {
      const allEventsRequest = fetch('https://event.up.railway.app/api/v1/event/get-all-events', {
        method: 'GET',
      });

      const userEventsRequest = fetch(`https://event.up.railway.app/api/v1/event/get-all-event`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const userPastEvents = fetch(`https://event.up.railway.app/api/v1/event/get-past-event`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      try {
        const [allEventsRes, userEventsRes, userPastRes] = await Promise.all([
          allEventsRequest,
          userEventsRequest,
          userPastEvents,
        ]);

        // Check if any of the requests failed
        const responses = [
          allEventsRes,
          userEventsRes,
          userPastRes,
        ];

        const failedResponse = responses.find((res) => !res.ok);
        if (failedResponse) {
          throw new Error('Failed to fetch some events');
        }

        const allEventsData = await allEventsRes.json();
        const userEventsData = await userEventsRes.json();
        const pastEventsData = await userPastRes.json();

        // console.log(allEventsData)
        setEvents(allEventsData.events);
        setUserEvents(userEventsData.events);

        // Filter past events
        const currentDate = new Date();
        const pastEventsDataFiltered = userEventsData.events.filter(
          (event) => new Date(event.date) < currentDate
        );
        setPastEvents(pastEventsDataFiltered);
      } catch (err) {
        setError('Failed to fetch events.');
        toast.error('Failed to fetch events', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'dark',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, [token]);

  const handleJoinEvent = async (eventId) => {
    try {
      const response = await fetch(`https://event.up.railway.app/api/v1/event/join/${eventId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to join event');
      }

      toast.success('Successfully joined event!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      });

      // Add event to user events without reloading
      const joinedEvent = events.find((event) => event._id === eventId);
      setUserEvents([...userEvents, joinedEvent]);

      // Optionally: update the original events list if needed
      setEvents(events.filter((event) => event._id !== eventId));
    } catch (error) {
      toast.error('Failed to join event', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      });
    }
  };

  const handleLeaveEvent = async (eventId) => {
    try {
      const response = await fetch(`https://event.up.railway.app/api/v1/event/leave/${eventId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to leave event');
      }

      toast.success('Successfully left the event!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      });

      // Refresh events after leaving
      window.location.reload();
    } catch (error) {
      toast.error('Failed to leave event', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      });
    }
  };

  const EventCard = ({ event, isUserEvent }) => (
    <Card className="shadow-md">
  <CardHeader className="flex flex-col items-start p-4 bg-indigo-600 text-white">
    <h4 className="text-lg font-bold">{event.title}</h4>
    <p className="text-sm">{event.description}</p>
  </CardHeader>
  <CardBody className="p-4">
    {event.imageUrl && (
      <img
        src={event.imageUrl}
        alt={event.title}
        className="w-full h-48 object-cover mb-4 rounded-md"
      />
    )}
    <div className="space-y-2 text-sm text-gray-800">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-indigo-700" />
        <span>
          {new Date(event.date).toLocaleDateString()} at {event.time}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-indigo-700" />
        <span>{event.attendees?.length || 0} attendees</span>
      </div>
    </div>
  </CardBody>
  <CardFooter className="p-4 bg-indigo-50">
    {isUserEvent ? (
      <Button
        color="error"
        className="w-full"
        onClick={() => handleLeaveEvent(event._id)}
      >
        Leave Event
      </Button>
    ) : (
      <Button
        color="primary"
        className="w-full"
        onClick={() => handleJoinEvent(event._id)}
      >
        Join Event
      </Button>
    )}
  </CardFooter>
</Card>

  );

  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const isUserEvent = (event) => {
    return userEvents.some((userEvent) => userEvent._id === event._id);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold text-indigo-700">Events Dashboard</h1>
            <Button
              onPress={() => navigate('/create-event')}
              color="primary"
              variant="shadow"
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2"
              size="lg"
            >
              Create Event
            </Button>
          </div>

          <Card className="w-full border-none bg-white shadow">
            <CardBody className="p-0 overflow-hidden">
              <Tabs
                aria-label="Events"
                color="primary"
                variant="bordered"
                classNames={{
                  base: 'w-full',
                  tabList: 'gap-6 w-full rounded-none p-0 border-b border-gray-300',
                  tab: 'max-w-fit px-8 h-14 text-indigo-600',
                  tabContent: 'group-data-[selected=true]:text-indigo-700',
                }}
              >
                <Tab key="all" title="All Events">
                  <div className="lg:p-8 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {events.map((event) => (
                        <EventCard
                          key={event._id}
                          event={event}
                          isUserEvent={false}
                        />
                      ))}
                    </div>
                  </div>
                </Tab>

                <Tab
                  key="upcoming"
                  title={(
                    <div className="flex items-center space-x-2">
                      <span className="text-medium font-medium">My Events</span>
                      <Badge
                        content={userEvents.length}
                        color="primary"
                        size="sm"
                        className="group-data-[selected=true]:border-indigo-700"
                      />
                    </div>
                  )}
                >
                  <div className="lg:p-8 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userEvents.map((event) => (
                        <EventCard
                          key={event._id}
                          event={event}
                          isUserEvent={true}
                        />
                      ))}
                    </div>
                  </div>
                </Tab>

                <Tab
                  key="past"
                  title={(
                    <div className="flex items-center space-x-2">
                      <span className="text-medium font-medium">Past Events</span>
                      <Badge
                        content={pastEvents.length}
                        color="secondary"
                        size="sm"
                      />
                    </div>
                  )}
                >
                  <div className="lg:p-8 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pastEvents.map((event) => (
                        <EventCard
                          key={event._id}
                          event={event}
                          isUserEvent={false}
                        />
                      ))}
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventsDashboard;

