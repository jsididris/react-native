/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

const mockComponent = require.requireActual('./mockComponent');

require.requireActual('../Libraries/polyfills/babelHelpers.js');
require.requireActual('../Libraries/polyfills/Object.es7.js');
require.requireActual('../Libraries/polyfills/error-guard');

global.__DEV__ = true;

global.Promise = require.requireActual('promise');
global.regeneratorRuntime = require.requireActual('regenerator-runtime/runtime');

global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
};
global.cancelAnimationFrame = function(id) {
  clearTimeout(id);
};

jest
  .mock('../Libraries/Core/Devtools/setupDevtools')
  .mock('npmlog');

// there's a __mock__ for it.
jest.setMock('../Libraries/vendor/core/ErrorUtils', require('../Libraries/vendor/core/ErrorUtils'));

jest
  .mock('../Libraries/Core/InitializeCore')
  .mock('../Libraries/Image/Image', () => mockComponent('../Libraries/Image/Image'))
  .mock('../Libraries/Text/Text', () => mockComponent('../Libraries/Text/Text'))
  .mock('../Libraries/Components/TextInput/TextInput', () => mockComponent('../Libraries/Components/TextInput/TextInput'))
  .mock('../Libraries/Modal/Modal', () => mockComponent('../Libraries/Modal/Modal'))
  .mock('../Libraries/Components/View/View', () => mockComponent('../Libraries/Components/View/View'))
  .mock('../Libraries/Components/RefreshControl/RefreshControl', () => require.requireMock('RefreshControlMock'))
  .mock('../Libraries/Components/ScrollView/ScrollView', () => require.requireMock('ScrollViewMock'))
  .mock(
    '../Libraries/Components/ActivityIndicator/ActivityIndicator',
    () => mockComponent('../Libraries/Components/ActivityIndicator/ActivityIndicator'),
  )
  .mock('../Libraries/Lists/ListView/ListView', () => require.requireMock('ListViewMock'))
  .mock('../Libraries/Lists/ListView/ListViewDataSource', () => {
    const DataSource = require.requireActual('../Libraries/Lists/ListView/ListViewDataSource');
    DataSource.prototype.toJSON = function() {
      function ListViewDataSource(dataBlob) {
        this.items = 0;
        // Ensure this doesn't throw.
        try {
          Object.keys(dataBlob).forEach(key => {
            this.items += dataBlob[key] && (
              dataBlob[key].length || dataBlob[key].size || 0
            );
          });
        } catch (e) {
          this.items = 'unknown';
        }
      }

      return new ListViewDataSource(this._dataBlob);
    };
    return DataSource;
  })
  .mock('../Libraries/Components/Touchable/ensureComponentIsNative', () => () => true);

