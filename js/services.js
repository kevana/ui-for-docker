'use strict';

angular.module('dockerui.services', ['ngResource'])
    .factory('Engine', function ($resource, Settings) {
        return $resource(Settings.url + '/engines', {}, {
            get: {
                method: 'GET',
                isArray: true
            }
        });
    })
    .factory('Container', function ($resource, Settings) {
        return $resource(Settings.url + '/containers', {
            name: '@name'
        }, {
            query: {
                method: 'GET',
                params: {
                    all: 0,
                },
                isArray: true
            }
        });
    })
    .factory('Image', function ($resource, Settings) {
        // Resource for docker images
        // http://docs.docker.io/en/latest/api/docker_remote_api.html#images
        return $resource(Settings.url + '/images/:id/:action', {}, {
            query: {
                method: 'GET',
                params: {
                    all: 0,
                    action: 'json'
                },
                isArray: true
            },
            get: {
                method: 'GET',
                params: {
                    action: 'json'
                }
            },
            history: {
                method: 'GET',
                params: {
                    action: 'history'
                },
                isArray: true
            },
            create: {
                method: 'POST',
                params: {
                    action: 'create'
                }
            },
            remove: {
                method: 'DELETE',
                params: {
                    id: '@id'
                },
                isArray: true
            }
        });
    })
    .factory('Docker', function ($resource, Settings) {
        // Information for docker
        // http://docs.docker.io/en/latest/api/docker_remote_api.html#display-system-wide-information
        return $resource(Settings.url + '/version', {}, {
            get: {
                method: 'GET'
            }
        });
    })
    .factory('System', function ($resource, Settings) {
        // System for docker
        // http://docs.docker.io/en/latest/api/docker_remote_api.html#display-system-wide-information
        return $resource(Settings.url + '/info', {}, {
            get: {
                method: 'GET'
            }
        });
    })
    .factory('Settings', function (UI_VERSION) {
        return {
            displayAll: false,
            uiVersion: UI_VERSION,
            url: "/api/",
        };
    })
    .factory('ViewSpinner', function () {
        var spinner = new Spinner();
        var target = document.getElementById('view');

        return {
            spin: function () {
                spinner.spin(target);
            },
            stop: function () {
                spinner.stop();
            }
        };
    })
    .factory('Messages', function ($rootScope) {
        return {
            send: function (title, text) {
                $.gritter.add({
                    title: title,
                    text: text,
                    time: 2000,
                    before_open: function () {
                        if ($('.gritter-item-wrapper').length == 3) {
                            return false;
                        }
                    }

                });
            },
            error: function (title, text) {
                $.gritter.add({
                    title: title,
                    text: text,
                    time: 6000,
                    before_open: function () {
                        if ($('.gritter-item-wrapper').length == 4) {
                            return false;
                        }
                    }
                });
            }
        };
    });