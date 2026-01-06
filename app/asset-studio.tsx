import React from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check, Diamond, User, Mic, Map, Users, Play, Heart, Shield, Gift, Scale, Hourglass, Search, Sun, ClipboardList, Puzzle } from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';
import { PRESET_LOCATIONS, FRIENDS, VOICE_PRESETS } from '@/constants/data';

type TabType = 'places' | 'faces' | 'voices' | 'values';

// Focus values for lessons (matching create.tsx)
const FOCUS_VALUES = [
  { id: 'compassion', name: 'Compassion', icon: Heart, bgColor: '#fff1f2', iconColor: '#f43f5e', desc: 'Understanding feelings' },
  { id: 'bravery', name: 'Bravery', icon: Shield, bgColor: '#fffbeb', iconColor: '#f59e0b', desc: 'Finding courage' },
  { id: 'sharing', name: 'Sharing', icon: Gift, bgColor: '#faf5ff', iconColor: '#a855f7', desc: 'The joy of giving' },
  { id: 'honesty', name: 'Honesty', icon: Scale, bgColor: '#eff6ff', iconColor: '#3b82f6', desc: 'Telling the truth' },
  { id: 'patience', name: 'Patience', icon: Hourglass, bgColor: '#ecfdf5', iconColor: '#10b981', desc: 'Waiting calmly' },
  { id: 'teamwork', name: 'Teamwork', icon: Users, bgColor: '#eef2ff', iconColor: '#6366f1', desc: 'Working together' },
  { id: 'curiosity', name: 'Curiosity', icon: Search, bgColor: '#ecfeff', iconColor: '#06b6d4', desc: 'Discovering new things' },
  { id: 'gratitude', name: 'Gratitude', icon: Sun, bgColor: '#fefce8', iconColor: '#eab308', desc: 'Being thankful' },
  { id: 'responsibility', name: 'Responsibility', icon: ClipboardList, bgColor: '#f8fafc', iconColor: '#64748b', desc: 'Doing your part' },
  { id: 'problem_solving', name: 'Problem Solving', icon: Puzzle, bgColor: '#f0fdfa', iconColor: '#14b8a6', desc: 'Finding solutions' },
];

const getHeaderInfo = (tab: TabType): { title: string; icon: LucideIcon; color: string; bgColor: string } => {
  switch (tab) {
    case 'places':
      return { title: 'Select World', icon: Map, color: '#6366f1', bgColor: '#eef2ff' };
    case 'faces':
      return { title: 'Choose Sidekick', icon: Users, color: '#f97316', bgColor: '#fff7ed' };
    case 'voices':
      return { title: 'Choose Narrator', icon: Mic, color: '#f43f5e', bgColor: '#fff1f2' };
    case 'values':
      return { title: 'Pick a Lesson', icon: Heart, color: '#ec4899', bgColor: '#fdf2f8' };
    default:
      return { title: 'Select Asset', icon: Diamond, color: '#64748b', bgColor: '#f8fafc' };
  }
};

