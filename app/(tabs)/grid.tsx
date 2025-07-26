import Button from '@/components/Button';
import DataTable from '@/components/DataTable';
import { BG, FG } from '@/constants';
import { generatePairs } from '@/utils/generatePairs';
import { currentPairIndexAtom, duelsAtom, fighterPairsAtom, sameGenderOnlyAtom } from '@store';
import { useAtom } from 'jotai';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function TournamentGridScreen() {
  const [fighterPairs, setFighterPairs]   = useAtom(fighterPairsAtom);
  const [sameGenderOnly] = useAtom(sameGenderOnlyAtom);
  const [, setCurrentPairIndex] = useAtom(currentPairIndexAtom);
  const [duels, setDuels] = useAtom(duelsAtom);
  const headers = ['Боец 1', 'Победы 1', 'Победы 2', 'Боец 2'];

  const genPairs = ()=>{
    const newFighters = fighterPairs.map(pair=>pair[0].win > pair[1].win ? { ...pair[0], win: 0 } : { ...pair[1], win: 0 })
    setDuels(prev=>[...prev, fighterPairs])
    generatePairs(newFighters, sameGenderOnly, setFighterPairs)
    setCurrentPairIndex(0)
  }

  return (
    <SafeAreaView style={styles.container}>
      <DataTable data={fighterPairs.map(([f1, f2]) => [f1.name, f1.win.toString(), f2.win.toString(), f2.name])} headers={headers} />
      <Button title={"Окончить 1 тур"} onPress={genPairs} />

      {duels.length ? duels.map((duel, i)=>
        <View key={i} style={styles.duelWrap}>
            <Text style={styles.duelTitle}>{`${i+1} тур`}</Text>
            <DataTable data={duel.map(([f1, f2]) => [f1.name, f1.win.toString(), f2.win.toString(), f2.name])} headers={headers} />
        </View>
      ): <></>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, padding: 16, paddingTop: 70, rowGap: 20 },
  duelWrap: { flexDirection: "column", rowGap: 10 },
  duelTitle: { color: FG, textAlign: "center" }
});