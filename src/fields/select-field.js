import React from 'react';
import { Select } from 'antd';

import CommonField from './common-field';
import attach from '../attach';
import DisplayValueTypography from './display-value-typography';
//import MaskedInput from 'react-text-mask';

const Option = Select.Option;

class SelectField extends React.PureComponent {
  constructor(props) {
    super(props);

    // Create a custom TextMask component. This is done once in the constructor so that it is not
    // done in each call to render()
    /* this.TextMaskCustom = props => {
      const { inputRef, ...other } = props;
      const { mask } = this.props;

      return <MaskedInput {...other} ref={inputRef} mask={mask} />;
    }; */
  }

  handleChange(value) {
    this.props.component.setValue(value);
  }

  handleFocus() {
    this.setState({ focus: true });
  }

  handleBlur() {
    this.setState({ focus: false });
    this.props.component.setTouched(true);
  }

  renderOptions() {
    const { options, blankString, value, multiple } = this.props;

    if (options) {
      let opts = [];

      if (!multiple && blankString) {
        // Note: the blankString doesn't make sense when we allow multiple selections
        opts.push(
          <Option value="" key="">
            {blankString}
          </Option>
        );
      }

      options.forEach(option => {
        if (multiple) {
          //const checked = value ? value.indexOf(option.value) !== -1 : false;
          opts.push(
            <Option key={option.value} value={option.value}>
              {option.value}
            </Option>
          );
        } else {
          opts.push(
            <Option key={option.value} value={option.value}>
              {option.value}
            </Option>
          );
        }
      });

      return opts;
    }
  }

  render() {
    const {
      value,
      err,
      touched,
      disabled,
      component,
      fullWidth,
      classes,
      editable,
      multiple,
      accessEditable,
      useDisplayValue,
      options,
      autocomplete
    } = this.props;

    const dis = accessEditable === false || disabled;

    let fld = null;
    if (editable && !useDisplayValue) {
      const optional = {};
      /* if (mask) {
        optional.inputComponent = this.TextMaskCustom;
      } */
      //const uiValue = component.getUIValue();

      fld = (
        <Select
          mode={multiple ? 'multiple' : null}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
          options={options}
          isClearable={true}
          placeholder=""
          onChange={value => this.handleChange(value)}
          onBlur={() => this.handleBlur()}
          onFocus={() => this.handleFocus()}
          value={value}
          isDisabled={dis}
          //fullWidth={fullWidth}
          isMulti={multiple}
        >
          {this.renderOptions()}
        </Select>
      );
    } /* else {
      fld = (
        <DisplayValueTypography>
          {displayValue ? displayValue : component.getDisplayValue()}
        </DisplayValueTypography>
      );
    }
 */
    return <CommonField component={component}>{fld}</CommonField>;
  }
}

export default attach([
  'value',
  'err',
  'options',
  'touched',
  'blankString',
  'disabled',
  'fullWidth',
  'editable',
  'multiple',
  'useDisplayValue',
  'autocomplete'
])(SelectField);
