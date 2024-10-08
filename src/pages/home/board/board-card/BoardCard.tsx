import type { IGameCard } from "@/store/game/game.types";
import { motion } from "framer-motion";
import cn from 'clsx';
import { useGameStore } from "@/store/game/game.store";
import { useEnemyTarget } from "./useEnemyTarget";
import { useSelectAttacker } from "@/store/game/actions/select-attacker";
import { DamageList } from "../DamageList";

interface Props {
  card: IGameCard; 
  isPlayerSide: boolean; 
}

// Основной компонент
export function BoardCard({ card, isPlayerSide }: Props) {
  // Использование хуков для доступа к состоянию игры и выбора атакующего
  const { handleSelectTarget } = useEnemyTarget();
  const { returnCard, currentTurn } = useGameStore();
  const { setCardAttackerId, cardAttackerId } = useSelectAttacker();


  // Обработчик клика на карте
  const handleClick = (cardId: string) => {
    console.log(`Карта нажата: ${card.name}, ID: ${cardId}, Может атаковать: ${card.isCanAttack}`);

    if (isPlayerSide) {
      if (card.isCanAttack) {
        setCardAttackerId(cardId); // Установка атакующего, если карта может атаковать
      } else if (card.isPlayedThisTurn) {
        returnCard(cardId); // Возврат карты, если она была сыграна в этом ходу
      }
    } else {
      handleSelectTarget(cardId, true); // Выбор цели для атаки
    }
  };

  // Проверка, выбрана ли карта как атакующий игрока
  const isSelectPlayerAttacker = isPlayerSide && cardAttackerId === card.id;

  return (
    <motion.button
      className={cn("h-[11.3rem] w-32 rounded-lg border-2 border-transparent border-solid transition-colors relative", 
        {
          'cursor-pointer !border-green-400 shadow-2xl': card.isCanAttack && !isSelectPlayerAttacker && isPlayerSide && currentTurn === "player",
          '!border-primary shadow-2xl': isSelectPlayerAttacker,
          '!border-red-400': !isPlayerSide && cardAttackerId,
          'cursor-not-allowed': currentTurn !== 'player'
        }
      )}
      initial={{ scale: 0.5, rotate: -15, y: -200, opacity: 0 }} // Начальные параметры анимации
      animate={{
        scale: 1,
        rotate: 0,
        y: 0,
        opacity: 1,
      }}
      transition={{ type: 'spring', stiffness: 150, damping: 20, mass: 1 }} // Параметры перехода
      onClick={() => (currentTurn !== 'player' ? null : handleClick(card.id))} // Обработчик клика с проверкой текущего хода
    >
      <img alt={card.name} src={card.imageUrl} draggable="false" /> 
      <DamageList id={card.id} isRight /> 
    </motion.button>
  );
}
