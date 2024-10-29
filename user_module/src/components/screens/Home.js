import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  useColorScheme,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {COLORS, FONTS} from '../constants/Constants';
import Feather from 'react-native-vector-icons/Feather';
import imgPlaceHolder from '../../assets/placeholders/default-avatar.png';

const {width, height} = Dimensions.get('window');

const Home = () => {
  const [image, setImage] = useState('');
  const [fullName, setFullName] = useState('');
  const [searchBorderColor, setSearchBorderColor] = useState(COLORS.lightGray);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const authInstance = auth();

  const fetchUserData = async () => {
    const user = authInstance.currentUser;
    if (user) {
      try {
        const userDoc = await firestore()
          .collection('app_users')
          .doc(user.uid)
          .get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          setFullName(userData.full_name);
          setImage(userData.profile_image);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUserData()]);
      setLoading(false);
    };

    loadData();
  }, [authInstance]);

  return (
    <SafeAreaView
      style={[
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
        },
      ]}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.leftContainer}>
            <View style={styles.greetingContainer}>
              <Text
                style={[
                  styles.greeting,
                  {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
                ]}>
                Hello,
              </Text>
              <Text
                style={[
                  styles.name,
                  {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
                ]}>
                {fullName}!
              </Text>
            </View>
            <Text
              style={[
                styles.description,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Have A Nice Day!
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={styles.rightContainer}>
              <View style={styles.imgContainer}>
                {image ? (
                  <Image source={{uri: image}} style={styles.img} />
                ) : (
                  <Image source={imgPlaceHolder} style={styles.img} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchBarContainer,
              {borderColor: searchBorderColor},
            ]}>
            <Feather
              name="search"
              size={width * 0.045}
              color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
              style={styles.searchIcon}
            />
            <TextInput
              style={[
                styles.searchInputField,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}
              placeholder="Search!"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.lightGray
              }
              onFocus={() => setSearchBorderColor(COLORS.primary)}
              onBlur={() => setSearchBorderColor(COLORS.lightGray)}
            />
          </View>
        </View>

        <View style={styles.homeContainer}>
          <Text
            style={[
              styles.home,
              {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
            ]}>
            All services will be shown here!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  scrollViewContainer: {
    marginTop: height * 0.005,
  },

  headerContainer: {
    paddingHorizontal: width * 0.02,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.01,
    marginTop: height * 0.01,
  },

  leftContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: height * 0.01,
    marginLeft: height * 0.01,
  },

  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },

  greeting: {
    fontSize: width * 0.045,
    fontFamily: FONTS.semiBold,
  },

  name: {
    fontSize: width * 0.055,
    fontFamily: FONTS.semiBold,
  },

  description: {
    fontSize: width * 0.035,
    fontFamily: FONTS.bold,
    marginTop: width * 0.01,
  },

  rightContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  imgContainer: {
    marginTop: height * 0.02,
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: (width * 0.3) / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.lightGray,
  },

  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  searchContainer: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.03,
  },

  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.03,
  },

  searchInputField: {
    paddingHorizontal: width * 0.03,
    fontFamily: FONTS.semiBold,
    width: width * 0.65,
  },

  searchIcon: {
    marginRight: width * 0.01,
  },

  homeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  home: {
    fontFamily: FONTS.semiBold,
    fontSize: width * 0.05,
  },
});
