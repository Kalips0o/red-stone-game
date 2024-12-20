import type { IGameStore } from '../game.types'
import { getCardById } from './attack-card'
import { useNotificationStore } from '@/store/notiffication/notification.store'
import { useDamageStore } from './damage.store'
import { EnumTypeCard } from '@/card.types'
import { create } from 'zustand'
import { useGameStore } from '../game.store'

interface ISoundStore {
  playPlayerScream: () => void;
  playOpponentScream: () => void;
  playCardDeal: () => void;
  playCardOnTable: () => void;
  playCardAttack: () => void;
  playWin: () => void;
  playLose: () => void;
}

export const useSoundStore = create<ISoundStore>(() => ({
  playPlayerScream: () => {},
  playOpponentScream: () => {},
  playCardDeal: () => {},
  playCardOnTable: () => {},
  playCardAttack: () => {},
  playWin: () => {},
  playLose: () => {},
}));

export const attackHeroAction = (state: IGameStore, attackerId: string
): Partial<IGameStore> => {

    const isAttackerPlayer = state.currentTurn === 'player';
	const opponent = isAttackerPlayer ? state.opponent : state.player;
	const attacker = getCardById(attackerId, isAttackerPlayer ? state.player.deck : state.opponent.deck);
	const opponentTaunt = opponent.deck.find(
		card => card.type === EnumTypeCard.taunt && card.isOnBoard
	);

	if (attacker && attacker.isCanAttack && !opponentTaunt && opponent.health > 0) {
		opponent.health = Math.max(0, opponent.health - attacker.attack);
		attacker.isCanAttack = false;

		useDamageStore
			.getState()
			.addDamage(isAttackerPlayer ? 'opponent' : 'player', attacker.attack);

		if (isAttackerPlayer) {
			useSoundStore.getState().playOpponentScream();
			const opponentImage = document.querySelector('.right-10.top-2 img');
			if (opponentImage) {
				opponentImage.classList.add('shake');
				setTimeout(() => {
					opponentImage.classList.remove('shake');
				}, 500);
			}
		} else {
			useSoundStore.getState().playPlayerScream();
		}

		if (opponent.health <= 0) {
			setTimeout(() => {
				useGameStore.setState(state => ({
					...state,
					isGameOver: true,
					isGameStarted: false
				}));

				useNotificationStore
					.getState()
					.show(
						isAttackerPlayer ? 'You win' : 'You lose',
						isAttackerPlayer ? 'win' : 'lose'
					);
			}, 5000);
		}
	}

	return {
		player: state.player,
		opponent: state.opponent,
	};
};
