import { createUseStyles } from 'react-jss';

const scrollbar = {
  content: '""',
  position: 'absolute',
  zIndex: 1,
  backgroundColor: 'lightgray',
};

const scrollbarThickness = 12;
const scrollerMargin = 3;

const styles = createUseStyles({
  scrollPane: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    touchAction: 'none',
  },
  artboard: {
    position: 'absolute',
    backgroundColor: 'white',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: 'auto',
    maxHeight: '80vh',
  },
  verticalScroll: {
    ...scrollbar,
    width: scrollbarThickness,
    height: '100%',
    right: 0,
  },
  horizontalScroll: {
    ...scrollbar,
    width: '100%',
    height: scrollbarThickness,
    bottom: 0,
  },
  scroller: {
    content: '""',
    display: 'block',
    width: scrollbarThickness - 2 * scrollerMargin,
    height: scrollbarThickness - 2 * scrollerMargin,
    margin: scrollerMargin,
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'magenta',
    borderRadius: 4,
  },
}, {
  name: 'Artboard',
});

export default styles;
