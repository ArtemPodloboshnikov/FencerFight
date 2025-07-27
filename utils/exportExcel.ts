import { ParticipantType } from '@store';
import I18n from '@utils/i18n';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';

export async function exportExcel(
  data: ParticipantType[][][],
  fileName = 'tournament.xlsx'
) {
  const wb = XLSX.utils.book_new();

  /* заголовки */
  data.forEach((pair, i) => {
    const wsData: any[][] = [];
    wsData.push([`${i+1} ${I18n.t('stage')}`])
    wsData.push([I18n.t('name'), I18n.t('win'), I18n.t('win'), I18n.t('name')]);
    pair.forEach(([p1, p2]) => {
        wsData.push([p1.name, p1.win.toString(), p2.win.toString(), p2.name]);
    })

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, `${i+1} ${I18n.t('stage')}`);
  });

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });

  /* путь и имя файла */
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;
  await FileSystem.writeAsStringAsync(fileUri, wbout, { encoding: FileSystem.EncodingType.Base64 });

  /* открыть «поделиться» (отправит файл в Excel, Telegram, e-mail и т.д.) */
  await Sharing.shareAsync(fileUri);
}