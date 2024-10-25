import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Dimensions,
  useColorScheme,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../../../constants/Constants';
import BikeCard from '../../../utils/BikeCard/BikeCard';
import CustomModal from '../../../utils/Modals/CustomModal';

const {width} = Dimensions.get('window');

const MyBikes = () => {
  const [bikes, setBikes] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();  

  const renderBikeItem = ({item}) => (
    <BikeCard
      bike={item}
      onDelete={bikeId => {
        setBikes(prevBikes => prevBikes.filter(bike => bike._id !== bikeId));
      }}
    />
  );

  return (
    <SafeAreaView
      style={[
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
        },
      ]}>
      <View style={styles.secondaryContainer}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.white} />
          </View>
        ) : (
          <FlatList
            data={bikes}
            renderItem={renderBikeItem}
            keyExtractor={item => item._id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text
                  style={[
                    styles.emptyMessage,
                    {
                      color:
                        colorScheme === 'dark'
                          ? COLORS.white
                          : COLORS.darkColor,
                    },
                  ]}>
                  No Bikes Available!
                </Text>
              </View>
            }
            contentContainerStyle={{flexGrow: 1}}
          />
        )}
      </View>

      <CustomModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        description="Error Fetching User Data. Please Try Again Later."
        animationSource={require('../../../../assets/animations/error.json')}
      />
    </SafeAreaView>
  );
};

export default MyBikes;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  secondaryContainer: {
    flex: 1,
    padding: width * 0.05,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyMessage: {
    fontSize: width * 0.05,
    fontFamily: FONTS.semiBold,
    textAlign: 'center',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
