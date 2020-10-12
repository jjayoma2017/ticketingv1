import axios from 'axios';
const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async () => {
  if (typeof window === 'undefined') {
    const response = await axios.get(
      'http://default.my-release-ingress-nginx-controller.svc.cluster.local/api/users/currentuser',
      //'https://192.168.99.101/api/users/currentuser',
      {
        headers: {
          Host: 'ticketing.dev',
        },
      }
    );
    return response.data;
    return {};
  } else {
    const response = await axios.get('/api/users/currentuser');
    console.log('Executed');
    return response.data;
  }
};

export default LandingPage;
