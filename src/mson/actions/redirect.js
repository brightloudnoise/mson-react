import Action from './action';
import globals from '../globals';

export default class Redirect extends Action {
  _create(props) {
    super._create(props);

    this.set({
      props: ['path']
    });

    this._setDefaults(props, { layer: 'frontEnd' });
  }

  async act() {
    globals.redirect(this.get('path'));
  }
}
