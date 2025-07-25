import * as Localization from 'expo-localization';
import { I18n } from "i18n-js";

const i18n = new I18n({
  en: {
    fighterName: 'Fighter Name',
    fightDuration: 'Fight Duration',
    doubleHits: 'Double Hits',
    protests: 'Protests',
    warnings: 'Warnings',
    settingsSaved: 'Settings saved',
    participants: 'Participants',
    hitZones: 'Hit Zones',
    head: 'Head',
    torso: 'Torso',
    arms: 'Arms',
    legs: 'Legs',
    changeBellSound: 'Change Bell Sound',
    changeWarningSound: 'Change Warning Sound',
    randomizePairs: 'Randomize Pairs',
    pairs: 'Pairs',
    addNewPair: 'Add New Pair',
    sounds: 'Sounds',
    addTwoFighters: "Add at least 2 fighters",
    updated: "updated",
    win: "Won",
    draw: "Draw",
    reset: "Initial settings",
    sameGenderPairs: "Same-gender pairs only",
    editTime: "Edit time"
  },
  ru: {
    fighterName: 'Имя бойца',
    fightDuration: 'Длительность боя',
    doubleHits: 'Обоюдки',
    protests: 'Протесты',
    warnings: 'Предупреждения',
    settingsSaved: 'Настройки сохранены',
    participants: 'Участники',
    hitZones: 'Зоны поражения',
    head: 'Голова',
    torso: 'Корпус',
    arms: 'Руки',
    legs: 'Ноги',
    changeBellSound: 'Изменить звук звонка',
    changeWarningSound: 'Изменить звук предупреждения',
    randomizePairs: 'Случайные пары',
    pairs: 'Пары',
    addNewPair: 'Добавить новую пару',
    sounds: 'Звуки',
    addTwoFighters: "Добавьте минимум 2 бойца",
    updated: "обновлён",
    win: "Победил",
    draw: "Ничья",
    reset: "Исходные настройки",
    sameGenderPairs: "Пары только одного пола",
    editTime: "Изменить время"
  },
  zh: {
    fighterName: "战斗机的名字",
    fightDuration: "战斗持续时间",
    doubleHits: "相互影响",
    protests: "抗议",
    warnings: "警告",
    settingsSaved: "设置已保存",
    participants: "参加者",
    hitZones: "打击区域",
    head: "头部",
    torso: "躯干",
    arms: "手臂",
    legs: "腿部",
    changeBellSound: "更改铃声",
    changeWarningSound: "更改警告声音",
    randomizePairs: "随机配对",
    pairs: "成对的竞争对手",
    addNewPair: "添加新对",
    sounds: "音效",
    addTwoFighters: "请至少添加 2 名选手",
    updated: "已更新",
    win: "获胜",
    draw: "平局",
    reset: "初始设置",
    sameGenderPairs: "仅限同性配对",
    editTime: "编辑时间"
  }
});

// Set the locale once at the beginning of your app
i18n.locale != Localization.getLocales()[0].languageCode;
i18n.defaultLocale = 'en';

export default i18n;