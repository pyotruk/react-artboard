/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'shared/redux/store';

import { Size } from 'utils/types';

export type Artboard = {
  dataURL: string;
  size: Size;
};

export type TLayerSliceState = {
  artboard: Artboard;
  zoomScaleFactor: number;
};

export const defaultArtboard: Artboard = {
  dataURL: 'https://picsum.photos/200/300',
  size: {
    width: 400,
    height: 400,
  },
};

export const initialLayerSliceState: TLayerSliceState = {
  artboard: defaultArtboard,
  zoomScaleFactor: 1,
};

export const layerOptionsSlice = createSlice({
  name: 'layer',
  initialState: initialLayerSliceState,
  reducers: {
    setScaleFactor: (state, action: PayloadAction<number>) => {
      state.zoomScaleFactor = action.payload;
    },
    setArtboard: (state, { payload }: PayloadAction<Artboard>) => {
      Object.assign(state.artboard.size, payload.size);
      state.artboard.dataURL = payload.dataURL;
    },
  },
});

export const {
  setScaleFactor,
  setArtboard,
} = layerOptionsSlice.actions;
export const getScaleFactor = (state: RootState) => Number(state.layer.zoomScaleFactor.toFixed(2));
export const getArtboardDataURL = (state: RootState) => state.layer.artboard.dataURL;
export const getArtboardSize = (state: RootState) => state.layer.artboard.size;
