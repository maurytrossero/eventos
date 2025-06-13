// src/data/invitationTemplates.ts
export interface InvitationTemplate {
  id: string;
  nombre: string;
  descripcion: string;
  componente: string; // nombre del componente a usar dinámicamente
  imagenPreview: string; // URL para mostrar una previsualización
}

export const invitationTemplates: InvitationTemplate[] = [
  {
    id: 'quince',
    nombre: 'Invitación de 15 años',
    descripcion: 'Diseño elegante para fiestas de 15.',
    componente: 'InvitacionQuince',
    imagenPreview: '/assets/previews/quince.jpg'
  },
  {
    id: 'boda',
    nombre: 'Invitación de Boda',
    descripcion: 'Diseño romántico para bodas.',
    componente: 'InvitacionBoda',
    imagenPreview: '/assets/previews/boda.jpg'
  }
];
