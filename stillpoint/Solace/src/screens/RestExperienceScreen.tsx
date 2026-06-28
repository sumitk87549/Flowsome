import React from 'react';
import { View, Text, StyleSheet, BackHandler, Pressable } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FONT, FS } from '@/constants/typography';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/design/theme';
import { useAmbientSound } from '@/hooks/useAmbientSound';
import { usePanelQueue } from '@/hooks/usePanelQueue';
import { PanelText } from '@/components/rest/PanelText';
import EyesAwayMode from '@/rest-modes/EyesAwayMode';
import { ListenMode } from '@/rest-modes/ListenMode';
import { BreatheAndDriftMode } from '@/rest-modes/BreatheAndDriftMode';
import { QuickSettleMode } from '@/rest-modes/QuickSettleMode';
import MoveAndSeeMode from '@/rest-modes/MoveAndSeeMode';
import SenseAndGroundMode from '@/rest-modes/SenseAndGroundMode';
import StoryMomentMode from '@/rest-modes/StoryMomentMode';
import MemoryMode from '@/rest-modes/MemoryMode';
import WalkMode from '@/rest-modes/WalkMode';
import type { RootStackParamList } from '@/types/navigation';
import type { RestMode, Panel } from '@/types/session';
import { useSession } from '@/context/SessionContext';
import { ConfirmSheet } from '@/components/shared/ConfirmSheet';
import { PeacefulBackground } from '@/components/shared/PeacefulBackground';

type RestExperienceRouteProp = RouteProp<RootStackParamList, 'RestExperience'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function RestExperienceScreen() {
  const route = useRoute<RestExperienceRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { settings } = useSettings();
  const ambient = useAmbientSound();
  const theme = useTheme();
  const { currentCycleNumber, totalCycles } = useSession();

  const [showSkipConfirm, setShowSkipConfirm] = React.useState(false);

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setShowSkipConfirm(true);
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const { mode, duration } = route.params;

  const handleSessionComplete = React.useCallback(() => {
    // Fade out ambient sound and navigate
    ambient.stopAmbient(2000, () => {
      if (settings.settleNoticeEnabled) {
        navigation.navigate('SettleNotice', {
          sessionNumber: currentCycleNumber,
          totalSessions: totalCycles,
        });
      } else if (settings.autoStartWork) {
        navigation.navigate('WorkSession', { intentionWord: undefined });
      } else {
        navigation.navigate('ReturnPrompt', {
          sessionNumber: currentCycleNumber,
          totalSessions: totalCycles,
        });
      }
    });
  }, [navigation, ambient, settings, currentCycleNumber, totalCycles]);

  const handleSkipConfirm = () => {
    setShowSkipConfirm(false);
    handleSessionComplete();
  };
  // Route to the correct rest mode component based on mode param
  // Sprint 8 replaces the stub content inside each case with real mode components
  const renderMode = () => {
    switch (mode) {
      case 'eyesAway':
        return <EyesAwayMode duration={duration} onSessionComplete={handleSessionComplete} />;
      case 'quietListening':
      case 'listen':
        return <ListenMode duration={duration} onSessionComplete={handleSessionComplete} />;
      case 'move':
      case 'moveAndSee':
        return <MoveAndSeeMode duration={duration} onSessionComplete={handleSessionComplete} />;
      case 'senseAndGround':
        return <SenseAndGroundMode duration={duration} onSessionComplete={handleSessionComplete} />;
      case 'storyGarden':
      case 'storyMoment':
        return <StoryMomentMode duration={duration} onSessionComplete={handleSessionComplete} />;
      default:
        return <RestModeStub modeName="Rest" duration={duration} onComplete={handleSessionComplete} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <PeacefulBackground />
      </View>
      
      {renderMode()}
      
      <Pressable 
        style={styles.skipButton} 
        onPress={() => setShowSkipConfirm(true)}
        hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <Text style={[styles.skipButtonText, { color: theme.colors.textMuted }]}>✕</Text>
      </Pressable>
      <ConfirmSheet
        visible={showSkipConfirm}
        title="Skip this rest?"
        confirmLabel="Skip Rest"
        cancelLabel="Stay"
        onConfirm={handleSkipConfirm}
        onCancel={() => setShowSkipConfirm(false)}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPORARY STUB — Sprint 8 replaces the rendering logic for each mode.
// This stub shows the mode name and a timer, allows manual navigation forward.
// ─────────────────────────────────────────────────────────────────────────────

interface RestModeStubProps {
  modeName: string;
  duration: number;    // minutes
  onComplete: () => void;
}

// Test script for DoD verification
const TEST_PANELS: Panel[] = [
  { type: 1, text: 'Take a breath.', holdMs: 2000, hapticOnEntry: 'light' },
  { type: 2, text: 'You have arrived.', holdMs: 3000 },
  { type: 3, text: 'Rest here.', holdMs: 2500 },
];

function RestModeStub({ modeName, duration, onComplete }: RestModeStubProps) {
  const { currentPanel, currentIndex, advanceToNext } = usePanelQueue(TEST_PANELS);

  // Auto-complete after the configured duration (for testing purposes)
  React.useEffect(() => {
    const timer = setTimeout(onComplete, duration * 60 * 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={stubStyles.container}>
      <Text style={stubStyles.modeText}>{modeName}</Text>
      <Text style={stubStyles.subText}>{duration} min · tap below when done</Text>
      
      {currentPanel && !currentPanel.isEmpty && (
        <PanelText
          key={currentIndex}
          panel={currentPanel}
          onExit={advanceToNext}
        />
      )}

      <Text style={stubStyles.tapText} onPress={onComplete}>
        End Rest (test)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 10,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    fontSize: 24,
    opacity: 0.8,
  },
});

const stubStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeText: {
    fontFamily: FONT.thin,
    fontSize: 32,
    color: '#EEE6D8',
    marginBottom: 12,
  },
  subText: {
    fontFamily: FONT.light,
    fontSize: 14,
    color: '#EEE6D8',
    opacity: 0.55,
    marginBottom: 40,
  },
  tapText: {
    fontFamily: FONT.light,
    fontSize: 14,
    color: '#EEE6D8',
    opacity: 0.4,
    textDecorationLine: 'underline',
    position: 'absolute',
    bottom: 50,
  },
});
