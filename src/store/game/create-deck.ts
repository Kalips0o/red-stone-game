import type { IGameCard } from './game.types'
import {CARDS} from "../../constants/game/cards.constants";

export function createDeck(): IGameCard[] {
    return CARDS.map((card, index) => ({
        ...card,
        id: (index + 1),
        isOnBoard: false,
        isCanAttack: false,
    }))
}
