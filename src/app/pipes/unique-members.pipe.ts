import { Pipe, PipeTransform } from '@angular/core';
import { Commentaire } from '../models/commentaire.model';

interface MemberInfo {
  id_member: number;
  member_name: string;
}

@Pipe({
  name: 'uniqueMembers',
  standalone: true
})
export class UniqueMembersPipe implements PipeTransform {
  transform(commentaires: Commentaire[]): MemberInfo[] {
    if (!commentaires || commentaires.length === 0) {
      return [];
    }

    // Créer un Map pour stocker les membres uniques
    const memberMap = new Map<number, MemberInfo>();
    
    // Parcourir tous les commentaires et ajouter les membres uniques
    commentaires.forEach(commentaire => {
      if (!memberMap.has(commentaire.id_member) && commentaire.member_name) {
        memberMap.set(commentaire.id_member, {
          id_member: commentaire.id_member,
          member_name: commentaire.member_name
        });
      }
    });
    
    // Convertir le Map en tableau et trier par nom
    return Array.from(memberMap.values())
      .sort((a, b) => a.member_name.localeCompare(b.member_name));
  }
}
