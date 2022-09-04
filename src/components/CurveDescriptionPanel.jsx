import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Typography} from "@material-ui/core";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import React, {Component} from "react";

class CurveDescriptionPanel extends Component {
    render() {
        const {title = "", description = ""} = this.props;
        return (
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography variant="h5">{title}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography>
                        {description}
                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

export default CurveDescriptionPanel;