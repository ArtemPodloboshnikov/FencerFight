import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useAtom, useSetAtom } from 'jotai';
import { Mars, Plus, RefreshCw, Save, Trash2, Venus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TimerPicker } from 'react-native-timer-picker';
import Toast from 'react-native-toast-message';

import Button from '@/components/Button';
import Section from '@/components/Section';
import ToastCustom from '@/components/ToastCustom';
import { ACCENT, ACCENT_TRANSPARENT, BG, FG, langLabels, PLACEHOLDER, STORAGE_PREFIX, SURFACE } from '@/constants';
import {
  currentPairIndexAtom,
  fighter1Atom,
  fighter2Atom,
  fighterPairsAtom,
  fightTimeAtom,
  fightTimeDefault,
  hitZonesAtom,
  hitZonesDefault,
  languageAtom,
  ParticipantType,
  soundsUpdateAtom
} from '@store';
import I18n from '@utils/i18n';

export default function SettingsScreen() {
  /* ---------- атомы ---------- */
  const [fightTime, setFightTime] = useAtom(fightTimeAtom);
  const [hitZones, setHitZones] = useAtom(hitZonesAtom);
  const setFighter1 = useSetAtom(fighter1Atom);
  const setFighter2 = useSetAtom(fighter2Atom);
  const [fighterPairs, setFighterPairs] = useAtom(fighterPairsAtom);
  const [currentPairIndex, setCurrentPairIndex] = useAtom(currentPairIndexAtom);
  const [language, setLanguage] = useAtom(languageAtom);
  const setUpdateSounds = useSetAtom(soundsUpdateAtom)


  /* ---------- состояние ---------- */
  const [newName, setNewName]           = useState('');
  const [sameGenderOnly, setSameGenderOnly] = useState(false);
  const [participants, setParticipants] = useState<ParticipantType[]>([]);
  const [newGender, setNewGender] = useState<'M' | 'F'>('M');
  const [showPicker, setShowPicker] = useState(false);

  /* ---------- загрузка ---------- */
  useEffect(() => {
    (async () => {
      const [t, z, p] = await Promise.all([
        AsyncStorage.getItem(STORAGE_PREFIX + 'fightTime'),
        AsyncStorage.getItem(STORAGE_PREFIX + 'hitZones'),
        AsyncStorage.getItem(STORAGE_PREFIX + 'participants'),
      ]);

      if (t) setFightTime(Number(t));
      if (z) setHitZones(JSON.parse(z));
      if (p) setParticipants(JSON.parse(p));
    })();
  }, []);

  /* ---------- сохранение ---------- */
  const saveAll = async () => {
    await AsyncStorage.setItem(STORAGE_PREFIX + 'fightTime', fightTime.toString());
    await AsyncStorage.setItem(STORAGE_PREFIX + 'hitZones', JSON.stringify(hitZones));
    await AsyncStorage.setItem(STORAGE_PREFIX + 'participants', JSON.stringify(participants));
    Toast.show({
      type: "success",
      text1: '✓',
      text2: I18n.t('settingsSaved'),
      text2Style: { fontFamily: "IBMPlexSansMedium" }
    })
  };

    const selectPair = (idx: number) => {
      if (idx < 0 || idx >= fighterPairs.length) return;
      const pair = fighterPairs[idx];
      setCurrentPairIndex(idx);
      setFighter1(pair[0].name);
      setFighter2(pair[1].name);
    };

  /* ---------- участники ---------- */
  const addParticipant = () => {
    const name = newName.trim();
    if (!name) return;
    setParticipants([...participants, { name, gender: newGender }]);
    setNewName('');
  };
  const removeParticipant = (idx: number) =>
    setParticipants(participants.filter((_, i) => i !== idx));

  const generatePairs = () => {
  if (participants.length < 2) {
    Toast.show({ type: 'error', text1: I18n.t('addTwoFighters') });
    return;
  }

  let shuffled = [...participants].sort(() => Math.random() - 0.5);
  const pairs: ParticipantType[][] = [];

  if (sameGenderOnly) {
    const males = shuffled.filter((p) => p.gender === 'M');
    const females = shuffled.filter((p) => p.gender === 'F');

    [males, females].forEach((group) => {
      for (let i = 0; i < group.length - 1; i += 2) {
        pairs.push([group[i], group[i + 1]]);
      }
      if (group.length % 2 !== 0) {
        pairs.push([group[group.length - 1], { name: '—', gender: group[group.length - 1].gender }]);
      }
    });
    setFighterPairs(pairs);
  } else {
    /* старая логика без фильтра по полу */

    for (let i = 0; i < shuffled.length - 1; i += 2) {
      pairs.push([shuffled[i], shuffled[i + 1]]);
      }
      if (shuffled.length % 2 !== 0) {
        pairs.push([shuffled[shuffled.length - 1], { name: '—', gender: shuffled[shuffled.length - 1].gender } ]);
      }
        setFighterPairs(pairs);
    }

    setCurrentPairIndex(0);
    setFighter1(pairs[0][0].name);
    setFighter2(pairs[0][1].name);
  };

  /* ---------- звуки ---------- */
  const pickSound = async (type: 'bell' | 'warning') => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
      if (res.assets[0].uri) {
        await deleteCustomSounds(type)
        const fileType = res.assets[0].name.split(".")[1]
        const target = `${FileSystem.documentDirectory}${type}_custom.${fileType}`;
        await FileSystem.copyAsync({ from: res.assets[0].uri, to: target });
        await AsyncStorage.setItem(STORAGE_PREFIX + type + 'Sound', target);
        Toast.show({
          type: "success",
          text1: "✓",
          text2: `${type} ${I18n.t("updated")}`,
          text2Style: { fontFamily: "IBMPlexSansMedium" }
        })
        setUpdateSounds(true)
      }
    } catch (e) {
        Toast.show({
          type: "error",
          text1: "X",
          text2: `${e}`,
          text2Style: { fontFamily: "IBMPlexSansMedium" }
        })
    }
  };

  const changeLang = () => {
    const langs = Object.keys(langLabels);
    const currentIndex = langs.indexOf(language);
    const newIndex = currentIndex + 1
    const newLang = langs[newIndex === langs.length ? 0 : newIndex];

    I18n.locale = newLang;
    AsyncStorage.setItem(STORAGE_PREFIX + 'language', newLang);
    setLanguage(newLang);
  };

  async function deleteCustomSounds(type: 'bell' | 'warning' | 'all') {
    if (type === "bell" || type === "all") {
      const customBellPath = await AsyncStorage.getItem(STORAGE_PREFIX + 'bellSound')
      if (customBellPath)
        await FileSystem.deleteAsync(customBellPath);
    }

    if (type === "warning" || type === "all") {
      const customWarningPath = await AsyncStorage.getItem(STORAGE_PREFIX + 'warningSound')
      if (customWarningPath)
        await FileSystem.deleteAsync(customWarningPath);
    }
  }

  const resetAll = async () => {
    setFightTime(fightTimeDefault)
    setHitZones(hitZonesDefault)
    await deleteCustomSounds("all")
    await AsyncStorage.clear();

    Toast.show({
      type: "success",
      text1: I18n.t('reset')
    })
  }

  useEffect(() => {
  (async () => {
    const savedLang = await AsyncStorage.getItem(STORAGE_PREFIX + 'language');
    if (savedLang) {
      setLanguage(savedLang);
      I18n.locale = savedLang;
    }
  })();
  }, []);

  return (
    <>
    <ScrollView key={language}style={styles.container} contentContainerStyle={styles.content}>
      {/* Кнопка смены языка */}
      <View style={styles.langRow}>
        <TouchableOpacity onPress={changeLang}>
          <Text style={styles.langBtn}>{langLabels[language]}</Text>
        </TouchableOpacity>
      </View>

      {/* --- 1. Участники --- */}
      <Section title={I18n.t('participants')}>
        <TextInput
          placeholder={I18n.t('fighterName')}
          value={newName}
          onChangeText={setNewName}
          style={styles.input}
          placeholderTextColor={PLACEHOLDER}
          onSubmitEditing={addParticipant}
          returnKeyType="done"
        />

        <View style={styles.genderRow}>
          <TouchableOpacity onPress={() => setNewGender('M')} style={[styles.genderBtn, newGender === 'M' && styles.genderActive]}>
            <Mars size={28} color={FG} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setNewGender('F')} style={[styles.genderBtn, newGender === 'F' && styles.genderActive]}>
            <Venus size={28} color={FG} />
          </TouchableOpacity>
        </View>

        <Button style={styles.addBtn} onPress={addParticipant}>
          <Plus size={28} color={FG} />
        </Button>

        {participants.map((p, idx) => (
          <View key={idx} style={styles.participantRow}>
            <Text style={styles.participantTxt}>{p.name}</Text>
            {p.gender === "M" ?
              <Mars size={15} color={FG} style={{ marginLeft: -125}} /> : <Venus size={15} color={FG} style={{ marginLeft: -125}} />}
            <TouchableOpacity onPress={() => removeParticipant(idx)}>
              <Trash2 size={22} color={FG} />
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.genderRow}>
          <View style={[styles.genderRow, { marginVertical: 0 }]}>
            <Mars size={28} color={FG} />
            <Text style={styles.countTxt}>{participants.filter(p => p.gender === 'M').length}</Text>
          </View>
          <View style={[styles.genderRow, { marginVertical: 0, marginLeft: 30 }]}>
            <Venus size={28} color={FG} />
            <Text style={styles.countTxt}>{participants.filter(p => p.gender === 'F').length}</Text>
          </View>
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{I18n.t('sameGenderPairs')}</Text>
          <Switch
            value={sameGenderOnly}
            onValueChange={setSameGenderOnly}
            trackColor={{ false: '#767577', true: ACCENT }}
            thumbColor={sameGenderOnly ? FG : '#f4f3f4'}
          />
        </View>

        <Button style={{ marginTop: 10 }} onPress={generatePairs} title={I18n.t('randomizePairs')} stroke />
      </Section>

      <Section title={I18n.t('pairs')}>
        {fighterPairs.map((pair, idx) => (
          <Button
          key={idx}
          style={currentPairIndex === idx ? {...styles.pairItem, backgroundColor: ACCENT} : styles.pairItem}
          onPress={() => selectPair(idx)}
          title={`${pair[0].name} vs ${pair[1].name}`}
          />
        ))}
      </Section>

      {/* --- 2. Длительность --- */}
      <Section title={I18n.t('fightDuration')}>
        <Button
          title={I18n.t('editTime')}
          onPress={() => setShowPicker(true)}
        />
      </Section>

      {/* --- 3. Зоны поражения --- */}
      <Section title={I18n.t('hitZones')}>
        {Object.entries(hitZones).map(([zone, pts]) => (
          <View key={zone} style={styles.zoneRow}>
            <Text style={styles.zoneLabel}>{I18n.t(zone)}</Text>
            <TextInput
              value={pts.toString()}
              keyboardType="numeric"
              onChangeText={(v) => setHitZones({ ...hitZones, [zone]: Number(v) || 0 })}
              style={styles.zoneInput}
            />
          </View>
        ))}
      </Section>

      {/* --- 4. Системные звуки --- */}
      <Section title={I18n.t('sounds')}>
        <Button onPress={() => pickSound('bell')} title={I18n.t('changeBellSound')} />
        <Button style={{ marginTop: 10 }} onPress={() => pickSound('warning')} title={I18n.t('changeWarningSound')} stroke />
      </Section>

      {/* --- 5. Сохранить --- */}
      <Section>
        <Button onPress={saveAll}>
          <Save size={28} color={FG} />
        </Button>
        <Button onPress={resetAll} style={{ marginTop: 10 }} stroke>
          <RefreshCw size={28} color={FG} />
        </Button>
      </Section>
    </ScrollView>
    {/* --- Toast с TimePiker --- */}
    <ToastCustom visible={showPicker} onClose={()=>setShowPicker(false)}>
        <TimerPicker
          hideHours
          onDurationChange={({ minutes, seconds }) => {
            setFightTime(minutes * 60 + seconds);
          }}
          initialValue={{
            minutes: Math.floor(fightTime / 60),
            seconds: fightTime % 60,
          }}
          LinearGradient={null}
          styles={{
            theme: 'dark',
            backgroundColor: SURFACE,
            pickerContainer: {
              justifyContent: "center",
            },
            pickerItem: {
              color: FG,
              fontSize: 22,
              fontFamily: "IBMPlexSansRegular"
            },
            pickerLabel: {
              color: FG,
              fontSize: 16,
              fontFamily: "IBMPlexSansRegular"
            },
          }}
        />
    </ToastCustom>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, paddingTop: 30 },
  content:   { padding: 20 },

  langRow: { alignItems: 'flex-end', marginBottom: 12 },
  langBtn: { color: ACCENT, fontSize: 16, fontFamily: "IBMPlexSansSemiBold" },

  section: { backgroundColor: SURFACE, borderRadius: 16, padding: 16, marginBottom: 24 },

  input:      { backgroundColor: SURFACE, color: FG, borderRadius: 8, padding: 12, marginBottom: 8, fontFamily: "IBMPlexSansRegular" },
  addBtn:     { marginBottom: 12 },

  participantRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  participantTxt: { color: FG, fontSize: 16, width: 150, fontFamily: "IBMPlexSansMedium" },

  pairItem: { backgroundColor: ACCENT_TRANSPARENT, borderRadius: 8, padding: 12, marginBottom: 6 },

  row:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  zoneRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  zoneLabel:   { color: FG, fontSize: 16, fontFamily: "IBMPlexSansRegular" },
  zoneInput:   { width: 48, backgroundColor: SURFACE, color: FG, textAlign: 'center', borderRadius: 8, paddingVertical: 4, fontFamily: "IBMPlexSansRegular" },

  genderRow: { flexDirection: 'row', marginVertical: 8, justifyContent: 'center', alignItems: "center" },
  genderBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginRight: 8 },
  genderActive: { backgroundColor: ACCENT },

  switchRow: { flexDirection: 'row', alignItems: 'center' },
  switchLabel: { color: FG, flex: 1, fontFamily: "IBMPlexSansRegular", marginTop: -5 },

  countTxt: { color: FG, fontSize: 16, marginLeft: 10, fontFamily: "IBMPlexSansBold" },
});