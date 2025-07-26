import { useAudioPlayer } from 'expo-audio';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Button from '@/components/Button';
import Counter from '@/components/Counter';
import { ACCENT, BG, FG, STORAGE_PREFIX } from '@/constants';
import { incWin } from '@/utils/incWin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  currentPairIndexAtom,
  doubleHitsAtom,
  fighter1Atom,
  fighter2Atom,
  fighterPairsAtom,
  fightTimeAtom,
  hitZonesAtom,
  isRunningAtom,
  protests1Atom,
  protests2Atom,
  soundsUpdateAtom,
  timeLeftAtom,
  warnings1Atom,
  warnings2Atom
} from '@store';
import I18n from '@utils/i18n';
import { Minus, Pause, Play, RefreshCw, Trophy } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

const bell = require('../../assets/sounds/bell.mp3');
const warning = require('../../assets/sounds/warning.mp3');

export default function FightScreen() {
  const [fighter1] = useAtom(fighter1Atom);
  const [fighter2] = useAtom(fighter2Atom);
  const [currentPairIndex] = useAtom(currentPairIndexAtom);
  const [isRunning, setIsRunning] = useAtom(isRunningAtom);
  const [timeLeft, setTimeLeft] = useAtom(timeLeftAtom);
  const [hitZones] = useAtom(hitZonesAtom);
  const [fightTime] = useAtom(fightTimeAtom);
  const [isUpdateSounds, setUpdateSounds] = useAtom(soundsUpdateAtom)
  const [doubleHits, setDoubleHits] = useAtom(doubleHitsAtom);
  const [protests1,  setProtests1]  = useAtom(protests1Atom);
  const [protests2,  setProtests2]  = useAtom(protests2Atom);
  const [warnings1,  setWarnings1]  = useAtom(warnings1Atom);
  const [warnings2,  setWarnings2]  = useAtom(warnings2Atom);
  const [, setFighterPairs] = useAtom(fighterPairsAtom)

  const bellPlayer = useAudioPlayer(bell);
  const warningPlayer = useAudioPlayer(warning);
  const [bellUri, setBellUri]   = useState<string>("");
  const [warningUri, setWarningUri]= useState<string>("");

  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [wins, setWins] = useState([0, 0])

  const checkCustomSounds = async () => {
    if (isUpdateSounds) {
      const [b, w] = await Promise.all([
        AsyncStorage.getItem(STORAGE_PREFIX + 'bellSound'),
        AsyncStorage.getItem(STORAGE_PREFIX + 'warningSound'),
      ]);

      if (b) setBellUri(b);
      if (w) setWarningUri(w);
      setUpdateSounds(false)
    }
  };

  useEffect(() => {
    checkCustomSounds()
  }, [isUpdateSounds]);

  useEffect(() => { if (bellUri) bellPlayer.replace(bellUri)}, [bellUri, bellPlayer]);
  useEffect(() => { if (warningUri) warningPlayer.replace(warningUri)}, [warningUri, warningPlayer]);

  /* таймер */
  useEffect(() => {
    let iv: number;
    if (isRunning && timeLeft > 0) {
      iv = setInterval(() => {
        setTimeLeft((t) => {
          const next = t - 1;
          if (next === 15) {
            warningPlayer.seekTo(0);
            warningPlayer.play();
            setTimeout(()=>{if (warningPlayer.playing) warningPlayer.pause();}, 3000)
          }
          if (next === 0) {
            bellPlayer.seekTo(0);
            bellPlayer.play();
            setIsRunning(false);
            const isDraw = score1 === score2
            if (!isDraw) {
              if (score1 > score2) {
                incWin(fighter1, currentPairIndex, setFighterPairs)
                setWins(prev=>[prev[0]+1, prev[1]])

              } else {
                incWin(fighter2, currentPairIndex, setFighterPairs)
                setWins(prev=>[prev[0], prev[1]+1])
              }
            }
            Toast.show({
              type: "info",
              text1: I18n.t(isDraw ? "draw" : "win"),
              text1Style: { fontSize: 30, color: ACCENT, fontFamily: "IBMPlexSansSemiBold" },
              text2: (isDraw) ? "" : (score1 > score2 ? fighter1 : fighter2),
              text2Style: { fontSize: 26, color: FG, fontFamily: "IBMPlexSansRegular" },
            })
            setTimeout(()=>{if (bellPlayer.playing) bellPlayer.pause();}, 5000)
            return fightTime
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(iv);
  }, [isRunning, timeLeft, bellPlayer, warningPlayer]);

  const resetFight = () => {
    setScore1(0);
    setScore2(0);
    setDoubleHits(0);
    setProtests1(0);
    setProtests2(0);
    setWarnings1(0);
    setWarnings2(0);
    setTimeLeft(fightTime);
    setIsRunning(false);
    setWins([0, 0])
    warningPlayer.pause();
    bellPlayer.pause();
  };

  /* format time */
  const format = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  /* helpers */
  const addPoints = (setter: React.Dispatch<React.SetStateAction<number>>, zone: keyof typeof hitZones) => {
    const p = hitZones[zone];
    setter((s) => s + p);
  };

  const removePoints = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter((s) => s - 1);
  };

  useEffect(() => {
    setTimeLeft(fightTime);
  }, [fightTime]);

  return (
    <View style={styles.container}>
      {/* левая и правая половины */}
      {[
        {
          name: fighter1,
          score: score1,
          setScore: setScore1,
          protests: protests1,
          setProtests: setProtests1,
          warnings: warnings1,
          setWarnings: setWarnings1,
          styleWrap: styles.red
        },
        {
          name: fighter2,
          score: score2,
          setScore: setScore2,
          protests: protests2,
          setProtests: setProtests2,
          warnings: warnings2,
          setWarnings: setWarnings2,
          styleWrap: styles.blue
        }
      ].map((data, i)=>(
        <View style={[styles.side, data.styleWrap]} key={i}>
          <Text style={styles.name}>{data.name.replace(/ /g, '\n')}</Text>
          <Text style={styles.score}>{data.score}</Text>

          {Object.entries(hitZones).map(([zone, pts]) => (
            <TouchableOpacity
              key={`${i}-${zone}`}
              style={styles.zoneBtn}
              onPress={() => addPoints(data.setScore, zone as keyof typeof hitZones)}
            >
              <Text style={styles.zoneTxt}>
                {I18n.t(zone)} (+{pts})
              </Text>
            </TouchableOpacity>
          ))}
            <TouchableOpacity
              style={styles.zoneBtn}
              onPress={() => removePoints(data.setScore)}
            >
              <Minus size={28} color={FG} />
            </TouchableOpacity>
            <Counter label={I18n.t('protests')} value={data.protests} onInc={data.setProtests} onDec={data.setProtests} />
            <Counter label={I18n.t('warnings')} value={data.warnings} onInc={data.setWarnings} onDec={data.setWarnings} />
        </View>
      ))}

      <View style={[styles.bottomBar, { bottom: 115, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }]}>
        <View style={styles.winWrap}>
          <Text style={styles.winText}>{wins[0]}</Text>
          <Trophy size={28} color={ACCENT} />
        </View>
        <Counter label={I18n.t('doubleHits')} value={doubleHits} onInc={setDoubleHits} onDec={setDoubleHits} />
        <View style={styles.winWrap}>
          <Text style={styles.winText}>{wins[1]}</Text>
          <Trophy size={28} color={ACCENT} />
        </View>
      </View>

      {/* НИЖНЯЯ ПАНЕЛЬ */}
      <View style={styles.bottomBar}>
        <Text style={styles.timer}>{format(timeLeft)}</Text>

        <View style={styles.controls}>
          <Button onPress={resetFight}>
            <RefreshCw size={28} color={FG} />
          </Button>
          <Button onPress={() => setIsRunning(!isRunning)}>
              {isRunning ? <Pause size={28} color={FG} /> : <Play size={28} color={FG} />}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  side: { flex: 1, paddingTop: 60, alignItems: 'center' },
  red: { backgroundColor: '#8B0000' },
  blue: { backgroundColor: '#00008B' },

  name: { color: FG, fontSize: 21, marginBottom: 7, fontFamily: "IBMPlexSansBold", textAlign: "center" },
  score: { color: ACCENT, fontSize: 48, height: 40, lineHeight: 35, marginBottom: 7, fontFamily: "IBMPlexSansBold" },

  zoneBtn: {
    backgroundColor: '#FFFFFF15',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginVertical: 4,
  },
  zoneTxt: { color: FG, fontSize: 14, fontFamily: "IBMPlexSansRegular" },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BG,
    paddingVertical: 12,
    alignItems: 'center',
  },
  timer: { color: FG, fontSize: 36, fontFamily: "IBMPlexSansBold", marginBottom: 8 },
  controls: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },

  winText: { color: ACCENT, fontSize: 20, fontFamily: 'IBMPlexSansBold', position: "relative", left: -1 },
  winWrap: { flexDirection: 'column', alignItems: "center", marginTop: -10 }
});