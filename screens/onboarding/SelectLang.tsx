// SelectLang.tsx
import '../SelectLanguage/i18n';
import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {Divider} from 'react-native-elements';
import GlobalStyles from '../../assets/constants/colors';
import RowWithRadioButton from '../MyProfile/RowWithRadioButton';
import CompleteButton from '../../assets/constants/Components/Buttons/CompleteButton';
import {useDispatch, useSelector} from 'react-redux';
import {setLanguage} from '../SelectLanguage/LanguageActions';
import { initReactI18next, useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { AppState } from '../../ReduxStore';

interface SelectLangProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const SelectLang: React.FC <SelectLangProps> = ({navigation}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const language = useSelector((state: AppState) => state.language);
  const [selectedIndex, setIndex] = useState<number | null>(null);

  const handleLanguageChange = (newLanguage: string, index: number) => {
    setIndex(index);
    i18n.changeLanguage(newLanguage);
    dispatch(setLanguage(newLanguage));
  };

  return (
    <SafeAreaView style={styles.Background}>
      <ScreenTitle title={t('languages')} />
      <View>
        <Text style={{color: 'rgba(255, 255, 255, 0.6)',}}>
          {t('choose_language')}
        </Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>{t('suggested')}</Text>
      </View>
      <View style={{width: '98%'}}>
        <RowWithRadioButton
          title={t('englishUS')}
          isSelected={selectedIndex === 0}
          onSelected={() => handleLanguageChange('en', 0)}
        />
        <RowWithRadioButton
          title={t('spanish')}
          isSelected={selectedIndex === 2}
          onSelected={() => handleLanguageChange('es', 2)}
        />
        <Divider
          width={1}
          color={GlobalStyles.Colors.primary100}
          style={{width: '98%', alignSelf: 'center', marginVertical: 20}}
        />
        <View style={styles.Others}>
          <Text style={styles.title}>{t('others')}</Text>
        </View>
        <RowWithRadioButton
          title={t('mandarin')}
          isSelected={selectedIndex === 3}
          onSelected={() => handleLanguageChange('zh', 3)}
        />
        <RowWithRadioButton
          title={t('hindi')}
          isSelected={selectedIndex === 4}
          onSelected={() => handleLanguageChange('hi', 4)}
        />
        <RowWithRadioButton
          title={t('french')}
          isSelected={selectedIndex === 5}
          onSelected={() => handleLanguageChange('fr', 5)}
        />
        <RowWithRadioButton
          title={t('arabic')}
          isSelected={selectedIndex === 6}
          onSelected={() => handleLanguageChange('ar', 6)}
        />
        <RowWithRadioButton
          title={t('russian')}
          isSelected={selectedIndex === 7}
          onSelected={() => handleLanguageChange('ru', 7)}
        />
        <RowWithRadioButton
          title={t('indonesian')}
          isSelected={selectedIndex === 8}
          onSelected={() => handleLanguageChange('id', 8)}
        />
        <RowWithRadioButton
          title={t('vietnamese')}
          isSelected={selectedIndex === 9}
          onSelected={() => handleLanguageChange('vi', 9)}
        />
      </View>
      <CompleteButton text={t('submit')} onPress={() => {navigation.navigate('OnboardingManager')}} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '98%',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600', // Semibold
    color: 'white',
  },
  Others: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '98%',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default SelectLang