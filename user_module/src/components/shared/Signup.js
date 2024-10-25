import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
  useColorScheme,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../constants/Constants';
import ImagePicker from 'react-native-image-crop-picker';
import imgPlaceHolder from '../../assets/placeholders/default-avatar.png';
import CustomModal from '../utils/Modals/CustomModal';
import firebase from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';

const {width, height} = Dimensions.get('window');

const Signup = () => {
  const [image, setImage] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [hidePassword1, setHidePassword1] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordStrengthColor, setPasswordStrengthColor] = useState(
    COLORS.dark,
  );

  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [loading, setLoading] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const statusBarColor =
      colorScheme === 'dark' ? COLORS.darkColor : COLORS.primary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(
      colorScheme === 'dark' ? 'light-content' : 'dark-content',
    );
  });

  useEffect(() => {
    setIsButtonEnabled(isValidInput());
  }, [fullName, email, phone, address, password, confirmPassword]);

  const isValidInput = () => {
    const fullNamePattern = /^[a-zA-Z\s]*$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    const phonePattern = /^(\+92|92|0)(3\d{2}|\d{2})(\d{7})$/;
    const addressPattern = /^House#\d+\sStreet#\d+\s[A-Za-z\s]+\s[A-Za-z\s]+$/;
    const isFullNameValid = fullNamePattern.test(fullName);
    const isEmailValid = emailPattern.test(email);
    const isPhoneValid = phonePattern.test(phone);
    const isAddressValid = addressPattern.test(address);
    const isPasswordValid = passwordPattern.test(password);
    const isConfirmPasswordValid = password === confirmPassword;

    return (
      isFullNameValid &&
      isEmailValid &&
      isPhoneValid &&
      isAddressValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    );
  };

  const handleFullNameChange = value => {
    setFullName(value);
    if (value === '') {
      setFullNameError('Full name is required');
    } else if (!/^[a-zA-Z\s]+$/.test(value)) {
      setFullNameError('Only alphabets are allowed');
    } else {
      setFullNameError('');
    }
  };

  const handleEmailChange = value => {
    setEmail(value);
    if (value === '') {
      setEmailError('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('Enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePhoneChange = value => {
    setPhone(value);
    if (value === '') {
      setPhoneError('Phone number is required');
    } else if (!/^(\+92|92|0)(3\d{2}|\d{2})(\d{7})$/.test(value)) {
      setPhoneError('Invalid phone number format');
    } else {
      setPhoneError('');
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

  const handlePasswordChange = value => {
    setPassword(value);
    checkPasswordStrength(value);
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (value === '') {
      setPasswordError('Password is required');
    } else if (!passwordPattern.test(value)) {
      setPasswordError('');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = value => {
    setConfirmPassword(value);
    if (value === '') {
      setConfirmPasswordError('Please confirm your password');
    } else if (password !== value) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const checkPasswordStrength = password => {
    const strongPasswordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    const averagePasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (strongPasswordRegex.test(password)) {
      setPasswordStrength('Strong');
      setPasswordStrengthColor(COLORS.strongColor);
      setActiveIndex(2);
    } else if (averagePasswordRegex.test(password)) {
      setPasswordStrength('Average');
      setPasswordStrengthColor(COLORS.averageColor);
      setActiveIndex(1);
    } else {
      setPasswordStrength('Weak');
      setPasswordStrengthColor(COLORS.weakColor);
      setActiveIndex(0);
    }
  };

  const validateFullName = () => {
    const regex = /^[a-zA-Z\s]+$/;
    if (!fullName || !regex.test(fullName)) {
      return 'Full name is required and should contain only alphabets';
    }
    return '';
  };

  const validateEmail = () => {
    if (!email) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePhone = () => {
    if (!phone) {
      return 'Phone number is required';
    }
    const phoneRegex = /^(\+92|92|0)(3\d{2}|\d{2})(\d{7})$/;
    if (!phoneRegex.test(phone)) {
      return 'Invalid phone number format';
    }
    return '';
  };

  const validateAddress = () => {
    if (!address) {
      return 'Address is required';
    }
    const addressRegex = /^House#\d+\sStreet#\d+\s[A-Za-z\s]+\s[A-Za-z\s]+$/;
    if (!addressRegex.test(address)) {
      return 'Invalid address format, use: House#XX Street#XX Area City';
    }
    return '';
  };

  const validatePassword = () => {
    if (!password) {
      return 'Password is required';
    }
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long with uppercase, lowercase, number, and special character';
    }
    return '';
  };

  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handlePickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      setImage(image);
    });
  };

  const handleRegister = async () => {
    setLoading(true);

    const fullNameError = validateFullName();
    const emailError = validateEmail();
    const phoneError = validatePhone();
    const addressError = validateAddress();
    const passwordError = validatePassword();
    const confirmPasswordError = validateConfirmPassword();

    if (!image) {
      setLoading(false);
      alert('Profile picture is required!');
      return;
    }

    if (
      fullNameError ||
      emailError ||
      phoneError ||
      addressError ||
      passwordError ||
      confirmPasswordError
    ) {
      setLoading(false);
      return;
    }

    setShowAuthModal(true);

    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      const response = await fetch(image.path);
      const blob = await response.blob();

      const storageRef = firebase
        .storage()
        .ref(`app_users/user_profile_images/${user.uid}.jpg`);
      await storageRef.put(blob);

      const imageUrl = await storageRef.getDownloadURL();

      await firebase.firestore().collection('app_users').doc(user.uid).set({
        full_name: fullName,
        email: email,
        phone_number: phone,
        address: address,
        profile_image: imageUrl,
      });

      setShowAuthModal(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.navigate('Signin');
      }, 3000);
    } catch (error) {
      setShowAuthModal(false);
      setTimeout(() => {
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 1000);
      }, 1000);

      console.error('Signup failed:', error.message);
    } finally {
      setLoading(false);
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
        <TouchableOpacity onPress={() => navigation.goBack('Login')}>
          <Feather
            name="chevron-left"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.welcomeContainer}>
          <Text
            style={[
              styles.welcomeTitleText,
              {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
            ]}>
            Register
          </Text>
          <Text
            style={[
              styles.welcomeDescriptionText,
              {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
            ]}>
            Fill up the form to get registered.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.imgContainer}>
            <TouchableOpacity onPress={handlePickImage}>
              {image ? (
                <Image source={{uri: image.path}} style={styles.img} />
              ) : (
                <Image source={imgPlaceHolder} style={styles.img} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.nameContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Full Name
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholder="Enter Your Full Name"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.dark
              }
              keyboardType="name-phone-pad"
              value={fullName}
              onChangeText={handleFullNameChange}
            />
            {fullNameError && fullNameError ? (
              <Text style={styles.errorText}>{fullNameError}</Text>
            ) : null}
          </View>

          <View style={styles.emailContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Email
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholder="Enter Your Email"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.dark
              }
              keyboardType="email-address"
              value={email}
              onChangeText={handleEmailChange}
            />
            {emailError && emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          <View style={styles.phoneContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Phone Number
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholder="Enter Your Phone Number"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.dark
              }
              keyboardType="number-pad"
              value={phone}
              onChangeText={handlePhoneChange}
            />
            {phoneError && phoneError ? (
              <Text style={styles.errorText}>{phoneError}</Text>
            ) : null}
          </View>

          <View style={styles.addressContainer}>
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

          <View style={styles.passwordContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Password
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={[
                  styles.inputField,
                  {
                    flex: 1,
                    paddingRight: 40,
                    color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                  },
                ]}
                placeholder="Enter Your Password"
                placeholderTextColor={
                  colorScheme === 'dark' ? COLORS.gray : COLORS.dark
                }
                value={password}
                secureTextEntry={hidePassword}
                onChangeText={handlePasswordChange}
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setHidePassword(!hidePassword)}>
                <Feather
                  name={hidePassword ? 'eye-off' : 'eye'}
                  size={25}
                  color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
                />
              </TouchableOpacity>
            </View>

            {password !== '' && (
              <View style={styles.passwordStrengthContainer}>
                <View style={styles.passwordStrengthRow}>
                  <Text
                    style={[
                      styles.passwordStrengthText,
                      {color: passwordStrengthColor},
                    ]}>
                    {passwordStrength}
                  </Text>
                  <View style={styles.paginationContainer}>
                    {[...Array(3)].map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.dot,
                          {
                            backgroundColor:
                              index <= activeIndex
                                ? passwordStrengthColor
                                : COLORS.gray,
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </View>
            )}

            {passwordError && passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>

          <View style={styles.confirmPasswordContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Confirm Password
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={[
                  styles.inputField,
                  {
                    flex: 1,
                    paddingRight: 40,
                    color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                  },
                ]}
                placeholder="Confirm Your Password"
                placeholderTextColor={
                  colorScheme === 'dark' ? COLORS.gray : COLORS.dark
                }
                value={confirmPassword}
                secureTextEntry={hidePassword1}
                onChangeText={handleConfirmPasswordChange}
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setHidePassword1(!hidePassword1)}>
                <Feather
                  name={hidePassword1 ? 'eye-off' : 'eye'}
                  size={25}
                  color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
                />
              </TouchableOpacity>
            </View>
            {confirmPasswordError && confirmPasswordError ? (
              <Text style={styles.errorText}>{confirmPasswordError}</Text>
            ) : null}
          </View>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={[
                styles.signupBtn,
                {
                  backgroundColor: isButtonEnabled
                    ? COLORS.primary
                    : COLORS.gray,
                },
              ]}
              disabled={!isButtonEnabled}
              onPress={handleRegister}>
              <Text style={styles.signupText}>
                {loading ? (
                  <ActivityIndicator color={COLORS.white} size={25} />
                ) : (
                  'Sign up'
                )}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.extraContainer}>
            <Text
              style={{
                fontSize: width * 0.04,
                color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                fontFamily: FONTS.bold,
              }}>
              I have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
              <Text style={styles.extraText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <CustomModal
        visible={showAuthModal}
        title="Working!"
        description="Please Wait While Creating Your Account."
        animationSource={require('../../assets/animations/email.json')}
        onClose={() => setShowAuthModal(false)}
      />

      <CustomModal
        visible={showSuccessModal}
        title="Success!"
        description="Your Account Has Been Created Successfully"
        animationSource={require('../../assets/animations/success.json')}
        onClose={() => setShowSuccessModal(false)}
      />

      <CustomModal
        visible={showErrorModal}
        title="Failure!"
        description="Something Went Wrong"
        animationSource={require('../../assets/animations/error.json')}
        onClose={() => setShowErrorModal(false)}
      />
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
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

  scrollViewContainer: {
    paddingVertical: height * 0.03,
    marginTop: height * 0.005,
  },

  welcomeContainer: {
    marginTop: height * 0.1,
    marginLeft: width * 0.05,
  },

  welcomeTitleText: {
    fontSize: width * 0.09,
    color: COLORS.dark,
    fontFamily: FONTS.bold,
  },

  welcomeDescriptionText: {
    color: COLORS.dark,
    fontSize: width * 0.042,
    fontFamily: FONTS.medium,
    width: width * 0.9,
    lineHeight: height * 0.03,
  },

  formContainer: {
    marginTop: height * 0.02,
    marginHorizontal: width * 0.05,
    gap: 30,
  },

  imgContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: height * 0.02,
  },

  img: {
    width: width * 0.22,
    height: height * 0.12,
    borderRadius: 50,
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

  eyeIconContainer: {
    position: 'absolute',
    right: width * 0.03,
  },

  btnContainer: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
  },

  signupBtn: {
    width: '100%',
    alignItems: 'center',
    padding: height * 0.02,
    top: height * 0.035,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },

  signupText: {
    fontSize: width * 0.045,
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
  },

  extraContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    top: height * 0.065,
    padding: height * 0.05,
    gap: 20,
  },

  extraText: {
    fontSize: width * 0.045,
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },

  errorText: {
    position: 'absolute',
    bottom: -25,
    fontSize: width * 0.04,
    color: COLORS.errorColor,
    fontFamily: FONTS.semiBold,
    paddingHorizontal: 5,
  },

  passwordStrengthContainer: {
    marginTop: 5,
  },

  passwordStrengthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.02,
  },

  passwordStrengthText: {
    fontSize: width * 0.045,
    fontFamily: FONTS.semiBold,
  },

  paginationContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },

  dot: {
    width: width * 0.12,
    height: width * 0.02,
    margin: width * 0.01,
    borderRadius: width * 0.02,
  },
});
