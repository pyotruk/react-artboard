import { createUseStyles } from 'react-jss';

const styles = createUseStyles(({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 2,
    position: 'absolute',
    bottom: '1em',
    right: '7em',
    width: '124px',
    height: '40px',
    background: 'transparent',
  },
  zoomButton: {
    background: 'white',
    width: '36px',
    height: '36px',
    borderRadius: 8,
  },
  zoomInput: {
    background: 'inherit',
    border: 'none',
    width: '40px',
    height: '100%',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
}), {
  name: 'ZoomControls',
});

export default styles;