const mockEmptyObject = {};
const mockNativeModules = {
  AlertManager: {
    alertWithArgs: jest.fn(),
  },
  AppState: {
    addEventListener: jest.fn(),
  },
  AsyncLocalStorage: {
    multiGet: jest.fn((keys, callback) => process.nextTick(() => callback(null, []))),
    multiSet: jest.fn((entries, callback) => process.nextTick(() => callback(null))),
    multiRemove: jest.fn((keys, callback) => process.nextTick(() => callback(null))),
    multiMerge: jest.fn((entries, callback) => process.nextTick(() => callback(null))),
    clear: jest.fn(callback => process.nextTick(() => callback(null))),
    getAllKeys: jest.fn(callback => process.nextTick(() => callback(null, []))),
  },
  BuildInfo: {
    appVersion: '0',
    buildVersion: '0',
  },
  Clipboard: {
    setString: jest.fn(),
  },
  DataManager: {
    queryData: jest.fn(),
  },
  DeviceInfo: {
    Dimensions: {
      window: {
        fontScale: 2,
        height: 1334,
        scale: 2,
        width: 750,
      },
    },
  },
  FacebookSDK: {
    login: jest.fn(),
    logout: jest.fn(),
    queryGraphPath: jest.fn((path, method, params, callback) => callback()),
  },
  FbRelayNativeAdapter: {
    updateCLC: jest.fn(),
  },
  GraphPhotoUpload: {
    upload: jest.fn(),
  },
  I18n: {
    translationsDictionary: JSON.stringify({
      'Good bye, {name}!|Bye message': '\u{00A1}Adi\u{00F3}s {name}!',
    }),
  },
  ImageLoader: {
    getSize: jest.fn(
      (url) => new Promise(() => ({width: 320, height: 240}))
    ),
    prefetchImage: jest.fn(),
  },
  ImageViewManager: {
    getSize: jest.fn(
      (uri, success) => process.nextTick(() => success(320, 240))
    ),
    prefetchImage: jest.fn(),
  },
  KeyboardObserver: {
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
  Linking: {
    openURL: jest.fn(),
    canOpenURL: jest.fn(
      () => new Promise((resolve) => resolve(true))
    ),
    addEventListener: jest.fn(),
    getInitialURL: jest.fn(
      () => new Promise((resolve) => resolve())
    ),
    removeEventListener: jest.fn(),
  },
  LocationObserver: {
    getCurrentPosition: jest.fn(),
    startObserving: jest.fn(),
    stopObserving: jest.fn(),
  },
  ModalFullscreenViewManager: {},
  NetInfo: {
    fetch: jest.fn(
      () => new Promise((resolve) => resolve())
    ),
    addEventListener: jest.fn(),
    isConnected: {
      fetch: jest.fn(
        () => new Promise((resolve) => resolve())
      ),
      addEventListener: jest.fn(),
    },
  },
  Networking: {
    sendRequest: jest.fn(),
    abortRequest: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
  PushNotificationManager: {
    presentLocalNotification: jest.fn(),
    scheduleLocalNotification: jest.fn(),
    cancelAllLocalNotifications: jest.fn(),
    removeAllDeliveredNotifications: jest.fn(),
    getDeliveredNotifications: jest.fn(callback => process.nextTick(() => [])),
    removeDeliveredNotifications: jest.fn(),
    setApplicationIconBadgeNumber: jest.fn(),
    getApplicationIconBadgeNumber: jest.fn(callback => process.nextTick(() => callback(0))),
    cancelLocalNotifications: jest.fn(),
    getScheduledLocalNotifications: jest.fn(callback => process.nextTick(() => callback())),
    requestPermissions: jest.fn(() => Promise.resolve({alert: true, badge: true, sound: true})),
    abandonPermissions: jest.fn(),
    checkPermissions: jest.fn(callback => process.nextTick(() => callback({alert: true, badge: true, sound: true}))),
    getInitialNotification: jest.fn(() => Promise.resolve(null)),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
  SourceCode: {
    scriptURL: null,
  },
  StatusBarManager: {
    setColor: jest.fn(),
    setStyle: jest.fn(),
    setHidden: jest.fn(),
    setNetworkActivityIndicatorVisible: jest.fn(),
    setBackgroundColor: jest.fn(),
    setTranslucent: jest.fn(),
  },
  Timing: {
    createTimer: jest.fn(),
    deleteTimer: jest.fn(),
  },
  UIManager: {
    AndroidViewPager: {
      Commands: {
        setPage: jest.fn(),
        setPageWithoutAnimation: jest.fn(),
      },
    },
    blur: jest.fn(),
    createView: jest.fn(),
    dispatchViewManagerCommand: jest.fn(),
    focus: jest.fn(),
    setChildren: jest.fn(),
    manageChildren: jest.fn(),
    updateView: jest.fn(),
    removeSubviewsFromContainerWithID: jest.fn(),
    replaceExistingNonRootView: jest.fn(),
    customBubblingEventTypes: {},
    customDirectEventTypes: {},
    AndroidTextInput: {
      Commands: {},
    },
    ModalFullscreenView: {
      Constants: {},
    },
    ScrollView: {
      Constants: {},
    },
    View: {
      Constants: {},
    },
  },
  BlobModule: {
    BLOB_URI_SCHEME: 'content',
    BLOB_URI_HOST: null,
    enableBlobSupport: jest.fn(),
    disableBlobSupport: jest.fn(),
    createFromParts: jest.fn(),
    sendBlob: jest.fn(),
    release: jest.fn(),
  },
  WebSocketModule: {
    connect: jest.fn(),
    send: jest.fn(),
    sendBinary: jest.fn(),
    ping: jest.fn(),
    close: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
};

const mockNativeModuleJS = {
  '../Libraries/AppState/AppState': mockNativeModules.AppState,
  '../Libraries/Components/Clipboard/Clipboard': mockNativeModules.Clipboard,
  '../Libraries/Utilities/DeviceInfo': mockNativeModules.DeviceInfo,
  '../Libraries/Linking/Linking': mockNativeModules.Linking,
  '../Libraries/Network/NetInfo': mockNativeModules.NetInfo,
  '../Libraries/ReactNative/UIManager': mockNativeModules.UIManager,
};

const allRNMocks = {...mockNativeModules, ...mockNativeModuleJS};

Object.keys(allRNMocks).forEach(module => {
  try {
    jest.doMock(module, () => allRNMocks[module]); // needed by FacebookSDK-test
  } catch (e) {
    jest.doMock(module, () => allRNMocks[module], {virtual: true});
  }
});

jest
  .doMock('../Libraries/BatchedBridge/NativeModules', () => mockNativeModules)
  .doMock('../Libraries/Renderer/shims/ReactNativePropRegistry', () => ({
    register: id => id,
    getByID: () => mockEmptyObject,
  }));

jest.doMock('../Libraries/ReactNative/requireNativeComponent', () => {
  const React = require('react');

  return viewName => props => React.createElement(
    viewName,
    props,
    props.children,
  );
});
