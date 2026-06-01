export interface Verse {
  id: number;
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  translation: string;
  purport: string;
}

export interface ChapterMeta {
  num: number;
  name: string;
  subtitle: string;
  verses: number;
}

export interface Legend {
  name: string;
  desc: string;
  img: string;
}

export interface Author {
  name: string;
  role: string;
  desc: string;
}

export interface BenefitCard {
  icon: string;
  title: string;
  desc: string;
}

export interface TributeCard {
  name: string;
  profession: string;
  quote: string;
}

export interface PodcastCard {
  name: string;
  title: string;
  url: string;
}

export interface BookCard {
  author: string;
  title: string;
  desc: string;
  url: string;
  cover: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
