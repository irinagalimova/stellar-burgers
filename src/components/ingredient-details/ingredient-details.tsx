import { useSelector } from '@/services/store';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams();
  const ingredientData = useSelector((state) => state.ingredients.ingredients);
  const ingredient = ingredientData.find((ing) => ing._id === id);
  const isLoading = useSelector((state) => state.ingredients.isLoading);
  const error = useSelector((state) => state.ingredients.error);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <p>Не удалось загрузить ингредиенты. Попробуйте позже.</p>;
  }

  if (!ingredient) {
    return <p>Ингредиент не найден.</p>;
  }

  return <IngredientDetailsUI ingredientData={ingredient} />;
};
