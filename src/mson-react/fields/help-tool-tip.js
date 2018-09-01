// TODO: make full width of field include right margin if there is help?

import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import HelpOutline from '@material-ui/icons/HelpOutline';

export default class HelpToolTip extends React.PureComponent {
  render() {
    const { help } = this.props;
    return (
      <Tooltip title={help}>
        <IconButton aria-label="Help">
          <HelpOutline />
        </IconButton>
      </Tooltip>
    );
  }
}
