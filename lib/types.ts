export interface Image {
  path: string;
  alt: string;
}

export interface SocialMedia {
  url: string;
  alt: string;
  image: Image;
}

export interface LocalizedString {
  en: string;
  es: string;
}

export interface AboutMe {
  name: string;
  presentation: LocalizedString;
  phone: string;
  email: string;
  cvPath: string;
  socialMedia: SocialMedia[];
}

export interface Skill {
  title: string;
  icons: Image[];
}

export interface Experience {
  title: LocalizedString;
  description: LocalizedString;
  date: string;
}

export interface Education {
  title: LocalizedString;
  institution: LocalizedString;
  date: string;
}

export interface Project {
  title: LocalizedString;
  description: LocalizedString;
  technologies: string[];
  previewImage: Image;
}