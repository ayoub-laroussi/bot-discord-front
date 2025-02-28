import { Pipe, PipeTransform } from '@angular/core';
import { Commentaire } from '../models/commentaire.model';

interface ResourceInfo {
  id_resource: number;
  resource_title: string;
}

@Pipe({
  name: 'uniqueResources',
  standalone: true
})
export class UniqueResourcesPipe implements PipeTransform {
  transform(commentaires: Commentaire[]): ResourceInfo[] {
    if (!commentaires || commentaires.length === 0) {
      return [];
    }

    // Créer un Map pour stocker les ressources uniques
    const resourceMap = new Map<number, ResourceInfo>();
    
    // Parcourir tous les commentaires et ajouter les ressources uniques
    commentaires.forEach(commentaire => {
      if (!resourceMap.has(commentaire.id_resource) && commentaire.resource_title) {
        resourceMap.set(commentaire.id_resource, {
          id_resource: commentaire.id_resource,
          resource_title: commentaire.resource_title
        });
      }
    });
    
    // Convertir le Map en tableau et trier par titre
    return Array.from(resourceMap.values())
      .sort((a, b) => a.resource_title.localeCompare(b.resource_title));
  }
}
