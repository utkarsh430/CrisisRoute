import { clsx, type ClassValue } from 'clsx';
import { CrisisNode, Scenario } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercent(value: number) {
  return `${(value * 100).toFixed(0)}%`;
}

export function formatDecimal(value: number, digits = 2) {
  return value.toFixed(digits);
}

export function formatRoutePath(nodeNames: string[]) {
  return nodeNames.join(' → ');
}

export function buildNodeNameLookup(scenario: Scenario) {
  const nodes: CrisisNode[] = [scenario.warehouse, ...scenario.shelters];
  return new Map(nodes.map((node) => [node.id, node.name] as const));
}
