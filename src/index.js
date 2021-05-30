import 'regenerator-runtime/runtime'
import { create as createMap } from './components/google-map';

import './main.less';
window.handleGoogleMapReady = async function() {
  try {
    await createMap(document.querySelector('#map'));
  } catch (err) {
    console.error(err);
  }
}