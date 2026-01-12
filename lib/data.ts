// Data access layer for Datum
import { Visualization, Collection } from '@/types'
import visualizationsData from '@/data/visualizations.json'
import collectionsData from '@/data/collections.json'

export function getAllVisualizations(): Visualization[] {
  return visualizationsData as Visualization[]
}

export function getVisualizationBySlug(slug: string): Visualization | undefined {
  return getAllVisualizations().find(viz => viz.slug === slug)
}

export function getAllCollections(): Collection[] {
  return collectionsData as Collection[]
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return getAllCollections().find(col => col.slug === slug)
}

export function getVisualizationsByCollection(collectionSlug: string): Visualization[] {
  const collection = getCollectionBySlug(collectionSlug)
  if (!collection) return []
  
  return collection.visualizations
    .map(slug => getVisualizationBySlug(slug))
    .filter((viz): viz is Visualization => viz !== undefined)
}

export function getCollectionsByVisualization(vizSlug: string): Collection[] {
  const viz = getVisualizationBySlug(vizSlug)
  if (!viz) return []
  
  return viz.collections
    .map(slug => getCollectionBySlug(slug))
    .filter((col): col is Collection => col !== undefined)
}
