export enum EVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  UNLISTED = 'UNLISTED'
}

export const visibilityFromValue = (value: string): EVisibility | null => {
  const matchingVisibility = Object.values(EVisibility).find((visibility) => visibility === value);
  return matchingVisibility ? (matchingVisibility as EVisibility) : null;
};
