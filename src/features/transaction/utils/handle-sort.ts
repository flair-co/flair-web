import {SortingState} from '@tanstack/react-table';

import {SortField, SortOrder, TransactionSortParams} from '../types/search-params';

export function createSortingHandler(
  setSort: React.Dispatch<React.SetStateAction<TransactionSortParams>>,
) {
  return (updaterOrValue: SortingState | ((prev: SortingState) => SortingState)) => {
    setSort((prevSort) => {
      const currentSortingState = mapSortToSortingState(prevSort);
      const newSortingState =
        typeof updaterOrValue === 'function' ? updaterOrValue(currentSortingState) : updaterOrValue;
      return mapSortingStateToSort(newSortingState);
    });
  };
}

export function mapSortToSortingState(sort: TransactionSortParams): SortingState {
  if (sort && sort.by && sort.order) {
    return [{id: sort.by, desc: sort.order === SortOrder.DESC}];
  }
  return [];
}

function mapSortingStateToSort(sortingState: SortingState): TransactionSortParams {
  if (sortingState.length > 0) {
    const s = sortingState[0];
    return {by: s.id as SortField, order: s.desc ? SortOrder.DESC : SortOrder.ASC};
  }
  return {by: SortField.STARTED_AT, order: SortOrder.DESC};
}
