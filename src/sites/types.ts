import { BadgeInfo } from "../types";

export type InsertContext = {
  badge: BadgeInfo;
  badgeImg: HTMLImageElement;
};

export interface SiteHandler {
  id: string;
  url: string | RegExp;
  unwrap?(href: string): string;
  insert?(ctx: InsertContext): void;
}
