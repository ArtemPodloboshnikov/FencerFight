import { FG } from "@/constants";
import { Minus, Plus } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Counter({
    label,
    value,
    onInc,
    onDec,
  }: {
    label: string;
    value: number;
    onInc: React.Dispatch<React.SetStateAction<number>>;
    onDec: React.Dispatch<React.SetStateAction<number>>;
  }) {
    const inc = (setter: React.Dispatch<React.SetStateAction<number>>) =>
        setter((s) => s + 1);
    const dec = (setter: React.Dispatch<React.SetStateAction<number>>) =>
        setter((s) => Math.max(0, s - 1));
    return (
        <View style={styles.wrap}>
            <Text style={styles.counterLabel}>{label}</Text>
            <View style={styles.counterRow}>
            <TouchableOpacity onPress={()=>dec(onDec)}>
                <Minus size={20} color={FG} />
            </TouchableOpacity>
            <Text style={styles.counterValue}>{value}</Text>
            <TouchableOpacity onPress={()=>inc(onInc)}>
                <Plus size={20} color={FG} />
            </TouchableOpacity>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'column',
        marginVertical: 6,
        alignItems: "center",
    },
    counterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
        paddingHorizontal: 12,
    },
    counterLabel: {
        color: FG,
        fontSize: 14,
        minWidth: 70,
        textAlign: "center",
        fontFamily: "IBMPlexSansRegular",
    },
    counterValue: {
        color: FG,
        fontSize: 18,
        marginHorizontal: 8,
        minWidth: 24,
        textAlign: 'center',
        fontFamily: "IBMPlexSansRegular",
    },
})