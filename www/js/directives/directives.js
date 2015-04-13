angular.module('CardReader.directives', ['CardReader.services'])

    .directive('cardList', function(){
        return {
            restrict: 'E',
            scope: {
                cards: '=items'
            },
            controller: function($scope, $ionicActionSheet, $cordovaContacts, CardsService){

                $scope.click = function(card) {

                    var hideSheet = $ionicActionSheet.show({
                        buttons: [
                            //{ text: 'Добавить в Контакты' }
                        ],
                        destructiveText: 'Удалить',
                        destructiveButtonClicked: function() {
                            CardsService.removeCard(card);
                            return true;
                        },
                        cancelText: 'Отмена',
                        cancel: function () {},
                        buttonClicked: function (index) {

                            if (index === 0) {
                                $cordovaContacts.save({
                                    displayName: card.name,
                                    phoneNumbers: card.phoneNumbers
                                }).then(function() {
                                    alert('Сохранено!');
                                }, function(err) {
                                    alert(err);
                                });
                            }

                            return true;
                        }
                    });

                };

            },
            templateUrl: 'templates/directives/card-list.html'
        }
    });