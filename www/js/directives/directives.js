angular.module('CardReader.directives', ['CardReader.services', 'ngCordova'])

    .directive('cardList', function(){

        return {
            restrict: 'E',
            scope: {
                cards: '=items'
            },
            controller: function($scope, $ionicActionSheet, $cordovaContacts, $ionicPopup, CardsService){

                $scope.showModal = function(card) {

                    var hideSheet = $ionicActionSheet.show({
                        buttons: [
                            { text: 'Добавить в Контакты' }
                        ],
                        cancelText: 'Отмена',
                        cancel: function () {},
                        buttonClicked: function (index) {

                            if (index === 0) {

                                var phoneNumbers = [];
                                phoneNumbers[0] = new ContactField('mobile', card.phoneNumber, false);

                                try {
                                    $cordovaContacts.save({
                                        displayName: card.name,
                                        phoneNumbers: phoneNumbers
                                    }).then(function () {
                                        $ionicPopup.alert({
                                            template: 'Новый контакт добавлен!'
                                        });
                                    }, function (err) {
                                        alert(err);
                                    });
                                } catch (e) {
                                    alert(e);
                                }

                            }

                            return true;
                        }
                    });

                };

                $scope.removeCard = function(card) {
                    CardsService.removeCard(card);
                    return true;
                };

            },
            templateUrl: 'templates/directives/card-list.html'
        }

    });