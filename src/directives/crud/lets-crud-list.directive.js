(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('crudList', crudList);

    crudList.$inject = ['$window', 'jQuery', 'Backbone', 'Backgrid', 'appSettings', 'fwObjectService'];

    function crudList($window, jQuery, Backbone, Backgrid, appSettings, fwObjectService) {
        return {
            scope: {
                crudListSettings: '&',
                crudListDependenciesData: '&',
                app: '=',
            },
            controller: function ($scope) {
                $scope.route = null;

                $scope.$on('refreshGRID', function (event, params) {
                    $scope.pageableCRUDModel.fetch(params);
                });
            },
            link: function (scope, $el, attrs) {

                scope.$el = $el;

                function render() {
                    var settings = scope.crudListSettings();
                    settings.route = appSettings.API_URL + settings.url;
                    scope.route = settings.route;

                    Backgrid.InputCellEditor.prototype.attributes.class = 'form-control input-sm';

                    var CRUDModel = Backbone.Model.extend({});

                    var paramsPageable = {
                        model: CRUDModel,
                        url: settings.route + (!settings.pagerGeneral ? '/pager' : '/pagerGeneral'),
                        state: {
                            pageSize: 20
                        },
                        mode: 'server',
                        parseRecords: function (resp, options) {
                            return resp.data;
                        },
                        parseState: function (resp, queryParams, state, options) {
                            return { totalRecords: resp.total_count };
                        },
                    };
                    
                    if (settings.filterScope){
                        paramsPageable.queryParams = {
                            scope: settings.filterScope
                        };
                    }

                    if (settings.sort){
                        paramsPageable.state.sortKey = settings.sort.sortKey;
                        if (settings.sort.order && settings.sort.order=="desc"){
                            paramsPageable.state.order = 1;
                        }
                    }

                    var PageableCRUDModel = Backbone.PageableCollection.extend(paramsPageable);

                    var pageableCRUDModel = new PageableCRUDModel(),
                        initialCRUDModel = pageableCRUDModel;

                    scope.pageableCRUDModel = pageableCRUDModel;

                    function createBackgrid(collection) {
                        var columns = [];

                        var StringFormatter = function () {};
                        StringFormatter.prototype = new Backgrid.StringFormatter();

                        _.extend(StringFormatter.prototype, {
                            fromRaw: function (rawValue, b, c, d, e) {
                                return rawValue;
                            }
                        });

                        _.each(settings.fields, function (field, idx) {

                            if (field.viewable) {
                                var cellOptions = {
                                    name: field.name,
                                    label: field.label,
                                    cell: 'string',
                                    editable: false,
                                    headers: field
                                };

                                if (field.type == 'boolean') {
                                    cellOptions.sortable = false;
                                    cellOptions.cell = Backgrid.Cell.extend({
                                        className: "custom-situation-cell",
                                        formatter: {
                                            fromRaw: function (rawData, model) {
                                                return rawData ? field.customOptions.statusTrueText : field.customOptions.statusFalseText;
                                            },
                                            toRaw: function (formattedData, model) {
                                                return 'down';
                                            }
                                        }

                                    });
                                }
                                else if (field.type == 'simplecolor') {
                                    cellOptions.sortable = false;
                                    cellOptions.cell = Backgrid.Cell.extend({
                                        className: "custom-situation-cell",
                                        initialize: function () {
                                            Backgrid.Cell.prototype.initialize.apply(this, arguments);
                                        },
                                        render: function () {
                                            this.$el.empty();
                                            var formattedValue = '<cp-color class="color-picker" style="background-color: ' + this.model.attributes.cor + '"></cp-color>';
                                            this.$el.append(formattedValue);
                                            this.delegateEvents();
                                            return this;
                                        }
                                    });
                                }
                                else if (field.type == 'custom') {
                                    var customFormatter = {
                                        fromRaw: field.toString,
                                        toRaw: function (formattedData, model) {
                                            return 'down';
                                        }
                                    };

                                    cellOptions.sortable = false;
                                    var _backgridCellExtend = Backgrid.Cell.extend({
                                        className: "custom-cell",
                                        formatter: customFormatter
                                    });

                                    _backgridCellExtend.initialize = function () {
                                        Backgrid.Cell.prototype.initialize.apply(this, arguments);
                                    };
                                    _backgridCellExtend.render = function () {
                                        this.$el.empty();
                                        this.$el.data('model', this.model);
                                        var formattedValue = customFormatter.fromRaw(this.model);
                                        this.$el.append(formattedValue);
                                        this.delegateEvents();
                                        return this;
                                    };

                                    cellOptions.cell = Backgrid.Cell.extend(_backgridCellExtend);
                                }
                                else if (field.type == 'address') {
                                    var addressFormatter = {
                                        fromRaw: function (rawData, model) {
                                            try {
                                                return rawData.city + ' - ' + rawData.state;
                                            } catch (err) {
                                                return '';
                                            }

                                        },
                                        toRaw: function (formattedData, model) {
                                            return 'down';
                                        }
                                    };

                                    var AddressCell = Backgrid.Cell.extend({
                                        className: "address-cell",
                                        formatter: addressFormatter

                                    });

                                    cellOptions.cell = AddressCell;

                                }
                                else if (field.type == 'float') {
                                    cellOptions.cell = Backgrid.NumberCell.extend({
                                        decimalSeparator: ',',
                                        orderSeparator: '.'
                                    });
                                }
                                else if (field.type == 'date') {
                                    var format = "DD/MM/YYYY";
                                    if (field.customOptions.monthpicker !== undefined) {
                                        format = "MM/YYYY";
                                    }

                                    cellOptions.cell = Backgrid.Extension.MomentCell.extend({
                                        modelFormat: "YYYY/M/D",
                                        displayLang: "pt-br",
                                        displayFormat: format
                                    });
                                }
                                else if (field.customOptions.enum != undefined) {

                                    var enumOptions = [];
                                    for (var _idx in field.customOptions.enum) {
                                        var opt = field.customOptions.enum[_idx];
                                        enumOptions.push([opt, _idx]);
                                    }

                                    cellOptions.cell = Backgrid.SelectCell.extend({
                                        optionValues: enumOptions
                                    });

                                }
                                else if (field.autocomplete == true) {

                                    if (field.customOptions && field.customOptions.list!=undefined) {

                                        cellOptions.cell = Backgrid.Cell.extend({
                                            className: "custom-situation-cell-select",
                                            formatter: {
                                                fromRaw: function (rawData, model) {

                                                    var label="";
                                                    field.customOptions.list.forEach(function(item){
                                                        if (item.id==rawData){
                                                            label = item.label;
                                                        }
                                                    });

                                                    return label;

                                                },
                                                toRaw: function (formattedData, model) {
                                                    return 'down';
                                                }
                                            }
    
                                        });


                                    }else{
                                        cellOptions.name = cellOptions.name + '.label';
                                    }
                                    
                                }

                                columns.push(cellOptions);
                            }
                        });

                        var ActionCell = Backgrid.Cell.extend({
                            className: 'text-right btn-column' + (settings.tab == true ? ' detail' : ''),
                            template: function () {
                                var _buttons = [];
                                if (!settings.tab) {
                                    if (settings.settings.edit) {
                                        _buttons.push(jQuery('<button type="button" class="btn btn-default btn-edit"><span class="glyphicon glyphicon-pencil"></span></button>'));
                                    }
                                    if (settings.settings.delete) {
                                        _buttons.push(jQuery('<button type="button" class="btn btn-default btn-delete"><span class="glyphicon glyphicon-remove"></span></button>'));
                                    }
                                } else {
                                    if (settings.settings) {
                                        if (settings.settings.edit) {
                                            var _btnEditDetail = jQuery('<button type="button" class="btn btn-default btn-edit-detail"><span class="glyphicon glyphicon-pencil"></span></button>');
                                            _btnEditDetail.attr('data-route', settings.url);
                                            _buttons.push(_btnEditDetail);
                                        }
                                        if (settings.settings.delete) {
                                            var _btnDeleteDetail = jQuery('<button type="button" class="btn btn-default btn-delete-detail"><span class="glyphicon glyphicon-remove"></span></button>');
                                            _btnDeleteDetail.attr('data-route', settings.url);
                                            _buttons.push(_btnDeleteDetail);
                                        }
                                    } else {
                                        var _btnDeleteDetail = jQuery('<button type="button" class="btn btn-default btn-delete-detail"><span class="glyphicon glyphicon-remove"></span></button>');
                                        _btnDeleteDetail.attr('data-route', settings.url);
                                        _buttons.push(_btnDeleteDetail);
                                    }
                                }

                                var _group = jQuery('<div class="btn-group" role="group">');
                                _group.append(_buttons);

                                return _group;
                            },
                            events: {
                               
                            },
                            editRow: function (e) {
                                e.preventDefault();
                            },
                            render: function () {
                                var _html = this.template(this.model.toJSON());
                                this.$el.html(_html);
                                this.$el.data('model', this.model);
                                this.$el.find('button.btn-edit').click(function (e) {
                                    e.stopPropagation();

                                    var $scope = angular.element(this).scope();
                                    if (settings.tab) {
                                        $scope.$parent.edit($(this).closest('td').data('model').attributes);
                                    } else {
                                        $scope.edit($(this).closest('td').data('model').attributes);
                                    }


                                });

                                this.$el.find('button.btn-delete').click(function (e) {
                                    e.stopPropagation();

                                    var _confirm = window.confirm('Deseja realmente excluir esse registro?');

                                    if (_confirm) {
                                        var $scope = angular.element(this).scope();
                                        if (settings.tab) {
                                            $scope.$parent.delete($(this).closest('td').data('model').attributes);
                                        } else {
                                            $scope.delete($(this).closest('td').data('model').attributes);
                                        }
                                    }

                                });

                                this.$el.find('button.btn-delete-detail').click(function (e) {
                                    e.stopPropagation();

                                    var _confirm = window.confirm('Deseja realmente excluir esse registro?');

                                    if (_confirm) {
                                        var $scope = angular.element(this).scope();
                                        var route = jQuery(this).attr('data-route');

                                        if (settings.tab) {
                                            $scope.$parent.deleteDetail(route, $(this).closest('td').data('model').attributes);
                                        } else {
                                            $scope.deleteDetail(route, $(this).closest('td').data('model').attributes);
                                        }
                                    }
                                    
                                });

                                this.$el.find('button.btn-edit-detail').click(function (e) {
                                    e.stopPropagation();
                  
                                    var $scope = angular.element(this).scope();
                                    var tab = $.parseJSON($(this).closest('.table-container').attr('tab-config'));
                                    var row = $(this).closest('td').data('model').attributes;
                                    var route = $(this).attr('data-route');
                  
                                    $scope.newDetail(tab, $scope.data, row.id, route);
                                });
                               
                                this.delegateEvents();
                                return this;
                            }
                        });

                        columns.push({
                            name: "actions",
                            label: "Ações",
                            sortable: false,
                            cell: ActionCell
                        });

                        if (scope.$parent.app.helpers.isScreen('xs')) {

                            columns.splice(3, 1);
                        }

                        var rowClasses = [];
                        if (settings.tab == true) {
                            rowClasses.push('detail');
                        }
                        if (settings.settings != undefined && !settings.settings.edit) {
                            rowClasses.push('cant-edit');
                        }

                        var ClickableRow = Backgrid.Row.extend({
                            className: rowClasses.join(' '),
                        });

                        var pageableGrid = new Backgrid.Grid({
                            row: ClickableRow,
                            columns: columns,
                            collection: collection,
                            className: 'table table-striped table-editable no-margin mb-sm'
                        });

                        var paginator = new Backgrid.Extension.Paginator({

                            slideScale: 0.25, // Default is 0.5

                            // Whether sorting should go back to the first page
                            goBackFirstOnSort: false, // Default is true

                            collection: collection,

                            controls: {
                                rewind: {
                                    label: '<i class="fa fa-angle-double-left fa-lg"></i>',
                                    title: 'First'
                                },
                                back: {
                                    label: '<i class="fa fa-angle-left fa-lg"></i>',
                                    title: 'Previous'
                                },
                                forward: {
                                    label: '<i class="fa fa-angle-right fa-lg"></i>',
                                    title: 'Next'
                                },
                                fastForward: {
                                    label: '<i class="fa fa-angle-double-right fa-lg"></i>',
                                    title: 'Last'
                                }
                            }
                        });

                        function _returnPageGridWithSort() {
                            if (settings.fields[1]) {
                                if (settings.fields[1].type === 'string') return pageableGrid.render().sort(settings.fields[1].name, 'ascending').$el;
                                return pageableGrid.render().$el;
                            }
                            else return pageableGrid.render().$el;
                        }

                        scope.$el.find('.table-container').html('').append(_returnPageGridWithSort()).append(paginator.render().$el);
                    }

                    jQuery($window).on('sn:resize', function () {
                        createBackgrid(pageableCRUDModel);
                    });

                    createBackgrid(pageableCRUDModel);

                    scope.$broadcast('refreshGRID');
                }

                var listener = scope.$parent.$watch('headers', function (newValue, oldValue) {
                    if (newValue != null) {
                        var settings = scope.crudListSettings();
                        if (settings.tab == true) {
                            var listenerData = scope.$parent.$watch('data', function (newValue, oldValue) {
                                  if (newValue.id != undefined) {
                                      render();
                                      listenerData();
                                      listener();
                                  }
                            });
                        } else {
                            render();
                            listener();
                        }

                    }
                });
            }
        }
    }
})();
