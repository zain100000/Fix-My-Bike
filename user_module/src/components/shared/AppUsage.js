import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../constants/Constants';

const {width, height} = Dimensions.get('window');

const AppUsage = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={[
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
        },
      ]}>
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          },
        ]}>
        <TouchableOpacity onPress={() => navigation.goBack('Home')}>
          <Feather
            name="chevron-left"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.headerTextContainer}>
        <Text
          style={[
            styles.headerTitleText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Terms of Usage
        </Text>
        <Text
          style={[
            styles.headerDescriptionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Please read the terms below carefully.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text
          style={[
            styles.heading,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          General Terms
        </Text>
        <Text
          style={[
            styles.description,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          By using the Fix My Bike app, you agree to the following terms and
          conditions. The app is designed for bike owners to book servicing,
          maintenance, and repair services. Please use the app responsibly and
          in accordance with its purpose.
        </Text>

        <View style={styles.bulletContainer}>
          <Feather
            name="check-circle"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            You must be 18 years or older to use the app and book services.
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Feather
            name="check-circle"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            The app should be used for booking bike servicing, maintenance, and
            repairs only.
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Feather
            name="check-circle"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            You are responsible for providing accurate information about your
            bike's condition.
          </Text>
        </View>

        <Text
          style={[
            styles.heading,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          User Responsibilities
        </Text>
        <Text
          style={[
            styles.description,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          As a user of Fix My Bike, you are responsible for scheduling and
          managing your bike service bookings accurately. Providing incorrect
          information about your bike may result in delays or additional costs.
        </Text>

        <View style={styles.bulletContainer}>
          <Feather
            name="shield"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            Keep your account details secure and do not share them with others.
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Feather
            name="alert-circle"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            Notify us immediately if you suspect any unauthorized access to your
            account or incorrect service bookings.
          </Text>
        </View>

        <Text
          style={[
            styles.heading,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          Service Disclaimer
        </Text>
        <Text
          style={[
            styles.description,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          Fix My Bike provides a platform for booking bike services. The app
          does not guarantee the outcome or quality of services provided by
          third-party service providers. Always ensure that you select services
          that meet your needs and follow up with the provider for any issues.
        </Text>

        <View style={styles.bulletContainer}>
          <Feather
            name="tool"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            Fix My Bike is not liable for any damages or poor-quality repairs
            provided by third-party service providers.
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Feather
            name="help-circle"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            Always verify the credentials of service providers before proceeding
            with any repairs.
          </Text>
        </View>

        <Text
          style={[
            styles.heading,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          Data Privacy
        </Text>
        <Text
          style={[
            styles.description,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          Your data privacy is important to us. We collect and store data
          according to our privacy policy. You can review how we use your data
          within the app.
        </Text>

        <View style={styles.bulletContainer}>
          <Feather
            name="lock"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            We ensure the confidentiality of your personal information related
            to your bike and services.
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Feather
            name="user-check"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            You have control over your personal data and can request its
            deletion at any time.
          </Text>
        </View>

        <Text
          style={[
            styles.heading,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          Contact Us
        </Text>
        <Text
          style={[
            styles.description,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          If you have any queries or concerns regarding these terms, feel free
          to contact us at:
        </Text>
        <View style={styles.contactContainer}>
          <Feather
            name="mail"
            size={20}
            color={COLORS.primary}
            style={styles.contactIcon}
          />
          <Text
            style={[
              styles.contactText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            fixmybike@gmail.com
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppUsage;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: width * 0.04,
  },

  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: width * 0.02,
    paddingVertical: width * 0.05,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gray,
  },

  headerTextContainer: {
    marginTop: height * 0.12,
    marginHorizontal: width * 0.04,
  },

  headerTitleText: {
    fontSize: width * 0.09,
    color: COLORS.dark,
    fontFamily: FONTS.bold,
  },

  headerDescriptionText: {
    color: COLORS.dark,
    fontSize: width * 0.042,
    fontFamily: FONTS.medium,
    top: height * 0.01,
  },

  contentContainer: {
    marginTop: height * 0.02,
    marginHorizontal: width * 0.04,
  },

  heading: {
    fontSize: width * 0.06,
    fontFamily: FONTS.semiBold,
    marginVertical: height * 0.02,
  },

  description: {
    fontSize: width * 0.045,
    fontFamily: FONTS.regular,
    marginBottom: height * 0.02,
    lineHeight: width * 0.06,
    textAlign: 'justify',
  },

  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
    marginHorizontal: width * 0.04,
  },

  bulletIcon: {
    right: width * 0.05,
  },

  bulletText: {
    fontSize: width * 0.045,
    fontFamily: FONTS.regular,
    lineHeight: width * 0.06,
    textAlign: 'justify',
  },

  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.03,
    marginTop: height * 0.03,
  },

  contactIcon: {
    marginRight: width * 0.03,
  },

  contactText: {
    fontSize: width * 0.045,
    fontFamily: FONTS.regular,
    lineHeight: width * 0.06,
  },
});
