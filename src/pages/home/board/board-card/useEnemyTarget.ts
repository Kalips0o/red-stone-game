import { useSelectAttacker } from "@/store/game/actions/select-attacker";
import { useGameStore } from "@/store/game/game.store";

export function useEnemyTarget() {
  const { attackHero, attackCard, currentTurn } = useGameStore();
  const { cardAttackerId, setCardAttackerId } = useSelectAttacker();

  
  const handleSelectTarget = (targetId: string, isHero = false) => {
    if (!cardAttackerId) {
      console.log('Нет выбранной атакующей карты.');
      return;
    }
    if (currentTurn !== "player") {
      return;
    }
  
  
    if (isHero) {
      attackHero(cardAttackerId);
    } else if (targetId) {
      attackCard(cardAttackerId, targetId); 
    }
  
    setCardAttackerId(null); 
  };

  return { handleSelectTarget }; 
}
