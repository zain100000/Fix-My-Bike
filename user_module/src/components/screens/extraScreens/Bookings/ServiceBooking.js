import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  useColorScheme,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS, FONTS} from '../../../constants/Constants';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const {width, height} = Dimensions.get('window');

const ServiceBookingDetails = () => {
  const route = useRoute();
  const service_name = route.params?.service_name;
  const service_price = route.params?.service_price;

  const [totalPrice, setTotalPrice] = useState(service_price || 0);
  const [name, setName] = useState('');
  const [cell, setCell] = useState('');
  const [address, setAddress] = useState('');
  const [comments, setComments] = useState('');
  const [bikeModel, setBikeModel] = useState('');
  const [bikeRegNumber, setBikeRegNumber] = useState('');
  const [chainLubricants, setChainLubricants] = useState('');
  const [tirePressure, setTirePressure] = useState('');
  const [headLightAdjustment, setHeadLightAdjustment] = useState('');
  const [breakCheck, setBreakCheck] = useState('');
  const [batteryCleaning, setBatteryCleaning] = useState('');
  const [mirrorAdjustment, setMirrorAdjustment] = useState('');

  const [nameError, setNameError] = useState('');
  const [cellError, setCellError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [bikeModelError, setBikeModelError] = useState('');
  const [bikeRegNumberError, setBikeRegNumberError] = useState('');

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

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
          setName(userData.full_name);
          setCell(userData.phone_number);
          setAddress(userData.address);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  const fetchBikes = async () => {
    setLoading(true);
    try {
      const user = auth().currentUser;
      if (user) {
        const snapshot = await firestore()
          .collection('user_bikes')
          .where('userId', '==', user.uid)
          .get();

        const userBikes = snapshot.docs.map(doc => {
          const {bikeModel, bikeRegNumber} = doc.data();
          return {
            id: doc.id,
            bikeModel,
            bikeRegNumber,
          };
        });

        if (userBikes.length > 0) {
          setBikeModel(userBikes[0].bikeModel);
          setBikeRegNumber(userBikes[0].bikeRegNumber);
        }
      }
    } catch (error) {
      console.log('Error fetching bikes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUserData(), fetchBikes()]);
      setLoading(false);
    };

    loadData();
  }, [authInstance]);

  useEffect(() => {
    const statusBarColor =
      colorScheme === 'dark' ? COLORS.darkColor : COLORS.primary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(
      colorScheme === 'dark' ? 'light-content' : 'dark-content',
    );
  }, [colorScheme]);

  const isValidInput = () => {
    const namePattern = /^[a-zA-Z\s]*$/;
    const cellPattern = /^(\+92|92|0)(3\d{2}|\d{2})(\d{7})$/;
    const addressPattern = /^House#\d+\sStreet#\d+\s[A-Za-z\s]+\s[A-Za-z\s]+$/;
    const isNameValid = namePattern.test(name);
    const isCellValid = cellPattern.test(cell);
    const isAddressValid = addressPattern.test(address);

    bikeModelError === '' &&
      bikeRegNumberError === '' &&
      bikeModel !== '' &&
      bikeRegNumber !== '';

    return isNameValid && isCellValid && isAddressValid;
  };

  const handleNameChange = value => {
    setName(value);
    if (value === '') {
      setNameError('Name is required');
    } else if (!/^[a-zA-Z\s]+$/.test(value)) {
      setNameError('Only alphabets are allowed');
    } else {
      setNameError('');
    }
  };

  const handleCellChange = value => {
    setCell(value);
    if (value === '') {
      setCellError('Cell is required');
    } else if (!/^(\+92|92|0)(3\d{2}|\d{2})(\d{7})$/.test(value)) {
      setCellError('Invalid Cell Format');
    } else {
      setCellError('');
    }
  };

  const handleAddressChange = value => {
    setAddress(value);
    if (value === '') {
      setAddressError('Address is required');
    } else if (
      !/^House#\d+\sStreet#\d+\s[A-Za-z\s]+\s[A-Za-z\s]+$/.test(value)
    ) {
      setAddressError('Address must follow format');
    } else {
      setAddressError('');
    }
  };

  const renderAdditionalServices = (label, price, isSelected, onPress) => (
    <View style={styles.optionRow}>
      <TouchableOpacity onPress={onPress} style={styles.checkboxContainer}>
        <View style={styles.checkbox}>
          {isSelected && <Text style={styles.checkmark}>&#10003;</Text>}
        </View>
      </TouchableOpacity>
      <View style={styles.optionTextContainer}>
        <Text
          style={[
            styles.optionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          {label}
        </Text>
        <Text
          style={[
            styles.optionPrice,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          {`(Rs.${price})`}
        </Text>
      </View>
    </View>
  );

  const calculateTotalPrice = updatedServiceState => {
    const basePrice = parseFloat(service_price) || 0;
    let additionalCost = 0;

    const {chain, tire, headlight, brake, battery, mirror} =
      updatedServiceState;

    if (chain) additionalCost += 50;
    if (tire) additionalCost += 30;
    if (headlight) additionalCost += 40;
    if (brake) additionalCost += 35;
    if (battery) additionalCost += 60;
    if (mirror) additionalCost += 25;

    setTotalPrice(basePrice + additionalCost);
  };

  useEffect(() => {
    setIsButtonEnabled(isValidInput());
  }, [name, cell, address, comments]);

  const handleServiceBooking = async () => {
    if (isButtonEnabled) {
      setLoading(true);
      try {
        const user = authInstance.currentUser;
        if (user) {
          await firestore()
            .collection('booking_services')
            .add({
              userId: user.uid,
              serviceName: service_name,
              serviceBasePrice: service_price,
              name: name,
              cell: cell,
              address: address,
              comments: comments,
              bikeModel: bikeModel,
              bikeRegNumber: bikeRegNumber,
              additionalServices: [
                ...(chainLubricants ? ['Chain Lubrication'] : []),
                ...(tirePressure ? ['Tire Pressure Check'] : []),
                ...(headLightAdjustment ? ['Headlight Adjustment'] : []),
                ...(breakCheck ? ['Brake Light Check'] : []),
                ...(batteryCleaning ? ['Battery Terminal Cleaning'] : []),
                ...(mirrorAdjustment ? ['Mirror Adjustment'] : []),
              ],
              totalPrice: totalPrice,
              timestamp: Date.now(),
            });
          alert('Booking submitted successfully!');
        }
      } catch (error) {
        console.error('Error submitting booking:', error);
      } finally {
        setLoading(false);
      }
    }
  };

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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather
            name="chevron-left"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.formContainer}>
          <View style={styles.inputFieldContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Service Name
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.dark
              }
              value={service_name}
              editable={false}
            />
          </View>

          <View style={styles.inputFieldContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Service Base Price
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.dark
              }
              value={service_price}
              editable={false}
            />
          </View>

          <View style={styles.labelContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              User Information!
            </Text>
          </View>

          <View style={styles.inputFieldContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Name
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholder="Enter Your Name"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.dark
              }
              value={name}
              onChangeText={handleNameChange}
            />
            {nameError && nameError ? (
              <Text style={styles.errorText}>{nameError}</Text>
            ) : null}
          </View>

          <View style={styles.inputFieldContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Cell
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholder="Enter Your Cell"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.dark
              }
              keyboardType="number-pad"
              value={cell}
              onChangeText={handleCellChange}
            />
            {cellError && cellError ? (
              <Text style={styles.errorText}>{cellError}</Text>
            ) : null}
          </View>

          <View style={styles.inputFieldContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Address
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholder="Enter Your Address"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.dark
              }
              value={address}
              onChangeText={handleAddressChange}
            />
            {addressError && addressError ? (
              <Text style={styles.errorText}>{addressError}</Text>
            ) : null}
          </View>

          <View style={styles.labelContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Vehicle Information!
            </Text>
          </View>

          <View style={styles.inputFieldContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Bike Model
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}
              placeholder="Enter Bike Model"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.white : COLORS.dark
              }
              value={bikeModel}
              editable={false}
            />
          </View>

          <View style={styles.inputFieldContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Bike Registration Number
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}
              placeholder="Enter Registration Number"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.white : COLORS.dark
              }
              value={bikeRegNumber}
              editable={false}
            />
          </View>

          <View style={styles.extrasContainer}>
            <View style={styles.titleContainer}>
              <Text
                style={[
                  styles.titleText,
                  {
                    color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                  },
                ]}>
                Additional Services!
              </Text>
            </View>

            <View style={styles.optionsContainer}>
              {renderAdditionalServices(
                'Chain Lubrication',
                50,
                chainLubricants,
                () => {
                  const newState = !chainLubricants;
                  setChainLubricants(newState);
                  calculateTotalPrice({
                    chain: newState,
                    tire: tirePressure,
                    headlight: headLightAdjustment,
                    brake: breakCheck,
                    battery: batteryCleaning,
                    mirror: mirrorAdjustment,
                  });
                },
              )}

              {renderAdditionalServices(
                'Tire Pressure Check',
                30,
                tirePressure,
                () => {
                  const newState = !tirePressure;
                  setTirePressure(newState);
                  calculateTotalPrice({
                    chain: chainLubricants,
                    tire: newState,
                    headlight: headLightAdjustment,
                    brake: breakCheck,
                    battery: batteryCleaning,
                    mirror: mirrorAdjustment,
                  });
                },
              )}

              {renderAdditionalServices(
                'Headlight Adjustment',
                40,
                headLightAdjustment,
                () => {
                  const newState = !headLightAdjustment;
                  setHeadLightAdjustment(newState);
                  calculateTotalPrice({
                    chain: chainLubricants,
                    tire: tirePressure,
                    headlight: newState,
                    brake: breakCheck,
                    battery: batteryCleaning,
                    mirror: mirrorAdjustment,
                  });
                },
              )}

              {renderAdditionalServices(
                'Brake Light Check',
                35,
                breakCheck,
                () => {
                  const newState = !breakCheck;
                  setBreakCheck(newState);
                  calculateTotalPrice({
                    chain: chainLubricants,
                    tire: tirePressure,
                    headlight: headLightAdjustment,
                    brake: newState,
                    battery: batteryCleaning,
                    mirror: mirrorAdjustment,
                  });
                },
              )}

              {renderAdditionalServices(
                'Battery Terminal Cleaning',
                60,
                batteryCleaning,
                () => {
                  const newState = !batteryCleaning;
                  setBatteryCleaning(newState);
                  calculateTotalPrice({
                    chain: chainLubricants,
                    tire: tirePressure,
                    headlight: headLightAdjustment,
                    brake: breakCheck,
                    battery: newState,
                    mirror: mirrorAdjustment,
                  });
                },
              )}

              {renderAdditionalServices(
                'Mirror Adjustment',
                25,
                mirrorAdjustment,
                () => {
                  const newState = !mirrorAdjustment;
                  setMirrorAdjustment(newState);
                  calculateTotalPrice({
                    chain: chainLubricants,
                    tire: tirePressure,
                    headlight: headLightAdjustment,
                    brake: breakCheck,
                    battery: batteryCleaning,
                    mirror: newState,
                  });
                },
              )}
            </View>
          </View>

          <View style={styles.inputFieldContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Comments
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholder="Anything else for our mechanic?"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.dark
              }
              multiline={true}
              numberOfLines={6}
              value={comments}
              onChangeText={setComments}
            />
          </View>

          <View style={styles.inputFieldContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Total Price
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.dark
              }
              value={`Rs. ${totalPrice}`}
              editable={false}
            />
          </View>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={[
                styles.bookBtn,
                {
                  backgroundColor: isButtonEnabled
                    ? COLORS.primary
                    : COLORS.gray,
                },
              ]}
              disabled={!isButtonEnabled}>
              <Text style={styles.bookText}>
                {loading ? (
                  <ActivityIndicator color={COLORS.white} size={25} />
                ) : (
                  'Book Service'
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServiceBookingDetails;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingHorizontal: width * 0.02,
    paddingVertical: width * 0.05,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gray,
  },

  formContainer: {
    marginHorizontal: width * 0.05,
    marginTop: height * 0.15,
    gap: height * 0.05,
  },

  imageContainer: {
    width: width * 0.9,
    height: height * 0.3,
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: height * 0.15,
    borderRadius: 10,
  },

  image: {
    width: width * 0.9,
    height: height * 0.9,
    resizeMode: 'cover',
  },

  label: {
    fontSize: width * 0.045,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    marginBottom: height * 0.01,
  },

  inputField: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: COLORS.primary,
    paddingHorizontal: width * 0.03,
    fontSize: width * 0.045,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
  },

  pickerContainer: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: COLORS.primary,
    height: height * 0.08,
    width: width * 0.9,
    color: COLORS.dark,
  },

  picker: {
    height: height * 0.06,
    width: width * 0.9,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
  },

  extrasContainer: {
    marginVertical: height * 0.001,
    paddingHorizontal: width * 0.02,
  },

  titleContainer: {
    marginBottom: height * 0.02,
  },

  titleText: {
    fontSize: width * 0.045,
    fontFamily: FONTS.semiBold,
  },

  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.35,
    marginBottom: height * 0.02,
  },

  checkboxContainer: {
    marginRight: width * 0.02,
  },

  checkbox: {
    height: height * 0.036,
    width: width * 0.065,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkmark: {
    color: COLORS.primary,
  },

  optionTextContainer: {
    justifyContent: 'center',
    marginBottom: height * 0.01,
  },

  optionText: {
    fontSize: width * 0.04,
    fontFamily: FONTS.semiBold,
  },

  optionPrice: {
    fontSize: width * 0.04,
    fontFamily: FONTS.semiBold,
  },

  btnContainer: {
    marginBottom: height * 0.02,
    width: '100%',
  },

  bookBtn: {
    width: '100%',
    alignItems: 'center',
    padding: height * 0.024,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },

  bookText: {
    fontSize: width * 0.045,
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
  },

  errorText: {
    position: 'absolute',
    bottom: -25,
    fontSize: width * 0.04,
    color: COLORS.errorColor,
    fontFamily: FONTS.semiBold,
    paddingHorizontal: 5,
  },
});
