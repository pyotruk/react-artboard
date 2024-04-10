import { configureStore, combineReducers, ThunkAction, Action } from '@reduxjs/toolkit';
import { layerOptionsSlice, TLayerSliceState } from 'features/layer/layerOptionsSlice';

export const store = configureStore({
  reducer: combineReducers({
    layer: layerOptionsSlice.reducer,
  }),
});

export type AppDispatch = typeof store.dispatch;

export type RootState = {
  layer: TLayerSliceState;
};

export type AppThunk<ReturnType = void> = ThunkAction<
ReturnType,
RootState,
unknown,
Action<string>
>;
