import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  X,
  Map,
  Users,
  Mic,
  Plus,
  Upload,
  Trash2,
  Pencil,
  MoreVertical,
  CloudLightning,
  Sparkles,
} from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';
import { PRESET_LOCATIONS, FRIENDS, VOICE_PRESETS } from '@/constants/data';

type TabType = 'faces' | 'places' | 'voices';

interface TabConfig {
  id: TabType;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const tabs: TabConfig[] = [
  { id: 'faces', label: 'Characters', icon: Users, color: '#f97316', bgColor: '#fff7ed' },
  { id: 'places', label: 'Places', icon: Map, color: '#6366f1', bgColor: '#eef2ff' },
  { id: 'voices', label: 'Voices', icon: Mic, color: '#f43f5e', bgColor: '#fff1f2' },
];

export default function ManageAssetsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('faces');

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.flex1}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Parent Zone</Text>
              </View>
            </View>
            <Text style={styles.title}>My Assets</Text>
            <Text style={styles.subtitle}>Manage your custom story elements</Text>
          </View>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <X size={20} color="#64748b" />
          </Pressable>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsRow}>
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              const TabIcon = tab.icon;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
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

        {/* Content Area */}
        <ScrollView style={styles.flex1} contentContainerStyle={styles.scrollContent}>
          {/* CHARACTERS TAB */}
          {activeTab === 'faces' && (
            <View style={styles.section}>
              <Pressable style={styles.uploadButton}>
                <View style={[styles.uploadIcon, { backgroundColor: '#ffedd5' }]}>
                  <Plus size={24} color="#f97316" />
                </View>
                <View style={styles.uploadTextContainer}>
                  <Text style={styles.uploadTitle}>Create New Character</Text>
                  <Text style={styles.uploadSubtitle}>Upload photo or design avatar</Text>
                </View>
              </Pressable>

              <View style={styles.listContainer}>
                {FRIENDS.map(friend => (
                  <View key={friend.id} style={styles.listItem}>
                    <View style={[styles.listItemIcon, { backgroundColor: '#fef3c7' }]}>
                      <Text style={styles.emoji}>{friend.icon}</Text>
                    </View>
                    <View style={styles.listItemContent}>
                      <Text style={styles.listItemTitle}>{friend.name}</Text>
                      <Text style={styles.listItemSubtitle}>{friend.type}</Text>
                    </View>
                    <View style={styles.listItemActions}>
                      <Pressable style={styles.actionButton}>
                        <Pencil size={16} color="#94a3b8" />
                      </Pressable>
                      <Pressable style={styles.actionButton}>
                        <Trash2 size={16} color="#94a3b8" />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* PLACES TAB */}
          {activeTab === 'places' && (
            <View style={styles.section}>
              <Pressable style={styles.uploadButtonRow}>
                <View style={[styles.uploadIconSmall, { backgroundColor: '#e0e7ff' }]}>
                  <Upload size={20} color="#6366f1" />
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.uploadTitle}>Upload Location Photo</Text>
                  <Text style={styles.uploadSubtitle}>Use real places from your life</Text>
                </View>
              </Pressable>

              <View style={styles.grid}>
                {PRESET_LOCATIONS.map(loc => (
                  <View key={loc.id} style={styles.gridItem}>
                    <View style={styles.gridImageContainer}>
                      <Image
                        source={{ uri: loc.image }}
                        style={styles.gridImage}
                        resizeMode="cover"
                      />
                      <View style={styles.gridImageOverlay}>
                        <Pressable style={styles.gridDeleteButton}>
                          <Trash2 size={14} color="#64748b" />
                        </Pressable>
                      </View>
                    </View>
                    <View style={styles.gridItemContent}>
                      <Text style={styles.gridItemTitle} numberOfLines={1}>{loc.name}</Text>
                      <View style={styles.gridItemFooter}>
                        <Text style={styles.gridItemLabel}>Preset</Text>
                        <Pressable>
                          <Pencil size={12} color="#cbd5e1" />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* VOICES TAB */}
          {activeTab === 'voices' && (
            <View style={styles.section}>
              <View style={styles.disabledLayer}>
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
                  <View style={styles.voiceCloneButton}>
                    <Mic size={16} color="#f43f5e" />
                    <Text style={styles.voiceCloneButtonText}>Start Recording</Text>
                  </View>
                </View>

                <Text style={styles.sectionLabel}>Your Voices</Text>

                {VOICE_PRESETS.map(voice => (
                  <View key={voice.id} style={styles.voiceItem}>
                    <View style={styles.voiceItemIcon}>
                      <Text style={styles.emoji}>{voice.icon}</Text>
                    </View>
                    <View style={styles.flex1}>
                      <Text style={styles.voiceItemTitle}>{voice.name}</Text>
                      <Text style={styles.voiceItemSubtitle}>{voice.style}</Text>
                    </View>
                    <Pressable style={styles.moreButton}>
                      <MoreVertical size={20} color="#cbd5e1" />
                    </Pressable>
                  </View>
                ))}
              </View>

              <View style={styles.comingSoonOverlay}>
                <View style={styles.comingSoonCard}>
                  <View style={styles.comingSoonIcon}>
                    <Sparkles size={28} color="#f43f5e" />
                  </View>
                  <Text style={styles.comingSoonTitle}>Coming Soon</Text>
                  <Text style={styles.comingSoonText}>
                    Voice Cloning is currently under development. Stay tuned for updates!
                  </Text>
                </View>
              </View>
            </View>
          )}
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
    paddingBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  badge: { backgroundColor: '#0f172a', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  title: { fontSize: 24, fontWeight: '800', color: '#1e293b', letterSpacing: -0.5 },
  subtitle: { fontSize: 12, fontWeight: '700', color: '#94a3b8' },
  closeButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9',
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
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
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
  listItemActions: { flexDirection: 'row', gap: 8 },
  actionButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  gridItem: {
    width: '47%', backgroundColor: 'white', padding: 12, borderRadius: 24, borderWidth: 1, borderColor: '#f1f5f9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  gridImageContainer: { aspectRatio: 1, borderRadius: 16, overflow: 'hidden', marginBottom: 12, position: 'relative' },
  gridImage: { width: '100%', height: '100%' },
  gridImageOverlay: { position: 'absolute', top: 8, right: 8 },
  gridDeleteButton: {
    width: 28, height: 28, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
  },
  gridItemContent: { paddingHorizontal: 4 },
  gridItemTitle: { fontWeight: '700', color: '#1e293b', fontSize: 14 },
  gridItemFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  gridItemLabel: { fontSize: 10, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' },
  disabledLayer: { opacity: 0.4, gap: 16 },
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
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, paddingLeft: 8 },
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
  moreButton: { padding: 8 },
  comingSoonOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  comingSoonCard: {
    backgroundColor: 'rgba(255,255,255,0.9)', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#e2e8f0',
    alignItems: 'center', maxWidth: 240,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24,
    transform: [{ rotate: '3deg' }],
  },
  comingSoonIcon: {
    width: 56, height: 56, backgroundColor: '#ffe4e6', borderRadius: 28,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  comingSoonTitle: { fontWeight: '800', color: '#1e293b', fontSize: 20, marginBottom: 8 },
  comingSoonText: { fontSize: 12, fontWeight: '700', color: '#64748b', lineHeight: 18, textAlign: 'center' },
});
