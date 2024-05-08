import { createUseStyles } from 'react-jss';

const styles = createUseStyles(({
  viewWrapper: {
    display: 'flex',
    flexDirection: 'row-reverse',
    width: '100%',
    height: '100%',
    backgroundColor: 'lightgray',
    userSelect: 'none',
  },
  view: {
    height: '100vh',
    position: 'relative',
    width: '100%',
    touchAction: 'none',
  },
  drawingCanvas: {
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    cursor: 'crosshair',
  },
}), { name: 'App' });

export default styles;
