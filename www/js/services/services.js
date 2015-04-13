angular.module('CardReader.services', [])

    .service('cameraService', function($cordovaCamera, $q) {

        this._getPhoto = function(params) {

            var deferred = $q.defer(),
                options = {
                    quality: 100,
                    destinationType: Camera.DestinationType.FILE_URI, //Camera.DestinationType.DATA_URL
                    sourceType: params.sourceType,
                    saveToPhotoAlbum: params.saveToPhotoAlbum,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG
                };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                deferred.resolve(imageData);
            }, function(err) {
                deferred.reject(err);
            });

            return deferred.promise;

        };

        this.takePhoto = function() {

            return this._getPhoto({
                sourceType: Camera.PictureSourceType.CAMERA,
                saveToPhotoAlbum: true //ADd
            });

        };

        this.fetchPhoto = function() {

            return this._getPhoto({
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                saveToPhotoAlbum: false
            });

        };

    })

    .factory('CardsService', ['localStorage', 'Utils', function(localStorage, Utils) {

        var Data = {
            cards: localStorage.getObject('cards').length ? localStorage.getObject('cards') : []
        };

        return {

            getCards: function() {
                return Data.cards;
            },

            addCard: function(cardInfo) {

                cardInfo.id = Utils.guidGenerator();

                Data.cards.unshift(cardInfo);
                localStorage.setObject('cards', Data.cards);

            },

            removeCard: function(cardInfo) {
                Data.cards.splice(Data.cards.indexOf(cardInfo), 1);
                localStorage.setObject('cards', Data.cards);
            },

            updateCard: function(cardInfo) {
                Data.cards[Data.cards.indexOf(cardInfo)].name = cardInfo.name;
            }

        };

    }])

    .factory('LoadingService', ['$ionicLoading', function($ionicLoading) {

        var defaultLoadingInstance = {
            template: 'Загрузка...',
            noBackdrop: true,
            duration : 10000
        };

        return {

            show: function(params) {

                params = params || {};

                return $ionicLoading.show(angular.extend(defaultLoadingInstance, params));

            },

            hide: function() {
                $ionicLoading.hide();
            }

        }

    }])

    .service('ocrService', function($q) {

        this.getNumbersFromImage = function(imageInstance) {

            var deferred = $q.defer();

            try {
                OCRAD(imageInstance, {
                    numeric: true
                }, function (text) {
                    deferred.resolve(text);
                });
            } catch (err) {
                deferred.reject(err);
            }

            return deferred.promise;

        }

    })

    .factory('Utils', function() {

        return {

            guidGenerator: function () {

                var S4 = function() {
                    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
                };

                return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
            }

        }

    })

    .factory('localStorage', function($window) {

        return {

            /**
             * Записать строку
             * @param {String} key ключ
             * @param {String} value значение
             */
            set: function(key, value) {
                $window.localStorage[key] = value;
            },

            /**
             * Получить значение по ключу
             * @param {String} key ключ поиска
             * @param {String} defaultValue значение по ключу если иного не имеется
             * @returns {String} значение || defaultValue
             */
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },

            /**
             * Записать объект
             * @param {String} key ключ
             * @param {Object} value объект
             */
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },

            /**
             * Получить объект по ключу
             * @param {String} key ключ поиска
             * @returns {Object} значение || {}
             */
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },

            clearAllInformation: function() {
                $window.localStorage.clear();
            }

        }
    });