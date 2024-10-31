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
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {COLORS, FONTS} from '../constants/Constants';
import imgPlaceHolder from '../../assets/placeholders/default-avatar.png';
import ServicesContainer from '../utils/ServicesCard/ServicesContainer';
import Feather from 'react-native-vector-icons/Feather';

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

  const services = [
    {
      id: '1',
      service_image:
        'https://cdn.dealerspike.com/imglib/seo/stock/ps/ps_bike_mechanic_a.jpg',
      service_name: 'Basic Inspection and Safety Checks',
      service_description:
        'Quick inspection of essential parts, fluid levels, and tire pressure adjustment.',
      service_price: '200',
    },
    {
      id: '2',
      service_image:
        'https://th.bing.com/th/id/OIP.B0ZtnRQW2NKOZ7mpJ-SNWgHaE8?pid=ImgDet&rs=1',
      service_name: 'Battery and Electrical System Check',
      service_description:
        'Battery testing and replacement, terminal cleaning, headlight, taillight, and indicator check.',
      service_price: '250',
    },
    {
      id: '3',
      service_image:
        'https://th.bing.com/th/id/OIP.6iqWXAViNSW2OdLoF77IfAHaEK?pid=ImgDet&rs=1',
      service_name: 'Cleaning and Detailing Services',
      service_description:
        'Full bike wash, detailing, polishing, waxing, rust removal, and prevention.',
      service_price: '300',
    },
    {
      id: '4',
      service_image:
        'https://th.bing.com/th/id/OIP.VXHQEv-Xc5R7lgFf11tslwHaE8?pid=ImgDet&rs=1',
      service_name: 'Pre-ride Inspection for Long Trips',
      service_description:
        'Comprehensive check for long journeys, including fluids, brakes, and lighting.',
      service_price: '300',
    },
    {
      id: '5',
      service_image:
        'https://th.bing.com/th/id/OIP.YX56KlRlvTL9PPS6vj9CEwHaEK?pid=ImgDet&rs=1',
      service_name: 'Chain and Sprocket Maintenance',
      service_description:
        'Chain cleaning, lubrication, tension adjustment, and sprocket inspection.',
      service_price: '300',
    },
    {
      id: '6',
      service_image:
        'https://th.bing.com/th/id/OIP.CxsxHKURvO7H0_fzQhCnLwHaE8?pid=ImgDet&rs=1',
      service_name: 'Fuel System Services',
      service_description:
        'Fuel filter replacement, carburetor cleaning, fuel line inspection for leaks or clogs.',
      service_price: '400',
    },
    {
      id: '7',
      service_image:
        'https://th.bing.com/th/id/OIP.HbyFNx3t6Q1G1EqAkGiYlgHaEK?pid=ImgDet&rs=1',
      service_name: 'Exhaust System Check',
      service_description:
        'Exhaust pipe inspection for leaks, cleaning, rust prevention, muffler servicing.',
      service_price: '350',
    },
    {
      id: '8',
      service_image:
        'https://th.bing.com/th/id/OIP.2YZjkYJ1EghXIfybOX3pzQHaEK?rs=1&pid=ImgDetMain',
      service_name: 'Engine Maintenance',
      service_description:
        'Oil change, oil filter replacement, spark plug replacement, air filter cleaning.',
      service_price: '600',
    },
    {
      id: '9',
      service_image:
        'https://th.bing.com/th/id/OIP.iSSb2EXFkzfmD5XoqQrHMQHaE8?rs=1&pid=ImgDetMain',
      service_name: 'Tire and Wheel Services',
      service_description:
        'Tire replacement and balancing, puncture repair, tread depth check, wheel alignment.',
      service_price: '500',
    },
    {
      id: '10',
      service_image:
        'https://th.bing.com/th/id/OIP.gnD2YMPiYqIZc3LtltVg5AHaEK?pid=ImgDet&rs=1',
      service_name: 'Cooling System Maintenance',
      service_description:
        'Radiator and coolant check, coolant flush, and hose inspection.',
      service_price: '450',
    },
    {
      id: '11',
      service_image:
        'https://th.bing.com/th/id/OIP.L9uy0bOZ21aMgMeYHKKvKQHaE8?pid=ImgDet&rs=1',
      service_name: 'Suspension Services',
      service_description:
        'Front and rear suspension adjustment, fork oil change, shock absorber inspection.',
      service_price: '800',
    },
    {
      id: '12',
      service_image:
        'https://th.bing.com/th/id/OIP.x_iCGmAANdvWgnjcBu7X-gHaE8?pid=ImgDet&rs=1',
      service_name: 'Comprehensive Diagnostic Check',
      service_description:
        'Full diagnostics for engine, brakes, exhaust, and electrical systems.',
      service_price: '1000',
    },
    {
      id: '13',
      service_image:
        'https://th.bing.com/th/id/OIP.Q7aZyfUSIA8i_dZZxoHE4QHaEK?pid=ImgDet&rs=1',
      service_name: 'Customization and Upgrades',
      service_description:
        'Accessory installation, performance upgrades, paint and decal services.',
      service_price: '1500',
    },
    {
      id: '14',
      service_image:
        'https://th.bing.com/th/id/OIP.yG8kdL2Vv8Vp-4Kr4N9uzwHaE8?pid=ImgDet&rs=1',
      service_name: 'Winterization and Storage Preparation',
      service_description:
        'Fuel stabilizer application, battery storage prep, and full cover for off-season storage.',
      service_price: '550',
    },
  ];

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
              placeholder="Search services here!"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.lightGray
              }
              onFocus={() => setSearchBorderColor(COLORS.primary)}
              onBlur={() => setSearchBorderColor(COLORS.lightGray)}
            />
          </View>
        </View>

        <View style={styles.serviceContainer}>
          <Text
            style={[
              styles.services,
              {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
            ]}>
            <FlatList
              data={services}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <ServicesContainer
                  service_image={item.service_image}
                  service_name={item.service_name}
                  service_description={item.service_description}
                  service_price={item.service_price}
                />
              )}
              contentContainerStyle={styles.serviceContainer}
            />
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

  homeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  home: {
    fontFamily: FONTS.semiBold,
    fontSize: width * 0.05,
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

  serviceContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: height * 0.01,
    marginLeft: height * 0.01,
  },
});
