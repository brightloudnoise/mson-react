import React from 'react';
import { Checkbox } from 'antd';
//import Switch from '@material-ui/core/Switch';
import CommonField from './common-field';
import attach from '../attach';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DisplayValueTypography from './display-value-typography';

class BooleanField extends React.PureComponent {
  handleChange = event => {
    this.props.component.setValue(event.target.checked);
  };

  render() {
    const {
      value,
      disabled,
      component,
      editable,
      useDisplayValue,
      label
    } = this.props;

    let hideLabelUI = null;

    let fld = null;
    if (editable && !useDisplayValue) {
      hideLabelUI = true;
      fld = (
        <FormControlLabel
          control={
            <Checkbox
              checked={value ? value : false}
              onChange={this.handleChange}
              value="true"
              disabled={disabled}
            />
          }
          label={label}
        />
      );
    } else {
      fld = (
        <DisplayValueTypography>
          {component.getDisplayValue()}
        </DisplayValueTypography>
      );
    }

    return (
      <CommonField component={component} hideLabelUI={hideLabelUI}>
        {fld}
      </CommonField>
    );
  }
}

export default attach([
  'value',
  'err',
  'disabled',
  'editable',
  'useDisplayValue',
  'label'
])(BooleanField);
