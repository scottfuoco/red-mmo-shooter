import React from 'react';
import ReactDOM from 'react-dom';
import App from '../imports/ui/containers/App';
import './main.css';

import { Meteor } from 'meteor/meteor';

Meteor._debug = (function (super_meteor_debug) {
  return function (error, info) {
    if (!(info && _.has(info, 'msg')))
      super_meteor_debug(error, info);
  }
})(Meteor._debug);

Meteor.startup(() => {
  ReactDOM.render(
    <App />,
    document.getElementById('app-root')
  )
});