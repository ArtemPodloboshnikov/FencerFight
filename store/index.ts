import { atom } from 'jotai';

export const fightTimeDefault = 180;

// Основные атомы таймера
export const fightTimeAtom = atom(fightTimeDefault); // Время боя в секундах (по умолчанию 3 минуты)
export const win1Atom = atom(0); // Очки первого бойца
export const win2Atom = atom(0); // Очки второго бойца
export const isRunningAtom = atom(false); // Состояние таймера (запущен/остановлен)
export const timeLeftAtom = atom(fightTimeDefault); // Оставшееся время
export const languageAtom = atom('en'); // Язык интерфейса ('en', 'ru', 'zh')
export const soundsUpdateAtom = atom(true); // Обновление звуков
export const sameGenderOnlyAtom = atom(false); // Сортировка по полу

// Атомы для новых функций
export const doubleHitsAtom = atom(0); // Флаг учета обоюдных попаданий
export const protests1Atom = atom(0); // Флаг учета протестов для бойца 1
export const protests2Atom = atom(0); // Флаг учета протестов для бойца 2
export const warnings1Atom = atom(0); // Счетчик предупреждений для бойца 1
export const warnings2Atom = atom(0); // Счетчик предупреждений для бойца 2

export type ParticipantType = { name: string; gender: 'M' | 'F', win: number };

// Атомы для управления парами бойцов
export const fighterPairsAtom = atom<ParticipantType[][]>([
  // Массив пар бойцов по умолчанию
  [{ name: 'Fighter A', gender: "M", win: 0}, { name: 'Fighter B', gender: "M", win: 0 }],
  [{ name: 'Fighter C', gender: "F", win: 0 }, { name: 'Fighter D', gender: "F", win: 0 }]
]);

export const duelsAtom = atom<ParticipantType[][][]>([])

export const hitZonesDefault = {
  head: 3,
  torso: 2,
  arms: 2,
  legs: 1
}

export const hitZonesAtom = atom(hitZonesDefault);

export const currentPairIndexAtom = atom(0); // Индекс текущей выбранной пары