import {
  ArrowDownUp,
  ArrowUpDown,
  Binary,
  CalendarRange,
  CircleHelp,
  GitBranch,
  GitFork,
  Grid3x3,
  Layers,
  Link2,
  ListOrdered,
  Network,
  Search,
  TreePine,
  TrendingUp,
  Type,
  type LucideIcon,
} from "lucide-react";

/** Maps a topic's stored icon name (see db seed data) to its lucide-react component. */
const TOPIC_ICONS: Record<string, LucideIcon> = {
  ListOrdered,
  Link2,
  Type,
  Layers,
  ArrowUpDown,
  Search,
  ArrowDownUp,
  TrendingUp,
  GitBranch,
  Binary,
  CalendarRange,
  Network,
  TreePine,
  Grid3x3,
  GitFork,
};

export function getTopicIcon(name: string): LucideIcon {
  return TOPIC_ICONS[name] ?? CircleHelp;
}
