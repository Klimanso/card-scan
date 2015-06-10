angular.module('CardReader.controllers', ['CardReader.services'])

    .controller('MainController', function($scope, $ionicModal, $timeout) {})


    .controller('NewCardModalController', ['$scope', 'CardsService', function($scope, CardsService) {

        init();

        function init() {

            $scope.Contact = {
                name: '',
                lastname: '',
                number: $scope.number
            };

        }

        $scope.isValid = function() {
            return Boolean(($scope.Contact.name || $scope.Contact.lastname) && $scope.number);
        };

        $scope.close = function() {
            $scope.modal.remove();
        };

        $scope.saveData = function() {

            CardsService.addCard({
                name: $scope.Contact.name + ' ' + $scope.Contact.lastname,
                phoneNumber: $scope.Contact.number,
                imageData: $scope.imageData
            });

            $scope.number = '';
            $scope.modal.remove();

        };

    }])

    .controller('SettingsController', ['$scope', 'localStorage', function($scope, localStorage) {

        $scope.savingPhoto = {
            checked: localStorage.get('savingPhoto')
                ? localStorage.get('savingPhoto') === 'true'
                : true
        };

        $scope.savingPhotoChange = function() {
            localStorage.set('savingPhoto', $scope.savingPhoto.checked);
        };

    }])

    .controller('CardsMenuController', function($scope, $stateParams, $ionicModal, $cordovaVibration, CardsService, LoadingService, cameraService, ocrService) {

        init();

        function init() {
            $scope.cards = CardsService.getCards();
        }

        $scope.recognize = function(imageData) {

            $scope.imageData = imageData;

            var img = new Image();
            img.src = $scope.imageData;

            LoadingService.show();

            img.onload = function() {

                ocrService.getNumbersFromImage(img).then(function(number) {

                    $scope.number = parseInt(number.replace( /\D+/g, ''));

                    $ionicModal.fromTemplateUrl('templates/modals/new-card.html', {
                        scope: $scope
                    }).then(function(modal) {

                        $scope.modal = modal;

                        $cordovaVibration.vibrate(200);
                        $scope.modal.show();

                        LoadingService.hide();

                    });

                });

            };

        };

        $scope.takePhoto = function() {
            cameraService.takePhoto().then($scope.recognize);
        };

        $scope.fetchPhoto = function() {
            cameraService.fetchPhoto().then($scope.recognize);
        };

        $scope.$on('$destroy', function() {
            $scope.modal && $scope.modal.remove();
        });

    });