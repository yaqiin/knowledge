import { Globe, Monitor, Puzzle, Smartphone, type LucideIcon } from "lucide-react";
import type { Tool, ToolPlatform } from "@/lib/data";

/** The platform filter: chips appear in this order, and only for groups that have tools. */
export const PLATFORM_GROUPS: Record<string, { name: string; icon: LucideIcon }> = {
  mobile: { name: "هاتف", icon: Smartphone },
  desktop: { name: "حاسوب", icon: Monitor },
  browser: { name: "متصفح", icon: Puzzle },
  web: { name: "ويب", icon: Globe },
};

export const PLATFORMS: Record<ToolPlatform, { label: string; group: string }> = {
  android: { label: "Google Play", group: "mobile" },
  ios: { label: "App Store", group: "mobile" },
  windows: { label: "ويندوز", group: "desktop" },
  mac: { label: "ماك", group: "desktop" },
  linux: { label: "لينكس", group: "desktop" },
  chrome: { label: "Chrome", group: "browser" },
  firefox: { label: "Firefox", group: "browser" },
  edge: { label: "Edge", group: "browser" },
  web: { label: "الموقع", group: "web" },
  telegram: { label: "تيليجرام", group: "web" },
};

export const inGroup = (tool: Tool, group: string) => tool.links.some(link => PLATFORMS[link.platform].group === group);
