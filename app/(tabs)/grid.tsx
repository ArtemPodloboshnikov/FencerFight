import Button from '@/components/Button';
import DataTable from '@/components/DataTable';
import { FG } from '@/constants';
import { exportExcel } from '@/utils/exportExcel';
import { generatePairs } from '@/utils/generatePairs';
import { truncate } from '@/utils/helpers';
import { currentPairIndexAtom, duelsAtom, fighterPairsAtom, ParticipantType, sameGenderOnlyAtom } from '@store';
import I18n from '@utils/i18n';
import { useAtom } from 'jotai';
import { Share2 } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function TournamentGridScreen() {
  const [fighterPairs, setFighterPairs]   = useAtom(fighterPairsAtom);
  const [sameGenderOnly] = useAtom(sameGenderOnlyAtom);
  const [, setCurrentPairIndex] = useAtom(currentPairIndexAtom);
  const [duels, setDuels] = useAtom(duelsAtom);
  const headers = [I18n.t('name'), I18n.t('win'), I18n.t('win'), I18n.t('name')];

  const genPairs = ()=>{
    const newFighters = fighterPairs.map(pair=>pair[0].win > pair[1].win ? { ...pair[0], win: 0 } : { ...pair[1], win: 0 })
    setDuels(prev=>[...prev, fighterPairs])
    if (newFighters.length > 1) {
      generatePairs(newFighters, sameGenderOnly, setFighterPairs, setCurrentPairIndex)
    } else {
      setFighterPairs([[]])
    }
  }

  const getDataTable = (data: ParticipantType[][]) => data.map(([f1, f2]) => [truncate(f1.name), f1.win.toString(), f2.win.toString(), truncate(f2.name)])

    /* собираем все секции в массив для FlatList */
  const sections = [
    /* текущий этап */
    ...(fighterPairs.filter(p => p.length).length
      ? [
          { key: 'current', title: I18n.t('currentStage'), data: getDataTable(fighterPairs) },
        ]
      : []),
    /* исторические этапы */
    ...duels.map((duel, i) => ({
      key: `duel-${i}`,
      title: `${i + 1} ${I18n.t('stage')}`,
      data: getDataTable(duel),
    })),
  ];

  return (
    <FlatList
      data={sections}
      keyExtractor={(item) => item.key}
      contentContainerStyle={styles.container}
      renderItem={({ item, index }) => (
        <View style={styles.duelWrap}>
          <Text style={styles.duelTitle}>{item.title}</Text>
          <DataTable data={item.data} headers={headers} />
          {index === 0 ?
          (fighterPairs.filter(p => p.length).length ? (
            <Button
              title={I18n.t('stageEnd')}
              onPress={genPairs}
              disabled={
                fighterPairs.length !== fighterPairs.filter(pairs=>pairs.filter(pair=>pair.win).length).length
              }
            />
          ) : <></>)
          :
          <></>
          }
        </View>
      )}
      ListFooterComponent={
        <Button onPress={() => exportExcel(duels)}>
          <Share2 color={FG} size={28} />
        </Button>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 50 },
  duelWrap: { flexDirection: "column", rowGap: 10, marginBottom: 20 },
  duelTitle: { color: FG, textAlign: "center", fontFamily: "IBMPlexSansBold", fontSize: 28 }
});