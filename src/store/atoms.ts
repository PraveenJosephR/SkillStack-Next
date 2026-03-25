import { atom } from "recoil";

export const semplanDrawerOpenState = atom<boolean>({
  key: "semplanDrawerOpenState", 
  default: false,               
});