import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../data/products';
import { useFocusEffect } from '@react-navigation/native';

const FAVORITES_STORAGE_KEY = 'product_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsedFavorites = JSON.parse(stored);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load favorites from AsyncStorage on mount and when screen focuses
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const saveFavorites = async (newFavorites: Product[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addToFavorites = useCallback(async (product: Product) => {
    const newFavorites = [...favorites, product];
    await saveFavorites(newFavorites);
  }, [favorites]);

  const removeFromFavorites = useCallback(async (productId: number) => {
    const newFavorites = favorites.filter(product => product.id !== productId);
    await saveFavorites(newFavorites);
  }, [favorites]);

  const toggleFavorite = useCallback(async (product: Product) => {
    const isCurrentlyFavorite = favorites.some(fav => fav.id === product.id);
    
    if (isCurrentlyFavorite) {
      await removeFromFavorites(product.id);
    } else {
      await addToFavorites(product);
    }
  }, [favorites, addToFavorites, removeFromFavorites]);

  const isFavorite = useCallback((productId: number) => {
    return favorites.some(product => product.id === productId);
  }, [favorites]);

  const refreshFavorites = useCallback(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    refreshFavorites,
  };
};