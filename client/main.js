import React from 'react';
import ReactDOM from 'react-dom';
import App from '../imports/ui/containers/App';
import './main.css';

import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  ReactDOM.render(
    <App />,
    document.getElementById('app-root')
  )
});