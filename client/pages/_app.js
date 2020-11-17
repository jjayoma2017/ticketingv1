// _app.js => custom app component. Default page. All global styling must be placed in here
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className='container'>
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

/**
 * Server side rendering method. Call data from server. This method is Executed from theserver.
 * @param  {object} context The standard single argument that getInitialProps received.
 *                          This object contains these props: pathname,query,asPath,req,
 *                          res,err
 * @return {object} pageProps,data The values  returned from the currentuser api. The returned data will be
 *                        automatically passed into the LandingPage method above
 */
AppComponent.getInitialProps = async (appContext) => {
  const client = await buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
  let pageProps = {};
  if (appContext.Component.getInitialProps)
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
