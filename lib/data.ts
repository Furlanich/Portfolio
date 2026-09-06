import about from '@/data/about.json';
import skills from '@/data/skills.json';
import experience from '@/data/experience.json';
import education from '@/data/education.json';
import type { AboutMe, Education, Experience, Skill } from '@/lib/types';

export const aboutData = about as AboutMe;
export const skillsData = skills as Skill[];
export const experienceData = experience as Experience[];
export const educationData = education as Education[];
