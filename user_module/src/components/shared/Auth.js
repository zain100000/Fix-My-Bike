import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  useColorScheme,
} from 'react-native';
import {COLORS, FONTS} from '../constants/Constants';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {useNavigation} from '@react-navigation/native';
import CustomModal from '../utils/Modals/CustomModal';

const {width, height} = Dimensions.get('window');

const Auth = () => {
  const [showGoogleAuthModal, setShowGoogleAuthModal] = useState(false);
  const [showFacebookAuthModal, setShowFacebookAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '942886347816-2bl6f37r0ko3enu4j1t67j32is43qln3.apps.googleusercontent.com',
    });
  }, []);

  useEffect(() => {
    const statusBarColor =
      colorScheme === 'dark' ? COLORS.darkColor : COLORS.primary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(
      colorScheme === 'dark' ? 'light-content' : 'dark-content',
    );
  }, [colorScheme]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setShowGoogleAuthModal(true);

    try {
      await GoogleSignin.hasPlayServices();

      const {idToken} = await GoogleSignin.signIn();

      if (!idToken) {
        throw new Error('Failed to obtain ID token');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      const result = await auth().signInWithCredential(googleCredential);

      const user = result.user;
      const userRef = firestore().collection('app_users').doc(user.uid);
      const doc = await userRef.get();

      if (!doc.exists) {
        await userRef.set(
          {
            full_name: user.displayName || 'Unnamed User',
            email: user.email,
          },
          {merge: true},
        );
      }

      setShowGoogleAuthModal(false);
      setTimeout(() => {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.replace('Main');
        }, 2000);
      }, 500);
    } catch (error) {
      console.error('Error during Google Sign-In:', error.message);
      setShowGoogleAuthModal(false);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setFacebookLoading(true);
      setShowFacebookAuthModal(true);

      await LoginManager.logOut();

      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }

      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw 'Something went wrong obtaining access token';
      }

      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );

      const userCredential = await auth().signInWithCredential(
        facebookCredential,
      );

      const user = userCredential.user;

      const userRef = firestore().collection('app_users').doc(user.uid);
      const doc = await userRef.get();

      if (!doc.exists) {
        await userRef.set({
          full_name: user.displayName,
          email: user.email,
        });
      }

      setShowFacebookAuthModal(false);

      setTimeout(() => {
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.replace('Main');
        }, 2000);
      }, 500);

      setFacebookLoading(false);
    } catch (error) {
      console.log(error);
      setShowFacebookAuthModal(false);

      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);

      setFacebookLoading(false);
    }
  };

  const dynamicStyles = styles(colorScheme);

  return (
    <SafeAreaView
      style={[
        dynamicStyles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
        },
      ]}>
      <View style={dynamicStyles.headerImageContainer}>
        <Image
          source={require('../../assets/authScreen/auth.png')}
          style={dynamicStyles.headerImage}
        />
      </View>

      <View style={dynamicStyles.textContainer}>
        <Text
          style={[
            dynamicStyles.title,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Fix My Bike
        </Text>
        <Text
          style={[
            dynamicStyles.description,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Let's get your bike serviced!
        </Text>
      </View>

      <View style={dynamicStyles.buttonContainer}>
        <TouchableOpacity
          style={[
            dynamicStyles.googleButtonContainer,
            {
              backgroundColor:
                colorScheme === 'dark'
                  ? COLORS.googleButton
                  : COLORS.googleButton,
            },
          ]}
          onPress={handleGoogleSignIn}>
          {googleLoading ? (
            <ActivityIndicator size={25} color={COLORS.dark} />
          ) : (
            <>
              <Image
                source={require('../../assets/png/google-icon.png')}
                style={dynamicStyles.icon}
              />

              <Text
                style={[
                  dynamicStyles.googleButtonText,
                  {
                    color: colorScheme === 'dark' ? COLORS.dark : COLORS.dark,
                  },
                ]}>
                Continue with Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            dynamicStyles.faceboookButtonContainer,
            {
              backgroundColor:
                colorScheme === 'dark'
                  ? COLORS.facebookButton
                  : COLORS.facebookButton,
            },
          ]}
          onPress={handleFacebookSignIn}>
          {googleLoading ? (
            <ActivityIndicator size={25} color={COLORS.dark} />
          ) : (
            <>
              <Image
                source={require('../../assets/png/facebook-icon.png')}
                style={dynamicStyles.icon}
              />

              <Text
                style={[
                  dynamicStyles.facebookButtonText,
                  {
                    color: colorScheme === 'dark' ? COLORS.dark : COLORS.dark,
                  },
                ]}>
                Continue with Facebook
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={dynamicStyles.extraContainer}>
        <View style={dynamicStyles.signinContainer}>
          <Text
            style={{
              fontSize: width * 0.04,
              color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
              fontFamily: FONTS.semiBold,
            }}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
            <Text
              style={[
                dynamicStyles.extraText,
                {
                  color:
                    colorScheme === 'dark' ? COLORS.primary : COLORS.primary,
                },
              ]}>
              Signin
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={dynamicStyles.policyContainer}>
        <Text
          style={[
            dynamicStyles.policyText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          By signing up or logging in, I accept the app{' '}
          <Text
            onPress={() => navigation.navigate('Privacy_Policy')}
            style={[
              dynamicStyles.linkText,
              {
                color: colorScheme === 'dark' ? COLORS.primary : COLORS.primary,
              },
            ]}>
            Privacy Policy
          </Text>{' '}
          and{' '}
          <Text
            onPress={() => navigation.navigate('Terms')}
            style={[
              dynamicStyles.linkText,
              {color: colorScheme === 'dark' ? COLORS.primary : COLORS.primary},
            ]}>
            Terms & Conditions
          </Text>
          .
        </Text>
      </View>

      <CustomModal
        visible={showGoogleAuthModal}
        onClose={() => setShowGoogleAuthModal(false)}
        animationSource={require('../../assets/animations/google.json')}
        title="Trying To Login!"
        description="Please wait while We're Trying To Log You In With Your Google Account."
      />

      <CustomModal
        visible={showFacebookAuthModal}
        onClose={() => setShowFacebookAuthModal(false)}
        animationSource={require('../../assets/animations/facebook.json')}
        title="Trying To Login!"
        description="Please wait while We're Trying To Log You In With Your Facebook Account."
      />

      <CustomModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        animationSource={require('../../assets/animations/success.json')}
        title="Success!"
        description="Your Account Has Been Created Successfully."
      />

      <CustomModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        animationSource={require('../../assets/animations/error.json')}
        title="Login Failed"
        description="There Was An Error During The Login Process. Please Try Again."
      />
    </SafeAreaView>
  );
};

export default Auth;

const styles = colorScheme =>
  StyleSheet.create({
    primaryContainer: {
      flex: 1,
    },

    headerImage: {
      width: '100%',
      height: height * 0.35,
      resizeMode: 'cover',
    },

    textContainer: {
      top: height * 0.02,
    },

    title: {
      fontSize: width * 0.07,
      fontFamily: FONTS.semiBold,
      left: width * 0.06,
      marginBottom: height * 0.015,
    },

    description: {
      fontSize: width * 0.045,
      left: width * 0.065,
      fontFamily: FONTS.medium,
      width: width * 0.9,
    },

    buttonContainer: {
      flexDirection: 'column',
      paddingHorizontal: width * 0.05,
      marginTop: height * 0.08,
      gap: height * 0.02,
    },

    googleButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      padding: height * 0.018,
      width: '100%',
      gap: 10,
      shadowColor: COLORS.dark,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },

    googleButtonText: {
      fontSize: width * 0.04,
      fontFamily: FONTS.bold,
    },

    faceboookButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      padding: height * 0.018,
      width: '100%',
      gap: 10,
      shadowColor: COLORS.dark,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },

    facebookButtonText: {
      fontSize: width * 0.04,
      fontFamily: FONTS.bold,
    },

    icon: {
      resizeMode: 'contain',
      width: width * 0.12,
      height: height * 0.045,
      top: 2,
    },

    signinContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      marginTop: height * 0.01,
      padding: height * 0.02,
    },

    extraText: {
      fontSize: width * 0.04,
      fontFamily: FONTS.semiBold,
    },

    policyContainer: {
      position: 'absolute',
      bottom: height * 0.01,
      marginVertical: height * 0.02,
      paddingHorizontal: width * 0.08,
      alignSelf: 'center',
    },

    policyText: {
      fontSize: width * 0.04,
      fontFamily: FONTS.semiBold,
      lineHeight: height * 0.03,
      textAlign: 'center',
    },

    linkText: {
      fontWeight: 'bold',
    },
  });
