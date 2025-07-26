import { ParticipantType } from '@/store';

export function incWin(
    winnerName: string,
    pairIndex: number,
    setter: React.Dispatch<React.SetStateAction<ParticipantType[][]>>)
{
  setter(prev =>
      prev.map((pair, i) =>{
            if (pairIndex === i) {
                return pair.map(p =>
                    p.name === winnerName ? { ...p, win: p.win + 1 } : p
                )
            }
            return pair
        }
      )
  );
}