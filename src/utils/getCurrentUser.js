export const getCurrentUser = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const request = await fetch('http://localhost:4000/api/v1/users/current-user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (request.ok) {
        const data = await request.json();
        
        if (data.statusCode === 200) {
          return data
        }
      } else {
        if(request.status === 401) {
            return false
        }
      }
    } catch (error) {
      return error
    }
  };
