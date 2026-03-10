import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import GlobalStyles from '../../assets/constants/colors';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import CompleteButton from '../../assets/constants/Components/Buttons/CompleteButton';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp, NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../App';
import {useSelector} from 'react-redux';
import {AppState} from '../../ReduxStore';
import axios from 'axios';

type LoanLifecycleProps = NativeStackScreenProps<HomeStackParamList, 'LoanLifecycle'>;

type LifecycleState =
  | 'Draft'
  | 'Open'
  | 'Partially Funded'
  | 'Funded'
  | 'Active'
  | 'Repaid'
  | 'Late'
  | 'Defaulted'
  | 'Canceled'
  | 'Disputed';

type LoanStatusData = {
  currentState: LifecycleState;
  createdDate: string;
  fundedDate: string | null;
  firstPaymentDate: string | null;
  nextPaymentDate: string | null;
  completionDate: string | null;
  states: LifecycleState[];
};

const happyPath: LifecycleState[] = [
  'Draft',
  'Open',
  'Partially Funded',
  'Funded',
  'Active',
  'Repaid',
];

const branchStates: LifecycleState[] = [
  'Late',
  'Defaulted',
  'Canceled',
  'Disputed',
];

const getStateColor = (
  state: LifecycleState,
  currentState: LifecycleState,
  passedStates: LifecycleState[],
): string => {
  if (state === currentState) return GlobalStyles.Colors.primary200;
  if (branchStates.includes(state)) {
    if (state === currentState) return GlobalStyles.Colors.primary300;
    return GlobalStyles.Colors.primary600;
  }
  if (passedStates.includes(state)) return GlobalStyles.Colors.primary400;
  return GlobalStyles.Colors.primary600;
};

const LoanLifecycle: React.FC<LoanLifecycleProps> = ({route}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const token = useSelector((state: AppState) => state.token);
  const {loanId} = route.params;

  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState<LoanStatusData | null>(null);

  useEffect(() => {
    fetchLoanStatus();
  }, []);

  const fetchLoanStatus = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token.token}`,
        Accept: 'application/json',
      },
    };

    axios
      .get(
        `http://localhost:8080/api/omnis/loan/${loanId}/status`,
        config,
      )
      .then(response => {
        setStatusData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Loan status error:', error);
        setLoading(false);
      });
  };

  const getPassedStates = (): LifecycleState[] => {
    if (!statusData) return [];
    const currentIndex = happyPath.indexOf(statusData.currentState);
    if (currentIndex === -1) return statusData.states || [];
    return happyPath.slice(0, currentIndex);
  };

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '—';
    return dateStr;
  };

  const renderTimelineStep = (
    state: LifecycleState,
    index: number,
    isBranch: boolean,
  ) => {
    if (!statusData) return null;
    const passedStates = getPassedStates();
    const isCurrent = state === statusData.currentState;
    const color = getStateColor(state, statusData.currentState, passedStates);
    const isPassed = passedStates.includes(state);

    return (
      <View
        key={`${state}-${index}`}
        style={[styles.timelineStep, isBranch && styles.branchStep]}>
        <View style={styles.timelineIndicator}>
          <View
            style={[
              styles.dot,
              {backgroundColor: color},
              isCurrent && styles.dotCurrent,
            ]}
          />
          {index < happyPath.length - 1 && !isBranch && (
            <View
              style={[
                styles.line,
                {
                  backgroundColor: isPassed
                    ? GlobalStyles.Colors.primary400
                    : GlobalStyles.Colors.primary600,
                },
              ]}
            />
          )}
        </View>
        <View style={styles.stepContent}>
          <Text
            style={[
              styles.stepLabel,
              isCurrent && styles.stepLabelCurrent,
              isBranch && styles.stepLabelBranch,
            ]}>
            {state}
          </Text>
          {isCurrent && (
            <Text style={styles.stepCurrentBadge}>Current</Text>
          )}
        </View>
      </View>
    );
  };

  const renderActionButton = () => {
    if (!statusData) return null;

    switch (statusData.currentState) {
      case 'Active':
        return (
          <CompleteButton
            text="Make Payment"
            color={GlobalStyles.Colors.primary200}
            onPress={() => navigation.navigate('ActiveOfferMakePayment')}
          />
        );
      case 'Draft':
        return (
          <CompleteButton
            text="Cancel Loan"
            color={GlobalStyles.Colors.primary300}
            onPress={() => {
              console.log('Cancel loan:', loanId);
            }}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle
          title="Loan Status"
          showBackArrow={true}
          onBackPress={() => {}}
        />
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="large"
            color={GlobalStyles.Colors.primary200}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle
        title="Loan Status"
        showBackArrow={true}
        onBackPress={() => {}}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.timelineContainer}>
          <Text style={styles.timelineTitle}>Lifecycle</Text>
          {happyPath.map((state, index) =>
            renderTimelineStep(state, index, false),
          )}
          <View style={styles.branchContainer}>
            <Text style={styles.branchTitle}>Other States</Text>
            {branchStates.map((state, index) =>
              renderTimelineStep(state, index, true),
            )}
          </View>
        </View>

        <View style={styles.datesContainer}>
          <Text style={styles.datesTitle}>Key Dates</Text>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Created</Text>
            <Text style={styles.dateValue}>
              {formatDate(statusData?.createdDate ?? null)}
            </Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Funded</Text>
            <Text style={styles.dateValue}>
              {formatDate(statusData?.fundedDate ?? null)}
            </Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>First Payment</Text>
            <Text style={styles.dateValue}>
              {formatDate(statusData?.firstPaymentDate ?? null)}
            </Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Next Payment</Text>
            <Text style={styles.dateValue}>
              {formatDate(statusData?.nextPaymentDate ?? null)}
            </Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Completion</Text>
            <Text style={styles.dateValue}>
              {formatDate(statusData?.completionDate ?? null)}
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      {renderActionButton()}
    </SafeAreaView>
  );
};

export default LoanLifecycle;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 16,
  },
  timelineTitle: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  branchStep: {
    marginLeft: 20,
  },
  timelineIndicator: {
    alignItems: 'center',
    width: 24,
    marginRight: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotCurrent: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: GlobalStyles.Colors.primary100,
  },
  line: {
    width: 2,
    height: 24,
    marginTop: 2,
  },
  stepContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
  },
  stepLabel: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 15,
  },
  stepLabelCurrent: {
    color: GlobalStyles.Colors.primary200,
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepLabelBranch: {
    fontStyle: 'italic',
  },
  stepCurrentBadge: {
    marginLeft: 8,
    backgroundColor: GlobalStyles.Colors.primary200,
    color: GlobalStyles.Colors.primary100,
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  branchContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: GlobalStyles.Colors.accent200,
  },
  branchTitle: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
    marginBottom: 10,
  },
  datesContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 24,
    backgroundColor: GlobalStyles.Colors.primary700,
    borderRadius: 16,
    padding: 16,
  },
  datesTitle: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateLabel: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
  },
  dateValue: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 20,
  },
});
