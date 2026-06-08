import React, { useState } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { ConfigurationScreen } from './screens/ConfigurationScreen';
import { SessionScreen } from './screens/SessionScreen';
import { Route } from './types';

export default function App() {
  const [route, setRoute] = useState<Route>({ name: 'Home' });
  const [routeHistory, setRouteHistory] = useState<Route[]>([]);

  const navigate = (newRoute: Route) => {
    setRouteHistory((prev) => [...prev, route]);
    setRoute(newRoute);
  };

  const goBack = () => {
    if (routeHistory.length > 0) {
      const newHistory = [...routeHistory];
      const previousRoute = newHistory.pop()!;
      setRouteHistory(newHistory);
      setRoute(previousRoute);
    }
  };

  const renderScreen = () => {
    switch (route.name) {
      case 'Home':
        return <HomeScreen navigate={navigate} goBack={goBack} />;
      case 'Config':
        return <ConfigurationScreen sessionType={route.sessionType} navigate={navigate} goBack={goBack} />;
      case 'Session':
        return <SessionScreen config={route.config} navigate={navigate} goBack={goBack} />;
      default:
        return <HomeScreen navigate={navigate} goBack={goBack} />;
    }
  };

  return renderScreen();
}
