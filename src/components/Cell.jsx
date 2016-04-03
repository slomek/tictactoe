import React from 'react';

import {GameActions} from '../game/game.actions';

let Cell = React.createClass({

    mark() {
        let {row, col} = this.props;
        GameActions.userMove(row, col);
    },

    render: function () {
        let {value} = this.props;

        return (
            <div className={`cell marked-cell-${value}`} onClick={this.mark}></div>
        );
    }
});

export {Cell};