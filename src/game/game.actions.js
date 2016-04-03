import Reflux from 'reflux';

let GameActions = Reflux.createActions([
    "startGame",
    "userMove",
    "cpuMove"
]);

export {GameActions};