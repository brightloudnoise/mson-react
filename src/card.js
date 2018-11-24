import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Card as BVCard } from 'antd';
//import Grid from "@material-ui/core/Grid";
//import Paper from "@material-ui/core/Paper";
import Component from './component';
//import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  paper: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit * 2
  },
  content: {
    flex: 1 // TODO: needed?
  }
});

class Card extends React.PureComponent {
  render() {
    const { classes, component } = this.props;

    const content = component.get('content');
    const title = component.get('title');

    return (
      <BVCard title={title} extra={<a href="#">More</a>}>
        <Component component={content} />
      </BVCard>
    );
  }
}

export default withStyles(styles)(Card);
