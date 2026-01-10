import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet, Vibration } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  X,
  Map,
  Users,
  Mic,
  Plus,
  Upload,
  CloudLightning,
  Heart,
  Check,
  Diamond,
  LucideIcon,
  Play
} from 'lucide-react-native';
import { PRESET_LOCATIONS, FRIENDS, VOICE_PRESETS, CORE_VALUES } from '@/constants/data';

type TabType = 'faces' | 'places' | 'voices' | 'values';

interface TabConfig {
  id: TabType;
  label: string;
  title: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const TABS: TabConfig[] = [
  { id: 'faces', label: 'Characters', title: 'Choose Sidekick', icon: Users, color: '#f97316', bgColor: '#fff7ed' },
  { id: 'places', label: 'Places', title: 'Select World', icon: Map, color: '#6366f1', bgColor: '#eef2ff' },
  { id: 'voices', label: 'Voices', title: 'Choose Narrator', icon: Mic, color: '#f43f5e', bgColor: '#fff1f2' },
  { id: 'values', label: 'Values', title: 'Pick a Lesson', icon: Heart, color: '#ec4899', bgColor: '#fdf2f8' },
];

export default function ManageAssetsScreen() {
  const params = useLocalSearchParams<{
    tab?: string;
    mode?: string;
    selectedLocationId?: string;
    selectedCharacterId?: string;
    selectedVoiceId?: string;
    selectedValueId?: string;
  }>();

  const [activeTab, setActiveTab] = useState<TabType>('faces');
  
  const isPickerMode = params.mode === 'picker' && params.tab;
  const activeTabConfig = TABS.find(t => t.id === activeTab);

  useEffect(() => {
    if (params.tab && TABS.some(t => t.id === params.tab)) {
      setActiveTab(params.tab as TabType);
    }
  }, [params.tab]);

  const handleClose = () => {
    router.back();
  };
  
  const handleTabChange = (tabId: TabType) => {
    if (isPickerMode) return;
    Vibration.vibrate(5);
    setActiveTab(tabId);
  };

  const handleSelectLocation = (id: string) => {
    Vibration.vibrate(5);
    router.navigate({
      pathname: '/(tabs)/create',
      params: { selectedLocationId: id },
    });
  };

  const handleSelectCharacter = (id: string) => {
    Vibration.vibrate(5);
    router.navigate({
      pathname: '/(tabs)/create',
      params: { selectedCharacterId: id },
    });
  };

  const handleSelectVoice = (id: string) => {
    Vibration.vibrate(5);
    router.navigate({
      pathname: '/(tabs)/create',
      params: { selectedVoiceId: id },
    });
  };

  const handleSelectValue = (id: string) => {
    Vibration.vibrate(5);
    router.navigate({
      pathname: '/(tabs)/create',
      params: { selectedValueId: id },
    });
  };
  
  const handleLongPress = () => {
    Vibration.vibrate(20);
  };

  const renderHeader = () => {
    if (isPickerMode && activeTabConfig) {
      const TabIcon = activeTabConfig.icon;
      return (
        <View style={styles.pickerHeader}>
          <View style={styles.pickerHeaderLeft}>
            <View style={[styles.pickerHeaderIcon, { backgroundColor: activeTabConfig.bgColor }]}>
              <TabIcon size={20} color={activeTabConfig.color} strokeWidth={2.5} />
            </View>
            <Text style={styles.pickerHeaderTitle}>{activeTabConfig.title}</Text>
          </View>
          <Pressable onPress={handleClose} style={styles.pickerCloseButton}>
            <X size={20} color="#94a3b8" />
          </Pressable>
        </View>
      );
    }
    
    return (
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Assets</Text>
          <Text style={styles.subtitle}>Select or create story elements</Text>
        </View>
        <Pressable onPress={handleClose} style={styles.closeButton}>
          <X size={20} color="#64748b" />
        </Pressable>
      </View>
    );
  };

  const renderCharactersContent = () => (
    <View style={styles.section}>
      <Pressable 
        style={styles.uploadButton}
        onPress={() => Vibration.vibrate(10)}
        onLongPress={handleLongPress}
      >
        <View style={[styles.uploadIcon, { backgroundColor: '#ffedd5' }]}>
          <Plus size={24} color="#f97316" />
        </View>
        <View style={styles.uploadTextContainer}>
          <Text style={styles.uploadTitle}>Create New Character</Text>
          <Text style={styles.uploadSubtitle}>Upload photo or design avatar</Text>
        </View>
      </Pressable>

      <View style={styles.listContainer}>
        {FRIENDS.map(friend => {
          const isSelected = params.selectedCharacterId === friend.id;
          return (
            <Pressable
              key={friend.id}
              onPress={() => handleSelectCharacter(friend.id)}
              onLongPress={handleLongPress}
              style={[
                styles.listItem,
                isSelected && { borderColor: '#f97316', backgroundColor: '#fff7ed' }
              ]}
            >
              <View style={[styles.listItemIcon, { backgroundColor: friend.color }]}>
                <Text style={styles.emoji}>{friend.icon}</Text>
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>{friend.name}</Text>
                <Text style={styles.listItemSubtitle}>{friend.type}</Text>
              </View>
              <View style={styles.listItemActions}>
                {isSelected ? (
                  <View style={[styles.checkCircle, { backgroundColor: '#f97316' }]}>
                    <Check size={16} color="white" />
                  </View>
                ) : (
                  <>
                    {friend.cost > 0 && (
                      <View style={styles.costBadge}>
                        <Diamond size={12} color="#0891b2" fill="#0891b2" />
                        <Text style={styles.costText}>{friend.cost}</Text>
                      </View>
                    )}
                  </>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const renderPlacesContent = () => (
    <View style={styles.section}>
      <Pressable 
        style={styles.uploadButtonRow}
        onPress={() => Vibration.vibrate(10)}
        onLongPress={handleLongPress}
      >
        <View style={[styles.uploadIconSmall, { backgroundColor: '#e0e7ff' }]}>
          <Upload size={20} color="#6366f1" />
        </View>
        <View style={styles.flex1}>
          <Text style={styles.uploadTitle}>Upload Location Photo</Text>
          <Text style={styles.uploadSubtitle}>Use real places from your life</Text>
        </View>
      </Pressable>

      <View style={styles.grid}>
        {PRESET_LOCATIONS.map(loc => {
          const isSelected = params.selectedLocationId === loc.id;
          return (
            <Pressable
              key={loc.id}
              onPress={() => handleSelectLocation(loc.id)}
              onLongPress={handleLongPress}
              style={[
                styles.gridItem,
                isSelected && { borderColor: '#6366f1', borderWidth: 2 }
              ]}
            >
              <View style={styles.gridImageContainer}>
                <Image
                  source={loc.image}
                  style={styles.gridImage}
                  resizeMode="cover"
                />
                {isSelected && (
                  <View style={styles.gridImageOverlaySelected}>
                    <View style={[styles.checkCircle, { backgroundColor: '#6366f1' }]}>
                      <Check size={16} color="white" />
                    </View>
                  </View>
                )}
              </View>
              <View style={styles.gridItemContent}>
                <Text style={styles.gridItemTitle} numberOfLines={1}>{loc.name}</Text>
                <View style={styles.gridItemFooter}>
                  {loc.cost > 0 && !isSelected ? (
                    <View style={styles.costBadge}>
                      <Diamond size={10} color="#0891b2" fill="#0891b2" />
                      <Text style={styles.costText}>{loc.cost}</Text>
                    </View>
                  ) : (
                    <Text style={styles.gridItemLabel}>Preset</Text>
                  )}
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const renderVoicesContent = () => (
    <View style={styles.section}>
      <View style={styles.voiceCloneCard}>
        <View style={styles.voiceCloneHeader}>
          <View style={styles.flex1}>
            <Text style={styles.voiceCloneTitle}>Clone a Voice</Text>
            <Text style={styles.voiceCloneSubtitle}>
              Create a custom narrator using your own voice.
            </Text>
          </View>
          <View style={styles.voiceCloneIcon}>
            <CloudLightning size={24} color="white" />
          </View>
        </View>
        <Pressable 
          style={styles.voiceCloneButton}
          onPress={() => Vibration.vibrate(10)}
        >
          <Mic size={16} color="#f43f5e" />
          <Text style={styles.voiceCloneButtonText}>Start Recording</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionLabel}>Available Voices</Text>

      <View style={styles.voiceList}>
        {VOICE_PRESETS.map(voice => {
          const isSelected = params.selectedVoiceId === voice.id;
          return (
            <Pressable
              key={voice.id}
              onPress={() => handleSelectVoice(voice.id)}
              onLongPress={handleLongPress}
              style={[
                styles.voiceItem,
                isSelected && { borderColor: '#f43f5e', backgroundColor: '#fff1f2' }
              ]}
            >
              <View style={styles.voiceItemIcon}>
                <Text style={styles.emoji}>{voice.icon}</Text>
              </View>
              <View style={styles.flex1}>
                <Text style={styles.voiceItemTitle}>{voice.name}</Text>
                <Text style={styles.voiceItemSubtitle}>{voice.style}</Text>
              </View>
              {isSelected ? (
                <View style={[styles.checkCircle, { backgroundColor: '#f43f5e' }]}>
                  <Check size={16} color="white" />
                </View>
              ) : voice.cost > 0 ? (
                <View style={styles.costBadge}>
                  <Diamond size={12} color="#0891b2" fill="#0891b2" />
                  <Text style={styles.costText}>{voice.cost}</Text>
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
    </View>
  );

  const renderValuesContent = () => (
    <View style={styles.section}>
      <View style={styles.valueList}>
        {CORE_VALUES.map(value => {
          const isSelected = params.selectedValueId === value.id;
          const ValueIcon = value.icon;
          return (
            <Pressable
              key={value.id}
              onPress={() => handleSelectValue(value.id)}
              onLongPress={handleLongPress}
              style={[
                styles.skillCard,
                isSelected && styles.skillCardSelected,
                isSelected && { borderColor: value.color }
              ]}
            >
              <View style={[styles.skillIconBadge, { backgroundColor: value.bgColor }]}>
                <ValueIcon size={24} color={value.textColor} />
              </View>
              <View style={styles.skillContent}>
                <Text style={styles.skillName} numberOfLines={1}>{value.name}</Text>
                <Text style={styles.skillDescription} numberOfLines={1}>{value.description}</Text>
              </View>
              {isSelected ? (
                <View style={[styles.skillCheckCircle, { backgroundColor: value.color }]}>
                  <Check size={14} color="white" strokeWidth={3} />
                </View>
              ) : (
                <View style={styles.skillSelectCircle} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flex1}>
        {renderHeader()}

        {!isPickerMode && (
          <View style={styles.tabsContainer}>
            <View style={styles.tabsRow}>
              {TABS.map(tab => {
                const isActive = activeTab === tab.id;
                const TabIcon = tab.icon;
                return (
                  <Pressable
                    key={tab.id}
                    onPress={() => handleTabChange(tab.id)}
                    style={[
                      styles.tab,
                      isActive && { backgroundColor: tab.bgColor }
                    ]}
                  >
                    <TabIcon
                      size={20}
                      color={isActive ? tab.color : '#94a3b8'}
                      strokeWidth={2.5}
                    />
                    <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        <ScrollView style={styles.flex1} contentContainerStyle={styles.scrollContent}>
          {activeTab === 'faces' && renderCharactersContent()}
          {activeTab === 'places' && renderPlacesContent()}
          {activeTab === 'voices' && renderVoicesContent()}
          {activeTab === 'values' && renderValuesContent()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFBF7' },
  flex1: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 24, fontWeight: '800', color: '#1e293b', letterSpacing: -0.5 },
  subtitle: { fontSize: 12, fontWeight: '700', color: '#94a3b8' },
  closeButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9',
    alignItems: 'center', justifyContent: 'center',
  },
  pickerHeader: {
    paddingHorizontal: 24, 
    paddingBottom: 16, 
    paddingTop: 24,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  pickerHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pickerHeaderIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  pickerHeaderTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b', letterSpacing: -0.5 },
  pickerCloseButton: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(241,245,249,0.8)',
    alignItems: 'center', justifyContent: 'center',
  },
  tabsContainer: { paddingHorizontal: 24, paddingVertical: 16 },
  tabsRow: {
    flexDirection: 'row', backgroundColor: 'white', padding: 6, borderRadius: 16,
    borderWidth: 1, borderColor: '#f1f5f9',
  },
  tab: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 12, borderRadius: 12,
  },
  tabLabel: { fontSize: 12, fontWeight: '700', color: '#94a3b8' },
  tabLabelActive: { color: '#334155' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 16 },
  section: { gap: 24 },
  uploadButton: {
    width: '100%', height: 128, borderRadius: 24, borderWidth: 2, borderStyle: 'dashed',
    borderColor: '#cbd5e1', backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  uploadButtonRow: {
    width: '100%', height: 96, borderRadius: 24, borderWidth: 2, borderStyle: 'dashed',
    borderColor: '#cbd5e1', backgroundColor: '#f8fafc', flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 24,
  },
  uploadIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  uploadIconSmall: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  uploadTextContainer: { alignItems: 'center' },
  uploadTitle: { fontWeight: '700', color: '#334155' },
  uploadSubtitle: { fontSize: 12, fontWeight: '700', color: '#94a3b8' },
  listContainer: { gap: 16 },
  listItem: {
    backgroundColor: 'white', padding: 16, borderRadius: 24, borderWidth: 1, borderColor: '#f1f5f9',
    flexDirection: 'row', alignItems: 'center', gap: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  listItemIcon: { width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 30 },
  listItemContent: { flex: 1 },
  listItemTitle: { fontWeight: '700', color: '#1e293b', fontSize: 18 },
  listItemSubtitle: { fontSize: 12, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 },
  listItemActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  checkCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  costBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ecfeff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  costText: { fontSize: 12, fontWeight: '700', color: '#0891b2' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  gridItem: {
    width: '47%', backgroundColor: 'white', padding: 12, borderRadius: 24, borderWidth: 1, borderColor: '#f1f5f9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  gridImageContainer: { aspectRatio: 1, borderRadius: 16, overflow: 'hidden', marginBottom: 12, position: 'relative' },
  gridImage: { width: '100%', height: '100%' },
  gridImageOverlaySelected: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(99, 102, 241, 0.2)', alignItems: 'center', justifyContent: 'center' },
  gridItemContent: { paddingHorizontal: 4 },
  gridItemTitle: { fontWeight: '700', color: '#1e293b', fontSize: 14 },
  gridItemFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  gridItemLabel: { fontSize: 10, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' },
  voiceCloneCard: { backgroundColor: '#f43f5e', padding: 24, borderRadius: 24 },
  voiceCloneHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 },
  voiceCloneTitle: { fontWeight: '700', fontSize: 20, color: 'white' },
  voiceCloneSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500' },
  voiceCloneIcon: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12 },
  voiceCloneButton: {
    backgroundColor: 'white', paddingVertical: 12, borderRadius: 12, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center', gap: 8,
  },
  voiceCloneButtonText: { color: '#f43f5e', fontWeight: '700', fontSize: 14 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, paddingLeft: 8, marginBottom: 12 },
  voiceList: { gap: 12 },
  voiceItem: {
    backgroundColor: 'white', padding: 16, borderRadius: 24, borderWidth: 1, borderColor: '#f1f5f9',
    flexDirection: 'row', alignItems: 'center', gap: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  voiceItemIcon: {
    width: 48, height: 48, borderRadius: 16, backgroundColor: 'white',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#f8fafc',
  },
  voiceItemTitle: { fontWeight: '700', color: '#1e293b' },
  voiceItemSubtitle: { fontSize: 12, fontWeight: '700', color: '#94a3b8' },
  voicePlayButton: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#f8fafc',
    alignItems: 'center', justifyContent: 'center',
  },
  valueList: { gap: 16, paddingBottom: 24 },
  skillCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  skillCardSelected: {
    backgroundColor: 'white',
    borderWidth: 2,
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  skillIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillContent: {
    flex: 1,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  skillDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94a3b8',
  },
  skillCheckCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  skillSelectCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
});
