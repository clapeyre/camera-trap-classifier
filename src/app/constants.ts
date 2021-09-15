export interface Animaux {
  [key: number]: string
}

export const RESULT: Animaux = {
  '0':  'Blaireau',
  '1':  'Brebis',
  '2':  'Cervide',
  '3':  'Chat',
  '4':  'Cheval',
  '5':  'Chevreuil',
  '6':  'Chevre',
  '7':  'Chien',
  '8':  'Daim',
  '9':  'Ecureuil',
  '10': 'Humain',
  '11': 'Isard',
  '12': 'Lievre',
  '13': 'Marmotte',
  '14': 'Martre',
  '15': 'Oiseaux',
  '16': 'Ours',
  '17': 'Renard',
  '18': 'Rien',
  '19': 'Sanglier',
  '20': 'Tetras',
  '21': 'Vache'
};

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

export interface Prediction {
  fileName: string;
  preview: string;
  blaireau: number;
  brebis: number;
  cervide: number;
  chat: number;
  cheval: number;
  chevreuil: number;
  chevre: number;
  chien: number;
  daim: number;
  ecureuil: number;
  humain: number;
  isard: number;
  lievre: number;
  marmotte: number;
  martre: number;
  oiseaux: number;
  ours: number;
  renard: number;
  rien: number;
  sanglier: number;
  tetras: number;
  vache: number;
}

export const EMPTY_PREDICTION: Prediction[] = [{fileName: 'DSC0001', preview: '', blaireau: 0, brebis: 0, cervide: 0, chat: 0,
cheval: 0, chevreuil: 0, chevre: 0, chien: 0, daim: 0, ecureuil: 0, humain: 0,
isard: 0, lievre: 0, marmotte: 0, martre: 0, oiseaux: 0, ours: 0, renard: 0,
rien: 0, sanglier: 0, tetras: 0, vache: 0}];

export const DISPLAYED_COLUMNS: string[] = [
  'fileName', 'preview', 'blaireau', 'brebis', 'cervide', 'chat', 'cheval', 'chevreuil', 'chevre',
  'chien', 'daim', 'ecureuil', 'humain', 'isard', 'lievre', 'marmotte',
'martre', 'oiseaux', 'ours', 'renard', 'rien', 'sanglier', 'tetras', 'vache'
];
