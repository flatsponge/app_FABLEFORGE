import React from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check, Diamond, User, Mic, Map, Users, Play } from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';
import { PRESET_LOCATIONS, FRIENDS, VOICE_PRESETS } from '@/constants/data';

type TabType = 'places' | 'faces' | 'voices';

const getHeaderInfo = (tab: TabType): { title: string; icon: LucideIcon; color: string; bgColor: string } => {
  switch (tab) {
    case 'places':
      return { title: 'Select Scene', icon: Map, color: '#6366f1', bgColor: '#eef2ff' };
    case 'faces':
      return { title: 'Cast Characters', icon: Users, color: '#f97316', bgColor: '#fff7ed' };
    case 'voices':
      return { title: 'Choose Narrator', icon: Mic, color: '#f43f5e', bgColor: '#fff1f2' };
    default:
      return { title: 'Select Asset', icon: Diamond, color: '#64748b', bgColor: '#f8fafc' };
  }
};

export default function AssetStudioScreen() {
  const params = useLocalSearchParams<{
    tab?: string;
    selectedLocationId?: string;
    selectedCharacterIds?: string;
    selectedVoiceId?: string;
  }>();

  const initialTab = (params.tab as TabType) || 'places';
  const selectedLocationId = params.selectedLocationId || null;
  const selectedCharacterIds = params.selectedCharacterIds?.split(',').filter(Boolean) || [];
  const selectedVoiceId = params.selectedVoiceId || '';

  const { title, icon: Icon, color, bgColor } = getHeaderInfo(initialTab);

  const handleClose = () => {
    router.back();
  };

  const handleSelectLocation = (id: string) => {
    router.back();
  };

  const handleToggleCharacter = (id: string) => {
    router.back();
  };

  const handleSelectVoice = (id: string) => {
    router.back();
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
              <Pressable
                onPress={() => handleToggleCharacter('me')}
                style={[
                  styles.characterCard,
                  selectedCharacterIds.includes('me') && styles.characterCardSelected
                ]}
              >
                <View style={styles.characterIcon}>
                  <User size={24} color={selectedCharacterIds.includes('me') ? '#f97316' : '#94a3b8'} />
                </View>
                <Text style={[
                  styles.characterName,
                  selectedCharacterIds.includes('me') && styles.characterNameSelected
                ]}>Me</Text>
              </Pressable>

              {FRIENDS.map(friend => {
                const isSelected = selectedCharacterIds.includes(friend.id);
                return (
                  <Pressable
                    key={friend.id}
                    onPress={() => handleToggleCharacter(friend.id)}
                    style={[styles.characterCard, isSelected && styles.characterCardSelected]}
                  >
                    <Text style={styles.emoji}>{friend.icon}</Text>
                    <Text style={[styles.characterName, isSelected && styles.characterNameSelected]}>
                      {friend.name}
                    </Text>
                    {isSelected && (
                      <View style={styles.characterCheck}>
                        <Check size={10} color="white" strokeWidth={3} />
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
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.2)' },
  sheet: {
    backgroundColor: 'rgba(255,255,255,0.95)',
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
  characterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  characterCard: {
    width: '31%', aspectRatio: 0.75, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#f1f5f9',
  },
  characterCardSelected: {
    backgroundColor: 'white', borderWidth: 2, borderColor: '#f97316',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8,
  },
  characterIcon: {
    width: 48, height: 48, backgroundColor: 'white', borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  emoji: { fontSize: 30 },
  characterName: { fontWeight: '700', fontSize: 12, color: '#64748b' },
  characterNameSelected: { color: '#1e293b' },
  characterCheck: {
    position: 'absolute', top: -4, right: -4, backgroundColor: '#f97316',
    padding: 2, borderRadius: 999, borderWidth: 2, borderColor: 'white',
  },
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
});
