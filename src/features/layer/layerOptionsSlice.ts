/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'shared/redux/store';

export type TLayerSliceState = {
  zoomScaleFactor: number;
};

export const initialLayerSliceState: TLayerSliceState = {
  zoomScaleFactor: 1,
};

export const layerOptionsSlice = createSlice({
  name: 'layer',
  initialState: initialLayerSliceState,
  reducers: {
    setScaleFactor: (state, action: PayloadAction<number>) => {
      state.zoomScaleFactor = action.payload;
    },
  },
});

export const {
  setScaleFactor,
} = layerOptionsSlice.actions;
export const getScaleFactor = (state: RootState) => Number(state.layer.zoomScaleFactor.toFixed(2));