export default function AssetStudioScreen() {
  const params = useLocalSearchParams<{
    tab?: string;
    selectedLocationId?: string;
    selectedCharacterId?: string;
    selectedVoiceId?: string;
    selectedValueId?: string;
  }>();

  const initialTab = (params.tab as TabType) || 'places';
  const selectedLocationId = params.selectedLocationId || null;
  const selectedCharacterId = params.selectedCharacterId || null;
  const selectedVoiceId = params.selectedVoiceId || null;
  const selectedValueId = params.selectedValueId || null;

  const { title, icon: Icon, color, bgColor } = getHeaderInfo(initialTab);

  const handleClose = () => {
    router.back();
  };

  const handleSelectLocation = (id: string) => {
    // Navigate back to create with the selected location
    router.navigate({
      pathname: '/(tabs)/create',
      params: { selectedLocationId: id },
    });
  };

  const handleSelectCharacter = (id: string) => {
    router.navigate({
      pathname: '/(tabs)/create',
      params: { selectedCharacterId: id },
    });
  };

  const handleSelectVoice = (id: string) => {
    router.navigate({
      pathname: '/(tabs)/create',
      params: { selectedVoiceId: id },
    });
  };

  const handleSelectValue = (id: string) => {
    router.navigate({
      pathname: '/(tabs)/create',
      params: { selectedValueId: id },
    });
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backdrop} onPress={handleClose} />

      <SafeAreaView style={styles.sheet} edges={['bottom']}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.headerIcon, { backgroundColor: bgColor }]}>
              <Icon size={20} color={color} strokeWidth={2.5} />
            </View>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <X size={20} color="#94a3b8" />
          </Pressable>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {initialTab === 'places' && (
            <View style={styles.grid}>
              {PRESET_LOCATIONS.map(loc => {
                const isSelected = selectedLocationId === loc.id;
                return (
                  <Pressable
                    key={loc.id}
                    onPress={() => handleSelectLocation(loc.id)}
                    style={styles.locationCard}
                  >
                    <Image source={{ uri: loc.image }} style={styles.locationImage} resizeMode="cover" />
                    <View style={[styles.locationOverlay, isSelected && styles.locationOverlaySelected]} />

                    {isSelected && (
                      <View style={styles.checkContainer}>
                        <View style={styles.checkCircle}>
                          <Check size={24} color="white" strokeWidth={3} />
                        </View>
                      </View>
                    )}

                    <View style={styles.locationInfo}>
                      <Text style={styles.locationName}>{loc.name}</Text>
                      {loc.cost > 0 && !isSelected && (
                        <View style={styles.costBadge}>
                          <Diamond size={12} color="#67e8f9" fill="#67e8f9" />
                          <Text style={styles.costText}>{loc.cost}</Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}

          {initialTab === 'faces' && (
            <View style={styles.characterGrid}>
              {FRIENDS.map(friend => {
                const isSelected = selectedCharacterId === friend.id;
                return (
                  <Pressable
                    key={friend.id}
                    onPress={() => handleSelectCharacter(friend.id)}
                    style={[styles.characterCard, isSelected && styles.characterCardSelected]}
                  >
                    <Text style={styles.emoji}>{friend.icon}</Text>
                    <Text style={[styles.characterName, isSelected && styles.characterNameSelected]}>
                      {friend.name}
                    </Text>
                    <Text style={styles.characterType}>{friend.type}</Text>
                    {isSelected && (
                      <View style={styles.characterCheck}>
                        <Check size={10} color="white" strokeWidth={3} />
                      </View>
                    )}
                    {!isSelected && friend.cost > 0 && (
                      <View style={styles.characterCost}>
                        <Diamond size={10} color="#67e8f9" fill="#67e8f9" />
                        <Text style={styles.characterCostText}>{friend.cost}</Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}

          {initialTab === 'voices' && (
            <View style={styles.voiceList}>
              {VOICE_PRESETS.map(voice => {
                const isSelected = selectedVoiceId === voice.id;
                return (
                  <Pressable
                    key={voice.id}
                    onPress={() => handleSelectVoice(voice.id)}
                    style={[styles.voiceCard, isSelected && styles.voiceCardSelected]}
                  >
                    <View style={styles.voiceIcon}>
                      <Text style={styles.emoji}>{voice.icon}</Text>
                    </View>
                    <View style={styles.voiceInfo}>
                      <Text style={styles.voiceName}>{voice.name}</Text>
                      <Text style={styles.voiceStyle}>{voice.style}</Text>
                    </View>
                    {isSelected ? (
                      <View style={styles.voiceCheckSelected}>
                        <Check size={16} color="white" strokeWidth={3} />
                      </View>
                    ) : (
                      <View style={styles.voicePlayButton}>
                        <Play size={12} color="#94a3b8" fill="#94a3b8" />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}

          {initialTab === 'values' && (
            <View style={styles.valueList}>
              {FOCUS_VALUES.map(value => {
                const isSelected = selectedValueId === value.id;
                const ValueIcon = value.icon;
                return (
                  <Pressable
                    key={value.id}
                    onPress={() => handleSelectValue(value.id)}
                    style={[styles.valueCard, isSelected && styles.valueCardSelected]}
                  >
                    <View style={[styles.valueIcon, { backgroundColor: value.bgColor }]}>
                      <ValueIcon size={20} color={value.iconColor} />
                    </View>
                    <View style={styles.valueInfo}>
                      <Text style={styles.valueName}>{value.name}</Text>
                      <Text style={styles.valueDesc}>{value.desc}</Text>
                    </View>
                    {isSelected && (
                      <View style={[styles.valueCheckSelected, { backgroundColor: value.iconColor }]}>
                        <Check size={16} color="white" strokeWidth={3} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.2)' },
  sheet: {
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    maxHeight: '75%',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  handle: {
    width: 48, height: 6, borderRadius: 3, backgroundColor: '#e2e8f0',
    alignSelf: 'center', marginTop: 12, marginBottom: 4,
  },
  header: {
    paddingHorizontal: 24, paddingBottom: 16, paddingTop: 8,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b', letterSpacing: -0.5 },
  closeButton: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(241,245,249,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  content: { paddingHorizontal: 24 },
  contentContainer: { paddingBottom: 24, paddingTop: 8 },

  // Location Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  locationCard: {
    width: '48%', aspectRatio: 0.8, borderRadius: 24, overflow: 'hidden',
  },
  locationImage: { width: '100%', height: '100%' },
  locationOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  locationOverlaySelected: { backgroundColor: 'rgba(79,70,229,0.4)' },
  checkContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  checkCircle: {
    backgroundColor: '#6366f1', padding: 8, borderRadius: 999,
  },
  locationInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12 },
  locationName: { color: 'white', fontWeight: '700', fontSize: 14, lineHeight: 18 },
  costBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  costText: { fontSize: 10, fontWeight: '700', color: '#67e8f9' },

  // Character Grid
  characterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  characterCard: {
    width: '31%', aspectRatio: 0.75, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#f1f5f9', paddingVertical: 12,
  },
  characterCardSelected: {
    backgroundColor: 'white', borderWidth: 2, borderColor: '#f97316',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8,
  },
  emoji: { fontSize: 30 },
  characterName: { fontWeight: '700', fontSize: 12, color: '#1e293b', marginTop: 8 },
  characterNameSelected: { color: '#1e293b' },
  characterType: { fontSize: 10, fontWeight: '600', color: '#94a3b8', marginTop: 2 },
  characterCheck: {
    position: 'absolute', top: -4, right: -4, backgroundColor: '#f97316',
    padding: 2, borderRadius: 999, borderWidth: 2, borderColor: 'white',
  },
  characterCost: {
    flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 6,
    backgroundColor: 'rgba(103,232,249,0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8,
  },
  characterCostText: { fontSize: 10, fontWeight: '700', color: '#0891b2' },

  // Voice List
  voiceList: { gap: 12, paddingBottom: 24 },
  voiceCard: {
    width: '100%', flexDirection: 'row', alignItems: 'center', gap: 16,
    padding: 12, paddingRight: 16, borderRadius: 24, borderWidth: 1, borderColor: '#f1f5f9',
    backgroundColor: 'white',
  },
  voiceCardSelected: { backgroundColor: '#fff1f2', borderColor: '#fecdd3' },
  voiceIcon: {
    width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'white', borderWidth: 1, borderColor: '#f8fafc',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  voiceInfo: { flex: 1 },
  voiceName: { fontWeight: '700', color: '#1e293b', fontSize: 14 },
  voiceStyle: { fontSize: 12, fontWeight: '700', color: '#94a3b8' },
  voiceCheckSelected: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#f43f5e',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4,
  },
  voicePlayButton: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#f8fafc',
    alignItems: 'center', justifyContent: 'center',
  },

  // Value List
  valueList: { gap: 12, paddingBottom: 24 },
  valueCard: {
    width: '100%', flexDirection: 'row', alignItems: 'center', gap: 16,
    padding: 12, paddingRight: 16, borderRadius: 24, borderWidth: 1, borderColor: '#f1f5f9',
    backgroundColor: 'white',
  },
  valueCardSelected: { backgroundColor: '#fdf2f8', borderColor: '#fbcfe8' },
  valueIcon: {
    width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
  },
  valueInfo: { flex: 1 },
  valueName: { fontWeight: '700', color: '#1e293b', fontSize: 14 },
  valueDesc: { fontSize: 12, fontWeight: '600', color: '#94a3b8' },
  valueCheckSelected: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4,
  },
});
