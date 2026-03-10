import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import GlobalStyles from '../../assets/constants/colors';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import TextInputComponent from '../../assets/constants/Components/TextInputComponent';
import CompleteButton from '../../assets/constants/Components/Buttons/CompleteButton';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FeedStackParamList} from '../../App';
import {useSelector} from 'react-redux';
import {AppState} from '../../ReduxStore';
import axios from 'axios';

type VisibilityFilter = 'All' | 'Public' | 'Friends' | 'Group';
type StatusFilter = 'Open' | 'Funded' | 'Active';
type SortOption = 'Newest' | 'Amount High-Low' | 'Amount Low-High' | 'Score';

type SearchResult = {
  id: string;
  title: string;
  amount: number;
  omnisScore: number;
  status: string;
  visibility: string;
};

export default function PostSearchFilter() {
  const navigation =
    useNavigation<NativeStackNavigationProp<FeedStackParamList>>();
  const token = useSelector((state: AppState) => state.token);

  const [searchText, setSearchText] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [minScore, setMinScore] = useState('');
  const [selectedVisibility, setSelectedVisibility] =
    useState<VisibilityFilter>('All');
  const [selectedStatuses, setSelectedStatuses] = useState<StatusFilter[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('Newest');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const visibilityOptions: VisibilityFilter[] = [
    'All',
    'Public',
    'Friends',
    'Group',
  ];
  const statusOptions: StatusFilter[] = ['Open', 'Funded', 'Active'];
  const sortOptions: SortOption[] = [
    'Newest',
    'Amount High-Low',
    'Amount Low-High',
    'Score',
  ];

  const toggleStatus = (status: StatusFilter) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status],
    );
  };

  const handleReset = () => {
    setSearchText('');
    setMinAmount('');
    setMaxAmount('');
    setMinScore('');
    setSelectedVisibility('All');
    setSelectedStatuses([]);
    setSortBy('Newest');
    setResults([]);
  };

  const handleApplyFilters = () => {
    setLoading(true);

    const params: Record<string, string> = {};
    if (searchText) params.search = searchText;
    if (minAmount) params.minAmount = minAmount;
    if (maxAmount) params.maxAmount = maxAmount;
    if (minScore) params.minScore = minScore;
    if (selectedVisibility !== 'All')
      params.visibility = selectedVisibility;
    if (selectedStatuses.length > 0)
      params.status = selectedStatuses.join(',');
    params.sortBy = sortBy;

    const config = {
      headers: {
        Authorization: `Bearer ${token.token}`,
        Accept: 'application/json',
      },
      params,
    };

    axios
      .get('http://localhost:8080/api/omnis/posts/search', config)
      .then(response => {
        setResults(response.data.posts || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Search error:', error);
        setLoading(false);
      });
  };

  const renderResultItem = ({item}: {item: SearchResult}) => (
    <View style={styles.resultCard}>
      <View style={styles.resultRow}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultAmount}>${item.amount}</Text>
      </View>
      <View style={styles.resultRow}>
        <Text style={styles.resultMeta}>Score: {item.omnisScore}</Text>
        <Text style={styles.resultMeta}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle
        title="Search Loans"
        showBackArrow={true}
        onBackPress={() => {}}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search loans..."
            placeholderTextColor="rgba(255,255,255, 0.6)"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Amount Range</Text>
          <View style={styles.rangeRow}>
            <View style={styles.rangeInput}>
              <TextInput
                style={styles.rangeTextInput}
                placeholder="Min"
                placeholderTextColor="rgba(255,255,255, 0.6)"
                keyboardType="numeric"
                value={minAmount}
                onChangeText={setMinAmount}
              />
            </View>
            <Text style={styles.rangeSeparator}>—</Text>
            <View style={styles.rangeInput}>
              <TextInput
                style={styles.rangeTextInput}
                placeholder="Max"
                placeholderTextColor="rgba(255,255,255, 0.6)"
                keyboardType="numeric"
                value={maxAmount}
                onChangeText={setMaxAmount}
              />
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>OMNIS Score Minimum</Text>
          <View style={styles.scoreInputContainer}>
            <TextInput
              style={styles.rangeTextInput}
              placeholder="Min score"
              placeholderTextColor="rgba(255,255,255, 0.6)"
              keyboardType="numeric"
              value={minScore}
              onChangeText={setMinScore}
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Visibility</Text>
          <View style={styles.toggleRow}>
            {visibilityOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.toggleButton,
                  selectedVisibility === option && styles.toggleButtonActive,
                ]}
                onPress={() => setSelectedVisibility(option)}>
                <Text
                  style={[
                    styles.toggleButtonText,
                    selectedVisibility === option &&
                      styles.toggleButtonTextActive,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.toggleRow}>
            {statusOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.toggleButton,
                  selectedStatuses.includes(option) &&
                    styles.toggleButtonActive,
                ]}
                onPress={() => toggleStatus(option)}>
                <Text
                  style={[
                    styles.toggleButtonText,
                    selectedStatuses.includes(option) &&
                      styles.toggleButtonTextActive,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Sort By</Text>
          <View style={styles.toggleRow}>
            {sortOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.toggleButton,
                  sortBy === option && styles.toggleButtonActive,
                ]}
                onPress={() => setSortBy(option)}>
                <Text
                  style={[
                    styles.toggleButtonText,
                    sortBy === option && styles.toggleButtonTextActive,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyFilters}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <ActivityIndicator
            size="large"
            color={GlobalStyles.Colors.primary200}
            style={styles.loader}
          />
        )}

        {results.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Results</Text>
            {results.map(item => (
              <View key={item.id}>{renderResultItem({item})}</View>
            ))}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchContainer: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 16,
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255, 0.6)',
    borderRadius: 16,
    paddingHorizontal: 16,
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
  },
  sectionContainer: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 8,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rangeInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255, 0.6)',
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  rangeTextInput: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
  },
  rangeSeparator: {
    color: GlobalStyles.Colors.primary100,
    marginHorizontal: 10,
    fontSize: 16,
  },
  scoreInputContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255, 0.6)',
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255, 0.6)',
    backgroundColor: 'transparent',
  },
  toggleButtonActive: {
    backgroundColor: GlobalStyles.Colors.primary200,
    borderColor: GlobalStyles.Colors.primary200,
  },
  toggleButtonText: {
    color: 'rgba(255,255,255, 0.6)',
    fontSize: 14,
  },
  toggleButtonTextActive: {
    color: GlobalStyles.Colors.primary100,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 16,
  },
  resetButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GlobalStyles.Colors.primary200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  resetButtonText: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: '500',
  },
  applyButton: {
    flex: 2,
    height: 50,
    borderRadius: 16,
    backgroundColor: GlobalStyles.Colors.primary200,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  applyButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
  resultsContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 8,
  },
  resultsTitle: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  resultCard: {
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  resultTitle: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '500',
  },
  resultAmount: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultMeta: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 13,
  },
  bottomSpacer: {
    height: 20,
  },
});
