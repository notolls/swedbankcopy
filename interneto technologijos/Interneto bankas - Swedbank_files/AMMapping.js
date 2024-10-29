// Group common Adobe Analytics mapping. Source here:
// https://git.swedbank.net/projects/SA/repos/adobeanalytics-docs/browse/web/common/ameasurementmapping.js

if (typeof s != 'undefined') {
    s.shortenVarName = function (name) {
        try {
            if (name) {
                if (name.indexOf('eVar') > -1) {
                    name = name.replace(/eVar/g, 'v');
                } else if (name.indexOf('prop') > -1) {
                    name = name.replace(/prop/g, 'c');
                } else if (name.indexOf('channel') > -1) {
                    name = name.replace(/channel/g, 'ch');
                } else if (name.indexOf('list') > -1) {
                    name = name.replace(/list/g, 'l');
                } else if (name.indexOf('event') > -1) {
                    name = name.replace(/event/g, 'e');
                }
            }
            return name;
        } catch (e) {}
    };
    s.pushVal = function(sObj, name, value, obj) {
        try {
            if (name && value && obj) {
                obj.push(name);
                if (name.indexOf('prop') == -1) {
                    sObj.usedVars.push(s.shortenVarName(name));
                }
            }
            sObj[name] = value || '';
        } catch (e) {}
    };
    s.pushEvent = function(sObj, obj, name, value) {
        try {
            if (name && obj) {
                obj.push(value ? name + '=' + value : name);
                sObj.usedVars.push(s.shortenVarName(name));
            }
        } catch (e) {}
    };
    s.linkTrackEventsJoin = function(events) {
        try {
            var eventArray = [], eventVal = '', eventVals=[];
            if (events && events.length) {
                for (var i = 0; i < events.length; i++) {
                    eventVal = events[i];
                    if (eventVal) {
                        eventVals = eventVal.split(/[=:]+/);
                        eventArray.push(eventVals[0]);
                    }
                }
            }
            return eventArray.join(',');
        } catch (e) { }
    };
    s.uniques = function(arr) {
        try {
            var a = [];
            for (var i=0, l=arr.length; i<l; i++)
                if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
                    a.push(arr[i]);
            return a;
        } catch (e) {}
    };
    s.replaceIllegalProductChar = function(data) {
        try {
            var dataString = String(data || '');
            dataString = dataString.toLowerCase();
            dataString = dataString.replace(/[\xE0-\xE6]/g, 'a');
            dataString = dataString.replace(/[\xE7]/g, 'c');
            dataString = dataString.replace(/[\xE8-\xEB]/g, 'e');
            dataString = dataString.replace(/[\xEC-\xEF]/g, 'i');
            dataString = dataString.replace(/[\xF0]/g, 'd');
            dataString = dataString.replace(/[\xF1]/g, 'n');
            dataString = dataString.replace(/[\xF2-\xF6]/g, 'o');
            dataString = dataString.replace(/[\xF9-\xFC]/g, 'u');
            dataString = dataString.replace(/[\x9A]/g, 's');
            dataString = dataString.replace(/[\xFD-\xFF]/g, 'y');
            dataString = dataString.replace(/[\x9E]/g, 'z');
            dataString = dataString.replace(/[^a-zA-Z\d\s:\-_.]/g, '');
            dataString = dataString.replace(/[|;=,]/g, '');
            return dataString;
        } catch (e) {
            return data;
        }
    };
    s.clickMapping = function(sObj, data, vars, events) {
        try {
            if (data.click && data.click.event && data.click.event.click) {
                s.pushVal(sObj, 'eVar23', data.click.name, vars);
                s.pushVal(sObj, 'eVar73', data.click.type, vars);
                s.pushVal(sObj, 'eVar74', data.click.group, vars);
                s.pushVal(sObj, 'eVar75', data.click.status, vars);
                s.pushVal(sObj, 'eVar96', data.click.groupName, vars);
                s.pushEvent(sObj, events, 'event146');
            }
        } catch (e) {}
    }
    s.flowAddProductValue = function(sObj, name, value) {
        try {
            value = s.replaceIllegalProductChar(value || '');
            if (name && value) {
                sObj.usedVars.push(s.shortenVarName(name));
            }
            return value;
        } catch (e) {}
    };
    s.flowAddProductEvar = function (sObj, objName, eVarID, product, eVarList) {
        try {
            if (objName && eVarID && product[objName]) {
                eVarList.push(eVarID + '=' + s.replaceIllegalProductChar(product[objName]));
                sObj.usedVars.push(s.shortenVarName(eVarID));
            }
        } catch (e) {}
    }
    s.flowAddProductEvent = function(sObj, objName, eventID, product, events, eventList, addedEvents) {
        try {
            if (objName && eventID && product[objName]) {
                eventList.push(eventID + '=' + s.replaceIllegalProductChar(product[objName]));
                if (typeof addedEvents[objName] == 'undefined' && eventID !== 'event116') {
                    s.pushEvent(sObj, events, eventID);
                    addedEvents.transactionBuy = true;
                }
            }
        } catch (e) {}
    }
    s.flowProductMapping = function(sObj, data, vars, events, isPageView) {
        try {

            const productsArray = data && data.flow && data.flow.productArray ? data.flow.productArray : [];
            const settingsArray = data && data.flow && data.flow.settingsArray ? data.flow.settingsArray : [];

            // Remap properties
            settingsArray.forEach((val, i) => {
                settingsArray[i] = val;
                settingsArray[i].category = "settings";
                settingsArray[i].settingsValueKey = val.key; // keep backwards compatability //ownership
                settingsArray[i].settingsValue = val.value;     //yes/no
            })

            var products = [];
            productsArray.forEach((val) => {
                products.push(val)
            })
            settingsArray.forEach((val) => {
                products.push(val)
            })

            if (data && data.flow && data.flow.productArray && products.length > 0) {
                var addedEvents = {},
                    productList = [],
                    eVarList,
                    eventList,
                    category,
                    name,
                    units,
                    revenue,
                    product;
                for (var i = 0; i < products.length; i++) {
                    product = products[i];
                    eVarList = [];
                    eventList = [];
                    category = s.flowAddProductValue(sObj, 'category', product.category);
                    name = s.flowAddProductValue(sObj, 'product', product.name);
                    units = s.flowAddProductValue(sObj, 'units', product.units);
                    revenue = s.flowAddProductValue(sObj, 'revenue', product.revenue);
                    //product events
                    s.flowAddProductEvent(sObj, 'transferAdd', 'event115', product, events, eventList, addedEvents);
                    s.flowAddProductEvent(sObj, 'transferCompleteAmount', 'event116', product, events, eventList, addedEvents);
                    s.flowAddProductEvent(sObj, 'transferUnits', 'event150', product, events, eventList, addedEvents);
                    s.flowAddProductEvent(sObj, 'transactionBuy', 'event117', product, events, eventList, addedEvents);
                    s.flowAddProductEvent(sObj, 'transactionBuyVolume', 'event118', product, events, eventList, addedEvents);
                    s.flowAddProductEvent(sObj, 'transactionSell', 'event119', product, events, eventList, addedEvents);
                    s.flowAddProductEvent(sObj, 'transactionSellVolume', 'event120', product, events, eventList, addedEvents);
                    s.flowAddProductEvent(sObj, 'transactionCommission', 'event121', product, events, eventList, addedEvents);
                    s.flowAddProductEvent(sObj, 'transactionSwitch', 'event157', product, events, eventList, addedEvents);
                    s.flowAddProductEvent(sObj, 'transactionSwitchVolume', 'event158', product, events, eventList, addedEvents);
                    s.flowAddProductEvent(sObj, 'transactionStop', 'event159', product, events, eventList, addedEvents);
                    s.flowAddProductEvent(sObj, 'transactionStopVolume', 'event160', product, events, eventList, addedEvents);
                    s.flowAddProductEvent(sObj, 'transactionUnits', 'event176', product, events, eventList, addedEvents);
                    //product eVars
                    s.flowAddProductEvar(sObj, 'id', 'eVar86', product, eVarList);
                    s.flowAddProductEvar(sObj, 'settingsValue', 'eVar87', product, eVarList);
                    s.flowAddProductEvar(sObj, 'settingsValueKey', 'eVar140', product, eVarList);
                    s.flowAddProductEvar(sObj, 'serviceSettingValue', 'eVar87', product, eVarList);
                    //s.flowAddProductEvar(sObj, 'transferAmount', 'eVar14', product, eVarList); //Simplificationm, out of usage
                    //s.flowAddProductEvar(sObj, 'transferRecurringType', 'eVar43', product, eVarList); //Simplificationm, out of usage
                    s.flowAddProductEvar(sObj, 'transferType', 'eVar44', product, eVarList);
                    s.flowAddProductEvar(sObj, 'transferBank', 'eVar45', product, eVarList);
                    s.flowAddProductEvar(sObj, 'transferAddType', 'eVar48', product, eVarList);
                    s.flowAddProductEvar(sObj, 'transactionRecurringType', 'eVar50', product, eVarList);
                    s.flowAddProductEvar(sObj, 'transactionVolume', 'eVar51', product, eVarList);
                    s.flowAddProductEvar(sObj, 'transactionSymbol', 'eVar80', product, eVarList);
                    s.flowAddProductEvar(sObj, 'transactionSymbolChange', 'eVar81', product, eVarList);
                    s.flowAddProductEvar(sObj, 'transactionOrderType', 'eVar82', product, eVarList);
                    s.flowAddProductEvar(sObj, 'transactionCompany', 'eVar84', product, eVarList);
                    s.flowAddProductEvar(sObj, 'transactionAllocation', 'eVar100', product, eVarList);
                    productList.push(category + ';' + name + ';' + units + ';' + revenue + ';' + eventList.join('|') + ';' + eVarList.join('|'));
                }
                if (productList.length > 0) {
                    sObj.products = productList.join(',');
                    vars.push("products");
                    sObj.usedVars.push("products");
                }
            }
        } catch (e) {}
    }
    s.flowEcommerce = function(sObj, data, vars, events, isPageView) {
        try {
            if (data && data.flow) {
                if (data.flow.products) {
                    s.pushVal(sObj, 'products', data.flow.products, vars);
                }
                if (data.flow.productArray || data.flow.settingsArray) {
                    s.flowProductMapping(sObj, data, vars, events, isPageView);
                }
                if (data.flow.event && isPageView) {
                    if (data.flow.event.purchase) {
                        s.pushEvent(sObj, events, 'purchase');
                    }
                    if (data.flow.event.prodView) {
                        s.pushEvent(sObj, events, 'prodView');
                    }
                    if (data.flow.event.scView) {
                        s.pushEvent(sObj, events, 'scView');
                    }
                    if (data.flow.event.scOpen) {
                        s.pushEvent(sObj, events, 'scOpen');
                    }
                    if (data.flow.event.scAdd) {
                        s.pushEvent(sObj, events, 'scAdd');
                    }
                    if (data.flow.event.scRemove) {
                        s.pushEvent(sObj, events, 'scRemove');
                    }
                    if (data.flow.event.scCheckout) {
                        s.pushEvent(sObj, events, 'scCheckout');
                    }
                }
            }
        } catch (e) {}
    };
    s.flowApplication = function(sObj, data, vars, events, isPageView) {
        try {
            if (data && data.flow && data.flow.type == 'application') {
                s.pushVal(sObj, 'eVar34', data.flow.applicationAmount, vars);
                s.pushVal(sObj, 'eVar38', data.flow.applicationStatus, vars);
                s.pushVal(sObj, 'eVar54', data.flow.applicationReason, vars);
                s.pushVal(sObj, 'eVar77', data.flow.applicationMinAmount, vars);
                s.pushVal(sObj, 'eVar78', data.flow.applicationMaxAmount, vars);
                s.pushVal(sObj, 'eVar79', data.flow.applicationApplicant, vars);
                s.pushVal(sObj, 'eVar99', data.flow.applicationTotalUnits, vars);
                s.pushVal(sObj, 'eVar107', data.flow.applicationSource, vars);
                s.pushVal(sObj, 'eVar115', data.flow.applicationHomeInfo, vars);
                s.pushVal(sObj, 'eVar116', data.flow.applicationInterestRate, vars);
                s.pushVal(sObj, 'eVar117', data.flow.applicationRepaymentPeriod, vars);
                s.pushVal(sObj, 'eVar120', data.flow.applicationCarInfo, vars);
                if (data.flow.event && isPageView) {
                    if (data.flow.event.applicationStart) {
                        s.pushEvent(sObj, events, 'event31');
                    } else if (data.flow.event.applicationStep2) {
                        s.pushEvent(sObj, events, 'event32');
                    } else if (data.flow.event.applicationStep3) {
                        s.pushEvent(sObj, events, 'event33');
                    } else if (data.flow.event.applicationStep4) {
                        s.pushEvent(sObj, events, 'event34');
                    } else if (data.flow.event.applicationStep5) {
                        s.pushEvent(sObj, events, 'event35');
                    } else if (data.flow.event.applicationStep6) {
                        s.pushEvent(sObj, events, 'event36');
                    } else if (data.flow.event.applicationStep7) {
                        s.pushEvent(sObj, events, 'event37');
                    } else if (data.flow.event.applicationStep8) {
                        s.pushEvent(sObj, events, 'event38');
                    } else if (data.flow.event.applicationStep9) {
                        s.pushEvent(sObj, events, 'event39');
                    } else if (data.flow.event.applicationStep10) {
                        s.pushEvent(sObj, events, 'event40');
                    } else if (data.flow.event.applicationStep11) {
                        s.pushEvent(sObj, events, 'event41');
                    } else if (data.flow.event.applicationStep12) {
                        s.pushEvent(sObj, events, 'event42');
                    } else if (data.flow.event.applicationStep13) {
                        s.pushEvent(sObj, events, 'event43');
                    } else if (data.flow.event.applicationStep14) {
                        s.pushEvent(sObj, events, 'event44');
                    } else if (data.flow.event.applicationStep15) {
                        s.pushEvent(sObj, events, 'event45');
                    } else if (data.flow.event.applicationStep16) {
                        s.pushEvent(sObj, events, 'event46');
                    } else if (data.flow.event.applicationStep17) {
                        s.pushEvent(sObj, events, 'event47');
                    } else if (data.flow.event.applicationStep18) {
                        s.pushEvent(sObj, events, 'event48');
                    } else if (data.flow.event.applicationStep19) {
                        s.pushEvent(sObj, events, 'event49');
                    }
                    if (data.flow.event.applicationComplete) {
                        s.pushEvent(sObj, events, 'event50');
                    }
                    if (data.flow.event.applicationSend) {
                        s.pushEvent(sObj, events, 'event203');
                    }
                }
            }
        } catch (e) {}
    }
    s.flowLead = function(sObj, data, vars, events, isPageView) {
        try {
            if (data && data.flow && data.flow.type == 'lead') {
                s.pushVal(sObj, 'eVar34', data.flow.leadAmount, vars);
                s.pushVal(sObj, 'eVar38', data.flow.leadStatus, vars);
                s.pushVal(sObj, 'eVar54', data.flow.leadReason, vars);
                s.pushVal(sObj, 'eVar77', data.flow.leadMinAmount, vars);
                s.pushVal(sObj, 'eVar78', data.flow.leadMaxAmount, vars);
                s.pushVal(sObj, 'eVar79', data.flow.leadApplicant, vars);
                s.pushVal(sObj, 'eVar99', data.flow.leadTotalUnits, vars);
                s.pushVal(sObj, 'eVar107', data.flow.leadSource, vars);
                s.pushVal(sObj, 'eVar115', data.flow.leadHomeInfo, vars);
                s.pushVal(sObj, 'eVar116', data.flow.leadInterestRate, vars);
                s.pushVal(sObj, 'eVar117', data.flow.leadRepaymentPeriod, vars);
                s.pushVal(sObj, 'eVar120', data.flow.leadCarInfo, vars);
            }
        } catch (e) {}
    }
    s.flowSupport = function(sObj, data, vars, events, isPageView) {
        try {
            if (data && data.flow && data.flow.type == 'support') {
                s.pushVal(sObj, 'eVar38', data.flow.supportStatus, vars);
                s.pushVal(sObj, 'eVar54', data.flow.supportReason, vars);
                s.pushVal(sObj, 'eVar34', data.flow.supportAmount, vars);
                s.pushVal(sObj, 'eVar77', data.flow.supportMinAmount, vars);
                s.pushVal(sObj, 'eVar78', data.flow.supportMaxAmount, vars);
                s.pushVal(sObj, 'eVar99', data.flow.supportTotalUnits, vars);
                s.pushVal(sObj, 'eVar107', data.flow.supportSource, vars);
                s.pushVal(sObj, 'eVar155', data.flow.supportId, vars);
            }
        } catch (e) {}
    }
    s.flowTool = function(sObj, data, vars, events, isPageView) {
        try {
            if (data && data.flow && data.flow.type == 'tool') {
                s.pushVal(sObj, 'eVar34', data.flow.toolAmount, vars);
                s.pushVal(sObj, 'eVar77', data.flow.toolMinAmount, vars);
                s.pushVal(sObj, 'eVar78', data.flow.toolMaxAmount, vars);
                s.pushVal(sObj, 'eVar99', data.flow.toolTotalUnits, vars);
                s.pushVal(sObj, 'eVar107', data.flow.toolSource, vars);
                if (data.flow.event && isPageView) {
                    if (data.flow.event.toolStart) {
                        s.pushEvent(sObj, events, 'event61');
                    } else if (data.flow.event.toolStep2) {
                        s.pushEvent(sObj, events, 'event62');
                    } else if (data.flow.event.toolStep3) {
                        s.pushEvent(sObj, events, 'event63');
                    } else if (data.flow.event.toolStep4) {
                        s.pushEvent(sObj, events, 'event64');
                    } else if (data.flow.event.toolStep5) {
                        s.pushEvent(sObj, events, 'event65');
                    } else if (data.flow.event.toolStep6) {
                        s.pushEvent(sObj, events, 'event66');
                    } else if (data.flow.event.toolStep7) {
                        s.pushEvent(sObj, events, 'event67');
                    } else if (data.flow.event.toolStep8) {
                        s.pushEvent(sObj, events, 'event68');
                    } else if (data.flow.event.toolStep9) {
                        s.pushEvent(sObj, events, 'event69');
                    }
                    if (data.flow.event.toolComplete) {
                        s.pushEvent(sObj, events, 'event70');
                    }
                }
            }
        } catch (e) {}
    }
    s.flowTransfer = function(sObj, data, vars, events, isPageView) {
        try {
            if (data && data.flow && data.flow.type == 'transfer') {
                s.pushVal(sObj, 'eVar34', data.flow.transferAmount, vars);
                s.pushVal(sObj, 'eVar38', data.flow.transferStatus, vars);
                s.pushVal(sObj, 'eVar54', data.flow.transferReason, vars);
                s.pushVal(sObj, 'eVar99', data.flow.transferTotalUnits, vars);
                s.pushVal(sObj, 'eVar107', data.flow.transferSource, vars);
            }
        } catch (e) {}
    }
    s.flowTransaction = function(sObj, data, vars, events, isPageView) {
        try {
            if (data && data.flow && data.flow.type == 'transaction') {
                s.pushVal(sObj, 'eVar34', data.flow.transactionAmount, vars);
                s.pushVal(sObj, 'eVar38', data.flow.transactionStatus, vars);
                s.pushVal(sObj, 'eVar54', data.flow.transactionReason, vars);
                s.pushVal(sObj, 'eVar85', data.flow.transactionAccountType, vars);
                s.pushVal(sObj, 'eVar99', data.flow.transactionTotalUnits, vars);
                s.pushVal(sObj, 'eVar107', data.flow.transactionSource, vars);
            }
        } catch (e) {}
    }
    s.flowSearch = function(sObj, data, vars, events, isPageView) {
        try {
            if (data && data.flow && data.flow.type == 'search') {
                s.pushVal(sObj, 'eVar27', data.flow.searchKeyword, vars);
                s.pushVal(sObj, 'eVar28', data.flow.searchFilter, vars);
                s.pushVal(sObj, 'eVar30', data.flow.searchViewedResult, vars);
                s.pushVal(sObj, 'eVar94', data.flow.searchDestination, vars);
                s.pushVal(sObj, 'eVar95', data.flow.searchResultType, vars);
                s.pushVal(sObj, 'eVar99', data.flow.searchTotalUnits, vars);
                s.pushVal(sObj, 'eVar107', data.flow.searchSource, vars);
                if (data.flow.event.searchTotal) {
                    s.pushEvent(sObj, events, 'event141');
                }
                if (data.flow.event.searchHit) {
                    s.pushEvent(sObj, events, 'event142');
                }
                if (data.flow.event.searchNoHit) {
                    s.pushEvent(sObj, events, 'event143');
                }
                if (data.flow.event.searchClick) {
                    s.pushEvent(sObj, events, 'event144');
                }
            }
        } catch (e) {}
    };
    s.flowService = function(sObj, data, vars, events, isPageView) {
        try {
            if (data && data.flow && data.flow.type == 'service') {
                s.pushVal(sObj, 'eVar34', data.flow.serviceAmount, vars);
                s.pushVal(sObj, 'eVar38', data.flow.serviceStatus, vars);
                s.pushVal(sObj, 'eVar54', data.flow.serviceReason, vars);
                s.pushVal(sObj, 'eVar77', data.flow.serviceMinAmount, vars);
                s.pushVal(sObj, 'eVar78', data.flow.serviceMaxAmount, vars);
                s.pushVal(sObj, 'eVar79', data.flow.serviceApplicant, vars);
                s.pushVal(sObj, 'eVar99', data.flow.serviceTotalUnits, vars);
                s.pushVal(sObj, 'eVar105', data.flow.servicePreviousAmount, vars);
                s.pushVal(sObj, 'eVar107', data.flow.serviceSource, vars);
            }
        } catch (e) {}
    }
    s.flowSettings = function(sObj, data, vars, events, isPageView) {
        try {
            if (data && data.flow && data.flow.type == 'settings') {
                if (data.flow.event && isPageView) {
                    if (data.flow.event.settingsStart) {
                        s.pushEvent(sObj, events, 'event101');
                    } else if (data.flow.event.settingsStep2) {
                        s.pushEvent(sObj, events, 'event102');
                    } else if (data.flow.event.settingsStep3) {
                        s.pushEvent(sObj, events, 'event103');
                    } else if (data.flow.event.settingsStep4) {
                        s.pushEvent(sObj, events, 'event104');
                    } else if (data.flow.event.settingsStep5) {
                        s.pushEvent(sObj, events, 'event105');
                    } else if (data.flow.event.settingsStep6) {
                        s.pushEvent(sObj, events, 'event106');
                    } else if (data.flow.event.settingsStep7) {
                        s.pushEvent(sObj, events, 'event107');
                    } else if (data.flow.event.settingsStep8) {
                        s.pushEvent(sObj, events, 'event108');
                    } else if (data.flow.event.settingsStep9) {
                        s.pushEvent(sObj, events, 'event109');
                    }
                    if (data.flow.event.settingsComplete) {
                        s.pushEvent(sObj, events, 'event110');
                    }
                }
            }
        } catch (e) {}
    }
    s.flowCustomerFeedback = function(sObj, data, vars, events, isPageView) {
        try {
            if (data && data.flow && data.flow.customerFeedbackCategory) {
                s.pushVal(sObj, 'eVar88', data.flow.customerFeedbackCategory, vars);
                s.pushVal(sObj, 'eVar89', data.flow.customerFeedbackRating, vars);
                s.pushVal(sObj, 'eVar107', data.flow.customerFeedbackSource, vars);
                s.pushVal(sObj, 'eVar131', data.flow.customerFeedbackName, vars);
                if (data.flow.event) {
                    if (data.flow.event.customerFeedbackShown) {
                        s.pushEvent(sObj, events, 'event171');
                    }
                    if (data.flow.event.customerFeedbackRatingTotal) {
                        s.pushEvent(sObj, events, 'event172', data.flow.event.customerFeedbackRatingTotal);
                    }
                    if (data.flow.event.customerFeedbackWritten) {
                        s.pushEvent(sObj, events, 'event173');
                    }
                    if (data.flow.event.customerFeedbackComplete) {
                        s.pushEvent(sObj, events, 'event174');
                    }
                    if (data.flow.event.customerFeedbackNeutral) {
                        s.pushEvent(sObj, events, 'event187');
                    }
                    if (data.flow.event.customerFeedbackLike) {
                        s.pushEvent(sObj, events, 'event188');
                    }
                    if (data.flow.event.customerFeedbackDislike) {
                        s.pushEvent(sObj, events, 'event189');
                    }
                    if (data.flow.event.customerFeedbackClose) {
                        s.pushEvent(sObj, events, 'event201');
                    }
                    if (data.flow.event.customerFeedbackCancel) {
                        s.pushEvent(sObj, events, 'event202');
                    }
                    if (data.flow.event.customerFeedbackDislikeSend) {
                        s.pushEvent(sObj, events, 'event205');
                    }
                }
            }
        } catch (e) {}
    };
    s.flowBehaviour = function(sObj, data, vars, events, isPageView) {
        try {
            if (data && data.flow && data.flow.type && data.flow.category && data.flow.name) {
                var name = data.flow.type + ':' + data.flow.category + ':' + data.flow.name;
                s.pushVal(sObj, 'eVar24', name, vars);
                s.pushVal(sObj, 'eVar25', data.flow.behaviourType, vars);
                s.pushVal(sObj, 'eVar26', data.flow.scenario, vars);
                s.pushVal(sObj, 'eVar61', data.flow.stepDescription, vars);
                s.pushVal(sObj, 'eVar98', data.flow.category, vars);
                if ((data.flow.event && isPageView) ||
                    (data.flow.type == 'search' && (data.flow.event.searchTotal || data.flow.event.searchClick))) {
                    if (data.flow.event.behaviourStart) {
                        s.pushEvent(sObj, events, 'event11');
                    } else if (data.flow.event.behaviourStep2) {
                        s.pushEvent(sObj, events, 'event12');
                    } else if (data.flow.event.behaviourStep3) {
                        s.pushEvent(sObj, events, 'event13');
                    } else if (data.flow.event.behaviourStep4) {
                        s.pushEvent(sObj, events, 'event14');
                    } else if (data.flow.event.behaviourStep5) {
                        s.pushEvent(sObj, events, 'event15');
                    } else if (data.flow.event.behaviourStep6) {
                        s.pushEvent(sObj, events, 'event16');
                    } else if (data.flow.event.behaviourStep7) {
                        s.pushEvent(sObj, events, 'event17');
                    } else if (data.flow.event.behaviourStep8) {
                        s.pushEvent(sObj, events, 'event18');
                    } else if (data.flow.event.behaviourStep9) {
                        s.pushEvent(sObj, events, 'event19');
                    } else if (data.flow.event.behaviourStep10) {
                        s.pushEvent(sObj, events, 'event20');
                    } else if (data.flow.event.behaviourStep11) {
                        s.pushEvent(sObj, events, 'event21');
                    } else if (data.flow.event.behaviourStep12) {
                        s.pushEvent(sObj, events, 'event22');
                    } else if (data.flow.event.behaviourStep13) {
                        s.pushEvent(sObj, events, 'event23');
                    } else if (data.flow.event.behaviourStep14) {
                        s.pushEvent(sObj, events, 'event24');
                    } else if (data.flow.event.behaviourStep15) {
                        s.pushEvent(sObj, events, 'event25');
                    } else if (data.flow.event.behaviourStep16) {
                        s.pushEvent(sObj, events, 'event26');
                    } else if (data.flow.event.behaviourStep17) {
                        s.pushEvent(sObj, events, 'event27');
                    } else if (data.flow.event.behaviourStep18) {
                        s.pushEvent(sObj, events, 'event28');
                    } else if (data.flow.event.behaviourStep19) {
                        s.pushEvent(sObj, events, 'event29');
                    }
                    if (data.flow.event.behaviourComplete) {
                        s.pushEvent(sObj, events, 'event30');
                        if (data.flow.type != 'login') {
                            s.pushVal(sObj, 'prop24', 'D=v24', vars);
                        }
                    }
                    if (data.flow.event.behaviourGreen) {
                        s.pushEvent(sObj, events, 'event122');
                    }
                    if (data.flow.event.behaviourGreenAmount) {
                        s.pushEvent(sObj, events, 'event123', data.flow.event.behaviourGreenAmount);
                    }
                    if (data.flow.event.behaviourYellow) {
                        s.pushEvent(sObj, events, 'event124');
                    }
                    if (data.flow.event.behaviourYellowAmount) {
                        s.pushEvent(sObj, events, 'event125', data.flow.event.behaviourYellowAmount);
                    }
                    if (data.flow.event.behaviourRed) {
                        s.pushEvent(sObj, events, 'event126');
                    }
                    if (data.flow.event.behaviourRedAmount) {
                        s.pushEvent(sObj, events, 'event127', data.flow.event.behaviourRedAmount);
                    }
                    var behaviourTypesEvents = { green: 122, yellow: 124, red: 126 };
                    var behaviourAmountsEvents = { green: 123, yellow: 125, red: 127 };
                    if (data.flow.event.flowType && behaviourTypesEvents[data.flow.event.flowType]) {
                        s.pushEvent(sObj, events, "event" + behaviourTypesEvents[data.flow.event.flowType]);
                        if (data.flow.event.behaviourAmount) {
                            s.pushEvent(sObj, events, "event" + behaviourAmountsEvents[data.flow.event.flowType], data.flow.event.behaviourAmount);
                        }
                    }
                }
            }
        } catch (e) {}
    }
    s.flowForm = function(sObj, data, vars, events, isPageView) {
        try {
            if (data && data.flow && data.flow.type && data.flow.category && data.flow.name) {
                var name = data.flow.type + ':' + data.flow.category + ':' + data.flow.name + ':' + data.flow.step;
                s.pushVal(sObj, 'eVar55', data.flow.type, vars);
                s.pushVal(sObj, 'eVar56', name, vars);
                if (data.flow.timer && data.flow.timer.duration) {
                    s.pushVal(sObj, 'eVar103', data.flow.timer.duration, vars);
                }
                if (data.flow.timer && data.flow.timer.startStep) {
                    s.pushVal(sObj, 'eVar104', data.flow.timer.startStep, vars);
                }
                if ((data.flow.event && isPageView) ||
                    (data.flow.type == 'search' && (data.flow.event.searchTotal || data.flow.event.searchClick))) {
                    if (data.flow.event.formView) {
                        s.pushEvent(sObj, events, 'event140');
                        if (data.flow.timer && data.flow.timer.stepDuration) {
                            s.pushEvent(sObj, events, 'event184', data.flow.timer.stepDuration);
                        }
                    }
                }
            }
        } catch (e) {}
    }
    /* WE ARE NOT TRACKING LOGIN FLOW CURRENTLY SEPARATELY, THIS IS THE ORIGINAL APPROACH

    s.flowLogin = function(sObj, data, vars, events, isPageView) {
        try {
            if (data && data.flow && data.flow.type == 'login') {
                s.pushVal(sObj, 'eVar11', 'D=v24', vars);
                s.pushVal(sObj, 'eVar13', 'D=v9', vars);
                s.pushVal(sObj, 'eVar12', data.flow.loginMethod, vars);
                s.pushVal(sObj, 'eVar38', data.flow.loginStatus, vars);
                s.pushVal(sObj, 'eVar54', data.flow.loginReason, vars);
                if (data.flow.event) {
                    if (data.flow.event.loginStart) {
                        s.pushEvent(sObj, events, 'event2');
                        s.pushEvent(sObj, events, 'event11');
                        s.pushEvent(sObj, events, 'event140');
                    } else if (data.flow.event.loginComplete) {
                        s.pushVal(sObj, 'eVar15', '+1', vars);
                        s.pushVal(sObj, 'eVar16', '+1', vars);
                        s.pushEvent(sObj, events, 'event3');
                        s.pushEvent(sObj, events, 'event30');
                        s.pushEvent(sObj, events, 'event140');
                    } else if (data.flow.event.loginError) {
                        s.pushEvent(sObj, events, 'event4');
                        s.pushEvent(sObj, events, 'event139');
                    }
                }
            }
        } catch (e) {}
    }*/

    s.configMapping = function(sObj, data, vars, events, isPageLoad) {
        try {
            s.account = data.account ? data.account : 'swedbankabsewebglobtestdev';
        } catch (e) {}
    };
    s.flowMapping = function(sObj, data, vars, events, isPageLoad) {
        if (data && data.flow && data.flow.type) {
            s.flowEcommerce(sObj, data, vars, events, isPageLoad);
            s.flowBehaviour(sObj, data, vars, events, isPageLoad);
            s.flowForm(sObj, data, vars, events, isPageLoad);
            s.flowApplication(sObj, data, vars, events, isPageLoad);
            s.flowLead(sObj, data, vars, events, isPageLoad);
            s.flowSearch(sObj, data, vars, events, isPageLoad);
            s.flowService(sObj, data, vars, events, isPageLoad);
            s.flowSettings(sObj, data, vars, events, isPageLoad);
            s.flowSupport(sObj, data, vars, events, isPageLoad);
            //s.flowLogin(sObj, data, vars, events, isPageLoad);
            s.flowTool(sObj, data, vars, events, isPageLoad);
            s.flowTransfer(sObj, data, vars, events, isPageLoad);
            s.flowTransaction(sObj, data, vars, events, isPageLoad);
        }
        if (data && data.flow && data.flow.customerFeedbackCategory) {
            s.flowCustomerFeedback(sObj, data, vars, events, isPageLoad);
        }
    };
    s.abTestMapping = function (sObj, data, vars, events, isPageLoad) {
        try {
            if (data && data.abTest) {
                s.pushVal(sObj, 'eVar46', data.abTest, vars);
                s.pushVal(sObj, 'prop46', 'D=v46', vars);
            } else if (data && data.flow && data.flow.abTest) {
                s.pushVal(sObj, 'eVar46', data.flow.abTest, vars);
                s.pushVal(sObj, 'prop46', 'D=v46', vars);
            }
            if (data && data.sitespectGUID) {
                s.pushVal(sObj, 'eVar20', data.sitespectGUID, vars);
            }
            if (data && data.sitespectEvent) {
               s.pushVal(sObj, 'eVar21', data.sitespectEvent, vars);
            }
        } catch (e) {}
    };
    s.partnerOfferMapping = function(sObj, data, vars, events, isPageLoad) {
        try {
             if (data && data.partnerOffer) {
                s.pushVal(sObj, 'eVar132', data.partnerOffer.offer, vars);
                s.pushVal(sObj, 'eVar133', data.partnerOffer.offerCategory, vars);
                s.pushVal(sObj, 'eVar134', data.partnerOffer.partnerName, vars);
                s.pushVal(sObj, 'eVar135', data.partnerOffer.group, vars);

                if (data.partnerOffer.event && data.partnerOffer.event.offerViewed) {
                    s.pushEvent(sObj, events, 'event214');
                }
            }
        } catch (e) {}
    };
    s.messagesMapping = function(sObj, name, data, vars, events, isPageLoad) {
        try {
            if (data && data.page && data.page.messages && name !== "formError") {
                s.pushVal(sObj, 'list1', data.page.messages.join(';'), vars);
            }
        } catch (e) {}
    };
    s.marketingMapping = function(sObj, data, vars, events, isPageLoad) {
        try {
            if (data && data.marketing) {
                if (data.marketing.event && isPageLoad) {
                    if (data.marketing.internalCampaignLoaded && data.marketing.event.internalCampaignLoad) {
                        s.pushVal(sObj, 'list3', data.marketing.internalCampaignLoaded.join(';'), vars);
                        s.pushEvent(sObj, events, 'event112');
                    }
                    if (data.marketing.internalCampaignViewed && data.marketing.event.internalCampaignView) {
                        s.pushVal(sObj, 'list3', data.marketing.internalCampaignViewed.join(';'), vars);
                        s.pushEvent(sObj, events, 'event113');
                    }
                    if (data.marketing.internalCampaignClick && data.marketing.event.internalCampaignClick) {
                        s.pushVal(sObj, 'list3', data.marketing.internalCampaignClick, vars);
                        s.pushVal(sObj, 'eVar60', data.marketing.internalCampaignClick, vars);
                        s.pushEvent(sObj, events, 'event114');
                    }
                }
            }
        } catch (e) {}
    };
    s.setIds = function(sObj, data, vars, events, isPageLoad) {
        try {
            if (data && data.page.userId) {
                s.pushVal(sObj, 'eVar8', data.page.userId, vars);
                s.visitor.setCustomerIDs({
                    "userid":{
                        "id": data.page.userId,
                        "authState": 1
                    }
                });
            }
            if (data && data.page.businessId) {
                s.pushVal(sObj, 'eVar17', data.page.businessId, vars);
            }
        } catch (e) {}
    };
    s.pageMapping = function(sObj, data, vars, events, isPageLoad) {
        try {
            if (data && data.page) {
                if (data.page.url) {
                    sObj.pageURL = data.page.url;
                }
                try {
                    if (data.page.referrer &&
                        location.hostname.toLowerCase().indexOf('lana.swedbank.se') == -1 &&
                        location.hostname.toLowerCase().indexOf('welcome.swedbank.se') == -1) {
                        sObj.referrer = data.page.referrer;
                    } else if (data.page.referrer &&
                        (location.hostname.toLowerCase().indexOf('lana.swedbank.se') != -1 ||
                        location.hostname.toLowerCase().indexOf('welcome.swedbank.se') != -1) &&
                        location.href.toLowerCase().indexOf('bankid=') != -1) {
                        sObj.referrer = data.page.referrer;
                    }
                } catch(ex) {}
                if (data.page.campaign) {
                    sObj.campaign = data.page.campaign;
                } else if (data.page.wtCampaign) {
                    sObj.campaign = data.page.wtCampaign;
                } else if (data.page.utm && data.page.utm.source) {
                    var utmParts = [];
                    utmParts.push(data.page.utm.medium || '-');
                    utmParts.push(data.page.utm.source || '-');
                    utmParts.push(data.page.utm.name || data.page.utm.campaign || '-');
                    utmParts.push(data.page.utm.content || '-');
                    utmParts.push('sales');
                    utmParts.push(data.page.utm.term || '-');
                    sObj.campaign = utmParts.join('_');
                }
                s.pushVal(sObj, 'pageName', data.page.pageName, vars);
                s.pushVal(sObj, 'channel', data.page.section, vars);
                s.pushVal(sObj, 'eVar1', 'D=pageName', vars);
                s.pushVal(sObj, 'eVar2', 'D=ch', vars);
                s.pushVal(sObj, 'eVar3', data.page.platform, vars);
                s.pushVal(sObj, 'eVar4', data.page.platformVersion, vars);
                s.pushVal(sObj, 'eVar5', data.page.platformType, vars);
                s.pushVal(sObj, 'eVar6', data.page.language, vars);
                s.pushVal(sObj, 'eVar7', data.page.bankId, vars);
                s.pushVal(sObj, 'eVar9', data.page.userType, vars);
                s.pushVal(sObj, 'eVar10', 'D=User-Agent', vars);
                s.pushVal(sObj, 'eVar22', data.page.platformMedium, vars);
                s.pushVal(sObj, 'eVar57', data.page.location, vars);
                s.pushVal(sObj, 'eVar58', 'D=r', vars);
                s.pushVal(sObj, 'eVar59', data.page.title, vars);
                s.pushVal(sObj, 'eVar63', data.page.customerType, vars);
                s.pushVal(sObj, 'eVar76', data.page.emailId, vars);
                s.pushVal(sObj, 'eVar90', data.page.emailLink, vars);
                s.pushVal(sObj, 'eVar91', data.page.emailContact, vars);
                s.pushVal(sObj, 'eVar92', data.page.authState, vars);
                s.pushVal(sObj, 'eVar93', data.page.anchor, vars);
                s.pushVal(sObj, 'eVar97', data.page.country, vars);
                s.pushVal(sObj, 'eVar102', data.page.query, vars);
                s.pushVal(sObj, 'eVar111', data.page.network, vars);
                s.pushVal(sObj, 'eVar118', data.page.sessionId, vars);
                s.pushVal(sObj, 'eVar119', data.page.pageNameRaw, vars);
                s.pushVal(sObj, 'eVar121', data.page.titleEng, vars);
                s.pushVal(sObj, 'eVar123', data.page.contentTitle, vars);
                s.pushVal(sObj, 'eVar138', data.page.tag, vars);
                s.pushVal(sObj, 'eVar127', data.page.gclid, vars);
                if (data.page.scpCookieValue && data.page.scpCookieAcceptance) {
                    s.pushVal(sObj, 'eVar114', data.page.scpCookieValue + ':' + data.page.scpCookieAcceptance, vars);
                }
                if (data.page.age) {
                    if (data.page.gender) {
                        s.pushVal(sObj, 'eVar136', data.page.age + ':' + data.page.gender, vars);
                    } else {
                        s.pushVal(sObj, 'eVar136', data.page.age + ':n/a', vars);
                    }
                }
                s.setIds(sObj, data, vars, events, isPageLoad);
                if (isPageLoad) {
                    s.pushVal(sObj, 'prop3', 'D=v3', vars);
                    s.pushVal(sObj, 'prop4', 'D=v4', vars);
                    s.pushVal(sObj, 'prop5', 'D=v5', vars);
                    s.pushVal(sObj, 'prop6', 'D=v6', vars);
                    s.pushVal(sObj, 'prop7', 'D=v7', vars);
                    s.pushVal(sObj, 'prop9', 'D=v9', vars);
                    s.pushVal(sObj, 'prop10', 'D=v10', vars);
                    s.pushVal(sObj, 'prop57', 'D=v57', vars);
                    s.pushVal(sObj, 'prop58', 'D=r', vars);
                    s.pushVal(sObj, 'prop67', 'D=v67', vars);
                    s.pushVal(sObj, 'prop68', 'D=v68', vars);
                    s.pushVal(sObj, 'prop69', 'D=v69', vars);
                    s.pushVal(sObj, 'prop70', 'D=v70', vars);
                    if (sObj.campaign) {
                        s.pushVal(sObj, 'eVar64', sObj.campaign, vars);
                    } else if (data.page.emailId) {
                        s.pushVal(sObj, 'eVar64', data.page.emailId, vars);
                    } else if (data.marketing && data.marketing.internalCampaignClick) {
                        s.pushVal(sObj, 'eVar64', data.marketing.internalCampaignClick, vars);
                    }
                    if (data.page.emailId && data.page.emailLink) {
                        s.pushVal(sObj, 'eVar110', data.page.emailId + ":" + data.page.emailLink, vars);
                        s.pushVal(sObj, 'eVar113', 'D=v57', vars);
                        s.pushEvent(sObj, events, 'event194');
                    }
                }
            }
        } catch (e) {}
    };
    s.eventMapAndTrack = function(sObj, name, data, vars, events, hrefProperty, linkType) {
        if (hrefProperty === undefined) {
            hrefProperty = this;
        }
        if (linkType === undefined) {
            linkType = 'o';
        }
        s.configMapping(sObj, data, vars, events, false);
        s.pageMapping(sObj, data, vars, events, false);
        s.messagesMapping(sObj, name, data, vars, events, false);
        if (data.flow && data.flow.clickFlow) {
            s.flowMapping(sObj, data, vars, events, true);
            data.flow.clickFlow = false;
        } else {
            s.flowMapping(sObj, data, vars, events, false);
        }
        s.abTestMapping(sObj, data, vars, events, false);
        s.partnerOfferMapping(sObj, data, vars, events, false);
        if (events.length) {
            vars.push('events');
        }
        if (sObj.usedVars && sObj.usedVars.length) {
            vars.push('list2');
            sObj.usedVars = s.uniques(sObj.usedVars);
            sObj.list2 = sObj.usedVars.join(';');
        }
        events = s.uniques(events);
        sObj.events = events.join(',');
        s.linkTrackEvents = s.linkTrackEventsJoin(events);
        s.linkTrackVars = vars.join(',');
        //s.tl(this, 'o', name);
        s.tl(hrefProperty, linkType, name, sObj);
        s.clearVars();
    };
    s.mappings = {
        "flownopageview": function(data) {
            var events = [], vars = [], sObj = new Object();
            sObj.usedVars = [];
            if (data.flow) {
                data.flow.clickFlow = true;
            }
            s.eventMapAndTrack(sObj, "flow", data, vars, events, true, "o");
        },
        "virtualpageview": function (data) {
            var events = [], vars = [], sObj = new Object();
            sObj.usedVars = [];
            try {
                s.configMapping(sObj, data, vars, events, true);
                s.pageMapping(sObj, data, vars, events, true);
                s.flowMapping(sObj, data, vars, events, true);
                s.abTestMapping(sObj, data, vars, events, true);
                s.partnerOfferMapping(sObj, data, vars, events, true);
                s.messagesMapping(sObj, "virtualpageview", data, vars, events, true);
                s.marketingMapping(sObj, data, vars, events, true);
                if (sObj.usedVars.length) {
                    vars.push('list2');
                    sObj.usedVars = s.uniques(sObj.usedVars);
                    sObj.list2 = sObj.usedVars.join(';');
                }
                events = s.uniques(events);
                sObj.events = events.join(',');
            } catch (e) {}
            s.t(sObj);
            s.clearVars();
        },
        "eventTrack": function(data, name) {
            var events = [], vars = [], sObj = new Object();
            sObj.usedVars = [];
            s.eventMapAndTrack(sObj, name, data, vars, events);
        },
        "internalCampaignLoadAndView": function(data) {
            var events = [], vars = [], sObj = new Object();
            sObj.usedVars = [];
            try {
                if (data && data.marketing && data.marketing.internalCampaignLoaded) {
                    s.pushVal(sObj, 'list3', data.marketing.internalCampaignLoaded.join(';'), vars);
                    s.pushEvent(sObj, events, 'event112');
                    s.pushEvent(sObj, events, 'event113');
                }
            } catch (e) {}
            s.eventMapAndTrack(sObj, "internalCampaignLoadAndView", data, vars, events);
        },
        "internalCampaignLoad": function(data) {
            var events = [], vars = [], sObj = new Object();
            sObj.usedVars = [];
            try {
                if (data && data.marketing && data.marketing.internalCampaignLoaded) {
                    s.pushVal(sObj, 'list3', data.marketing.internalCampaignLoaded.join(';'), vars);
                    s.pushEvent(sObj, events, 'event112');
                }
            } catch (e) {}
            s.eventMapAndTrack(sObj, "internalCampaignLoad", data, vars, events);
        },
        "internalCampaignView": function(data) {
            var events = [], vars = [], sObj = new Object();
            sObj.usedVars = [];
            try {
                if (data && data.marketing && data.marketing.internalCampaignViewed) {
                    s.pushVal(sObj, 'list3', data.marketing.internalCampaignViewed.join(';'), vars);
                    s.pushEvent(sObj, events, 'event113');
                }
            } catch (e) {}
            s.eventMapAndTrack(sObj, "internalCampaignView", data, vars, events);
        },
        "internalCampaignClick": function(data) {
            var events = [], vars = [], sObj = new Object();
            sObj.usedVars = [];
            try {
                if (data && data.marketing.internalCampaignClick) {
                    s.pushVal(sObj, 'list3', data.marketing.internalCampaignClick, vars);
                    s.pushVal(sObj, 'eVar60', data.marketing.internalCampaignClick, vars);
                    s.pushVal(sObj, 'eVar112', data.marketing.internalCampaignClick, vars);
                    s.pushEvent(sObj, events, 'event114');
                    s.clickMapping(sObj, data, vars, events);
                }
            } catch (e) {}
            s.eventMapAndTrack(sObj, "internalCampaignClick", data, vars, events);
        },
        "internalCampaignSoftClick": function (data) {
            var events = [], vars = [], sObj = new Object();
            sObj.usedVars = [];
            try {
                if (data && data.marketing.internalCampaignClick) {
                    s.pushVal(sObj, 'list3', data.marketing.internalCampaignClick, vars);
                    s.pushEvent(sObj, events, 'event204');
                }
            } catch (e) {}
            s.eventMapAndTrack(sObj, "internalCampaignSoftClick", data, vars, events);
        },
        "internalCampaignClose": function (data) {
            var events = [],vars = [], sObj = new Object();
            sObj.usedVars = [];
            try {
                if (data && data.marketing.internalCampaignClick) {
                    s.pushVal(sObj, 'list3', data.marketing.internalCampaignClick, vars);
                    s.pushEvent(sObj, events, 'event147');
                    s.clickMapping(sObj, data, vars, events);
                }
            } catch (e) {}
            s.eventMapAndTrack(sObj, "internalCampaignClose", data, vars, events);
        },
        "internalCampaignSoftClose": function (data) {
            var events = [], vars = [], sObj = new Object();
            sObj.usedVars = [];
            try {
                if (data && data.marketing.internalCampaignClick) {
                    s.pushVal(sObj, 'list3', data.marketing.internalCampaignClick, vars);
                    s.pushEvent(sObj, events, 'event148');
                }
            } catch (e) {}
            s.eventMapAndTrack(sObj, "internalCampaignSoftClose", data, vars, events);
        },
        "click": function(data) {
            var events = [], vars = [], sObj = new Object();
            sObj.usedVars = [];
            try {
                if (data && data.click) {
                    s.pushVal(sObj, 'eVar23', data.click.name, vars);
                    s.pushVal(sObj, 'eVar73', data.click.type, vars);
                    s.pushVal(sObj, 'eVar74', data.click.group, vars);
                    s.pushVal(sObj, 'eVar75', data.click.status, vars);
                    s.pushVal(sObj, 'eVar96', data.click.groupName, vars);
                    s.pushVal(sObj, 'eVar123', data.click.contentTitle, vars);
                    s.pushEvent(sObj, events, 'event146');
                }
            } catch (e) {}
            if (data.click && data.click.hrefProperty && data.click.linkType) {
                s.eventMapAndTrack(sObj, "click", data, vars, events, data.click.hrefProperty, data.click.linkType);
            } else {
                s.eventMapAndTrack(sObj, "click", data, vars, events);
            }
        },
        "fileClick": function (data) {
            var events = [], vars = [], sObj = new Object();
            sObj.usedVars = [];
            try {
                if (data && data.click) {
                    s.pushVal(sObj, 'eVar22', data.click.name, vars);
                    s.pushEvent(sObj, events, 'event145');
                }
            } catch (e) {}
            if (data.click && data.click.hrefProperty && data.click.linkType) {
                s.eventMapAndTrack(sObj, "fileClick", data, vars, events, data.click.hrefProperty, data.click.linkType);
            } else {
                s.eventMapAndTrack(sObj, "fileClick", data, vars, events);
            }
        },
        "formError": function(data) {
            var events = [], vars = [], sObj = new Object();
            sObj.usedVars = [];
            try {
                if (data && data.page && data.flow.formErrors) {
                    s.pushVal(sObj, 'list1', data.flow.formErrors.join(';'), vars);
                    s.pushEvent(sObj, events, 'event139');
                }
            } catch (e) {}
            s.eventMapAndTrack(sObj, "formError", data, vars, events);
        },
        "scroll": function(data) {
            var events = [], vars = [], sObj = new Object();
            sObj.usedVars = [];
            try {
                if (data && data.scroll && data.scroll.scrollPercentage) {
                    s.pushVal(sObj, 'eVar106', data.scroll.scrollPercentage, vars);
                }
                if (data && data.scroll && data.scroll.event && data.scroll.event.scroll) {
                    s.pushEvent(sObj, events, 'event185');
                }
            } catch (e) {}
            s.eventMapAndTrack(sObj, "scroll", data, vars, events);
        }
    };
    s.directCall = function(name, data) {
        try {
            if (name && s.mappings[name]) {
                s.mappings[name](data);
            } else if (name && s.mappings["eventTrack"]) {
                s.mappings["eventTrack"](data, name);
            }
        } catch (e) {}
    }
}