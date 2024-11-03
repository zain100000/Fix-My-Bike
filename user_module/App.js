import React, {useState} from 'react';
import {StatusBar} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {COLORS} from './src/components/constants/Constants';
import Splash from './src/components/shared/Splash';
import OnBoarding from './src/components/shared/onBoarding';
import Auth from './src/components/shared/Auth';
import Signin from './src/components/shared/Signin';
import Signup from './src/components/shared/Signup';
import ForgotPassword from './src/components/shared/ForgotPassword';
import PrivacyPolicy from './src/components/shared/PrivacyPolicy';
import AppUsage from './src/components/shared/AppUsage';
import About from './src/components/shared/About';
import BottomNavigator from './src/components/navigation/BottomNavigator';
import DetailProfileScreen from './src/components/screens/extraScreens/ProfileUpdate/DetailProfileScreen';
import ChangePassword from './src/components/shared/ChangePassword';
import CustomerCare from './src/components/screens/extraScreens/CustomerCare/CustomerCare';
import ServiceBooking from './src/components/screens/extraScreens/Bookings/ServiceBooking';

const Stack = createNativeStackNavigator();

const App = () => {
  const [statusBarColor, setStatusBarColor] = useState(COLORS.primary);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={statusBarColor} barStyle="light-content" />
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Splash">
        <Stack.Screen name="Splash">
          {props => <Splash {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>

        <Stack.Screen name="onBoard">
          {props => (
            <OnBoarding {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Auth">
          {props => <Auth {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>

        <Stack.Screen name="Signin">
          {props => <Signin {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>

        <Stack.Screen name="Signup">
          {props => <Signup {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>

        <Stack.Screen name="Forgot_Password">
          {props => (
            <ForgotPassword {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Privacy_Policy">
          {props => (
            <PrivacyPolicy {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Terms">
          {props => (
            <AppUsage {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="About">
          {props => <About {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>

        <Stack.Screen name="Main">
          {props => (
            <BottomNavigator {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Edit_Profile">
          {props => (
            <DetailProfileScreen
              {...props}
              setStatusBarColor={setStatusBarColor}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Change_Password">
          {props => (
            <ChangePassword {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Customer_Care">
          {props => (
            <CustomerCare {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Service_Booking">
          {props => (
            <ServiceBooking {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
